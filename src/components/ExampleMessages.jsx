/**
 * ExampleMessages
 * Renders three pre-written scam messages that users can load into the
 * textarea with a single click. Each example demonstrates a different
 * scam archetype so users can explore the detector's capabilities.
 *
 * Props:
 *   onSelect(message: string) — called when an example is chosen
 */

// ─── Example scam messages ──────────────────────────────────────────────────
const EXAMPLES = [
  {
    id: 'prize',
    label: '🎰 Prize Scam',
    hint: 'Lottery / reward fraud',
    message:
      `CONGRATULATIONS! You have been selected as the LUCKY WINNER of our £500,000 International Lottery Prize Draw! To claim your reward immediately, click here: http://claim-prize-now.info/verify. We require your bank account details and date of birth to process the transfer. This offer EXPIRES TODAY – don't delay, act now or forfeit your prize! Respond ASAP!!!`,
  },
  {
    id: 'phishing',
    label: '🏦 Bank Phishing',
    hint: 'Credential / account theft',
    message:
      `URGENT: Your PayPal account has been suspended due to suspicious activity. You must verify your account immediately to avoid permanent termination. Login with your password and credentials here: http://secure-paypal-login.net/confirm. We need your account details and social security number to restore access. Failure to respond within 24 hours will result in legal action.`,
  },
  {
    id: 'legitimate',
    label: '✅ Legitimate Email',
    hint: 'Safe / low-risk message',
    message:
      `Hi Sarah, just a quick reminder that our team meeting is scheduled for Thursday at 2 PM in the main conference room. We'll be going over the Q3 project updates and planning for the next sprint. Please bring any notes from your current tasks. No preparation needed beyond that — it should be a fairly relaxed catch-up. Let me know if you can't make it and I'll send the notes afterwards. Best regards, James`,
  },
  {
    id: 'irs',
    label: '🏛️ IRS Tax Threat',
    hint: 'Government impersonation',
    message:
      `This is an official notice from the IRS. Our records indicate you owe $3,847 in unpaid taxes. A warrant has been issued for your arrest. To avoid prosecution and jail, you must pay immediately using iTunes gift cards or Bitcoin. Call us back ASAP or face criminal charges. This is your FINAL NOTICE before legal action is taken against you!!!`,
  },
]

function ExampleMessages({ onSelect }) {
  return (
    <section className="examples-section" aria-labelledby="examples-heading">
      <h2 id="examples-heading" className="section-title">
        Try an Example
      </h2>
      <p className="section-desc">
        Load a sample message — including a legitimate one — to explore the detector.
      </p>

      <div className="examples-grid" role="list">
        {EXAMPLES.map(({ id, label, hint, message }) => (
          <button
            key={id}
            className="example-card"
            onClick={() => onSelect(message)}
            role="listitem"
            aria-label={`Load example: ${label} — ${hint}`}
          >
            <span className="example-label">{label}</span>
            <span className="example-hint">{hint}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ExampleMessages
