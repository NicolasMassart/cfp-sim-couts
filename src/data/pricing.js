/**
 * pricing.js — All tariff data for the CFP cost simulator
 *
 * This is the single source of truth for every euro figure in the app.
 * When the club updates its pricing, only this file needs to change.
 *
 * Data source: https://www.caenfalaiseplaneurs.fr/couts
 */

// ─────────────────────────────────────────────────────────────────────────────
// PRICING TABLE  (indexed by age bracket: 'u25' | 'o25')
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} AgePricing
 * @property {{ annual: number, term12d: number, daily: number }} membership
 *   - annual   : full-year club membership
 *   - term12d  : short-stay (up to 12 consecutive days) membership for visiting pilots
 *   - daily    : single-day membership for visiting pilots
 *
 * @property {{ annual: number, term12d: number, d6: number, d3: number }} license
 *   FFVP licence (includes RC + PJ insurance)
 *   - annual   : 12-month licence
 *   - term12d  : short-stay licence (visiting pilots)
 *   - d6       : 6-day temporary licence
 *   - d3       : 3-day temporary licence
 *
 * @property {{ wood: number, plastic: number, dg: number }} rates
 *   Hourly glider rate per aircraft category
 *   - wood    : bois et toile (ASK 13, Puchacz …)
 *   - plastic : Pégase / Marianne
 *   - dg      : DG500 / LAK19
 *
 * @property {number} instrRate
 *   Hourly instruction surcharge (April–September only)
 *
 * @property {{ w15nonSPL: number, h15: number, h30: number, ext10: number }} pkg
 *   Pre-paid hour packages
 *   - w15nonSPL : 15h wood-and-fabric package, for non-SPL students only
 *   - h15       : 15h package (with glider coefficient applied)
 *   - h30       : 30h package (renewable at −50 % on 3rd, −70 % on 4th+)
 *   - ext10     : 10h extension on a 30h package
 *
 * @property {{ single: number, d3: number, d6: number }} discovery
 *   Discovery-flight packages (all-in, no membership required)
 *
 * @property {number} eLearning
 *   Theory training fee for the SPL exam (paid once, season 1)
 *
 * @property {number} freeThreshold
 *   Hours per flight beyond which no participation fee is charged.
 *   u25 = 3 h, o25 = 4 h.
 */

export const P = {
  /** Under-25 pricing */
  u25: {
    membership: { annual: 115, term12d: 30,    daily: 20 },
    license:    { annual: 82.06, term12d: 89.06, d6: 21.69, d3: 14.69 },
    rates:      { wood: 14.5, plastic: 23, dg: 27 },
    instrRate:  8,
    pkg:        { w15nonSPL: 180, h15: 260, h30: 480, ext10: 180 },
    discovery:  { single: 130, d3: 310, d6: 570 },
    eLearning:  50,
    freeThreshold: 3,
  },

  /** 25-and-over pricing */
  o25: {
    membership: { annual: 230, term12d: 50,    daily: 20 },
    license:    { annual: 187.56, term12d: 89.06, d6: 21.69, d3: 14.69 },
    rates:      { wood: 20, plastic: 29, dg: 32 },
    instrRate:  10,
    pkg:        { w15nonSPL: 255, h15: 350, h30: 630, ext10: 210 },
    discovery:  { single: 130, d3: 340, d6: 650 },
    eLearning:  75,
    freeThreshold: 4,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// GLIDER COEFFICIENT
// Packages (15h / 30h) are priced in "coefficient-hours", not clock-hours.
// A plastic glider (coeff 1.0) is the reference.  A DG (1.2) costs 20 % more
// per real hour; wood (0.7) costs 30 % less.
// Formula: real_hours_covered = nominal_package_hours / coefficient
// ─────────────────────────────────────────────────────────────────────────────
export const COEFF = {
  wood:    0.7,
  plastic: 1.0,
  dg:      1.2,
};

// ─────────────────────────────────────────────────────────────────────────────
// TOW COST
// Tow cost per 1/100 h of tow time.  Revised periodically based on fuel price.
// ─────────────────────────────────────────────────────────────────────────────
export const TOW = 2.80; // € per 1/100h

// ─────────────────────────────────────────────────────────────────────────────
// FFVP SCHOLARSHIPS  (bourses)
// Paid by the FFVP to the pilot when each milestone is reached.
// perf: false = training milestones (applicable during formation)
// perf: true  = performance milestones (applicable after SPL)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Bourse
 * @property {string}  label  Human-readable milestone name
 * @property {number}  noBIA  Amount without BIA certification (€)
 * @property {number}  BIA    Amount with BIA certification (€)
 * @property {boolean} perf   true = performance aid, false = training aid
 */

export const BOURSES = [
  { label: 'Au Lâcher',                                                         noBIA: 100, BIA: 100, perf: false },
  { label: 'Pass Planeur',                                                       noBIA: 150, BIA: 200, perf: false },
  { label: 'SPL — Licence de Pilote de Planeur',                                 noBIA: 150, BIA: 200, perf: false },
  { label: 'Compétence campagne +',                                              noBIA: 300, BIA: 300, perf: true  },
  { label: 'Premiers 1 000 km WeGlide (Commandant de bord)',                    noBIA: 200, BIA: 200, perf: true  },
  { label: '1er championnat officiel (régional, inter-régional, national)',     noBIA: 200, BIA: 200, perf: true  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEARN SCENARIO FIXED PARAMETERS
// These describe the standard two-season training path. Adjust if the club
// changes its recommended curriculum.
// ─────────────────────────────────────────────────────────────────────────────
export const LEARN_PARAMS = {
  // Season 1 — instructor-led flights
  s1InstrFlights: 15, s1InstrDur: 1,      // 15 × 1 h

  // Season 2 phase A — end of instructor-led training
  s2InstrFlights: 5,  s2InstrDur: 1,      // 5 × 1 h

  // Season 2 phase B — circuit validation laps before first solo
  tdpFlights: 10, tdpDur: 5 / 60,         // 10 × 5 min
  tdpTow:     5,                           // short tow: 5/100h

  // Season 2 phase C — solo flights after SPL
  soloFlights: 10, soloDur: 11 / 12,      // 10 × 55 min

  // SF28 motorglider (winter off-season, no tow needed)
  sf28S1Hours: 6, sf28S2Hours: 4, sf28Rate: 60,  // €/h (winter rate; full rate is 80 €/h)

  // Paid once at the start so students can log flights from day one
  logbook: 16,

  // Standard tow per flight
  towPer100h: 12,
};
