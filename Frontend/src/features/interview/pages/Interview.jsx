import React, { useState, useEffect } from "react"
import "../style/interview.scss"
import { useInterview  } from "../hooks/useinterview"
import { useNavigate, useParams } from "react-router"

// Placeholder data in the same shape as your interviewReport document.
// Later the hook/state layers will pass the real report in through the `report` prop.


/* ---------- small icons ---------- */
const Icon = ({ children }) => (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
)

const CodeIcon = () => <Icon><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></Icon>
const ChatIcon = () => <Icon><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>
const MapIcon = () => <Icon><path d="m3 11 19-9-9 19-2-8-8-2z" /></Icon>
const ChevronIcon = () => <Icon><path d="m6 9 6 6 6-6" /></Icon>

const sections = [
    { id: "technical", label: "Technical Questions", Icon: CodeIcon },
    { id: "behavioral", label: "Behavioral Questions", Icon: ChatIcon },
    { id: "roadmap", label: "Road Map", Icon: MapIcon }
]

/* ---------- match score ring ---------- */
const ScoreRing = ({ score }) => {
    const radius = 34
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (Math.min(score, 100) / 100) * circumference

    const label =
        score >= 80 ? "Strong match for this role" :
        score >= 60 ? "Good match for this role" :
        "Needs more preparation"

    return (
        <div className="score">
            <div className="score__ring">
                <svg viewBox="0 0 80 80" width="96" height="96">
                    <circle className="score__track" cx="40" cy="40" r={radius} />
                    <circle
                        className="score__bar"
                        cx="40"
                        cy="40"
                        r={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                    />
                </svg>
                <div className="score__text">
                    <strong>{score}</strong>
                    <span>%</span>
                </div>
            </div>
            <p className="score__label">{label}</p>
        </div>
    )
}

/* ---------- accordion of questions ---------- */
const QuestionList = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(0)

    return (
        <div className="question-list">
            {items.map((item, index) => {
                const isOpen = openIndex === index
                return (
                    <article className={`question ${isOpen ? "question--open" : ""}`} key={index}>
                        <button
                            type="button"
                            className="question__head"
                            onClick={() => setOpenIndex(isOpen ? -1 : index)}
                        >
                            <span className="question__num">Q{index + 1}</span>
                            <span className="question__title">{item.question}</span>
                            <span className="question__chevron"><ChevronIcon /></span>
                        </button>

                        {isOpen && (
                            <div className="question__body">
                                <div className="question__block">
                                    <span className="tag tag--intention">Intention</span>
                                    <p>{item.intention}</p>
                                </div>
                                <div className="question__block">
                                    <span className="tag tag--answer">Model Answer</span>
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        )}
                    </article>
                )
            })}
        </div>
    )
}

/* ---------- vertical road map ---------- */
const RoadMap = ({ items }) => (
    <ol className="roadmap">
        {items.map((plan) => (
            <li className="roadmap__item" key={plan.day}>
                <span className="roadmap__dot" />
                <div className="roadmap__head">
                    <span className="roadmap__day">Day {plan.day}</span>
                    <h3>{plan.focus}</h3>
                </div>
                <ul>
                    {(plan.tasks || []).map((task, i) => (
                        <li key={i}>{task}</li>
                    ))}
                </ul>
            </li>
        ))}
    </ol>
)

/* ---------- page ---------- */
const Interview = () => {
    // Only UI state: which section is open in the main area.
    const [active, setActive] = useState("technical")
    const { report , getReportById, loading} = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if(interviewId) {
            getReportById(interviewId)
        }
    }, [ interviewId ])


    if(loading || !report) {
        return (
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }

    console.log(report)

    const technical = report.technicalQuestions || []
    const behavioral = report.behavioralQuestions || []
    const skillGaps = report.skillGaps || []
    const plans = report.preparationPlan || []

    const meta = {
        technical: `${technical.length} questions`,
        behavioral: `${behavioral.length} questions`,
        roadmap: `${plans.length}-day plan`
    }

    const titles = {
        technical: "Technical Questions",
        behavioral: "Behavioral Questions",
        roadmap: "Preparation Road Map"
    }

    return (
        <div className="interview">
            <div className="interview__layout">

                {/* LEFT: sections */}
                <aside className="interview__nav">
                    <p className="eyebrow">Sections</p>
                    <nav>
                        {sections.map(({ id, label, Icon: SectionIcon }) => (
                            <button
                                key={id}
                                type="button"
                                className={`nav-btn ${active === id ? "nav-btn--active" : ""}`}
                                onClick={() => setActive(id)}
                            >
                                <SectionIcon />
                                <span>{label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* MIDDLE: main content */}
                <main className="interview__main">
                    <header className="interview__main-header">
                        <h1>{titles[active]}</h1>
                        <span className="pill">{meta[active]}</span>
                    </header>

                    {active === "technical" && (
                        technical.length ? <QuestionList items={technical} /> : <p className="empty">No technical questions yet.</p>
                    )}

                    {active === "behavioral" && (
                        behavioral.length ? <QuestionList items={behavioral} /> : <p className="empty">No behavioral questions yet.</p>
                    )}

                    {active === "roadmap" && (
                        plans.length ? <RoadMap items={plans} /> : <p className="empty">No preparation plan yet.</p>
                    )}
                </main>

                {/* RIGHT: score + skill gaps */}
                <aside className="interview__side">
                    <p className="eyebrow">Match Score</p>
                    <ScoreRing score={report.matchScore ?? 0} />

                    <p className="eyebrow eyebrow--spaced">Skill Gaps</p>
                    {skillGaps.length ? (
                        <div className="gaps">
                            {skillGaps.map((gap, index) => (
                                <span className={`gap gap--${gap.severity}`} key={index}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="empty">No skill gaps found.</p>
                    )}
                </aside>

            </div>
        </div>
    )
}

export default Interview