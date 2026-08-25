# 🛡️ ScamShield AI

ScamShield AI is a browser-based scam detection tool built with **React** and **Vite**. Users can paste a suspicious email, SMS, or social-media message into the application and receive an instant risk assessment, an explanation of the warning signs found, and recommended safety actions.

The current version uses a **rule-based detection and scoring system** that runs entirely in the browser. No message content is sent to a server.

## ✨ Features

- **Scam risk scoring** from 0–100
- **Low, Medium, and High risk classifications**
- Detects common scam indicators, including:
  - urgency and pressure tactics
  - requests for money or unusual payment methods
  - password and personal-information requests
  - suspicious links
  - prize and lottery claims
  - impersonation of trusted organisations
  - threats and fear tactics
- Highlights the **specific warning signs** detected in a message
- Provides a **plain-English explanation** of the result
- Suggests **three relevant safety actions**
- Includes example messages for testing different scam scenarios
- **Read-aloud functionality** using the browser's Speech Synthesis API
- Adjustable font sizes for improved accessibility
- Keyboard shortcut: **Ctrl/Cmd + Enter** to analyse a message
- Responsive interface for desktop and smaller screens
- Fully **client-side processing** for privacy

## 🖥️ How It Works

When a user submits a message, ScamShield checks the text for patterns associated with common scam techniques. Each detected category contributes a weighted value to the overall risk score.

For example:

| Warning sign | Weight |
| --- | ---: |
| Urgency / pressure tactics | 15 |
| Money / payment request | 25 |
| Credential / password request | 20 |
| Suspicious link | 15 |
| Prize / lottery claim | 20 |
| Impersonation of a trusted body | 15 |
| Threats / fear tactics | 20 |

Excessive capital letters and exclamation marks can also increase the score slightly.

The final score is capped at 100 and mapped to a risk level:

- **Low:** 0–20
- **Medium:** 21–55
- **High:** 56–100

The application then generates an explanation and selects safety recommendations based on the warning categories found.

> **Note:** The current detector is heuristic and rule-based. It does not use a trained machine-learning or generative AI model, so its result should be treated as guidance rather than a definitive judgement.

## 🛠️ Tech Stack

- **React 18** — user interface and component state
- **Vite 6** — development server and build tooling
- **JavaScript (ES Modules)** — scam analysis logic
- **CSS** — responsive layout, styling, and animations
- **Web Speech API** — text-to-speech for analysis results

## 🚀 Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm before running the project.

### Installation

Clone or download the project, then open a terminal in the project directory and install the dependencies:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Vite will display a local development URL, usually:

```text
http://localhost:5173/
```

Open the URL in your browser to use ScamShield AI.

## 📦 Production Build

Create an optimised production build with:

```bash
npm run build
```

Preview the production build locally with:

```bash
npm run preview
```

## 📁 Project Structure

```text
scamshield-ai/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── AnalysisResult.jsx
    │   ├── ExampleMessages.jsx
    │   ├── Header.jsx
    │   └── MessageInput.jsx
    └── utils/
        └── scamAnalyser.js
```

### Main files

- `App.jsx` — manages the application's main state and analysis flow.
- `MessageInput.jsx` — handles message input, clearing, and keyboard shortcuts.
- `ExampleMessages.jsx` — provides example scam and legitimate messages.
- `AnalysisResult.jsx` — displays the score, warning signs, explanation, recommendations, and read-aloud controls.
- `scamAnalyser.js` — contains the scam-detection patterns, scoring logic, explanations, and recommendations.
- `index.css` — contains global styling, responsive design, animations, and accessibility-related styles.

## 🔒 Privacy

ScamShield performs its analysis entirely inside the user's browser. Message text is not uploaded or sent to an external API or backend server.

This makes the current version suitable for experimenting with potentially sensitive messages without intentionally transmitting their contents elsewhere.

## ♿ Accessibility

The interface includes several accessibility-focused features:

- adjustable text size
- semantic HTML and ARIA labels
- keyboard-accessible controls
- visible focus states
- screen-reader-friendly status updates
- text-to-speech analysis results
- responsive layouts for different screen sizes

## ⚠️ Limitations

ScamShield is a prototype and should not be treated as a replacement for professional fraud detection or security advice.

Because the current analysis relies on predefined keywords and patterns:

- sophisticated scams may avoid detection
- legitimate messages containing scam-like language may receive a higher score
- the system does not verify senders, URLs, phone numbers, or email addresses
- it does not currently analyse attachments or website content
- it does not use contextual machine-learning or natural-language understanding

Users should independently verify suspicious messages through official channels before sending money, sharing personal information, or clicking links.

## 🔮 Possible Future Improvements

Potential extensions to the project include:

- machine-learning or NLP-based message classification
- URL reputation and phishing-link checks
- email sender and domain verification
- explainable AI highlighting suspicious phrases directly in the message
- support for uploaded screenshots or images using OCR
- multilingual scam detection
- scam-reporting integrations
- configurable detection rules and risk weights
- automated testing for the analyser and React components

## 📄 Disclaimer

ScamShield AI is intended as an educational and assistive tool. A low-risk result does not guarantee that a message is safe, and a high-risk result does not conclusively prove that a message is fraudulent.
