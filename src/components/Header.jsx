/**
 * Header
 * Displays the shield logo, app name, tagline and font-size controls.
 *
 * Props:
 *   onDecrease   (fn)      — shrink text one step
 *   onIncrease   (fn)      — grow text one step
 *   canDecrease  (boolean) — false when already at the smallest step
 *   canIncrease  (boolean) — false when already at the largest step
 *   fontLabel    (string)  — human-readable name of current size, e.g. "Default"
 */
function Header({ onDecrease, onIncrease, canDecrease, canIncrease, fontLabel }) {
  return (
    <header className="header" role="banner">
      <div className="header-content">
        {/* Shield icon — purely decorative */}
        <div className="header-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="28"
            height="28"
            aria-hidden="true"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
        </div>

        {/* Branding */}
        <div className="header-branding">
          <h1 className="header-title">ScamShield AI</h1>
          <p className="header-tagline">
            AI-powered scam detection — runs entirely in your browser, no data sent anywhere
          </p>
        </div>

        {/* Font-size controls */}
        <div className="font-controls" role="group" aria-label="Text size controls">
          <button
            className="font-btn"
            onClick={onDecrease}
            disabled={!canDecrease}
            aria-label="Decrease font size"
            title="Decrease font size"
          >
            A−
          </button>

          {/* Live region so screen readers announce size changes */}
          <span className="font-label" role="status" aria-live="polite" aria-label={`Current text size: ${fontLabel}`}>
            {fontLabel}
          </span>

          <button
            className="font-btn"
            onClick={onIncrease}
            disabled={!canIncrease}
            aria-label="Increase font size"
            title="Increase font size"
          >
            A+
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
