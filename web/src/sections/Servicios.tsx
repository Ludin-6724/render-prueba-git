import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { servicios } from '@/content/site'

export default function Servicios() {
  return (
    <section id="servicios" className="services-section section-shell">
      <header className="section-heading">
        <h2 className="type-section">Servicios</h2>
        <p className="type-body">Tres disciplinas, un solo equipo. Se planifica, se produce y se publica bajo el mismo techo.</p>
      </header>
      <div className="services-list">
        {servicios.map((s) => (
          <article key={s.n} id={s.slug} className="service-row scroll-mt-24">
            <h3 className="type-project"><Link to="/servicios/">{s.titulo}<ArrowUpRight size={22} aria-hidden="true" /></Link></h3>
            <p className="type-body">{s.desc}</p>
            <ul className="service-tags" aria-label={`Áreas de ${s.titulo}`}>
              {s.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <Link to="/servicios/" className="text-link">Ver el detalle de cada servicio <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </section>
  )
}
