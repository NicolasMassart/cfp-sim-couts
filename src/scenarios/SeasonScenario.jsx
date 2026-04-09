/**
 * SeasonScenario.jsx — "Planifier ma saison" scenario
 *
 * Calculates the optimal package for a licensed pilot's full season,
 * renders a cost-evolution chart, and shows comparison hints.
 */

import { useState } from 'react';
import { P, COEFF }          from '../data/pricing.js';
import { billableHrs, towCost, flightOptions } from '../utils/calculations.js';
import { fmt, fmt2, fmtH, fmtSliderH }         from '../utils/formatting.js';
import SeasonChart from '../components/SeasonChart.jsx';
import FootNotes   from '../components/FootNotes.jsx';

export default function SeasonScenario() {
  // ── Local state ──────────────────────────────────────────────────────────
  const [age,   setAge]   = useState('o25');
  const [plane, setPlane] = useState('plastic');

  const [hours,      setHours]      = useState(20);
  const [dur,        setDur]        = useState(1.5);
  const [towPer100h, setTowPer100h] = useState(10);
  const [sf28Hours,  setSf28Hours]  = useState(0);

  // Raw slider values — clamped in computation below
  const [instrHoursRaw,       setInstrHoursRaw]       = useState(0.5);
  const [instrHoursWinterRaw, setInstrHoursWinterRaw] = useState(0);

  // ── Derived (clamped) values ─────────────────────────────────────────────
  const instrHours       = Math.min(Math.max(0.5, instrHoursRaw), hours);
  const instrHoursWinter = Math.min(Math.max(0, instrHoursWinterRaw), instrHours);
  const instrHoursSummer = instrHours - instrHoursWinter;

  const p = P[age];

  // ── Derived flight counts ─────────────────────────────────────────────────
  const soloHours    = Math.max(0, hours - instrHours);
  const soloFlights  = Math.max(0, Math.round(soloHours / dur));
  const instrFlights = Math.max(1, Math.round(instrHours / dur));
  const nFlights     = instrFlights + soloFlights;

  // ── Billable hours ────────────────────────────────────────────────────────
  const instrBillable = instrHours;
  const soloBillable  = billableHrs(soloFlights, dur, age);
  const billable      = instrBillable + soloBillable;
  const freeHrs       = soloFlights * Math.max(0, dur - p.freeThreshold);

  // ── Costs ─────────────────────────────────────────────────────────────────
  const instr       = instrHoursSummer * p.instrRate;
  const instrSaving = instrHoursWinter * p.instrRate;
  const tow         = towCost(nFlights, towPer100h);
  const sf28Cost    = sf28Hours * 60;
  const fixed       = p.membership.annual + p.license.annual;

  const opts     = flightOptions(billable, plane, age, false);
  const best     = opts[0];
  const totalBest = fixed + best.cost + instr + tow + sf28Cost;

  // Extra hours beyond package coverage (shown as a separate breakdown row)
  const extraFlightCost  = best.pkgCost != null ? best.cost - best.pkgCost : 0;
  const extraFlightHours = best.coverage != null && billable > best.coverage
    ? billable - best.coverage : 0;

  // ── Break-even thresholds ─────────────────────────────────────────────────
  const be15h = p.pkg.h15 / p.rates[plane];
  const be30h = p.pkg.h30 / p.rates[plane];

  // ── Instruction note (for breakdown table) ────────────────────────────────
  const instrNote = instrHoursWinter > 0
    ? `${fmtH(instrHoursSummer)} été (payant) · ${fmtH(instrHoursWinter)} hiver (gratuit)`
    : `${fmtH(instrHoursSummer)} en été`;

  return (
    <>
      {/* ── Profile toggles ─────────────────────────────────────────────── */}
      <p className="section-label">Votre profil</p>
      <div className="toggle-group">
        <button className={age === 'u25' ? 'active' : ''} onClick={() => setAge('u25')}>Moins de 25 ans</button>
        <button className={age === 'o25' ? 'active' : ''} onClick={() => setAge('o25')}>25 ans et plus</button>
      </div>
      <div className="toggle-group" style={{ marginTop: '8px' }}>
        <button className={plane === 'wood'    ? 'active' : ''} onClick={() => setPlane('wood')}>Bois et toile</button>
        <button className={plane === 'plastic' ? 'active' : ''} onClick={() => setPlane('plastic')}>Pégase / Marianne</button>
        <button className={plane === 'dg'      ? 'active' : ''} onClick={() => setPlane('dg')}>DG500 / LAK19</button>
      </div>

      {/* ── Season parameters ───────────────────────────────────────────── */}
      <p className="section-label" style={{ marginTop: '1.25rem' }}>Paramètres de saison</p>

      <div className="control-row">
        <label>Heures de vol totales</label>
        <input type="range" min={1} max={200} step={1} value={hours}
          onChange={(e) => setHours(+e.target.value)} />
        <span className="control-val">{hours} h</span>
      </div>

      <div className="control-row">
        <label>Durée moy. de vol</label>
        <input type="range" min={0.5} max={5} step={0.5} value={dur}
          onChange={(e) => setDur(+e.target.value)} />
        <span className="control-val">{dur.toFixed(1).replace('.', ',')} h</span>
      </div>

      <div className="control-row">
        <label>Remorquage moy. (1/100h)</label>
        <input type="range" min={5} max={30} step={1} value={towPer100h}
          onChange={(e) => setTowPer100h(+e.target.value)} />
        <span className="control-val">{towPer100h} /100h</span>
      </div>

      <div className="control-row">
        <label>Heures moto-planeur <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(SF 28 · 60 €/h)</span></label>
        <input type="range" min={0} max={20} step={0.5} value={sf28Hours}
          onChange={(e) => setSf28Hours(+e.target.value)} />
        <span className="control-val">{fmtSliderH(sf28Hours)}</span>
      </div>

      <div className="control-row">
        <label>Heures avec instructeur <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(min. 1 vol obligatoire)</span></label>
        <input type="range" min={0} max={hours} step={0.5} value={instrHours}
          onChange={(e) => {
            const val = +e.target.value;
            const newInstrHours = Math.min(Math.max(0.5, val), hours);
            setInstrHoursRaw(val);
            if (instrHoursWinterRaw > newInstrHours) setInstrHoursWinterRaw(newInstrHours);
          }} />
        <span className="control-val">{fmtSliderH(instrHours)}</span>
      </div>

      <div className="control-row">
        <label>dont en saison hivernale (oct.–mars) <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(supplément instruction gratuit)</span></label>
        <input type="range" min={0} max={hours} step={0.5} value={instrHoursWinter}
          onChange={(e) => setInstrHoursWinterRaw(Math.min(+e.target.value, instrHours))} />
        <span className="control-val">{fmtSliderH(instrHoursWinter)}</span>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}

      {freeHrs > 0 && (
        <div className="info-box green-box">
          <strong>Règle des heures gratuites :</strong> Au-delà de {fmtH(p.freeThreshold)} par vol solo,
          pas de participation aux frais. Vous ne payez que {fmtH(soloBillable)} au lieu de{' '}
          {fmtH(soloHours)} en solo. Économie : <strong>{fmt(freeHrs * p.rates[plane])}</strong>.
        </div>
      )}

      {instrSaving > 0 && (
        <div className="info-box green-box">
          Économie de <strong>{fmt(instrSaving)}</strong> : {fmtH(instrHoursWinter)} d'instruction
          en hiver → pas de supplément instruction.
        </div>
      )}

      {/* ── Cost evolution chart ───────────────────────────────────────────── */}
      <SeasonChart
        p={p}
        plane={plane}
        age={age}
        hours={hours}
        dur={dur}
        instrHours={instrHours}
        instrHoursSummer={instrHoursSummer}
        soloHours={soloHours}
        towPer100h={towPer100h}
        fixed={fixed}
        sf28CostTotal={sf28Cost}
        towTotal={tow}
      />

      <div className="metrics">
        <div className="metric-card sky">
          <p className="metric-label">Meilleur coût total</p>
          <p className="metric-value">{fmt(totalBest)}</p>
          <p className="metric-sub">{best.label}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">Coût par heure de vol</p>
          <p className="metric-value">{fmt(totalBest / Math.max(hours, 1))}</p>
          <p className="metric-sub">~{nFlights} vols · {fmtH(instrHoursSummer)} instr. été / {fmtH(instrHoursWinter)} instr. hiver</p>
        </div>
      </div>

      {best.coverage && best.coverage > billable && (
        <div className="info-box amber-box" style={{ marginTop: '.75rem' }}>
          Il vous resterait <strong>{fmtH(best.coverage - billable)}</strong> non utilisées sur votre forfait 30h — valables 1 an à compter de la souscription.
        </div>
      )}

      {/* ── Cost breakdown (collapsible) ──────────────────────────────────── */}
      <details className="fold" style={{ marginTop: '1rem' }}>
        <summary>Détail des coûts <span className="fold-total">{fmt(totalBest)}</span></summary>
        <div className="fold-body">
          <table className="breakdown">
            <tbody>
              <tr><td>Cotisation annuelle</td><td>{fmt(p.membership.annual)}</td></tr>
              <tr><td>Licence FFVP annuelle</td><td>{fmt2(p.license.annual)}</td></tr>
              {/* 30h options: one row per individual package purchase */}
              {best.pkg30Items ? (
                <>
                  {best.pkg30Items.map((item, idx) => (
                    <tr key={idx}><td>{item.label}</td><td>{fmt(item.cost)}</td></tr>
                  ))}
                  {best.pkgCostExt > 0 && (
                    <tr><td>{best.labelExt}</td><td>{fmt(best.pkgCostExt)}</td></tr>
                  )}
                </>
              ) : (
                /* 15h / pay-per-hour: single package row */
                <tr>
                  <td>
                    {best.label}
                    {best.note && <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {extraFlightCost > 0 ? best.note.replace(/, \+[^·]+à l'heure/, '') : best.note}
                    </span>}
                  </td>
                  <td>{fmt(extraFlightCost > 0 ? best.pkgCost : best.cost)}</td>
                </tr>
              )}
              {/* Extra hours row */}
              {extraFlightCost > 0 && (
                <tr>
                  <td>
                    Heures hors forfait
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {fmtH(extraFlightHours)} × {fmt2(p.rates[plane])}
                    </span>
                  </td>
                  <td>{fmt(extraFlightCost)}</td>
                </tr>
              )}
              <tr>
                <td>
                  Instruction
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>{instrNote}</span>
                </td>
                <td>{fmt(instr)}</td>
              </tr>
              <tr>
                <td>
                  Remorquage
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>~{nFlights} vols × {towPer100h}/100h</span>
                </td>
                <td>{fmt(tow)}</td>
              </tr>
              {sf28Cost > 0 && (
                <tr><td>Moto-planeur SF 28 ({fmtH(sf28Hours)} × 60 €/h)</td><td>{fmt(sf28Cost)}</td></tr>
              )}
              <tr className="total"><td>Total saison</td><td>{fmt(totalBest)}</td></tr>
            </tbody>
          </table>
        </div>
      </details>

      {/* ── Package break-even hints ───────────────────────────────────────── */}
      {billable < be15h ? (
        <div className="info-box amber-box" style={{ marginTop: '.75rem' }}>
          Pour {fmtH(billable)} facturables, le paiement à l'heure est moins cher que le forfait 15h
          (seuil de rentabilité : {fmtH(be15h)}).
        </div>
      ) : (best.id === 'pkg15' || best.id === 'pkg15w') ? (
        <div className="info-box green-box" style={{ marginTop: '.75rem' }}>
          Le forfait 15h est votre meilleure option. Le forfait 30h ne devient intéressant
          qu'à partir de {fmtH(be30h)} heures facturables.
        </div>
      ) : best.id?.startsWith('pkg30') ? (
        <div className="info-box green-box" style={{ marginTop: '.75rem' }}>
          Pour {fmtH(billable)}, le forfait 30h est votre meilleure option
          (rentable dès {fmtH(be30h)} heures facturables).
        </div>
      ) : null}

      {/* ── Multi-package discount reminder ───────────────────────────────── */}
      {best.n30 >= 3 ? (
        <div className="info-box amber-box" style={{ marginTop: '.5rem' }}>
          <strong>Réduction multi-forfaits 30h incluse :</strong> −50 % sur le 3e puis −70 % sur le 4e et suivants.
        </div>
      ) : billable > 30 / COEFF[plane] ? (
        <div className="info-box amber-box" style={{ marginTop: '.5rem' }}>
          <strong>Réduction disponible :</strong> à partir du 3e forfait 30h dans la même année
          civile : <strong>−50 %</strong> (4e et suivants : −70 %). Le simulateur en tient compte
          automatiquement.
        </div>
      ) : null}

      <FootNotes />
    </>
  );
}
