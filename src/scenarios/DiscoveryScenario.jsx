/**
 * DiscoveryScenario.jsx — "Forfait découverte ou cotisation annuelle ?" scenario
 *
 * Compares the cost of discovery-flight packages vs. a full annual membership,
 * and calculates the break-even number of flights.
 */

import { useState } from 'react';
import { P, TOW }          from '../data/pricing.js';
import { billableHrs, instrCost, towCost } from '../utils/calculations.js';
import { fmt, fmt2, fmtH } from '../utils/formatting.js';
import FootNotes from '../components/FootNotes.jsx';

export default function DiscoveryScenario() {
  // ── Local state ──────────────────────────────────────────────────────────
  const [age,       setAge]       = useState('u25');
  const [plane,     setPlane]     = useState('wood');
  const [nFlights,  setNFlights]  = useState(6);
  const [dur,       setDur]       = useState(1);
  const [withInstr, setWithInstr] = useState(true);
  const [isSummer,  setIsSummer]  = useState(true);

  const p = P[age];

  // ── Discovery package cost ─────────────────────────────────────────────────
  let discCost, discLabel;
  if (nFlights <= 2) {
    discCost  = nFlights * p.discovery.single;
    discLabel = nFlights + ' × vol découverte individuel (' + p.discovery.single + ' €)';
  } else if (nFlights === 3) {
    discCost  = p.discovery.d3;
    discLabel = 'Forfait découverte 3 vols';
  } else if (nFlights <= 5) {
    discCost  = p.discovery.d3 + (nFlights - 3) * p.discovery.single;
    discLabel = 'Forfait 3 vols + ' + (nFlights - 3) + ' vol(s) supplémentaire(s)';
  } else if (nFlights === 6) {
    discCost  = p.discovery.d6;
    discLabel = 'Forfait découverte 6 vols';
  } else {
    discCost  = p.discovery.d6 + (nFlights - 6) * p.discovery.single;
    discLabel = 'Forfait 6 vols + ' + (nFlights - 6) + ' vol(s) supplémentaire(s)';
  }

  // ── Annual membership path ─────────────────────────────────────────────────
  const billable    = billableHrs(nFlights, dur, age);
  const instr       = instrCost(billable, age, withInstr, isSummer);
  const tow         = towCost(nFlights, 10);
  const fixed       = p.membership.annual + p.license.annual;
  const flightCost  = billable * p.rates[plane];
  const memberTotal = fixed + flightCost + instr + tow;

  const saving         = discCost - memberTotal;
  const isMemberBetter = memberTotal < discCost;

  // ── Break-even calculation ─────────────────────────────────────────────────
  const varPerFlight = Math.min(dur, p.freeThreshold) * p.rates[plane]
    + (withInstr && isSummer ? Math.min(dur, p.freeThreshold) * p.instrRate : 0)
    + 10 * TOW;

  const discPerFlight = nFlights <= 3
    ? (nFlights === 3 ? p.discovery.d3 / 3 : p.discovery.single)
    : (nFlights === 6 ? p.discovery.d6 / 6 : p.discovery.single);

  let breakEven = null;
  if (discPerFlight > varPerFlight) {
    breakEven = fixed / (discPerFlight - varPerFlight);
  }

  return (
    <>
      {/* ── Profile toggle ───────────────────────────────────────────────── */}
      <p className="section-label">Votre profil</p>
      <div className="toggle-group">
        <button className={age === 'u25' ? 'active' : ''} onClick={() => setAge('u25')}>Moins de 25 ans</button>
        <button className={age === 'o25' ? 'active' : ''} onClick={() => setAge('o25')}>25 ans et plus</button>
      </div>

      {/* ── Flight parameters ────────────────────────────────────────────── */}
      <p className="section-label" style={{ marginTop: '1.25rem' }}>Projets de vol</p>

      <div className="control-row">
        <label>Nombre de vols</label>
        <input type="range" min={1} max={15} step={1} value={nFlights}
          onChange={(e) => setNFlights(+e.target.value)} />
        <span className="control-val">{nFlights}</span>
      </div>

      <div className="control-row">
        <label>Durée moy. de vol</label>
        <input type="range" min={0.5} max={3} step={0.5} value={dur}
          onChange={(e) => setDur(+e.target.value)} />
        <span className="control-val">{dur.toFixed(1).replace('.', ',')} h</span>
      </div>

      <label className="check-row">
        <input type="checkbox" checked={withInstr} onChange={(e) => setWithInstr(e.target.checked)} />
        Vol avec instructeur
      </label>
      <label className="check-row">
        <input type="checkbox" checked={isSummer} onChange={(e) => setIsSummer(e.target.checked)} />
        Saison estivale (avr.–sept.)
      </label>

      {/* ── Plane toggle (for the membership path) ───────────────────────── */}
      <p className="section-label" style={{ marginTop: '1rem' }}>Planeur (pour la voie cotisation)</p>
      <div className="toggle-group">
        <button className={plane === 'wood'    ? 'active' : ''} onClick={() => setPlane('wood')}>Bois et toile</button>
        <button className={plane === 'plastic' ? 'active' : ''} onClick={() => setPlane('plastic')}>Pégase / Marianne</button>
        <button className={plane === 'dg'      ? 'active' : ''} onClick={() => setPlane('dg')}>DG500 / LAK19</button>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}

      {/* KPI cards */}
      <div className="metrics" style={{ marginTop: '1.5rem' }}>
        <div className={`metric-card${isMemberBetter ? '' : ' accent'}`}>
          <p className="metric-label">Forfaits découverte</p>
          <p className="metric-value" style={{ color: `var(--${isMemberBetter ? 'text-mid' : 'accent'})` }}>
            {fmt(discCost)}
          </p>
          <p className="metric-sub">{discLabel}</p>
        </div>
        <div className={`metric-card${isMemberBetter ? ' green' : ''}`}>
          <p className="metric-label">Voie cotisation annuelle</p>
          <p className="metric-value" style={{ color: `var(--${isMemberBetter ? 'green' : 'text'})` }}>
            {fmt(memberTotal)}
          </p>
          <p className="metric-sub">Cotisation + licence + {fmtH(billable)} de vol</p>
        </div>
      </div>

      {/* Recommendation box */}
      {isMemberBetter ? (
        <div className="info-box green-box">
          <strong>Rejoignez le club !</strong> Même pour seulement {nFlights} vols,
          la cotisation annuelle ({fmt(memberTotal)}) coûte{' '}
          <strong>{fmt(Math.abs(saving))} de moins</strong> que le forfait découverte ({fmt(discCost)}).
          Les forfaits découverte sont conçus pour une expérience ponctuelle — dès que vous volez
          régulièrement, la cotisation est plus avantageuse.
        </div>
      ) : (
        <div className="info-box">
          <strong>Le forfait découverte est avantageux</strong> pour ce nombre de vols
          ({fmt(Math.abs(saving))} moins cher). Mais dès que vous volez davantage, la cotisation
          l'emporte.
        </div>
      )}

      {breakEven !== null && (
        <div className="info-box amber-box">
          <strong>Seuil de rentabilité à {Math.ceil(breakEven)} vols</strong> — à partir du vol
          n°{Math.ceil(breakEven)}, la cotisation annuelle est moins chère que les vols découverte.
        </div>
      )}

      {/* Cost detail tables */}
      <p className="section-label">Détail des coûts</p>
      <table className="breakdown">
        <tbody>
          <tr className="section-head"><td colSpan={2}>Voie forfait découverte</td></tr>
          <tr><td>{discLabel}</td><td>{fmt(discCost)}</td></tr>
          <tr><td><em style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Assurance FFVP comprise</em></td><td></td></tr>
          <tr className="total"><td>Total</td><td>{fmt(discCost)}</td></tr>
        </tbody>
      </table>

      <table className="breakdown">
        <tbody>
          <tr className="section-head">
            <td colSpan={2}>Voie cotisation annuelle ({age === 'u25' ? 'moins de 25 ans' : '25 ans et plus'})</td>
          </tr>
          <tr><td>Cotisation annuelle</td><td>{fmt(p.membership.annual)}</td></tr>
          <tr><td>Licence FFVP annuelle</td><td>{fmt2(p.license.annual)}</td></tr>
          <tr>
            <td>{nFlights} vols × {fmtH(Math.min(dur, p.freeThreshold))} facturable × {fmt2(p.rates[plane])}/h</td>
            <td>{fmt(flightCost)}</td>
          </tr>
          {withInstr && (
            <tr>
              <td>Instruction ({fmtH(billable)} × {p.instrRate} €/h{!isSummer ? ' — gratuit' : ''})</td>
              <td>{fmt(instr)}</td>
            </tr>
          )}
          <tr><td>Remorquage</td><td>{fmt(tow)}</td></tr>
          <tr className="total"><td>Total</td><td>{fmt(memberTotal)}</td></tr>
          {isMemberBetter && (
            <tr className="saving"><td>Économie vs forfait découverte</td><td>{fmt(Math.abs(saving))}</td></tr>
          )}
        </tbody>
      </table>

      <FootNotes />
    </>
  );
}
