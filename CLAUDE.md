# CLAUDE.md — CFP Costs Simulator

Rules, conventions and context for working on this project.
Read this file in full before making any change.

---

## Project overview

A cost simulator for **Caen Falaise Planeurs** (CFP), a French gliding club.
It helps members estimate their season budget across four scenarios:
- **Élève** — two-season training path to the SPL licence
- **Saison** — licensed pilot planning their flying hours
- **Découverte** — comparing discovery packages vs. annual membership
- **Visiteur** — visiting pilot calculating a short-stay cost

The app is hosted on **GitHub Pages** at `https://nicolasmassart.github.io/cfp-sim-couts/`.
Deployable artifact: `dist/` produced by `npm run build`.

---

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Bundler | Vite 5 + @vitejs/plugin-react | Config in `vite.config.js` |
| Language | React 18 + JSX | Functional components, hooks only. No TypeScript. |
| Styling | Plain CSS files | No preprocessor, no CSS-in-JS |
| Chart | Chart.js 4 via npm | Imported as `import Chart from 'chart.js/auto'` — no CDN global |
| Fonts | DM Sans + DM Mono | Google Fonts, loaded in `index.html` |

Runtime dependencies: `react`, `react-dom`, `chart.js`.

---

## Repository layout

```
cfp-costs-simulator/
├── index.html              # Minimal HTML — just <div id="root"> + main.jsx script
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # React entry: ReactDOM.createRoot → <App />
    ├── App.jsx             # Root component: header, scenario grid, active panel, footer
    ├── styles/
    │   ├── variables.css   # ALL CSS custom properties — edit here to restyle
    │   ├── base.css        # Reset, body, .hidden, hr.divider
    │   ├── layout.css      # header / main / footer
    │   └── components.css  # Every UI component (cards, toggles, tables…)
    ├── data/
    │   └── pricing.js      # SINGLE SOURCE OF TRUTH for every euro figure
    ├── utils/
    │   ├── formatting.js   # fmt / fmt2 / fmtH / fmtSliderH — pure functions
    │   └── calculations.js # billableHrs / instrCost / towCost / flightOptions
    ├── components/
    │   ├── FootNotes.jsx   # Regulatory notes React component (static, used by all scenarios)
    │   └── SeasonChart.jsx # Chart.js wrapper React component (useRef/useEffect)
    └── scenarios/
        ├── LearnScenario.jsx     # "Apprendre à voler" — useState(hasBIA) + JSX
        ├── SeasonScenario.jsx    # "Planifier ma saison" — sliders/toggles + SeasonChart
        ├── DiscoveryScenario.jsx # "Forfait découverte" — discovery vs membership
        └── VisitScenario.jsx     # "Pilote visiteur" — temporary membership
```

### Where things belong

| Task | File to edit |
|---|---|
| Pricing change | `src/data/pricing.js` only |
| New CSS variable or colour | `src/styles/variables.css` |
| New reusable UI element | `src/styles/components.css` + a new `.jsx` component if needed |
| New scenario | New `src/scenarios/XxxScenario.jsx` + add to `SCENARIO_COMPONENTS` in `src/App.jsx` |
| Fix a calculation bug | `src/utils/calculations.js` |
| Fix a display bug | The relevant `src/scenarios/*Scenario.jsx` file |
| Chart change | `src/components/SeasonChart.jsx` |

---

## Design system

### CSS variables (defined in `variables.css`)

Colours have semantic meaning — use the right token, never hardcode a hex.

| Variable | Meaning | Use |
|---|---|---|
| `--sky` / `--sky-mid` | Brand blue | Headers, active states |
| `--sky-light` / `--sky-pale` | Light blue | `.metric-card.sky` backgrounds |
| `--accent` | Orange-red | **Not for totals.** Reserved for the discovery scenario "discovery cost" card only |
| `--green` / `--green-light` | Positive | Savings, best choice, "Rejoignez le club" |
| `--amber` / `--amber-light` | Warning/info | Amber info boxes, remaining package hours |
| `--text`, `--text-mid`, `--text-muted` | Text hierarchy | Headings / body / hints |
| `--border`, `--surface`, `--white` | Surfaces | Card backgrounds, page background |

### Colour semantics — strictly enforced

These are hard UX rules derived from the actual design decisions on this project:

- **Blue** (`--sky-mid`) → best option total, grand totals ("Meilleur coût total", "Total formation")
- **Green** (`--green`) → a saving the user is actively making, positive outcomes
- **Amber/orange** (`--amber`) → informational callout, unused package hours warning, hints
- **Red** → expensive/to-be-avoided zones only — "Heures hors forfait" in the chart
- **Yellow shades** → packages (forfait 15h, 30h, extensions) in the chart
- **No accent (orange-red) on totals** — that colour reads as "error/danger"

### Chart colour convention (`src/components/SeasonChart.jsx`)

| Series | Colour | Rationale |
|---|---|---|
| Cotisation | Gray-400 | Fixed, neutral |
| Licence FFVP | Gray-500 | Fixed, neutral |
| Forfait 15h | Yellow-300 | Package — light yellow |
| Forfait(s) 30h | Yellow-500 | Package — all 30h combined, same colour regardless of count |
| Prolongation(s) 10h | Yellow-600 | Package extension — darker yellow |
| Heures hors forfait | Red-500 | Expensive: visually says "avoid this" |
| Remorquage | Violet-500 | Variable cost |
| Instruction (été) | Blue-500 | Variable cost |
| Moto-planeur SF 28 | Emerald-500 | Variable cost |

