# Skill: update-pricing

Use this skill whenever the user says a tariff has changed, wants to update a price, or asks to "update the pricing", "change the rates", "modify the forfait cost", etc.

---

## What this skill does

Guides a safe, complete update of the club's pricing data without touching any other file.

---

## Step-by-step instructions

### 1. Read the current pricing file

Always start by reading the full file — never edit from memory:

```
Read: src/data/pricing.js
```

### 2. Identify the exact field(s) to change

Use the table below to map what the user describes to the correct field in `P.u25` or `P.o25`:

| User says… | Field in `pricing.js` |
|---|---|
| Cotisation annuelle | `P.u25.membership.annual` / `P.o25.membership.annual` |
| Cotisation courte durée 12 jours | `P.u25.membership.term12d` / `P.o25.membership.term12d` |
| Cotisation à la journée | `P.u25.membership.daily` / `P.o25.membership.daily` |
| Licence FFVP annuelle | `P.u25.license.annual` / `P.o25.license.annual` |
| Tarif bois et toile | `P.u25.rates.wood` / `P.o25.rates.wood` |
| Tarif Pégase / Marianne | `P.u25.rates.plastic` / `P.o25.rates.plastic` |
| Tarif DG500 / LAK19 | `P.u25.rates.dg` / `P.o25.rates.dg` |
| Supplément instruction | `P.u25.instrRate` / `P.o25.instrRate` |
| Forfait 15h non-SPL | `P.u25.pkg.w15nonSPL` / `P.o25.pkg.w15nonSPL` |
| Forfait 15h | `P.u25.pkg.h15` / `P.o25.pkg.h15` |
| Forfait 30h | `P.u25.pkg.h30` / `P.o25.pkg.h30` |
| Prolongation 10h | `P.u25.pkg.ext10` / `P.o25.pkg.ext10` |
| Vol découverte individuel | `P.u25.discovery.single` / `P.o25.discovery.single` |
| Forfait découverte 3 vols | `P.u25.discovery.d3` / `P.o25.discovery.d3` |
| Forfait découverte 6 vols | `P.u25.discovery.d6` / `P.o25.discovery.d6` |
| E-learning / formation théorique | `P.u25.eLearning` / `P.o25.eLearning` |
| Remorquage (€/100h) | `TOW` (top-level constant) |
| Motoplaneur SF 28 (€/h) | `LEARN_PARAMS.sf28Rate` |
| Coefficients planeur | `COEFF.wood` / `COEFF.plastic` / `COEFF.dg` |
| Bourse FFVP | `BOURSES` array — find the matching `label` entry |

**Important:** If the user gives a price for only one age bracket (e.g. "the 30h package is now 520 €"), ask whether it's the same for both age brackets, or confirm from context. Under-25 and 25+ have different prices for almost everything.

### 3. Make the edit — pricing.js only

Use the `Edit` tool with precise `old_string` / `new_string` — include enough surrounding context to make the match unique.

Example:
```
Edit src/data/pricing.js
old: h30: 480,
new: h30: 520,
```

Update the JSDoc `@property` description if the value range or meaning changes.

### 4. Check for any JSDoc comment that references the old value

Search for the old value in comments:
```
Grep: src/data/pricing.js  pattern: <old_value>
```

Update any comment or example that references the old number.

### 5. Run the build

```bash
cd /path/to/cfp-costs-simulator && npm run build
```

The build must exit with `✓ built in Xms` and no errors. If it fails, read the error and fix before continuing.

### 6. Confirm to the user

Tell the user:
- Which field(s) changed
- Old value → new value
- Whether both age brackets were updated (or just one, and why)
- Reminder: "Run `git add src/data/pricing.js && git commit -m 'chore: update tariffs'` and push to deploy"

---

## Rules for this skill

- **Never touch any file other than `src/data/pricing.js`** for a pricing update.
- **Never hardcode a price** anywhere else — if the user asks to "change the remorquage price in the footer text", do it via `TOW` and let the rendering pick it up.
- **Always update both `u25` and `o25`** unless the user explicitly says only one bracket changes.
- **Always run the build** — a silent arithmetic error in the data can break the package optimiser.
