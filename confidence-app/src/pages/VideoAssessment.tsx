import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createMockVideoAssessmentReport, saveAssessmentReport } from '../data/reportData'
import './VideoAssessment.css'

const VIDEO_QUESTIONS = [
  'Tell us about a time you handled a challenge with confidence.',
  'How do you introduce yourself when meeting new people in a professional setting?',
  'Describe a situation where you had to speak up for your idea.',
  'What do you do when you feel nervous before an important task?',
  'Share one recent success that made you feel more confident in yourself.',
]

export default function VideoAssessment() {
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)

  const [current, setCurrent] = useState(0)
  const [permissionState, setPermissionState] = useState<'idle' | 'ready' | 'blocked'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current)
      }

      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    if (!videoRef.current || !streamRef.current) return
    videoRef.current.srcObject = streamRef.current
  }, [permissionState])

  const requestMediaAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setPermissionState('ready')
      setErrorMessage('')
    } catch {
      setPermissionState('blocked')
      setErrorMessage('Camera or microphone access was blocked. Allow both permissions to continue with the mock video assessment.')
    }
  }

  const handleComplete = () => {
    setIsProcessing(true)
    streamRef.current?.getTracks().forEach((track) => track.stop())

    timerRef.current = window.setTimeout(() => {
      const report = createMockVideoAssessmentReport()
      saveAssessmentReport(report)
      navigate('/report')
    }, 2200)
  }

  const progress = ((current + 1) / VIDEO_QUESTIONS.length) * 100

  return (
    <div className="video-assessment page">
      <div className="container">
        <h1>Stage 2: PersonaAI Video Assessment (Optional)</h1>
        <p className="intro">
          Respond to each prompt on camera while we simulate voice, posture, and expression analysis. This is a guided frontend demo, so the final result is a mock confidence summary.
        </p>

        <div className="video-assessment-grid">
          <section className="video-panel card">
            <div className="video-frame">
              <video ref={videoRef} autoPlay muted playsInline />
              {permissionState !== 'ready' && (
                <div className="video-overlay">
                  <span className="overlay-badge">Camera + Mic</span>
                  <p>Enable access to preview your response feed and continue the mock interview.</p>
                </div>
              )}
              {permissionState === 'ready' && <span className="recording-pill">Live preview</span>}
            </div>

            <div className="capture-actions">
              <button type="button" className="btn btn-primary" onClick={requestMediaAccess} disabled={isProcessing}>
                {permissionState === 'ready' ? 'Reconnect Camera & Mic' : 'Enable Camera & Mic'}
              </button>
              <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}
            <p className="pipeline-text">Processing preview: video frames, eye contact, posture signals, speaking pace, and response delivery.</p>
          </section>

          <section className="question-panel card">
            {permissionState === 'ready' ? (
              <>
                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width: `${progress}%` }} />
                  <span className="progress-text">Question {current + 1} of {VIDEO_QUESTIONS.length}</span>
                </div>

                <div className="question-block">
                  <span className="question-label">Current prompt</span>
                  <h2>{VIDEO_QUESTIONS[current]}</h2>
                  <p>Speak naturally for 20 to 40 seconds. We will pretend to analyze facial cues, vocal confidence, and clarity while you respond.</p>
                </div>

                <div className="helper-card">
                  <span>What we are reading</span>
                  <p>Eye contact, posture stability, vocal tone, speaking pace, pauses, and response structure.</p>
                </div>

                <div className="question-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrent((value) => value - 1)}
                    disabled={current === 0 || isProcessing}
                  >
                    Previous
                  </button>

                  {current + 1 < VIDEO_QUESTIONS.length ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setCurrent((value) => value + 1)}
                      disabled={isProcessing}
                    >
                      Next Prompt
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleComplete}
                      disabled={isProcessing}
                    >
                      Complete Video Assessment
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="question-waiting">
                <span className="question-label">Interview locked</span>
                <h2>Enable your camera and microphone to begin the video questions.</h2>
                <p>The prompts will appear here once media access is granted.</p>
              </div>
            )}

            {isProcessing && (
              <div className="processing-card">
                <div className="processing-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <h3>Analyzing recordings</h3>
                <p>Aggregating speech, expression, posture, and response signals into a mock confidence score.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
