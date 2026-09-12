import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay'
import { testimonios } from '@/content/site'

export default function Testimonios() {
  const [index, setIndex] = useState(0)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const go = (dir: number) => setIndex((i) => (i + dir + testimonios.length) % testimonios.length)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplay = useCarouselAutoplay(carouselRef, () => go(1), false, 10000)
  return (
    <section className="testimonials-section" aria-labelledby="testimonials-title">
      <div className="section-shell testimonials-layout">
        <h2 id="testimonials-title" className="type-section">La voz de quienes confían</h2>
        <div ref={carouselRef} {...autoplay.interaction} data-rotating={autoplay.running} role="region" aria-roledescription="carrusel" aria-label="Testimonios de clientes" className="testimonials-carousel"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1) }
          }}>
          <div className="testimonials-quote" onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY } }}
            onPointerCancel={() => { drag.current = null }}
            onPointerUp={(e) => {
              if (!drag.current) return
              const dx = e.clientX - drag.current.x
              const dy = e.clientY - drag.current.y
              drag.current = null
              if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
            }}>
            <figure key={index} className="quote-in" aria-live={autoplay.running ? "off" : "polite"} aria-atomic="true">
              <blockquote>“{testimonios[index]}”</blockquote>
              <figcaption>Cliente de RENDER</figcaption>
            </figure>
          </div>
          <div className="testimonials-controls">
            {!autoplay.reduced && <button type="button" className="autoplay-control"
              aria-label={`${autoplay.paused ? 'Activar' : 'Pausar'} avance automático de testimonios`}
              aria-pressed={autoplay.paused} onClick={autoplay.toggle}>
              {autoplay.paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              <span>{autoplay.paused ? 'Activar' : 'Pausar'}</span>
            </button>}
            <div className="flex gap-2">
              <button className="circle-control" type="button" aria-label="Testimonio anterior" onClick={() => go(-1)}><ArrowLeft size={20} aria-hidden="true" /></button>
              <button className="circle-control" type="button" aria-label="Testimonio siguiente" onClick={() => go(1)}><ArrowRight size={20} aria-hidden="true" /></button>
            </div>
            <span className="work-counter">{String(index + 1).padStart(2, '0')} <span>/ {String(testimonios.length).padStart(2, '0')}</span></span>
          </div>
        </div>
      </div>
    </section>
  )
}
