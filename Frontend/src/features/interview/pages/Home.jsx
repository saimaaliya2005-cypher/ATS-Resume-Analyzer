import React,{useState, useRef, useEffect } from "react"
import "../style/home.scss"
import { useInterview } from "../hooks/useinterview.js"
import { useNavigate } from "react-router"

// UI layer only. Hook, state and api layers get wired in later.
const Home = () => {

    const {loading, generateReport, reports, getReports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    useEffect(() => { getReports() }, [])
    
    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile})
        navigate(`/interview/${data._id}`)
    }

    if(loading) {
       return (
        <main className='loading-screen'>
            <h1>Loading your interview plan...</h1>
        </main>
       )
    }

    return (
        <div className="home">
            <main className="home__main">

                <header className="home__header">
                    <h1>
                        Create Your Custom <span className="gradient-text">Interview Plan</span>
                    </h1>
                    <p>
                        Let our AI analyze the job requirements and your unique profile
                        to build a winning strategy.
                    </p>
                </header>

                <section className="plan-card">
                    <div className="plan-card__body">

                        {/* LEFT: job description */}
                        <div className="panel panel--left">
                            <div className="panel__title">
                                <span className="panel__icon">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="7" width="18" height="13" rx="2" />
                                        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </span>
                                <h2>Target Job Description</h2>
                                <span className="badge">Required</span>
                            </div>

                            <div className="textarea-wrap">
                                <textarea
                                onChange={(e) => {setJobDescription(e.target.value)}}
                                    id="jobDescription"
                                    name="jobDescription"
                                    maxLength={5000}
                                    placeholder={'Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."'}
                                />
                                <span className="char-count">0 / 5000 chars</span>
                            </div>
                        </div>

                        {/* RIGHT: profile */}
                        <div className="panel panel--right">
                            <div className="panel__title">
                                <span className="panel__icon">
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M4 21a8 8 0 0 1 16 0" />
                                    </svg>
                                </span>
                                <h2>Your Profile</h2>
                            </div>

                            <div className="field">
                                <p className="field__label">
                                    Upload Resume <span className="badge badge--soft">Best results</span>
                                </p>

                                <label className="dropzone" htmlFor="resume">
                                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 18a4 4 0 0 1-.6-7.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9" />
                                        <path d="M12 12v8" />
                                        <path d="m9 15 3-3 3 3" />
                                    </svg>
                                    <span className="dropzone__title">Click to upload or drag &amp; drop</span>
                                    <span className="dropzone__hint">PDF (Max 3MB)</span>
                                </label>
                                <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf" />
                            </div>

                            <div className="divider"><span>or</span></div>

                            <div className="field">
                                <label className="field__label" htmlFor="selfDescription">
                                    Quick Self-Description
                                </label>
                                <textarea
                                onChange={(e) => {setSelfDescription(e.target.value)}}
                                    id="selfDescription"
                                    name="selfDescription"
                                    className="textarea--small"
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                />
                            </div>

                            <div className="info-note">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4" />
                                    <path d="M12 8h.01" />
                                </svg>
                                <p>
                                    Either a <strong>Resume</strong> or a <strong>Self Description</strong> is
                                    required to generate a personalized plan.
                                </p>
                            </div>
                        </div>
                    </div>

                    <footer className="plan-card__footer">
                        <span className="plan-card__meta">AI-Powered Strategy Generation • Approx 30s</span>
                        <button 
                        onClick={handleGenerateReport}
                        type="button" className="generate-btn">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
                            </svg>
                            Generate My Interview Strategy
                        </button>
                    </footer>
                </section>

                 {/*Recent Reports List */}
                    {reports.length > 0 && (
                        <section className="recent-reports">
                            <h2>My Recent Interview Plans</h2>
                            <ul className="reports-list">
                                {
                                    reports.map(report => (
                                        <li key={report._id} className="report-item" onClick={() => navigate (`/interview/${report._id}`)}>
                                            <h3>{report.title || 'Untitled Position'}</h3>
                                            <p className="report-meta">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                            <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score : {report.matchScore}</p>
                                        </li>
                                    ))}
                            </ul>
                            </section>
                    )}

                <nav className="home__links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Help Center</a>
                </nav>

            </main>
        </div>
    )
}

export default Home