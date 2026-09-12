import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { comercial, ongs, type Proyecto } from '@/content/site'

function ProjectCarousel({ title, projects, category, description }: {
  title: string; projects: Proyecto[]; category: 'ongs' | 'comercial'; description: string
}) {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [viewport, api] = useEmblaCarousel({ loop: true, duration: reduced ? 0 : 32 })
  const [selected, setSelected] = useState(0)
  const sync = useCallback(() => { if (api) setSelected(api.selectedScrollSnap()) }, [api])
  useEffect(() => {
    if (!api) return
    api.on('select', sync).on('reInit', sync)
    return () => { api.off('select', sync).off('reInit', sync) }
  }, [api, sync])
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const project = projects[selected]
  return (
    <section className="work-category" aria-labelledby={`work-${category}`}>
      <header className="work-category-heading">
        <h3 id={`work-${category}`}>{title}</h3>
        <p>{description}</p>
        <Link to={`/${category}/`} className="work-all">Ver todos los proyectos <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </header>
      <div className="work-carousel" role="region" aria-roledescription="carrusel" aria-label={`Proyectos ${title}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault()
            if (e.key === 'ArrowLeft') api?.scrollPrev()
            else api?.scrollNext()
          }
        }}>
        <div className="work-viewport" ref={viewport}>
          <div className="work-track">
            {projects.map((p, i) => (
              <div className={`work-slide ${selected === i ? 'is-selected' : ''}`} key={p.youtube}
                role="group" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${projects.length}: ${p.titulo}`}
                aria-hidden={selected !== i} inert={selected !== i}>
                <YoutubeEmbed key={`${p.youtube}-${selected === i}`} id={p.youtube} title={p.titulo} />
              </div>
            ))}
          </div>
        </div>
        <div className="work-details">
          <div className="work-copy" aria-live="polite" aria-atomic="true">
            <h4>{project.titulo}</h4>
            <p>{project.desc}</p>
          </div>
          <div className="work-controls">
            <span className="work-counter" aria-label={`Proyecto ${selected + 1} de ${projects.length}`}>
              {String(selected + 1).padStart(2, '0')} <span>/ {String(projects.length).padStart(2, '0')}</span>
            </span>
            <button className="circle-control" type="button" aria-label={`Proyecto anterior de ${title}`} onClick={() => api?.scrollPrev()}><ArrowLeft size={20} aria-hidden="true" /></button>
            <button className="circle-control" type="button" aria-label={`Proyecto siguiente de ${title}`} onClick={() => api?.scrollNext()}><ArrowRight size={20} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Portfolio() {
  return (
    <section id="portfolio" className="work-section" aria-labelledby="work-title">
      <div className="section-shell">
        <header className="section-heading work-heading">
          <h2 id="work-title" className="type-section">Nuestro trabajo</h2>
          <p className="type-body">Historias de personas.<br />Historias de marcas.</p>
        </header>
        <ProjectCarousel title="ONG" category="ongs" projects={ongs} description="Documentales y proyectos que ponen a las personas en el centro." />
        <ProjectCarousel title="Comercial" category="comercial" projects={comercial} description="Producciones que dan forma a la identidad de cada marca." />
      </div>
    </section>
  )
}
