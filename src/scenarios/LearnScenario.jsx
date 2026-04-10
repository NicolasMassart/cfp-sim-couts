/**
 * LearnScenario.jsx — "Apprendre à voler" scenario
 *
 * Calculates and renders the two-season training cost breakdown,
 * including FFVP scholarship tables.
 *
 * Fixed curriculum defined in: src/data/pricing.js → LEARN_PARAMS
 */

import { useState } from 'react';
import { P, BOURSES, LEARN_PARAMS } from '../data/pricing.js';
import { billableHrs, instrCost, towCost, flightOptions } from '../utils/calculations.js';
import { fmt, fmt2, fmtH } from '../utils/formatting.js';
import FootNotes from '../components/FootNotes.jsx';

export default function LearnScenario() {
  const [hasBIA, setHasBIA] = useState(false);

  // ── Fixed parameters ────────────────────────────────────────────────────────
  const isSummer = true;   // instructor flights are always in summer (avr.–sept.)
  const age      = 'u25';  // learn scenario is always for under-25 students
  const p        = P[age];
  const plane    = 'wood'; // training is always on bois-et-toile aircraft

  const fixed = p.membership.annual + p.license.annual;

  // ════════════════════════════════════════════════════════════════════════════
  // SEASON 1 — 15 instructor flights × 1 h
  // ════════════════════════════════════════════════════════════════════════════
  const n1    = LEARN_PARAMS.s1InstrFlights;
  const d1    = LEARN_PARAMS.s1InstrDur;
  const b1    = billableHrs(n1, d1, age);
  const i1    = instrCost(b1, age, true, isSummer);
  const t1    = towCost(n1, LEARN_PARAMS.towPer100h);
  const best1 = flightOptions(b1, plane, age, true)[0];

  // ════════════════════════════════════════════════════════════════════════════
  // SEASON 2 — two phases combined into a single package decision
  // Phase A: 5 instructor flights × 1 h  + 10 circuit laps × 5 min
  // Phase B: 10 solo flights × 55 min
  // ════════════════════════════════════════════════════════════════════════════
  const n2a  = LEARN_PARAMS.s2InstrFlights;
  const d2a  = LEARN_PARAMS.s2InstrDur;
  const nTdp = LEARN_PARAMS.tdpFlights;
  const dTdp = LEARN_PARAMS.tdpDur;

  const b2a   = billableHrs(n2a, d2a, age) + billableHrs(nTdp, dTdp, age);
  const i2a   = instrCost(b2a, age, true, isSummer);
  const t2a   = towCost(n2a, LEARN_PARAMS.towPer100h) + towCost(nTdp, LEARN_PARAMS.tdpTow);

  const n2b   = LEARN_PARAMS.soloFlights;
  const d2b   = LEARN_PARAMS.soloDur;
  const b2b   = billableHrs(n2b, d2b, age);
  const t2b   = towCost(n2b, LEARN_PARAMS.towPer100h);

  const b2    = b2a + b2b;
  const best2 = flightOptions(b2, plane, age, true)[0];

  // ── Package base vs. extra breakdown ─────────────────────────────────────
  const s1PkgBase  = best1.pkgCost ?? best1.cost;
  const s1PkgExtra = best1.cost - s1PkgBase;
  const s2PkgBase  = best2.pkgCost ?? best2.cost;
  const s2PkgExtra = best2.cost - s2PkgBase;

  // ── SF-28 motorglider (winter off-season) ─────────────────────────────────
  const sf28Cost1 = LEARN_PARAMS.sf28S1Hours * LEARN_PARAMS.sf28Rate;
  const sf28Cost2 = LEARN_PARAMS.sf28S2Hours * LEARN_PARAMS.sf28Rate;

  // ── Theory training (paid once, season 1) ─────────────────────────────────
  const eLearning = p.eLearning;
  const logbook = LEARN_PARAMS.logbook;

  // ── Season totals ──────────────────────────────────────────────────────────
  const total1     = fixed + best1.cost + i1 + t1 + sf28Cost1 + eLearning + logbook;
  const total2     = fixed + best2.cost + i2a + t2a + t2b + sf28Cost2;
  const grandTotal = total1 + total2;

  // ── FFVP scholarships ──────────────────────────────────────────────────────
  const training      = BOURSES.filter((b) => !b.perf);
  const perf          = BOURSES.filter((b) =>  b.perf);
  const totalTraining = training.reduce((s, b) => s + (hasBIA ? b.BIA : b.noBIA), 0);
  const totalPerf     = perf.reduce((s, b)     => s + (hasBIA ? b.BIA : b.noBIA), 0);

  return (
    <>
      {/* ── Training path description (collapsible) ─────────────────────── */}
      <details className="fold" style={{ marginBottom: '1rem' }}>
        <summary>
          <span>
            Parcours « Apprendre à voler » : formation sur <strong>2 saisons</strong> en <strong>planeur école bois et toile</strong>,
            avec vols <strong>instructeur et solo</strong>, complétée par la formation en <strong>motoplaneur SF 28</strong>, le passage de
            l'<strong>examen théorique SPL</strong> et la fourniture du <strong>carnet de vol</strong>.
          </span>
        </summary>
        <div className="fold-body">
          <ul style={{ listStyle: 'disc', fontSize: '12px', lineHeight: 2, paddingLeft: '1rem', margin: 0 }}>
            <li>Tarif <strong>bois et toile</strong> · formation sur <strong>2 saisons</strong></li>
            <li>Saison 1 (formation avec instructeur) : <strong>15 vols × 1 h</strong> en planeur pur</li>
            <li>
              Saison 2 (fin de formation + 1er solo) : <strong>5 vols × 1 h</strong> avec instructeur ·
              puis <strong>10 tours de piste × 5 min</strong> pour valider décollage/atterrissage ·
              puis <strong>10 vols × 55 min</strong> en solo
            </li>
            <li>
              Motoplaneur SF 28 (sept.–avr.) : <strong>6 h en saison 1 + 4 h en saison 2</strong> ·
              60 €/h · avec instructeur · instruction gratuite hors saison · sans remorquage
            </li>
            <li>Remorquage moyen : <strong>12/100h</strong> par vol · <strong>5/100h</strong> pour les tours de piste</li>
          </ul>
        </div>
      </details>

      {/* ── BIA question + checkbox ──────────────────────────────────────── */}
      <p style={{ fontSize: '12px', color: 'var(--text-mid)', margin: '0 0 .45rem' }}>
        Dis-nous si tu as obtenu ton BIA : si oui, cela augmente le montant de certaines bourses fédérales FFVP.
      </p>
      <label className="check-row">
        <input type="checkbox" checked={hasBIA} onChange={(e) => setHasBIA(e.target.checked)} />
        J'ai mon BIA
      </label>

      {/* ── Season 1 detail (collapsible) ────────────────────────────────── */}
      <details className="fold learn-season-fold" style={{ marginTop: '1.25rem' }}>
        <summary>
          <div className="learn-season-summary">
            <p className="metric-label">Saison 1</p>
            <p className="metric-value">{fmt(total1)}</p>
            <p className="metric-sub">Formation instructeur · 15 vols × 1 h + SF 28 {LEARN_PARAMS.sf28S1Hours} h</p>
          </div>
        </summary>
        <div className="fold-body">
          <table className="breakdown">
            <tbody>
              <tr><td>Cotisation annuelle</td><td>{fmt(p.membership.annual)}</td></tr>
              <tr><td>Licence FFVP annuelle</td><td>{fmt2(p.license.annual)}</td></tr>
              <tr>
                <td>Formation théorique <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(e-learning · examen SPL)</span></td>
                <td>{fmt(eLearning)}</td>
              </tr>
              <tr>
                <td>Carnet de vol <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(vendu aux élèves)</span></td>
                <td>{fmt(logbook)}</td>
              </tr>
              <tr className="section-head"><td colSpan={2}>Heures de vol — planeur pur (bois et toile)</td></tr>
              <tr><td>{best1.label}</td><td>{fmt(s1PkgBase)}</td></tr>
              {s1PkgExtra > 0 && (
                <tr>
                  <td>Heures supplémentaires <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{fmtH(s1PkgExtra / p.rates[plane])} au tarif horaire</span></td>
                  <td>{fmt(s1PkgExtra)}</td>
                </tr>
              )}
              <tr>
                <td>Instruction <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{fmtH(b1)} × {p.instrRate} €/h</span></td>
                <td>{fmt(i1)}</td>
              </tr>
              <tr>
                <td>Remorquage <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n1} vols × 12/100h</span></td>
                <td>{fmt(t1)}</td>
              </tr>
              <tr>
                <td>Motoplaneur SF 28 <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{LEARN_PARAMS.sf28S1Hours} h × {LEARN_PARAMS.sf28Rate} €/h · décollage autonome sans remorquage</span></td>
                <td>{fmt(sf28Cost1)}</td>
              </tr>
              <tr className="total"><td>Total saison 1</td><td>{fmt(total1)}</td></tr>
            </tbody>
          </table>
        </div>
      </details>

      {/* ── Season 2 detail (collapsible) ────────────────────────────────── */}
      <details className="fold learn-season-fold">
        <summary>
          <div className="learn-season-summary">
            <p className="metric-label">Saison 2</p>
            <p className="metric-value">{fmt(total2)}</p>
            <p className="metric-sub">Fin de formation + 1er solo (10 × 55 min) + SF 28 {LEARN_PARAMS.sf28S2Hours} h</p>
          </div>
        </summary>
        <div className="fold-body">
          <table className="breakdown">
            <tbody>
              <tr><td>Cotisation annuelle</td><td>{fmt(p.membership.annual)}</td></tr>
              <tr><td>Licence FFVP annuelle</td><td>{fmt2(p.license.annual)}</td></tr>
              <tr className="section-head"><td colSpan={2}>Heures de vol — planeur pur (bois et toile)</td></tr>
              <tr><td>{best2.label}</td><td>{fmt(s2PkgBase)}</td></tr>
              {s2PkgExtra > 0 && (
                <tr>
                  <td>Heures supplémentaires <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{fmtH(s2PkgExtra / p.rates[plane])} au tarif horaire</span></td>
                  <td>{fmt(s2PkgExtra)}</td>
                </tr>
              )}
              <tr>
                <td>Instruction <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{fmtH(b2a)} × {p.instrRate} €/h · vols avec instructeur uniquement</span></td>
                <td>{fmt(i2a)}</td>
              </tr>
              <tr>
                <td>Remorquage <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n2a} vols × 12/100h · {nTdp} tours de piste × {LEARN_PARAMS.tdpTow}/100h · {n2b} vols solo × 12/100h</span></td>
                <td>{fmt(t2a + t2b)}</td>
              </tr>
              <tr>
                <td>Motoplaneur SF 28 <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{LEARN_PARAMS.sf28S2Hours} h × {LEARN_PARAMS.sf28Rate} €/h · décollage autonome sans remorquage</span></td>
                <td>{fmt(sf28Cost2)}</td>
              </tr>
              <tr className="total"><td>Total saison 2</td><td>{fmt(total2)}</td></tr>
            </tbody>
          </table>
        </div>
      </details>

      {/* ── Grand total metric cards ──────────────────────────────────────── */}
      <div className="metrics">
        <div className="metric-card sky">
          <p className="metric-label">Total formation (2 saisons)</p>
          <p className="metric-value">{fmt(grandTotal)}</p>
          <p className="metric-sub">Hors bourses</p>
        </div>
        <div className="metric-card green">
          <p className="metric-label">Avec bourses de formation FFVP</p>
          <p className="metric-value">{fmt(Math.max(0, grandTotal - totalTraining))}</p>
          <p className="metric-sub">Après −{fmt(totalTraining)} de bourses{hasBIA ? ' (avantage BIA inclus)' : ''}</p>
        </div>
      </div>

      {/* ── Training scholarships (collapsible) ──────────────────────────── */}
      <details className="fold">
        <summary>
          <span>Bourses FFVP — jalons de formation</span>
          <span className="fold-total" style={{ color: 'var(--green)' }}>−{fmt(totalTraining)}</span>
        </summary>
        <div className="fold-body">
          <p style={{ fontSize: '11.5px', color: 'var(--text-mid)', marginBottom: '.6rem' }}>
            Versées par la FFVP à l'atteinte de chaque étape :
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {training.map((b) => {
              const amount  = hasBIA ? b.BIA : b.noBIA;
              const biaMark = hasBIA && b.BIA > b.noBIA;
              return (
                <li key={b.label} style={{ padding: '3px 0' }}>
                  <span style={{ color: 'var(--text-mid)' }}>{b.label}</span>
                  {biaMark && (
                    <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600 }}>
                      {' '}+{b.BIA - b.noBIA} € avec BIA
                    </span>
                  )}
                  <strong style={{ float: 'right', fontFamily: 'var(--mono)', color: 'var(--green)' }}>
                    −{amount} €
                  </strong>
                </li>
              );
            })}
          </ul>
        </div>
      </details>

      {/* ── Performance scholarships (collapsible) ───────────────────────── */}
      <details className="fold">
        <summary>
          <span>Aides à la performance FFVP — après SPL</span>
          <span className="fold-total" style={{ color: 'var(--green)' }}>jusqu'à −{fmt(totalPerf)}</span>
        </summary>
        <div className="fold-body">
          <p style={{ fontSize: '11.5px', color: 'var(--text-mid)', marginBottom: '.6rem' }}>
            Disponibles après l'obtention du SPL, sur plusieurs saisons :
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {perf.map((b) => {
              const amount  = hasBIA ? b.BIA : b.noBIA;
              const biaMark = hasBIA && b.BIA > b.noBIA;
              return (
                <li key={b.label} style={{ padding: '3px 0' }}>
                  <span style={{ color: 'var(--text-mid)' }}>{b.label}</span>
                  {biaMark && (
                    <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600 }}>
                      {' '}+{b.BIA - b.noBIA} € avec BIA
                    </span>
                  )}
                  <strong style={{ float: 'right', fontFamily: 'var(--mono)', color: 'var(--green)' }}>
                    −{amount} €
                  </strong>
                </li>
              );
            })}
          </ul>
        </div>
      </details>

      <FootNotes />
    </>
  );
}
