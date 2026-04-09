/**
 * FootNotes.jsx — Regulatory footnotes block
 *
 * Rendered at the bottom of every scenario result panel.
 * Static content — no props needed.
 */

export default function FootNotes() {
  return (
    <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
      <p style={{
        fontSize: '10px', fontWeight: 600, letterSpacing: '.08em',
        textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '.6rem',
      }}>
        Notes importantes
      </p>
      <ul style={{
        fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.8,
        paddingLeft: '1.1rem', listStyle: 'disc',
      }}>
        <li>
          Les heures au-delà de{' '}
          <strong style={{ color: 'var(--text-mid)' }}>3h (moins de 25 ans)</strong> ou{' '}
          <strong style={{ color: 'var(--text-mid)' }}>4h (25 ans et plus)</strong>{' '}
          lors du même vol ne nécessitent pas de participation aux frais.
        </li>
        <li>
          Le <strong style={{ color: 'var(--text-mid)' }}>Marianne</strong> est facturé au tarif bois et toile
          pour les vols d'instruction des élèves non encore brevetés SPL.
        </li>
        <li>
          Le <strong style={{ color: 'var(--text-mid)' }}>supplément d'instruction</strong> s'applique du
          1er avril au 30 septembre uniquement — offert hors de cette période.
        </li>
        <li>
          Le <strong style={{ color: 'var(--text-mid)' }}>forfait 30h est renouvelable</strong> dans la même
          année civile : <strong style={{ color: 'var(--text-mid)' }}>−50 %</strong> sur le 3e forfait,{' '}
          <strong style={{ color: 'var(--text-mid)' }}>−70 %</strong> sur les suivants.
          Contacter le club pour en bénéficier.
        </li>
        <li>
          Les <strong style={{ color: 'var(--text-mid)' }}>forfaits</strong> sont payables en trois fois
          et valables 1 an à compter de la souscription.
        </li>
        <li>
          Le <strong style={{ color: 'var(--text-mid)' }}>forfait 15h***</strong> est utilisable uniquement
          dans l'année civile de souscription (1er janvier – 31 décembre) et n'est pas renouvelable
          dans la même année.
        </li>
        <li>
          Les <strong style={{ color: 'var(--text-mid)' }}>coûts de remorquage et de dépannage aérien</strong>
          sont susceptibles d'être révisés en fonction du prix du carburant.
        </li>
        <li>
          La <strong style={{ color: 'var(--text-mid)' }}>cotisation à la journée</strong> ne peut être
          délivrée qu'à un pilote de planeur inscrit dans un autre club et titulaire d'une licence
          FFVP obtenue par ce club.
        </li>
        <li>
          <strong style={{ color: 'var(--text-mid)' }}>Licence FFVP* :</strong> coût de base incluant RC
          (Responsabilité Civile Aéronef) et PJ (Protection Juridique). Options disponibles :
          Individuelle Accident (IA), Assistance Rapatriement (AR), Frais médicaux et thérapie sportive.
        </li>
      </ul>
    </div>
  );
}