**Do not split forfait 30h into per-subscription tiers** — the reds were too close and indistinguishable. All 30h packages use a single yellow-500 bar; the step jumps in height are enough to show each new purchase.

---

## Code conventions

### JavaScript / JSX (React)

- **React 18** with functional components and hooks (`useState`, `useRef`, `useEffect`). No class components.
- **Default exports** for every component file (e.g. `export default function LearnScenario()`).
- **Named exports** for utilities in `src/utils/` — pure functions, no DOM, no side effects.
- **JSDoc** on every exported utility function: `@param`, `@returns`, and a one-line description.
- **JSX** replaces all template-literal HTML generation. No `innerHTML`. No `/* html */` template literals.
- **No emojis** anywhere in the UI or code output strings. They were intentionally removed.
- **State per scenario**: each `*Scenario.jsx` owns its state with `useState`. Never store scenario state globally.
- **Derived values at render time**: compute clamped/derived values from state directly in the component body. No `useMemo` needed at this scale.
- **Chart.js** is imported from npm: `import Chart from 'chart.js/auto'`. No CDN global.
- **SeasonChart**: use `useRef` for the canvas element and `useEffect` (no dep array) to update/create the chart every render. A second `useEffect(() => () => chart.destroy(), [])` handles cleanup on unmount.
- **All JSX imports** must use the explicit `.jsx` extension (e.g. `import FootNotes from '../components/FootNotes.jsx'`) because old `.js` files with similar names may still exist on disk during a transition.

### CSS

- **Never hardcode a hex colour** in component CSS — always use a CSS variable.
- **New components** go in `components.css` with a clear section comment block:
  ```css
  /* ══ COMPONENT NAME ══════════════════════════════════════════════ */
  ```
- **Inline styles** in JSX use camelCase object syntax: `style={{ marginTop: '1rem', color: 'var(--sky)' }}`.
- **Responsive overrides** go at the bottom of each CSS file in a `@media (max-width: 560px)` block.
- **Utility classes** (`.hidden`, `hr.divider`) live in `base.css` only.

### HTML (`index.html`)

- Minimal: just Google Fonts links, `<div id="root">`, and the `<script type="module" src="/src/main.jsx">` entry.
- No scenario HTML here — all structure lives in JSX components.
- No Chart.js CDN script tag — Chart.js is bundled via npm.

---

## UX principles (learned from actual usage)

1. **Show what the user actually saves, not what they could save.**
   Boxes like "Avantage hiver" should show real savings the user has locked in, not hypothetical amounts.

2. **Logical direction matters.**
   Sliders/toggles should work in the direction users naturally expect. Example: "dont en saison hivernale" (not "estivale") because the user slides right to add winter hours and save money — a positive action.

3. **Remove complexity that doesn't add decision value.**
   The full "comparaison de tous les forfaits" table was removed because it was overwhelming. Show only the winning option and a simple indicator of when to move to the next tier.

4. **Info boxes have a clear colour contract:**
   - Green box → "you're doing well / you're saving"
   - Amber box → "heads up / here's something to know"
   - Blue (default) box → neutral information
   Never use the accent (red-orange) for info boxes — it reads as an error.

5. **French language throughout.** All UI text, labels, notes and info boxes are in French. Comments in code files can be in English.

---

## Build & deploy workflow

```bash
# Development
yarn dev             # Vite dev server at http://localhost:5173

# Production
yarn build           # Output to dist/
yarn preview         # Serve dist/ locally to verify before push
```

**After every non-trivial change: run `npm run build` and confirm it exits cleanly.**
A clean build (✓ built in Xms, no errors) is the verification step.

GitHub Pages serves from the `dist/` folder (or from `main` branch root — check repo settings).
Git is managed by Nicolas from his own machine terminal — the Cowork sandbox cannot push to GitHub.

---

## Pricing data (`src/data/pricing.js`)

This is the **only file to touch** when the club updates its tariffs.
It exports:
- `P` — per-age pricing table (`u25` / `o25`)
- `COEFF` — glider coefficients (`wood` / `plastic` / `dg`)
- `TOW` — tow cost per 1/100h (€)
- `BOURSES` — FFVP scholarship table
- `LEARN_PARAMS` — fixed training curriculum parameters

When updating: change the value, run `npm run build`, verify the build is clean.

---

## Things to never do

- **Never hardcode a price** outside `src/data/pricing.js`.
- **Never put business logic** (calculations) directly in scenario files — go through `src/utils/calculations.js`.
- **Never use `innerHTML`** — that's what React replaces. Render everything as JSX.
- **Never use `window.Chart`** — Chart.js is now imported via npm (`chart.js/auto`).
- **Never omit `.jsx` extension** on imports of JSX components — old `.js` files with similar names may exist on disk and cause ambiguous resolution.
- **Never add emojis** to any user-visible string.
- **Never use the accent colour** (`--accent`) for totals or best-choice highlights — only for the discovery scenario "forfait" card.
- **Never split the forfait 30h chart series** into per-subscription colours — too hard to distinguish.
- **Never add complexity** back to the UI without a clear reason — the "comparaison de tous les forfaits" was intentionally removed.
- **Never inline styles** for things that belong in CSS variables — e.g. never write `color: #1a3a5c` when `color: var(--sky)` exists.
- **Never skip the build check** after a change.
