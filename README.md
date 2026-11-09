# ATS-Resume-Analyzer

# ATS Resume Analyzer

An AI-powered interview preparation app. Upload your resume (or write a short self-description), paste a job description, and get a personalised interview plan: match score, technical and behavioural questions with model answers, skill gaps, and a day-by-day preparation roadmap.

Built with the MERN stack and Google Gemini.

## Features

- Register, login and logout with JWT stored in an HTTP cookie (logged-out tokens are blacklisted)
- Upload a PDF resume (max 3MB) and paste a job description
- AI-generated interview report using Gemini with a structured JSON schema
  - Match score (0-100)
  - Technical and behavioural questions, each with the interviewer's intention and a model answer
  - Skill gaps with severity (low, medium, high)
  - Day-wise preparation roadmap
- Reports are saved to MongoDB Atlas and listed under "My Recent Interview Plans"
- Dark themed UI with a three-column report page (sections, questions, score and gaps)
- Resume PDF generation from the report data (in progress)

## Tech Stack

**Frontend:** React, Vite, React Router, Axios, SCSS
**Backend:** Node.js, Express, Mongoose, JWT, bcrypt, multer, pdf-parse, zod, puppeteer
**Database:** MongoDB Atlas
**AI:** Google Gemini (`@google/genai`)

## Project Structure

```
ATS-Resume/
├── Backend/
│   └── src/
│       ├── controllers/   # auth and interview controllers
│       ├── middlewares/   # auth and file upload (multer)
│       ├── models/        # user, blacklist token, interview report
│       ├── routes/        # /api/auth and /api/interview
│       ├── services/      # Gemini calls (ai.service.js)
│       └── app.js
└── Frontend/
    └── src/features/
        ├── auth/          # login, register, protected route
        └── interview/     # home, interview page, hooks, api, styles
```

The frontend follows four layers: UI (pages), hooks, state (context) and API (axios services).

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB Atlas connection string
- A Google Gemini API key from Google AI Studio

### 1. Clone

```bash
git clone https://github.com/saimaaliya2005-cypher/ATS-Resume-Analyzer.git
cd ATS-Resume-Analyzer
```

### 2. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env` (use the same variable names your code reads):

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Start the server (runs on `http://localhost:3000`):

```bash
npm run dev
```

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Endpoints

### Auth (`/api/auth`)

| Method | Route | Description |
| --- | --- | --- |
| POST | `/register` | Create an account |
| POST | `/login` | Login and set the auth cookie |
| GET | `/logout` | Logout and blacklist the token |
| GET | `/get-me` | Get the logged-in user |

### Interview (`/api/interview`)

| Method | Route | Description |
| --- | --- | --- |
| POST | `/` | Generate a report (multipart form: `resume`, `selfDescription`, `jobDescription`) |
| GET | `/` | List all reports of the logged-in user |
| GET | `/report/:interviewId` | Get one report |
| POST | `/resume/pdf/:interviewReportId` | Generate a resume PDF (in progress) |

All interview routes require login.

## Notes

- Gemini can return `503` when it is busy. The backend retries automatically a few times before failing.
- Never commit your `.env` file. It is already listed in `.gitignore`.

## Roadmap

- Finish resume PDF download button
- Delete reports
- Deploy backend and frontend