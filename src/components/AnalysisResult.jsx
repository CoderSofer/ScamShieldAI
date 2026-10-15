import { useState, useEffect } from 'react'

/**
 * AnalysisResult
 * Renders the full scam analysis report, divided into four accessible cards:
 *   1. Risk score with animated visual meter
 *   2. Detected warning signs (or a "no warnings" message)
 *   3. Plain-English explanation of the verdict
 *   4. Three recommended safety actions
 *
 * Props:
 *   result (object) — the object returned by analyseMessage()
 */
function AnalysisResult({ result }) {
  const {
    riskScore,
    riskLevel,
    riskColour,
    detectedWarnings,
    explanation,
    recommendations,
  } = result

  // ── Animate the meter from 0 → riskScore after mount ────────────────────
  const [meterWidth, setMeterWidth] = useState(0)
  useEffect(() => {
    const id = setTimeout(() => setMeterWidth(riskScore), 80)
    return () => clearTimeout(id)
  }, [riskScore])

  // ── Text-to-speech ───────────────────────────────────────────────────────
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Build a natural-sounding spoken script from the result data.
  const buildScript = () => {
    const recText = recommendations
      .map((r, i) => `${i + 1}. ${r}`)
      .join('. ')
    return (
      `Risk score: ${riskScore} out of 100. ${riskLevel} risk. ` +
      `${explanation} ` +
      `Recommended actions: ${recText}.`
    )
  }

  const handleSpeak = () => {
    if (!speechSupported) return
    if (isSpeaking) {
      // Stop playback immediately
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const utterance = new SpeechSynthesisUtterance(buildScript())
    utterance.onend  = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  // Cancel any in-progress speech when the result changes or the component unmounts
  useEffect(() => {
    return () => {
      if (speechSupported) window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [result]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      className="results-section"
      aria-labelledby="results-heading"
      aria-live="polite"
    >
      {/* Heading row: title + read-aloud toggle */}
      <div className="results-header">
        <h2 id="results-heading" className="section-title results-title">
          Analysis Complete
        </h2>

        <button
          className={`btn btn-read-aloud${isSpeaking ? ' btn-read-aloud--active' : ''}`}
          onClick={handleSpeak}
          disabled={!speechSupported}
          aria-pressed={isSpeaking}
          aria-label={isSpeaking ? 'Stop reading analysis aloud' : 'Read analysis aloud'}
          title={!speechSupported ? 'Text-to-speech not supported in this browser' : ''}
        >
          {isSpeaking ? '⏹ Stop' : '🔊 Read aloud'}
        </button>
      </div>

      {/* ── Card 1: Risk Score ──────────────────────────────────────────── */}
      <div
        className={`card risk-card risk-card--${riskColour}`}
        role="region"
        aria-label="Risk score summary"
      >
        <div className="risk-header">
          <div>
            <p className="risk-label">Risk Score</p>
            <p className="risk-score" aria-label={`${riskScore} out of 100`}>
              <span className="risk-score-value">{riskScore}</span>
              <span className="risk-score-max">/100</span>
            </p>
          </div>

          <div
            className={`risk-badge risk-badge--${riskColour}`}
            role="status"
            aria-label={`Risk level: ${riskLevel}`}
          >
            {riskLevel} Risk
          </div>
        </div>

        {/* Animated progress bar */}
        <div
          className="risk-meter"
          role="progressbar"
          aria-valuenow={riskScore}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Risk meter: ${riskScore} out of 100`}
        >
          <div
            className={`risk-meter-fill risk-meter-fill--${riskColour}`}
            style={{ width: `${meterWidth}%` }}
          />
        </div>

        <div className="risk-meter-labels" aria-hidden="true">
          <span>0 — Low</span>
          <span>Medium</span>
          <span>High — 100</span>
        </div>
      </div>

      {/* ── Card 2: Warning Signs ───────────────────────────────────────── */}
      <div className="card" role="region" aria-labelledby="warnings-heading">
        <h3 id="warnings-heading" className="card-title">
          {detectedWarnings.length > 0
            ? `⚠️ Warning Signs Detected (${detectedWarnings.length})`
            : '✅ Warning Signs'}
        </h3>

        {detectedWarnings.length > 0 ? (
          <ul className="warnings-list" role="list">
            {detectedWarnings.map(({ key, icon, label, description }) => (
              <li key={key} className="warning-item">
                <span className="warning-icon" aria-hidden="true">{icon}</span>
                <div className="warning-text">
                  <strong className="warning-label">{label}</strong>
                  <p className="warning-desc">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-warnings">
            No specific warning patterns were detected in this message.
          </p>
        )}
      </div>

      {/* ── Card 3: Plain-English Explanation ──────────────────────────── */}
      <div className="card" role="region" aria-labelledby="explanation-heading">
        <h3 id="explanation-heading" className="card-title">🔍 What We Found</h3>
        <p className="explanation-text">{explanation}</p>
      </div>

      {/* ── Card 4: Recommended Safety Actions ─────────────────────────── */}
      <div
        className={`card recommendations-card recommendations-card--${riskColour}`}
        role="region"
        aria-labelledby="recs-heading"
      >
        <h3 id="recs-heading" className="card-title">🛡️ Recommended Actions</h3>
        <ol className="recommendations-list" role="list">
          {recommendations.map((rec, i) => (
            <li key={i} className="recommendation-item">
              {/* Numbered circle */}
              <span className={`rec-number rec-number--${riskColour}`} aria-hidden="true">
                {i + 1}
              </span>
              <p className="rec-text">{rec}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default AnalysisResult
