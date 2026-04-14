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
  // ── Local state ────────────────────────────────────────────────────────────
  const [age, setAge] = useState('o25');
  const [plane, setPlane] = useState('dg');
  const [days, setDays] = useState(7);
  const [nFlights, setNFlights] = useState(5);
  const [dur, setDur] = useState(4);
  const [withInstr, setWithInstr] = useState(true);
  const [isSummer, setIsSummer] = useState(true);

  // ── Profile & pricing references ──────────────────────────────────────────
  const p = P[age];
  const towPer100h = 10;

  // ── Flight volume and billable hours ──────────────────────────────────────
  const totalFlightHours = nFlights * dur;
  const totalBillable = billableHrs(nFlights, dur, age);
  const freeHrsTotal = Math.max(0, totalFlightHours - totalBillable);
  const freeHourSavings = freeHrsTotal * p.rates[plane];

  const instr = instrCost(totalBillable, age, withInstr, isSummer);
  const tow = towCost(nFlights, towPer100h);
  const flightCost = totalBillable * p.rates[plane];
  const instructionSavings = !isSummer && withInstr ? totalBillable * p.instrRate : 0;

  // ── Membership decision ────────────────────────────────────────────────────
  const dailyMembershipCost = days * p.membership.daily;
  const term12DaysCost = p.membership.term12d;
  const switchDayThreshold = Math.ceil(term12DaysCost / p.membership.daily);

  const membershipOptions = [
    {
      id: 'term12',
      label: 'Cotisation courte durée 12 jours consécutifs',
      detail: "Valable jusqu'à 12 jours consécutifs",
      cost: term12DaysCost,
    },
    {
      id: 'daily',
      label: `${days} × cotisation à la journée`,
      detail: `${fmt2(p.membership.daily)} par jour`,
      cost: dailyMembershipCost,
    },
  ];

  // Why: this keeps ties deterministic and avoids a fluctuating recommendation.
  const bestMembership =
    days <= 12 && term12DaysCost <= dailyMembershipCost
      ? membershipOptions[0]
      : membershipOptions[1];

  const membershipSavings =
    bestMembership.id === 'term12'
      ? Math.max(0, dailyMembershipCost - term12DaysCost)
      : Math.max(0, term12DaysCost - dailyMembershipCost);

  const totalCost = bestMembership.cost + flightCost + instr + tow;
  const costPerFlight = totalCost / Math.max(nFlights, 1);

  // ── Display helpers ────────────────────────────────────────────────────────
  const planeName = plane === 'dg'      ? 'DG500 / LAK19'
                  : plane === 'plastic' ? 'Pégase / Marianne'
                  :                       'bois et toile';
  const dayLabel = `${days} jour${days > 1 ? 's' : ''}`;

  return (
    <>
      {/* ── Profile toggle ───────────────────────────────────────────────── */}
      <p className="section-label">Votre profil</p>
      <div className="toggle-group">
        <button className={age === 'u25' ? 'active' : ''} onClick={() => setAge('u25')}>Moins de 25 ans</button>
        <button className={age === 'o25' ? 'active' : ''} onClick={() => setAge('o25')}>25 ans et plus</button>
      </div>

      <div className="info-box" style={{ marginTop: '.75rem' }}>
        <strong>Pilote visiteur :</strong> Vous êtes titulaire d'une licence FFVP valide souscrite dans un
        autre club. Il vous suffit d'une cotisation temporaire ici — pas besoin d'une nouvelle licence annuelle.
      </div>

      {/* ── Stay & flight parameters ─────────────────────────────────────── */}
      <p className="section-label">Séjour &amp; vol</p>

      <div className="control-row">
        <label>Jours de séjour</label>
        <input type="range" min={1} max={12} step={1} value={days}
          onChange={(e) => setDays(+e.target.value)} />
        <span className="control-val">{dayLabel}</span>
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
          de <strong>{fmtH(freeHrsTotal)} gratuites</strong> — économie de {fmt(freeHourSavings)} sur les
          heures de vol. Vous ne payez que {fmtH(totalBillable)} sur {fmtH(totalFlightHours)} heures totales.
        </div>
      ) : (
        <div style={{ marginTop: '1.25rem' }} />
      )}

      {/* KPI cards */}
      <div className="metrics">
        <div className="metric-card sky">
          <p className="metric-label">Meilleur coût total ({dayLabel})</p>
          <p className="metric-value">{fmt(totalCost)}</p>
          <p className="metric-sub">{bestMembership.label}</p>
        </div>
        <div className={membershipSavings > 0 ? 'metric-card green' : 'metric-card'}>
          <p className="metric-label">Cotisation retenue</p>
          <p className="metric-value">{fmt(bestMembership.cost)}</p>
          <p className="metric-sub">
            {membershipSavings > 0 ? `Économie: ${fmt(membershipSavings)}` : 'Aucun écart entre options'} · seuil vers {switchDayThreshold} jours
          </p>
        </div>
      </div>

      <div className="info-box amber-box" style={{ marginTop: '.25rem' }}>
        Le basculement se fait vers <strong>{switchDayThreshold} jours</strong> :
        en-dessous, la cotisation à la journée est généralement plus favorable ; à partir de ce seuil, la formule 12 jours devient avantageuse.
      </div>

      <details className="fold" style={{ marginTop: '1rem' }}>
        <summary>Options de cotisation <span className="fold-total">{fmt(bestMembership.cost)}</span></summary>
        <div className="fold-body">
          <div className="compare-wrap" style={{ marginBottom: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th style={{ textAlign: 'right' }}>Coût</th>
                </tr>
              </thead>
              <tbody>
                {membershipOptions.map((option) => (
                  <tr key={option.id} className={option.id === bestMembership.id ? 'best' : ''}>
                    <td>
                      {option.label}
                      {option.id === bestMembership.id && <span className="badge badge-best">Meilleur</span>}
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                        {option.detail}
                      </span>
                    </td>
                    <td>{fmt(option.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      {/* Cost breakdown */}
      <details className="fold">
        <summary>Détail des coûts <span className="fold-total">{fmt(totalCost)}</span></summary>
        <div className="fold-body">
          <table className="breakdown">
            <tbody>
              <tr>
                <td>
                  {bestMembership.label}
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Votre licence FFVP du club d'origine vous couvre déjà.
                  </span>
                </td>
                <td>{fmt(bestMembership.cost)}</td>
              </tr>
              <tr className="section-head"><td colSpan={2}>Heures de vol — {planeName}</td></tr>
              <tr>
                <td>{nFlights} vols · {fmtH(totalBillable)} facturables × {fmt2(p.rates[plane])}/h</td>
                <td>{fmt(flightCost)}</td>
              </tr>
              {freeHrsTotal > 0 && (
                <tr className="saving">
                  <td>Heures gratuites au-delà de {fmtH(p.freeThreshold)}/vol ({fmtH(freeHrsTotal)})</td>
                  <td>− {fmt(freeHourSavings)}</td>
                </tr>
              )}
              {withInstr && (
                <tr>
                  <td>
                    Instruction
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {fmtH(totalBillable)} × {p.instrRate} €/h{!isSummer ? ' · gratuit hors avr.–sept.' : ''}
                    </span>
                  </td>
                  <td>{fmt(instr)}</td>
                </tr>
              )}
              <tr>
                <td>
                  Remorquage
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                    ~{nFlights} vols × {towPer100h}/100h
                  </span>
                </td>
                <td>{fmt(tow)}</td>
              </tr>
              <tr className="total"><td>Total séjour</td><td>{fmt(totalCost)}</td></tr>
            </tbody>
          </table>
        </div>
      </details>

      {/* Off-season instruction saving */}
      {instructionSavings > 0 && (
        <div className="info-box green-box">
          <strong>Avantage hors saison :</strong> Voler hors avril–septembre signifie pas de
          supplément d'instruction ({p.instrRate} €/h). Vous économisez{' '}
          {fmt(instructionSavings)} sur l'instruction.
        </div>
      )}

      <div className="metrics" style={{ marginTop: '.75rem' }}>
        <div className="metric-card">
          <p className="metric-label">Coût par vol</p>
          <p className="metric-value">{fmt(costPerFlight)}</p>
          <p className="metric-sub">{fmtH(totalBillable)} facturables sur {planeName}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Volume total</p>
          <p className="metric-value">{fmtH(totalFlightHours)}</p>
          <p className="metric-sub">{nFlights} vols · moyenne {fmtH(dur)} par vol</p>
        </div>
      </div>

      <FootNotes />
    </>
  );
}
