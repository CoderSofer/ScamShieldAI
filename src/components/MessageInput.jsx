/**
 * MessageInput
 * Textarea for pasting a suspicious message plus Analyse / Clear buttons.
 *
 * Props:
 *   message       (string)   — controlled textarea value
 *   onChange      (fn)       — called with new string when text changes
 *   onAnalyse     (fn)       — called when the Analyse button is clicked
 *   onClear       (fn)       — called when the Clear button is clicked
 *   isAnalysing   (boolean)  — disables controls while processing
 */
function MessageInput({ message, onChange, onAnalyse, onClear, isAnalysing }) {
  // The analyse button is only active when there is text and we are not busy
  const canAnalyse = message.trim().length > 0 && !isAnalysing

  const handleKeyDown = (e) => {
    // Allow Ctrl/Cmd + Enter as a keyboard shortcut to trigger analysis
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      if (canAnalyse) onAnalyse()
    }
  }

  return (
    <section className="input-section" aria-labelledby="input-heading">
      <h2 id="input-heading" className="section-title">
        Paste Your Message
      </h2>
      <p className="section-desc">
        Copy and paste a suspicious email, SMS or social-media message below,
        then click <strong>Analyse Message</strong>.
      </p>

      <textarea
        className="message-textarea"
        value={message}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste a suspicious message here…"
        aria-label="Suspicious message to analyse"
        aria-describedby="textarea-hint"
        rows={8}
        spellCheck={false}
        autoComplete="off"
      />

      {/* Character count hint */}
      <p id="textarea-hint" className="char-count" aria-live="polite">
        {message.length > 0
          ? `${message.length} character${message.length !== 1 ? 's' : ''} · Ctrl+Enter to analyse`
          : 'Ctrl+Enter to analyse once text is pasted'}
      </p>

      <div className="input-actions">
        <button
          className="btn btn-primary"
          onClick={onAnalyse}
          disabled={!canAnalyse}
          aria-disabled={!canAnalyse}
        >
          {/* Magnifying-glass icon */}
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          {isAnalysing ? 'Analysing…' : 'Analyse Message'}
        </button>

        {/* Only show Clear when there is content */}
        {message.length > 0 && (
          <button className="btn btn-ghost" onClick={onClear} aria-label="Clear message">
            Clear
          </button>
        )}
      </div>
    </section>
  )
}

export default MessageInput
