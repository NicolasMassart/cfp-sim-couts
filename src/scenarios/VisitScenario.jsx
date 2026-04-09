/**
 * VisitScenario.jsx — "Pilote visiteur (séjour court)" scenario
 *
 * Calculates costs for a licensed pilot from another club visiting for
 * a short stay: they use a temporary membership instead of the annual one.
 */

import { useState } from 'react';
import { P }               from '../data/pricing.js';
import { billableHrs, instrCost, towCost } from '../utils/calculations.js';
import { fmt, fmt2, fmtH } from '../utils/formatting.js';
import FootNotes from '../components/FootNotes.jsx';

export default function VisitScenario() {
  // ── Local state ──────────────────────────────────────────────────────────
  const [age,       setAge]       = useState('o25');
  const [plane,     setPlane]     = useState('dg');
  const [days,      setDays]      = useState(7);
  const [nFlights,  setNFlights]  = useState(5);
  const [dur,       setDur]       = useState(4);
  const [withInstr, setWithInstr] = useState(true);
  const [isSummer,  setIsSummer]  = useState(true);

  const p = P[age];

  // ── Flight costs ────────────────────────────────────────────────────────
  const billablePerFlight = Math.min(dur, p.freeThreshold);
  const totalBillable     = nFlights * billablePerFlight;
  const freeHrsTotal      = nFlights * Math.max(0, dur - p.freeThreshold);

  const instr      = instrCost(totalBillable, age, withInstr, isSummer);
  const tow        = towCost(nFlights, 10);
  const flightCost = totalBillable * p.rates[plane];

  // ── Membership options ───────────────────────────────────────────────────
  const dailyMem   = days * p.membership.daily;
  const term12dMem = p.membership.term12d;
  const bestMem    = (days <= 12 && term12dMem <= dailyMem)
    ? { cost: term12dMem, label: 'Cotisation courte durée 12 jours consécutifs' }
    : { cost: dailyMem,   label: days + ' × cotisation à la journée (20 €)' };

  const totalCost = bestMem.cost + flightCost + instr + tow;

  const planeName = plane === 'dg'      ? 'DG500 / LAK19'
                  : plane === 'plastic' ? 'Pégase / Marianne'
                  :                       'bois et toile';

  const mem12d   = p.membership.term12d;
  const memDaily = days * p.membership.daily;

  return (
    <>
      {/* ── Profile toggle ───────────────────────────────────────────────── */}
      <p className="section-label">Votre profil</p>
      <div className="toggle-group">
        <button className={age === 'u25' ? 'active' : ''} onClick={() => setAge('u25')}>Moins de 25 ans</button>
        <button className={age === 'o25' ? 'active' : ''} onClick={() => setAge('o25')}>25 ans et plus</button>
      </div>

      <div className="info-box" style={{ marginTop: '.75rem' }}>
        <strong>Pilote visiteur :</strong> Vous êtes titulaire d'une licence SPL/FFVP valide dans un
        autre club. Il vous suffit d'une cotisation temporaire ici — pas besoin d'une nouvelle licence annuelle.
      </div>

      {/* ── Stay & flight parameters ─────────────────────────────────────── */}
      <p className="section-label">Séjour &amp; vol</p>

      <div className="control-row">
        <label>Jours de séjour</label>
        <input type="range" min={1} max={12} step={1} value={days}
          onChange={(e) => setDays(+e.target.value)} />
        <span className="control-val">{days} jour{days > 1 ? 's' : ''}</span>
      </div>

      <div className="control-row">
        <label>Nombre de vols</label>
        <input type="range" min={1} max={20} step={1} value={nFlights}
          onChange={(e) => setNFlights(+e.target.value)} />
        <span className="control-val">{nFlights}</span>
      </div>

      <div className="control-row">
        <label>Durée moy. de vol</label>
        <input type="range" min={1} max={8} step={0.5} value={dur}
          onChange={(e) => setDur(+e.target.value)} />
        <span className="control-val">{dur.toFixed(1).replace('.', ',')} h</span>
      </div>

      {/* ── Plane toggle ─────────────────────────────────────────────────── */}
      <p className="section-label">Planeur</p>
      <div className="toggle-group">
        <button className={plane === 'wood'    ? 'active' : ''} onClick={() => setPlane('wood')}>Bois et toile</button>
        <button className={plane === 'plastic' ? 'active' : ''} onClick={() => setPlane('plastic')}>Pégase / Marianne</button>
        <button className={plane === 'dg'      ? 'active' : ''} onClick={() => setPlane('dg')}>DG500 / LAK19</button>
      </div>

      <label className="check-row" style={{ marginTop: '.75rem' }}>
        <input type="checkbox" checked={withInstr} onChange={(e) => setWithInstr(e.target.checked)} />
        Vol avec instructeur
      </label>
      <label className="check-row">
        <input type="checkbox" checked={isSummer} onChange={(e) => setIsSummer(e.target.checked)} />
        Saison estivale (avr.–sept.) — supplément d'instruction applicable
      </label>

      {/* ── Results ─────────────────────────────────────────────────────── */}

      {/* Free-hours benefit */}
      {freeHrsTotal > 0 ? (
        <div className="info-box green-box" style={{ marginTop: '1.25rem' }}>
          <strong>Avantage long vol :</strong> Au-delà de {fmtH(p.freeThreshold)} par vol,
          pas de participation aux frais. Avec des vols de {fmtH(dur)} en moyenne, vous bénéficiez
          de <strong>{fmtH(freeHrsTotal)} gratuites</strong> — économie de {fmt(freeHrsTotal * p.rates[plane])} sur les
          heures de vol. Vous ne payez que {fmtH(totalBillable)} sur {fmtH(nFlights * dur)} heures totales.
        </div>
      ) : (
        <div style={{ marginTop: '1.25rem' }} />
      )}

      {/* KPI cards */}
      <div className="metrics">
        <div className="metric-card accent">
          <p className="metric-label">Coût total ({days} jour{days > 1 ? 's' : ''})</p>
          <p className="metric-value">{fmt(totalCost)}</p>
          <p className="metric-sub">{bestMem.label}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Coût par vol</p>
          <p className="metric-value">{fmt(totalCost / Math.max(nFlights, 1))}</p>
          <p className="metric-sub">{fmtH(totalBillable)} facturables sur {planeName}</p>
        </div>
      </div>

      {/* Membership options comparison */}
      <p className="section-label">Options de cotisation pour {days} jour{days > 1 ? 's' : ''}</p>
      <div className="compare-wrap">
        <table>
          <thead>
            <tr>
              <th>Option</th>
              <th style={{ textAlign: 'right' }}>Coût</th>
              <th style={{ textAlign: 'right' }}>Remarques</th>
            </tr>
          </thead>
          <tbody>
            <tr className={mem12d <= memDaily ? 'best' : ''}>
              <td>
                Cotisation courte durée 12 jours consécutifs
                {mem12d <= memDaily && <span className="badge badge-best">Meilleur</span>}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{fmt(mem12d)}</td>
              <td style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>Jusqu'à 12 jours consécutifs</td>
            </tr>
            <tr className={memDaily < mem12d ? 'best' : ''}>
              <td>
                {days} × cotisation à la journée
                {memDaily < mem12d && <span className="badge badge-best">Meilleur</span>}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'var(--mono)' }}>{fmt(memDaily)}</td>
              <td style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>Nécessite une licence FFVP du club d'origine</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cost breakdown */}
      <p className="section-label">Détail des coûts</p>
      <table className="breakdown">
        <tbody>
          <tr><td>{bestMem.label}</td><td>{fmt(bestMem.cost)}</td></tr>
          <tr>
            <td><em style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Votre licence FFVP du club d'origine vous couvre — pas de nouvelle licence annuelle nécessaire</em></td>
            <td></td>
          </tr>
          <tr className="section-head"><td colSpan={2}>Heure de vol sur {planeName}</td></tr>
          <tr>
            <td>{nFlights} vols — {fmtH(totalBillable)} facturables × {fmt2(p.rates[plane])}/h</td>
            <td>{fmt(flightCost)}</td>
          </tr>
          {freeHrsTotal > 0 && (
            <tr className="saving">
              <td>Heures gratuites au-delà de {fmtH(p.freeThreshold)}/vol ({fmtH(freeHrsTotal)})</td>
              <td>— {fmt(freeHrsTotal * p.rates[plane])}</td>
            </tr>
          )}
          {withInstr && (
            <tr>
              <td>Instruction ({fmtH(totalBillable)} × {p.instrRate} €/h{!isSummer ? ' — gratuit hors avr.–sept.' : ''})</td>
              <td>{fmt(instr)}</td>
            </tr>
          )}
          <tr><td>Remorquage (~{nFlights} × 10/100h)</td><td>{fmt(tow)}</td></tr>
          <tr className="total"><td>Total</td><td>{fmt(totalCost)}</td></tr>
        </tbody>
      </table>

      {/* Off-season instruction saving */}
      {!isSummer && withInstr && (
        <div className="info-box green-box">
          <strong>Avantage hors saison :</strong> Voler hors avril–septembre signifie pas de
          supplément d'instruction ({p.instrRate} €/h). Vous économisez{' '}
          {fmt(totalBillable * p.instrRate)} sur l'instruction.
        </div>
      )}

      <FootNotes />
    </>
  );
}
