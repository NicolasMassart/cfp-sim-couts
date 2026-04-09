/**
 * SeasonChart.jsx — Season cost-evolution chart (Chart.js wrapper)
 *
 * Renders a stacked bar chart showing how cumulative cost builds up as
 * flying hours accumulate during the season, with a secondary line for
 * average cost per hour.
 *
 * Chart.js is imported as an npm module (chart.js/auto) — no CDN global needed.
 *
 * @param {object}  p                  Age-pricing object (P.u25 or P.o25)
 * @param {'wood'|'plastic'|'dg'} plane
 * @param {'u25'|'o25'} age
 * @param {number}  hours              Total planned flying hours (x-axis extent)
 * @param {number}  dur                Average flight duration (h)
 * @param {number}  instrHours         Total instructor hours
 * @param {number}  instrHoursSummer   Instructor hours in summer (surcharge applies)
 * @param {number}  soloHours          Total solo hours
 * @param {number}  towPer100h         Tow time per flight (1/100 h)
 * @param {number}  fixed              Fixed annual costs (membership + licence, €)
 * @param {number}  sf28CostTotal      Total SF-28 motorglider cost for the season (€)
 * @param {number}  towTotal           Total tow cost for the season (€)
 */

import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { P, COEFF } from '../data/pricing.js';
import { flightOptions } from '../utils/calculations.js';

