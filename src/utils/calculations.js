/**
 * calculations.js — Core financial calculation functions
 *
 * All the maths lives here, isolated from rendering logic.
 * Each function is pure (no side effects, no DOM access).
 *
 * Depends on: src/data/pricing.js
 */

import { P, COEFF, TOW } from '../data/pricing.js';
import { fmtH, fmt2 } from './formatting.js';

// ─────────────────────────────────────────────────────────────────────────────
// BILLABLE HOURS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the total billable hours for a series of solo flights.
 *
 * The "free hours" rule: hours beyond the freeThreshold in a single flight
 * are not charged.  E.g. a 5 h flight for an o25 pilot → only 4 h billed.
 *
 * @param {number} nFlights  Number of flights
 * @param {number} avgDur    Average duration per flight (hours)
 * @param {'u25'|'o25'} age
 * @returns {number} Total billable hours
 */
export function billableHrs(nFlights, avgDur, age) {
  return nFlights * Math.min(avgDur, P[age].freeThreshold);
}

// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCTION SURCHARGE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the instruction surcharge cost.
 *
 * The surcharge only applies between 1 April and 30 September.
 * Outside that period the surcharge is €0.
 *
 * @param {number} billable  Billable hours flown with an instructor
 * @param {'u25'|'o25'} age
 * @param {boolean} withInstr  Whether there is an instructor on board
 * @param {boolean} isSummer   Whether the flight is in the April–September period
 * @returns {number} Instruction surcharge (€)
 */
export function instrCost(billable, age, withInstr, isSummer) {
  if (!withInstr || !isSummer) return 0;
  return billable * P[age].instrRate;
}

// ─────────────────────────────────────────────────────────────────────────────
// TOWING COST
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the total aerotow cost for a series of flights.
 *
 * @param {number} nFlights     Number of flights (= number of tows)
 * @param {number} towPer100h   Tow duration in 1/100 h (e.g. 10 = 6 min tow)
 * @returns {number} Total tow cost (€)
 */
export function towCost(nFlights, towPer100h) {
  return nFlights * towPer100h * TOW;
}

// ─────────────────────────────────────────────────────────────────────────────
// FLIGHT OPTIONS (package optimiser)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return all relevant package options for a given number of billable hours,
 * sorted cheapest-first.  Each option object describes the flight-time cost
 * only (membership and tow are added separately by the caller).
 *
 * Package combinations considered:
 *   - Pay per hour
 *   - 15h wood package (non-SPL students only)
 *   - 15h package (with glider coefficient)
 *   - 30h package combinations with optional 10h extensions:
 *     1×30, 1×30+1ext, 1×30+2ext, 2×30, 2×30+1ext, 3×30, 4×30, …
 *
 * Discount schedule for 30h packages:
 *   - 1st and 2nd renewal: full price (p.pkg.h30)
 *   - 3rd renewal: −50 %
 *   - 4th and above: −70 %
 *
 * @param {number}          billableH  Total billable hours to cover
 * @param {'wood'|'plastic'|'dg'} plane
 * @param {'u25'|'o25'}     age
 * @param {boolean}         nonSPL     If true, include the non-SPL 15h wood package
 * @returns {Array<{id:string, label:string, cost:number, note:string, pkgCost?:number, coverage?:number, n30?:number, k?:number}>}
 */
export function flightOptions(billableH, plane, age, nonSPL) {
  const p    = P[age];
  const rate = p.rates[plane];
  const coeff = COEFF[plane];
  const opts  = [];

  // ── Option 1: pay per hour ─────────────────────────────────────────────
  opts.push({
    id:    'ph',
    label: "Paiement à l'heure de vol",
    cost:  billableH * rate,
    note:  fmtH(billableH) + ' × ' + fmt2(rate),
  });

  // ── Option 2: 15h wood package (non-SPL only) ──────────────────────────
  // Available for wood OR plastic gliders; priced at the wood rate.
  // Covers exactly 15 real hours (no coefficient).
  if (nonSPL && (plane === 'wood' || plane === 'plastic')) {
    const effRate = P[age].rates.wood;
    const pkgH    = 15;
    const extra   = Math.max(0, billableH - pkgH) * effRate;
    opts.push({
      id:      'pkg15w',
      label:   'Forfait 15h bois et toile (non-SPL)',
      cost:    p.pkg.w15nonSPL + extra,
      note:    'Couvre ' + pkgH + 'h' + (billableH > pkgH ? ', +' + fmtH(billableH - pkgH) + " à l'heure" : ' ✓'),
      pkgCost: p.pkg.w15nonSPL,
    });
  }

  // ── Option 3: standard 15h package (with coefficient) ─────────────────
  // Non-renewable within the same calendar year.
  const h15actual = 15 / coeff;
  const extra15   = Math.max(0, billableH - h15actual) * rate;
  opts.push({
    id:      'pkg15',
    label:   'Forfait 15h',
    cost:    p.pkg.h15 + extra15,
    note:    'Couvre ' + fmtH(h15actual)
           + (billableH > h15actual ? ', +' + fmtH(billableH - h15actual) + " à l'heure" : ' ✓')
           + ' · non renouvelable dans l\'année civile',
    pkgCost: p.pkg.h15,
  });

  // ── Options 4+: 30h packages ───────────────────────────────────────────

  // Marginal cost of the i-th 30h package subscription (1-indexed)
  function pkg30Inc(i) {
    if (i <= 2)     return p.pkg.h30;
    if (i === 3)    return p.pkg.h30 * 0.5;   // −50 % on 3rd
    return                 p.pkg.h30 * 0.3;   // −70 % on 4th+
  }

  // Cumulative cost of n 30h packages
  function pkg30TotalCost(n) {
    let c = 0;
    for (let i = 1; i <= n; i++) c += pkg30Inc(i);
    return c;
  }

  // The combinations we consider.
  // For n≥3, discounted pkg30 dominates ext10 in cost-per-hour, so we stop
  // offering ext10 on those.
  const combos30 = [
    [1, 0], [1, 1], [1, 2],
    [2, 0], [2, 1],
    [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
  ];

  for (const [n, k] of combos30) {
    const coverage = (n * 30 + k * 10) / coeff;
    const pkgCost  = pkg30TotalCost(n) + k * p.pkg.ext10;
    const extra    = Math.max(0, billableH - coverage) * rate;
    const coverNote = billableH > coverage
      ? ', +' + fmtH(billableH - coverage) + " à l'heure"
      : ' ✓';

    // Build a human-readable label for this combination
    let label;
    if      (n === 1 && k === 0) label = 'Forfait 30h';
    else if (n === 1 && k === 1) label = 'Forfait 30h + prolongation 10h';
    else if (n === 1 && k === 2) label = 'Forfait 30h + 2× prolongation 10h';
    else if (k === 0) {
      const disc = n === 3 ? ' (−50 % sur le 3e)'
                 : n > 3   ? ' (−70 % sur les suivants)'
                 : '';
      label = n + '× forfait 30h' + disc;
    } else {
      label = n + '× forfait 30h + ' + (k === 1 ? 'prolongation 10h' : '2× prolongation 10h');
    }

    opts.push({
      id:       `pkg30_${n}_${k}`,
      n30:      n,
      k,
      coverage,
      label,
      cost:     pkgCost + extra,
      pkgCost,
      note:     'Couvre ' + fmtH(coverage) + coverNote + ' · valable 1 an',
    });
  }

  // Return sorted cheapest-first so callers can simply take [0]
  return opts.sort((a, b) => a.cost - b.cost);
}
