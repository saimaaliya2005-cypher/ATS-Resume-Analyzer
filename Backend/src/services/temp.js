const resume = `
Saima Khan
Patna, India
saima.khan@email.com
+91 9876543210
LinkedIn: linkedin.com/in/saimakhan
GitHub: github.com/saimakhan

PROFESSIONAL SUMMARY
MERN Stack Developer with hands-on experience building full stack web applications using React, Node.js, Express and MongoDB. Skilled in REST APIs, JWT authentication and AI integrations.

TECHNICAL SKILLS
Languages: JavaScript, HTML, CSS, SCSS
Frontend: React.js, React Router, Axios
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Tools: Git, GitHub, Postman, VS Code
Concepts: REST APIs, JWT Authentication, MVC Architecture

WORK EXPERIENCE

Web Development Intern
TechNova Solutions | Jan 2026 - Present
- Built reusable React components and connected them to REST APIs.
- Implemented authentication using JWT and cookies.
- Fixed bugs and improved page load time by optimizing API calls.
- Collaborated with the team using Git and GitHub.

PROJECTS

ATS Resume Analyzer
- Built a full stack app that analyzes resumes against job descriptions using Node.js and the Gemini API.
- Implemented register, login and logout with JWT and a token blacklist.
- Stored user data in MongoDB Atlas.

Task Manager App
- Built using React and Express with full CRUD features.
- Added search and filter functionality.
- Designed a responsive UI using SCSS.

EDUCATION

Bachelor of Technology in Computer Science
Your University Name, 2026
`

const selfDescription = `
I am a MERN stack developer with experience building full stack projects.
I have worked with React, Node.js, Express and MongoDB, and I have built
authentication systems using JWT. I recently built an ATS Resume Analyzer
that uses the Gemini API. I am comfortable with REST APIs, Git and
deploying small projects. I am looking for a developer role where I can
keep learning and build scalable applications.
`

const jobDescription = `
Company: Example Tech Pvt Ltd
Position: Full Stack Developer (MERN)
Location: Remote / Bangalore

We are looking for a Full Stack Developer with strong experience in
React and Node.js to build scalable and high-performance web applications.

Responsibilities:
- Design and develop RESTful APIs using Node.js and Express.
- Build responsive user interfaces using React.
- Implement authentication and authorization mechanisms.
- Work with MongoDB for data modeling and queries.
- Write clean, maintainable and testable code.
- Collaborate with the design and backend teams.

Required Skills:
- Strong knowledge of JavaScript, React and Node.js.
- Experience with MongoDB and Mongoose.
- Understanding of REST APIs and JWT authentication.
- Familiarity with Git and basic CI/CD workflows.

Good to Have:
- Experience with AI or LLM APIs.
- Knowledge of Docker.
`

module.exports = {
    resume, selfDescription, jobDescription
}