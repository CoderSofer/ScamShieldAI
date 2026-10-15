import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import ExampleMessages from './components/ExampleMessages.jsx'
import MessageInput from './components/MessageInput.jsx'
import AnalysisResult from './components/AnalysisResult.jsx'
import { analyseMessage } from './utils/scamAnalyser.js'

// Available font-size steps (rem). Index 2 = 1 rem = default.
const FONT_SIZES  = [0.8, 0.9, 1, 1.125, 1.25]
const FONT_LABELS = ['Smallest', 'Small', 'Default', 'Large', 'Largest']
const DEFAULT_FONT_INDEX = 2

/**
 * App — root component
 *
 * State:
 *   message      — the text currently in the textarea
 *   result       — the analysis result object (null until first analysis)
 *   isAnalysing  — true during the brief processing delay
 *   fontIndex    — index into FONT_SIZES; applied as inline fontSize on the
 *                  root div so every rem-based value in the CSS scales together
 */
function App() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [fontIndex, setFontIndex] = useState(DEFAULT_FONT_INDEX)

  const decreaseFontSize = () => setFontIndex(i => Math.max(i - 1, 0))
  const increaseFontSize = () => setFontIndex(i => Math.min(i + 1, FONT_SIZES.length - 1))

  // rem units are always relative to the <html> element, so we must write the
  // chosen font size directly onto document.documentElement — not onto the div.
  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_SIZES[fontIndex] * 16}px`
    return () => {
      // Restore browser default when the component unmounts
      document.documentElement.style.fontSize = ''
    }
  }, [fontIndex])

  // Run the analysis. A short artificial delay lets the loading state render
  // so the user gets tactile feedback before the result appears.
  const handleAnalyse = () => {
    if (!message.trim()) return
    setIsAnalysing(true)
    setResult(null)

    setTimeout(() => {
      const analysisResult = analyseMessage(message)
      setResult(analysisResult)
      setIsAnalysing(false)
    }, 600)
  }

  // Clear the textarea and dismiss any existing result
  const handleClear = () => {
    setMessage('')
    setResult(null)
  }

  // Loading an example also resets any previous result
  const handleExampleSelect = (exampleMessage) => {
    setMessage(exampleMessage)
    setResult(null)
  }

  return (
    <div className="app">
      <Header
        onDecrease={decreaseFontSize}
        onIncrease={increaseFontSize}
        canDecrease={fontIndex > 0}
        canIncrease={fontIndex < FONT_SIZES.length - 1}
        fontLabel={FONT_LABELS[fontIndex]}
      />

      <main className="main-content">
        <ExampleMessages onSelect={handleExampleSelect} />

        <MessageInput
          message={message}
          onChange={setMessage}
          onAnalyse={handleAnalyse}
          onClear={handleClear}
          isAnalysing={isAnalysing}
        />

        {/* Loading state */}
        {isAnalysing && (
          <div className="analysing-indicator" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <span>Analysing message…</span>
          </div>
        )}

        {/* Results — only shown after a completed analysis */}
        {result && !isAnalysing && <AnalysisResult result={result} />}
      </main>

      <footer className="footer">
        <p>
          ScamShield AI runs entirely in your browser.&nbsp;
          No message text is ever sent to a server.
        </p>
      </footer>
    </div>
  )
}

export default App
