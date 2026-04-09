/**
 * formatting.js — Number & text formatting helpers
 *
 * All user-facing number rendering goes through these functions so that
 * the locale and style are consistent across every scenario.
 */

/**
 * Format a euro amount, rounded to the nearest integer.
 * Example: fmt(1234.6) → "1 235 €"
 *
 * @param {number} v
 * @returns {string}
 */
export const fmt = (v) =>
  Math.round(v).toLocaleString('fr-FR') + ' €';

/**
 * Format a euro amount with two decimal places (for licence fees etc.)
 * Example: fmt2(82.06) → "82,06 €"
 *
 * @param {number} v
 * @returns {string}
 */
export const fmt2 = (v) =>
  v.toFixed(2).replace('.', ',') + ' €';

/**
 * Format a number of hours for display in compact labels.
 * - Whole hours: "2h"
 * - Fractional:  "1,5h"
 *
 * @param {number} h
 * @returns {string}
 */
export const fmtH = (h) =>
  (h % 1 === 0 ? h : h.toFixed(1).replace('.', ',')) + 'h';

/**
 * Format slider values for the duration/hours control rows.
 * Differs from fmtH in that sub-1h values are shown in minutes.
 * - 0   → "0 h"
 * - 0.5 → "30 min"
 * - 1   → "1 h"
 * - 1.5 → "1,5 h"
 *
 * @param {number} h
 * @returns {string}
 */
export const fmtSliderH = (h) => {
  if (h === 0) return '0 h';
  if (h < 1)   return (h * 60) + ' min';
  return h % 1 === 0 ? h + ' h' : h.toFixed(1).replace('.', ',') + ' h';
};