export default function SeasonChart({
  p, plane, age,
  hours, dur,
  instrHours, instrHoursSummer, soloHours,
  towPer100h, fixed, sf28CostTotal, towTotal,
}) {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ── Pre-compute the "best" package for the FULL planned hours ──────────
    const billableRatio = Math.min(1, p.freeThreshold / Math.max(dur, 0.01));
    const rate          = p.rates[plane];
    const coeff         = COEFF[plane];
    const totalBillable = instrHours + soloHours * billableRatio;
    const bestFinal     = flightOptions(totalBillable, plane, age, false)[0];

    const cov30 = 30 / coeff;

    function pkg30IncChart(i) {
      if (i <= 2)  return p.pkg.h30;
      if (i === 3) return p.pkg.h30 * 0.5;
      return              p.pkg.h30 * 0.3;
    }

    function forfaitAtBx(bx) {
      if (bestFinal.n30 !== undefined) {
        const { n30, k } = bestFinal;
        let cumCost = 0, cov = 0;
        for (let i = 1; i <= n30; i++) {
          if (bx >= cov) cumCost += pkg30IncChart(i);
          cov += cov30;
        }
        for (let j = 1; j <= k; j++) {
          if (bx >= cov) cumCost += p.pkg.ext10;
          cov += 10 / coeff;
        }
        return cumCost;
      }
      if (bestFinal.id === 'pkg15')  return p.pkg.h15;
      if (bestFinal.id === 'pkg15w') return p.pkg.w15nonSPL;
      return 0;
    }

    function extraAtBx(bx) {
      if (bestFinal.n30 !== undefined) {
        return Math.max(0, bx - bestFinal.coverage) * rate;
      }
      if (bestFinal.id === 'pkg15') {
        const cov15 = 15 / coeff;
        return Math.max(0, bx - cov15) * rate;
      }
      if (bestFinal.id === 'pkg15w') {
        const cov15 = 15 / coeff;
        const c = p.pkg.w15nonSPL / (p.pkg.h15 / cov15);
        return Math.max(0, bx - c) * rate;
      }
      return bx * rate;
    }

    // ── Build per-hour data arrays ─────────────────────────────────────────
    const xLabels = [];
    const membershipArr = [], licenseArr = [];
    const f15Arr = [], forfait30Arr = [], fExtArr = [];
    const extraArr = [], towArr = [], instrArr = [], sf28Arr = [], lineArr = [];

    for (let x = 1; x <= hours; x++) {
      const frac = x / hours;
      xLabels.push(x);

      const bx = instrHours * frac + soloHours * frac * billableRatio;

      let f15 = 0, f30_1 = 0, f30_2 = 0, f30_3 = 0, f30_4p = 0, fExt = 0;

      if (bestFinal.id === 'pkg15')         f15 = p.pkg.h15;
      else if (bestFinal.id === 'pkg15w')   f15 = p.pkg.w15nonSPL;
      else if (bestFinal.n30 !== undefined) {
        const { n30, k } = bestFinal;
        let cov = 0;
        for (let i = 1; i <= n30; i++) {
          if (bx >= cov) {
            const mc = pkg30IncChart(i);
            if      (i === 1) f30_1  = mc;
            else if (i === 2) f30_2  = mc;
            else if (i === 3) f30_3  = mc;
            else              f30_4p += mc;
          }
          cov += cov30;
        }
        for (let j = 1; j <= k; j++) {
          if (bx >= cov) fExt += p.pkg.ext10;
          cov += 10 / coeff;
        }
      }

      const extra_x = extraAtBx(bx);
      const instr_x = instrHoursSummer * frac * p.instrRate;
      const sf28_x  = sf28CostTotal * frac;
      const tow_x   = towTotal      * frac;

      const total_x = p.membership.annual + p.license.annual
        + f15 + f30_1 + f30_2 + f30_3 + f30_4p + fExt
        + extra_x + instr_x + sf28_x + tow_x;

      membershipArr.push(p.membership.annual);
      licenseArr.push(p.license.annual);
      f15Arr.push(f15);
      forfait30Arr.push(f30_1 + f30_2 + f30_3 + f30_4p);
      fExtArr.push(fExt);
      extraArr.push(extra_x);
      towArr.push(tow_x);
      instrArr.push(instr_x);
      sf28Arr.push(sf28_x);
      lineArr.push(total_x / x);
    }

    // ── Assemble Chart.js datasets ─────────────────────────────────────────
    const bar = (label, data, color) => ({
      type:            'bar',
      label,
      data,
      backgroundColor: color,
      stack:           'cost',
      yAxisID:         'y',
      borderWidth:     0,
      order:           2,
    });

    const datasets = [
      bar('Cotisation',   membershipArr, '#9ca3af'),
      bar('Licence FFVP', licenseArr,   '#6b7280'),
    ];

    if (bestFinal.id === 'pkg15' || bestFinal.id === 'pkg15w')
      datasets.push(bar('Forfait 15h',         f15Arr,       '#fde047'));
    if (bestFinal.n30 >= 1)
      datasets.push(bar('Forfait(s) 30h',      forfait30Arr, '#eab308'));
    if (bestFinal.k >= 1)
      datasets.push(bar('Prolongation(s) 10h', fExtArr,      '#ca8a04'));

    datasets.push(
      bar('Heures hors forfait', extraArr, '#ef4444'),
      bar('Remorquage',          towArr,   '#8b5cf6'),
      bar('Instruction (été)',   instrArr, '#3b82f6'),
      bar('Moto-planeur SF 28',  sf28Arr,  '#10b981'),
      {
        type:        'line',
        label:       'Coût moyen / heure',
        data:        lineArr,
        yAxisID:     'y1',
        borderColor: '#ef4444',
        borderDash:  [5, 3],
        borderWidth: 2,
        pointRadius: 0,
        pointStyle:  'line',
        tension:     0.3,
        fill:        false,
        order:       0,
      },
    );

    const chartData = { labels: xLabels, datasets };

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 560;

    const options = {
      responsive:          true,
      maintainAspectRatio: true,
      aspectRatio:         isMobile ? 1.2 : 2.4,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 11 }, padding: 10, boxWidth: 12, usePointStyle: true,
            filter: (item, chart) => {
              const data = chart.datasets[item.datasetIndex]?.data ?? [];
              return data.some((v) => v > 0);
            },
            generateLabels: (chart) => {
              const defaults = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return defaults.map((item) => {
                if (item.text === 'Coût moyen / heure') item.lineDash = [5, 3];
                return item;
              });
            },
          },
        },
        tooltip: {
          callbacks: {
            title:  (items) => items[0].label + 'h de vol',
            label:  (c) => {
              if (!c.raw || c.raw === 0) return null;
              const suffix = c.dataset.yAxisID === 'y1' ? ' €/h' : ' €';
              return ` ${c.dataset.label} : ${c.raw.toFixed(0)}${suffix}`;
            },
            footer: (items) => {
              const barItems = items.filter((i) => i.dataset.yAxisID === 'y');
              const total    = barItems.reduce((s, i) => s + (i.raw || 0), 0);
              return total > 0 ? 'Total cumulé : ' + total.toFixed(0) + ' €' : null;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          title:   { display: true, text: 'Heures de vol', font: { size: 10 } },
          ticks:   { font: { size: 10 }, maxTicksLimit: 13, callback: (v, i) => xLabels[i] + 'h' },
        },
        y: {
          stacked:  true,
          position: 'left',
          title:    { display: true, text: 'Coût cumulé de l\'activité (€)', font: { size: 10 } },
          ticks:    { font: { size: 10 }, callback: (v) => v + ' €' },
          grid:     { color: '#f1f5f9' },
        },
        y1: {
          position: 'right',
          title:    { display: true, text: 'Coût moyen par heure de vol (€/h)', font: { size: 10 } },
          ticks:    { font: { size: 10 }, callback: (v) => v.toFixed(0) + ' €' },
          grid:     { drawOnChartArea: false },
        },
      },
    };

    // Reuse existing Chart instance to avoid canvas flickering
    if (chartRef.current) {
      chartRef.current.data    = chartData;
      chartRef.current.options = options;
      chartRef.current.update('none');
    } else {
      chartRef.current = new Chart(canvasRef.current, { type: 'bar', data: chartData, options });
    }
  });

  // Destroy chart on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      display: 'block', marginTop: '1.25rem',
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '1rem 1rem .75rem',
    }}>
      <p className="chart-title">
        Évolution du coût en fonction du nombre d'heures de vol dans la saison
      </p>
      <canvas ref={canvasRef} />
    </div>
  );
}
