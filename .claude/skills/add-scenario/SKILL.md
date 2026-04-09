# Skill: add-scenario

Use this skill when the user wants to add a new scenario to the simulator — e.g. "add a competition scenario", "add a scenario for advanced training", "add a new tab for motorglider", etc.

---

## What this skill does

Guides a complete, consistent implementation of a new scenario that fits the existing architecture without breaking anything.

---

## Step-by-step instructions

### 1. Understand the scenario fully before writing any code

Ask the user (or infer from context):

- **What is the scenario called?** (used for `id`, file name, card title)
- **Who is it for?** (age bracket fixed or selectable? specific glider?)
- **What inputs does the user control?** (sliders, toggles, checkboxes)
- **What does the output show?** (cost breakdown, comparison, recommendation)
- **Does it need new pricing data** not already in `src/data/pricing.js`?
- **Does it need a chart?** (only the season scenario currently has one)

### 2. Read the existing scenario most similar to the new one

Before writing anything, read the full source of the closest existing scenario as a reference:

- Simple (no chart, few inputs) → read `src/scenarios/visit.js`
- Comparison between two paths → read `src/scenarios/discovery.js`
- Complex with chart → read `src/scenarios/season.js`
- Fixed curriculum → read `src/scenarios/learn.js`

Also read `src/scenarios/index.js` to understand the wiring pattern.

### 3. Add pricing data if needed

If the new scenario requires prices not already in `pricing.js`, add them there first.
Follow the existing structure: JSDoc type annotation, then the value.
Never add pricing data directly in the scenario file.

### 4. Create the scenario file

Create `src/scenarios/{name}.js` following these conventions:

```js
/**
 * scenarios/{name}.js — "{Scenario title}" scenario
 *
 * One-sentence description of what this scenario calculates.
 */

import { P }               from '../data/pricing.js';
import { billableHrs, ... } from '../utils/calculations.js';
import { fmt, fmtH }        from '../utils/formatting.js';
import { footNotes }        from '../components/footNotes.js';
import { bindToggle }       from './index.js';

// ── Local state ──────────────────────────────────────────────────────────────
let scenarioAge   = 'o25';   // or whichever default makes sense
let scenarioPlane = 'plastic';

// ── Toggle wiring (called once from main.js) ─────────────────────────────────
export function init{Name}Toggles() {
  bindToggle('{name}AgeToggle',   (v) => { scenarioAge   = v; update{Name}(); });
  bindToggle('{name}PlaneToggle', (v) => { scenarioPlane = v; update{Name}(); });
}

// ── Slider wiring (called once from main.js) ─────────────────────────────────
export function init{Name}Sliders() {
  ['slider1Id', 'slider2Id'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', update{Name});
  });
}

// ── Main update function ─────────────────────────────────────────────────────
export function update{Name}() {
  // 1. Read inputs
  // 2. Calculate
  // 3. Build html string
  // 4. Inject: document.getElementById('{name}Results').innerHTML = html;
}
```

### 5. Add the HTML panel to `index.html`

Add a new `<div id="sc-{name}" class="hidden">` block inside `<main>`, following the same structure as existing panels. The `id` must match what `setScenario()` uses.

Pattern to follow:
```html
<!-- ── SCENARIO: {NAME} ─────────────────────────────────────────── -->
<div id="sc-{name}" class="hidden">
  <p class="section-label">Votre profil</p>
  <div class="toggle-group" id="{name}AgeToggle">
    <button data-v="u25">Moins de 25 ans</button>
    <button class="active" data-v="o25">25 ans et plus</button>
  </div>
  <!-- ... controls ... -->
  <div class="results-section" id="{name}Results"></div>
</div>
```

### 6. Add the scenario card to the grid in `index.html`

Add a `<button class="scenario-card" data-sc="{name}">` to the `.scenario-grid`:

```html
<button class="scenario-card" data-sc="{name}">
  <div class="sc-title">Title in French</div>
  <div class="sc-desc">Short description in French (1–2 lines).</div>
</button>
```

Keep the description concise — the existing cards are ~25–40 words. No emojis.

### 7. Register the scenario in `src/scenarios/index.js`

Add the new id to the `SCENARIOS` array:
```js
const SCENARIOS = ['learn', 'season', 'discovery', 'visit', '{name}'];
```

Add the updater to the `updaters` map in `setScenario()`:
```js
const updaters = {
  ...
  {name}: update{Name},
};
```

Add the import at the top of the file.

### 8. Wire up in `src/main.js`

```js
import { update{Name} }                   from './scenarios/{name}.js';
import { init{Name}Toggles, init{Name}Sliders } from './scenarios/{name}.js';

// Wire toggles
init{Name}Toggles();
// Wire sliders
init{Name}Sliders();
// Wire any checkboxes
document.getElementById('{name}SomeCheck')?.addEventListener('change', update{Name});
```

### 9. Run the build and verify

```bash
npm run build
```

Must exit cleanly. Then open the simulator, click the new scenario card, and verify:
- Card highlights on click
- Panel appears
- All controls update the results
- Results match manual mental-math for a simple case
- `footNotes()` appears at the bottom of the results

---

## Design rules for new scenarios

- **Colours follow the established contract** (see CLAUDE.md). Never introduce new accent colours.
- **Info boxes** use green (savings), amber (information), blue (neutral) — never red for a box.
- **Show the best option prominently** in a `.metric-card.sky` card (blue).
- **Show savings** in a `.metric-card.green` card.
- **Keep the cost breakdown in a collapsible `<details class="fold">`** — don't default-open a wall of numbers.
- **Always end with `footNotes()`** injected into the results HTML.
- **No emojis** anywhere.
- **French UI text** throughout. Comments in English is fine.
- **Simplicity over completeness** — if a comparison table feels overwhelming in context, cut it. The "comparaison de tous les forfaits" was removed from the season scenario for exactly this reason.
