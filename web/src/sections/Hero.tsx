import './Hero.css'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'

const PANELS = [
  {
    href: '#audiovisual',
    nombre: 'Producción audiovisual',
    meta: 'Comerciales · Documental · Eventos',
    clase: 'hero-panel-av',
    img: {
      src: '/assets/audiovisual/av-frame-ninos.webp',
      srcSet: '/assets/audiovisual/av-frame-ninos-800.webp 800w, /assets/audiovisual/av-frame-ninos.webp 1600w',
      width: 1600,
      height: 666,
      alt: 'Fotograma de una producción documental de Render: dos niños juegan frente a su casa',
    },
  },
  {
    href: '#marketing',
    nombre: 'Marketing digital',
    meta: 'Estrategia · Pauta · Contenidos',
    clase: 'hero-panel-mk',
  },
  {
    href: '#diseno',
    nombre: 'Diseño gráfico',
    meta: 'Branding · Editorial · Social media',
    clase: 'hero-panel-dg',
  },
] as const

export default function Hero() {
  return (
    <section id="inicio" className="hero-home" aria-labelledby="hero-title">
      <div className="hero-inner section-shell">
        <div className="hero-head">
          <h1 id="hero-title" className="hero-title">
            Historias que se ven. Marcas que crecen.
          </h1>
          <div className="hero-side">
            <p className="type-body">
              Producción audiovisual, marketing digital y diseño gráfico: un solo equipo en
              Chiquimula que planifica, produce y publica tu mensaje.
            </p>
            <div className="hero-actions">
              <a href="#portfolio" className="btn-solid">Ver proyectos</a>
              <Link to="/contacto/" className="btn-line">Cotizar</Link>
            </div>
          </div>
        </div>

        <ul className="hero-panels" aria-label="Servicios de Render">
          {PANELS.map((p) => (
            <li key={p.href} className={`hero-panel-item ${p.clase}`}>
              <a href={p.href} className="hero-panel">
                {'img' in p && p.img ? (
                  <img
                    className="hero-panel-img"
                    src={p.img.src}
                    srcSet={p.img.srcSet}
                    sizes="(max-width: 767px) 100vw, 46vw"
                    width={p.img.width}
                    height={p.img.height}
                    alt={p.img.alt}
                    fetchPriority="high"
                  />
                ) : null}
                <span className="hero-panel-label">
                  <span className="hero-panel-name">{p.nombre}</span>
                  <span className="hero-panel-meta">{p.meta}</span>
                </span>
                <span className="hero-panel-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
