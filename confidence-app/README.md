# PersonaAI-Powered Confidence Monitoring & Enhancement — Frontend

Frontend-only, hardcoded React prototype for the M.Tech project. No backend; for testing and user experience.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 (or the URL shown in the terminal).

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Pages

- **/** — Landing (intro, five pillars, CTA)
- **/login** — Log in (UI only; submits → Dashboard)
- **/register** — Sign up (name, email, password, age group) → Dashboard
- **/dashboard** — Start assessment, previous score (demo), tips
- **/assessment** — Stage 1: 25 scenario-based MCQs → Report
- **/video-assessment** — Stage 2 placeholder (no recording)
- **/report** — Sample confidence report (overall score, pillar chart, strengths/areas)
- **/action-plan** — Personalized exercises per pillar

## Tech

- React 18, TypeScript, Vite
- React Router, Recharts (report charts)
- Responsive CSS (mobile and desktop)
