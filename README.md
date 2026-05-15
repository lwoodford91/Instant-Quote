# 🎤 Palmwood Rentals — Event Quote Builder

A mobile-friendly quote builder app for Palmwood Rentals karaoke & event packages.

---

## Features

- **Package selection** — Sing Karaoke, Spotlight Karaoke, Superstar Karaoke, Movie Night
- **Add-ons** — Wireless mics, TV rental, wired mics, Attendant (hourly)
- **Delivery** — Auto-calculates driving distance & fee from Highland, CA using AI
- **Delivery TBD** — Option to send quote without address, with pending note
- **Discounts** — Independent 50% / 75% off controls for Delivery and Labor
- **Quote output** — Itemized quote with deposit breakdown, copies to clipboard
- **Booking link** — Direct link to palmwoodrentals.com/booking

---

## Getting Started

### Option 1 — Run as React App

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Option 2 — Standalone HTML (no install needed)

Open `public/index-standalone.html` directly in any browser — no server or build step required. Works offline after first load (except AI distance calculation).

---

## Deployment

This app is ready to deploy on **Netlify** or **Vercel** in one step:

### Netlify
1. Go to [netlify.com](https://netlify.com) and log in
2. Drag and drop the entire project folder
3. Netlify auto-detects Create React App and builds it
4. Your app is live at a `.netlify.app` URL

### Vercel
```bash
npm install -g vercel
vercel
```

### Add to iPhone Home Screen (PWA)
After deploying, open the URL in Safari on iPhone → Share → **Add to Home Screen**

---

## Project Structure

```
palmwood-rentals/
├── public/
│   ├── index.html              # React app entry point
│   └── index-standalone.html  # Self-contained single-file version
├── src/
│   ├── App.jsx                 # Main application component
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── .gitignore
├── package.json
└── README.md
```

---

## Delivery Fee Tiers

| Distance | Fee |
|----------|-----|
| ≤ 10 miles | $25 |
| ≤ 20 miles | $40 |
| ≤ 30 miles | $55 |
| ≤ 40 miles | $70 |
| ≤ 50 miles | $85 |
| ≤ 75 miles | $85 |
| 86+ miles  | $110 |

---

## Tech Stack

- **React 18** — UI framework
- **Claude AI API** — Auto-calculates driving distance from Highland, CA
- **Plain CSS** — No UI library dependencies

---

© Palmwood Rentals
