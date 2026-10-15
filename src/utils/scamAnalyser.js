/**
 * ScamShield AI — Core Analysis Engine
 *
 * Analyses plain-text messages for common scam indicators and returns a
 * structured result object. Everything runs client-side; no data leaves
 * the browser.
 *
 * Scoring model
 * ─────────────
 * Each detected warning category adds its `weight` to the total score.
 * Aggressive formatting (excessive CAPS, exclamation marks) adds a small
 * bonus. The final score is clamped to 0–100 and mapped to three risk
 * levels: Low (0–20), Medium (21–55), High (56–100).
 */

// ─── Warning-pattern definitions ────────────────────────────────────────────
// Each entry describes one category of scam tactic.
// `keywords` are matched case-insensitively against the message text.
// `weight` is the number of points added to the risk score when triggered.
const WARNING_PATTERNS = {
  urgency: {
    label: 'Urgency / Pressure Tactics',
    icon: '⚡',
    description: 'Creates artificial time pressure to prevent you thinking carefully.',
    keywords: [
      'urgent', 'immediately', 'act now', 'limited time', 'expires today',
      'deadline', 'asap', 'right away', 'hurry', 'final notice',
      'last chance', 'respond now', "don't wait", 'time sensitive',
      'within 24 hours', 'within 48 hours',
    ],
    weight: 15,
  },

  moneyRequest: {
    label: 'Money / Payment Request',
    icon: '💸',
    description: 'Asks you to send money, gift cards or financial details.',
    keywords: [
      'send money', 'wire transfer', 'bitcoin', 'crypto', 'gift card',
      'bank account', 'payment required', 'transfer funds', 'western union',
      'moneygram', 'itunes card', 'amazon card', 'prepaid card',
      'google play card', 'send payment', 'pay now',
    ],
    weight: 25,
  },

  passwordRequest: {
    label: 'Credential / Password Request',
    icon: '🔑',
    description: 'Requests login details, PINs or sensitive personal identifiers.',
    keywords: [
      'password', 'your pin', 'credentials', 'login details', 'account details',
      'verify your account', 'confirm your details', 'social security',
      'date of birth', "mother's maiden", 'security question',
      'enter your details', 'your ssn',
    ],
    weight: 20,
  },

  suspiciousLinks: {
    label: 'Suspicious Link',
    icon: '🔗',
    description: 'Contains links that may lead to phishing or malware sites.',
    keywords: [
      'click here', 'bit.ly', 'tinyurl', 'verify now', 'confirm now',
      'http://', 'login-', 'secure-', 'account-verify', 'update your info',
      'follow this link', 'visit this link',
    ],
    weight: 15,
  },

  prizeClaim: {
    label: 'Prize / Lottery Claim',
    icon: '🎰',
    description: 'Claims you have won something you never entered.',
    keywords: [
      'you have won', "you've won", 'you won', 'winner', 'lottery',
      'selected winner', 'lucky winner', 'claim your reward',
      'claim your prize', 'free gift', 'cash prize', 'prize draw',
    ],
    weight: 20,
  },

  impersonation: {
    label: 'Impersonation of Trusted Body',
    icon: '🎭',
    description: 'Appears to impersonate a government agency, bank or tech company.',
    keywords: [
      'irs', 'hmrc', 'microsoft support', 'apple support',
      'amazon support', 'paypal', 'your bank', 'government',
      'police department', 'fbi', 'official notice', 'tax office',
      'social security administration', 'from amazon', 'from apple',
    ],
    weight: 15,
  },

  threats: {
    label: 'Threats / Fear Tactics',
    icon: '⚠️',
    description: 'Threatens negative consequences to frighten you into compliance.',
    keywords: [
      'arrest', 'legal action', 'lawsuit', 'account suspended',
      'account terminated', 'prosecuted', 'warrant', 'criminal charges',
      'deportation', 'you will be fined', 'press charges',
      'sent to jail', 'face charges',
    ],
    weight: 20,
  },
}

// ─── Category-specific safety recommendations ────────────────────────────────
const CATEGORY_RECOMMENDATIONS = {
  urgency:
    'Take your time — legitimate organisations never demand instant responses. Slow down and verify.',
  moneyRequest:
    'Never send money, gift cards or cryptocurrency to someone you have not met in person and thoroughly verified.',
  passwordRequest:
    'No legitimate service will ever ask for your password or PIN via email or text. Never share these details.',
  suspiciousLinks:
    'Do not click links in unsolicited messages. Navigate to the official website by typing the address yourself.',
  prizeClaim:
    "You cannot win a competition you never entered. Any request to pay a fee to 'release' your prize is always a scam.",
  impersonation:
    'Call the organisation directly using a number from their official website — never a number provided in the message.',
  threats:
    'Threats of arrest or legal action sent by message are a hallmark scam tactic. Real authorities do not operate this way.',
}

