const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// works with both zod 3 (zod-to-json-schema) and zod 4 (built-in converter)
const toJsonSchema = (schema) => {
    const json = typeof z.toJSONSchema === "function"
        ? z.toJSONSchema(schema)
        : zodToJsonSchema(schema)
    delete json.$schema
    return json
}

const questionSchema = z.object({
    question: z.string().describe("The question that can be asked in the interview"),
    intention: z.string().describe("The intention of the interviewer behind asking this question"),
    answer: z.string().describe("How to answer this question, what points to cover, what approach to take")
})

const interviewReportSchema = z.object({
    title: z.string().describe("The title of the job for which the interview report is generated"),
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(questionSchema).min(5).describe("Technical questions with their intention and how to answer them"),
    behavioralQuestions: z.array(questionSchema).min(3).describe("Behavioral questions with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("How serious this skill gap is")
    })).describe("Skill gaps in the candidate's profile with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main topic or theme to focus on this day"),
        tasks: z.array(z.string()).describe("List of tasks to do on this day")
    })).describe("A day-wise preparation plan for the candidate")
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// retries when Gemini is overloaded (503) or rate limited (429)
async function callGemini(params) {
    for (let attempt = 1; attempt <= 4; attempt++) {
        try {
            return await ai.models.generateContent(params)
        } catch (err) {
            const busy = err.status === 503 || err.status === 429
            if (!busy || attempt === 4) throw err
            console.log(`Gemini busy, retry ${attempt}/4`)
            await sleep(attempt * 3000)
        }
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Create an interview PREPARATION plan for this candidate (not an interviewer's evaluation).

Return ONLY valid JSON with exactly these keys:
title (job title string),
matchScore (number 0-100),
technicalQuestions (array of objects with the string fields question, intention, answer),
behavioralQuestions (array of objects with the string fields question, intention, answer),
skillGaps (array of objects with skill (string) and severity ("low" | "medium" | "high")),
preparationPlan (array of objects with day (number), focus (string), tasks (array of strings)).
Every item in these arrays MUST be an object, never a plain string.
Give exactly 5 technical questions, 3 behavioral questions, up to 5 skill gaps and a 5 day plan. No markdown.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}`

    // try up to 2 times if the shape of the answer is wrong
    for (let attempt = 1; attempt <= 2; attempt++) {
        const response = await callGemini({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: toJsonSchema(interviewReportSchema),
                thinkingConfig: { thinkingLevel: "low" }
            }
        })

        try {
            const text = response.text.replace(/```json|```/g, "").trim()
            const result = interviewReportSchema.parse(JSON.parse(text))
            console.log("AI RESULT OK:", result.title, "| score:", result.matchScore)
            return result
        } catch (err) {
            console.log(`AI answer had the wrong shape (attempt ${attempt}/2):`, err.message?.slice(0, 200))
        }
    }

    throw new Error("Gemini returned an invalid report, please try again")
}

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })
    const pdfBuffer = await page.pdf({ format: "A4" ,
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `
    Generate a resume for a candidate with the following details:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    The response should be a JSON object with a single field "html" which contains the HTML content of the resume
    that can be converted to PDF using a library like puppeteer.
    The resume should be tailored for the given job decription and should highlight the candidate's strength and
    relevant experience. 
    The HTML content should be well-formatted and structured, making it easy to read and visible.
    The content of resume should not sound like it's generated by AI and should be as close as possible to a 
    real-world human-written resume. 
    you can highlight the content using some colors or different font styles but the overall design should be 
    simple or professional
    The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important
    information.
    The resume should not be so lengthy , it should be ideally be 1-2 pages long when converted to PDF. Focus on
    quality rather than quantity and make sure to include all relevnat information that can increase the 
    candidate's chances of getting an interview call for the given job description.
    `

    const response = await callGemini({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: toJsonSchema(resumePdfSchema)
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }