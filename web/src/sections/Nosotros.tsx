import { equipo } from '@/content/site'

export default function Nosotros() {
  return (
    <section id="nosotros" className="team-section section-shell">
      <header className="section-heading">
        <h2 className="type-section">¿Quién está detrás de Render?</h2>
        <p className="type-body">Un equipo de seis personas en Chiquimula que produce, diseña, edita y publica. Cada proyecto pasa por estas manos.</p>
      </header>
      <div className="team-grid">
        {equipo.map((p) => (
          <figure key={p.nombre}>
            <div className="team-photo"><img src={p.img} alt={p.nombre} width={640} height={690} loading="lazy" /></div>
            <figcaption><h3 className="type-project">{p.nombre}</h3><p>{p.cargo}</p></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