// Fallback recommendations used when fewer than 3 specific ones are available
const FALLBACK_RECOMMENDATIONS = [
  'Do not reply to or interact with this message.',
  'Report it to your national scam centre (e.g. Action Fraud in the UK, the FTC in the USA).',
  'Block the sender on your device.',
]

// ─── Keyword matching helper ─────────────────────────────────────────────────
/**
 * Returns true if lowerText contains the keyword.
 *
 * Multi-word phrases use a simple substring match.
 * Single words use a word-boundary regex to avoid false positives
 * (e.g. "password" should not match inside "passwordless").
 *
 * @param {string} lowerText  The message, already lower-cased.
 * @param {string} keyword    The keyword/phrase to look for.
 */
function matchesKeyword(lowerText, keyword) {
  const kw = keyword.trim()
  // Multi-word phrase or hyphenated term — plain substring match
  if (kw.includes(' ') || kw.includes('-')) {
    return lowerText.includes(kw)
  }
  // Single word — word-boundary regex
  try {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\b${escaped}\\b`).test(lowerText)
  } catch {
    return lowerText.includes(kw)
  }
}

// ─── Score-to-risk mapping ───────────────────────────────────────────────────
function scoreToRisk(score) {
  if (score <= 20) return { riskLevel: 'Low', riskColour: 'low' }
  if (score <= 55) return { riskLevel: 'Medium', riskColour: 'medium' }
  return { riskLevel: 'High', riskColour: 'high' }
}

// ─── Plain-English explanation builder ──────────────────────────────────────
function buildExplanation(riskLevel, score, detectedKeys) {
  if (detectedKeys.length === 0) {
    return `No obvious scam indicators were detected (score: ${score}/100). This message appears relatively safe, but always exercise caution with unsolicited messages — scammers constantly evolve their tactics.`
  }

  const labels = detectedKeys.map(k => WARNING_PATTERNS[k].label).join(', ')
  const count = detectedKeys.length
  const plural = count > 1 ? 's' : ''

  if (riskLevel === 'High') {
    return `This message raised ${count} red flag${plural} and scored ${score} out of 100, indicating a very high probability of being a scam. Patterns detected: ${labels}. Do not engage, click any links or provide any personal information.`
  }
  if (riskLevel === 'Medium') {
    return `This message contains ${count} suspicious element${plural} and scored ${score} out of 100 — warranting serious caution. Patterns detected: ${labels}. Verify the sender's identity through official channels before taking any action.`
  }
  return `This message scored ${score} out of 100 — a low risk level, but a minor warning was detected: ${labels}. It may be legitimate, but verify the sender if anything seems unusual.`
}

// ─── Recommendations builder ─────────────────────────────────────────────────
function buildRecommendations(detectedKeys) {
  const recs = []

  // Pick the most relevant category-specific recommendations first
  for (const key of detectedKeys) {
    if (CATEGORY_RECOMMENDATIONS[key] && recs.length < 3) {
      recs.push(CATEGORY_RECOMMENDATIONS[key])
    }
  }

  // Fill remaining slots with general fallback advice
  for (const fallback of FALLBACK_RECOMMENDATIONS) {
    if (recs.length >= 3) break
    if (!recs.includes(fallback)) recs.push(fallback)
  }

  return recs.slice(0, 3)
}

// ─── Main export ─────────────────────────────────────────────────────────────
/**
 * Analyses a message string for scam indicators.
 *
 * @param {string} text  The raw message text to analyse.
 * @returns {object|null} A structured result object, or null for empty input.
 */
export function analyseMessage(text) {
  if (!text || text.trim().length === 0) return null

  const lower = text.toLowerCase()
  const detectedKeys = []
  let totalScore = 0

  // ── Pattern matching ──
  for (const [key, pattern] of Object.entries(WARNING_PATTERNS)) {
    const triggered = pattern.keywords.some(kw => matchesKeyword(lower, kw))
    if (triggered) {
      detectedKeys.push(key)
      totalScore += pattern.weight
    }
  }

  // ── Formatting signals ──
  // Excessive CAPS and exclamation marks are common scam pressure techniques.
  const exclamationCount = (text.match(/!/g) || []).length
  const allCapsWordCount = (text.match(/\b[A-Z]{3,}\b/g) || []).length
  if (exclamationCount > 2) totalScore += Math.min(exclamationCount * 2, 8)
  if (allCapsWordCount > 2) totalScore += Math.min(allCapsWordCount * 2, 8)

  // Clamp to 0–100
  const riskScore = Math.min(Math.max(Math.round(totalScore), 0), 100)

  const { riskLevel, riskColour } = scoreToRisk(riskScore)
  const explanation = buildExplanation(riskLevel, riskScore, detectedKeys)
  const recommendations = buildRecommendations(detectedKeys)

  return {
    riskScore,
    riskLevel,
    riskColour,
    // Expand keys to full pattern objects so components can render them directly
    detectedWarnings: detectedKeys.map(key => ({ key, ...WARNING_PATTERNS[key] })),
    explanation,
    recommendations,
  }
}
