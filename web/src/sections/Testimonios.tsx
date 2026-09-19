import { useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react'
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay'
import { testimonios } from '@/content/site'

function initials(name: string | null) {
  return (name ?? 'Cliente de RENDER').split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function SplitQuote({ text }: { text: string }) {
  return <span className="testimonial-split-text">{text.split(' ').map((word, i) => (
    <motion.span key={`${word}-${i}`} initial={{ opacity: 0, y: 18, filter: 'blur(7px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: .38, delay: i * .018, ease: [0.22, 1, 0.36, 1] }}>{word}{' '}</motion.span>
  ))}</span>
}

export default function Testimonios() {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const cursorX = useSpring(useMotionValue(0), { damping: 25, stiffness: 150 })
  const cursorY = useSpring(useMotionValue(0), { damping: 25, stiffness: 150 })

  function go(dir: number) { setIndex((current) => (current + dir + testimonios.length) % testimonios.length) }
  const autoplay = useCarouselAutoplay(carouselRef, () => go(1), false, 10000)

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = carouselRef.current?.getBoundingClientRect()
    if (!rect) return
    cursorX.set(event.clientX - rect.left)
    cursorY.set(event.clientY - rect.top)
  }

  const current = testimonios[index]

  return (
    <section className="testimonials-section" aria-labelledby="testimonials-title">
      <div className="section-shell testimonials-layout">
        <h2 id="testimonials-title" className="type-section">La voz de quienes confían</h2>
        <div ref={carouselRef} {...autoplay.interaction} data-rotating={autoplay.running} role="region" aria-roledescription="carrusel" aria-label="Testimonios de clientes" className="testimonials-carousel testimonial-motion-card" onMouseMove={handleMouseMove} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(event.key === 'ArrowRight' ? 1 : -1) }
        }}>
          <motion.div className="testimonial-magnetic-cursor" style={{ x: cursorX, y: cursorY }} animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : .4 }} transition={{ type: 'spring', damping: 20, stiffness: 200 }} aria-hidden="true">NEXT</motion.div>
          <div className="testimonial-index" aria-hidden="true"><AnimatePresence mode="wait"><motion.span key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{String(index + 1).padStart(2, '0')}</motion.span></AnimatePresence><span> / {String(testimonios.length).padStart(2, '0')}</span></div>
          <div className="testimonial-avatar-stack" aria-hidden="true">{testimonios.map((testimonial, i) => <span key={`${testimonial.name}-${i}`} className={i === index ? 'is-active' : ''}>{initials(testimonial.name)}</span>)}</div>
          <div className="testimonials-quote" onPointerDown={(event) => { drag.current = { x: event.clientX, y: event.clientY } }} onPointerCancel={() => { drag.current = null }} onPointerUp={(event) => {
            if (!drag.current) return
            const dx = event.clientX - drag.current.x
            const dy = event.clientY - drag.current.y
            drag.current = null
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
          }}>
            <AnimatePresence mode="wait"><motion.figure key={index} className="quote-in" aria-live={autoplay.running ? 'off' : 'polite'} aria-atomic="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .28 }}>
              <blockquote>“<SplitQuote text={current.quote} />”</blockquote>
              <figcaption><span className="testimonial-author-mark" aria-hidden="true">{initials(current.name)}</span><span><strong>{current.name || 'Cliente de RENDER'}</strong>{current.company && <small>{current.company}</small>}</span></figcaption>
            </motion.figure></AnimatePresence>
          </div>
          <div className="testimonial-progress" aria-hidden="true"><motion.span animate={{ width: `${((index + 1) / testimonios.length) * 100}%` }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }} /></div>
          <div className="testimonials-controls">
            {!autoplay.reduced && <button type="button" className="autoplay-control" aria-label={`${autoplay.paused ? 'Activar' : 'Pausar'} avance automático de testimonios`} aria-pressed={autoplay.paused} onClick={autoplay.toggle}>{autoplay.paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}<span>{autoplay.paused ? 'Activar' : 'Pausar'}</span></button>}
            <div className="flex gap-2"><button className="circle-control" type="button" aria-label="Testimonio anterior" onClick={() => go(-1)}><ArrowLeft size={20} aria-hidden="true" /></button><button className="circle-control" type="button" aria-label="Testimonio siguiente" onClick={() => go(1)}><ArrowRight size={20} aria-hidden="true" /></button></div>
          </div>
        </div>
      </div>
    </section>
  )
}
