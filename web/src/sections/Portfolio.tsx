import { useCallback, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Play, X } from 'lucide-react'
import SqueezeCarousel from '@/components/portfolio/squeeze-carousel'
import { projectsCommercial, projectsONG, type Project } from '@/content/projects'
import { youtubeId, youtubePosters } from '@/lib/youtube'
import './Portfolio.css'

export default function Portfolio() {
  const [playing, setPlaying] = useState<Project | null>(null)
  const section = useRef<HTMLElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const openVideo = useCallback((project: Project) => {
    if (!youtubeId(project.youtubeUrl)) return
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setPlaying(project)
  }, [])
  const slidesFor = (projects: Project[]) => projects.flatMap((project, index) => {
    const id = youtubeId(project.youtubeUrl)
    if (!id) return []
    const [image, ...imageFallbacks] = youtubePosters(id)
    return [{ id: `${id}-${index}`, title: project.title, description: `${project.client} · ${project.category}`,
      image, imageFallbacks, imageAlt: '', action: 'Ver video', onAction: () => openVideo(project),
      overlay: <span className="sq-play"><Play size={26} fill="currentColor" aria-hidden="true" /></span>,
    }]
  })
  return (
    <section ref={section} id="portafolio" className="portfolio-squeeze" aria-labelledby="work-title">
      <span id="portfolio" className="portfolio-anchor" aria-hidden="true" />
      <span id="trabajo" className="portfolio-anchor" aria-hidden="true" />
      <div className="section-shell">
        <header className="section-heading">
          <h2 id="work-title" className="type-section">Nuestro trabajo</h2>
        </header>
        <section id="proyectos-comerciales" className="portfolio-group" aria-labelledby="commercial-title">
          <h3 id="commercial-title" className="type-section">Comerciales</h3>
          <SqueezeCarousel slides={slidesFor(projectsCommercial)} autoplay={playing === null} interval={3000} label="Proyectos comerciales" />
        </section>
        <section id="proyectos-ong" className="portfolio-group" aria-labelledby="ong-title">
          <h3 id="ong-title" className="type-section">ONG</h3>
          <SqueezeCarousel slides={slidesFor(projectsONG)} autoplay={playing === null} interval={3000} label="Proyectos de ONG" />
        </section>
      </div>
      <Dialog.Root open={playing !== null} onOpenChange={open => { if (!open) setPlaying(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="portfolio-video-backdrop" />
          <Dialog.Content className="portfolio-video-modal" onCloseAutoFocus={event => {
            event.preventDefault()
            const target = opener.current?.isConnected ? opener.current : section.current?.querySelector<HTMLElement>('[data-front="true"]')
            target?.focus({ preventScroll: true })
          }}>
            <div className="portfolio-video-heading">
              <div><Dialog.Title>{playing?.title}</Dialog.Title><Dialog.Description>{playing?.client} · {playing?.category}</Dialog.Description></div>
              <Dialog.Close className="portfolio-video-close" aria-label="Cerrar video"><X size={24} aria-hidden="true" /></Dialog.Close>
            </div>
            {playing && <iframe key={playing.youtubeUrl} title={playing.title} src={`https://www.youtube-nocookie.com/embed/${youtubeId(playing.youtubeUrl)}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  )
}
