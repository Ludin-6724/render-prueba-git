import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { CircleDashed, Check } from 'lucide-react'
import { proceso } from '@/content/site'
import './Proceso.css'

// Keep the supplied 21st card, nodes, beam and blur reveal, driven by page scroll.
function ProcessStep({ step, index, progress, reduced, active }: { step: string; index: number; progress: MotionValue<number>; reduced: boolean; active: number }) {
  const start = index * 0.15
  const opacity = useTransform(progress, [start, start + 0.06], [0, 1])
  const y = useTransform(progress, [start, start + 0.06], [10, 0])
  const filter = useTransform(progress, [start, start + 0.06], ['blur(8px)', 'blur(0px)'])
  const scale = useTransform(progress, [start, start + 0.06], [0.85, 1])
  const animated = !reduced && index > 0
  return <motion.li aria-hidden={!reduced && active < index} data-step={index + 1} data-active={active === index}
    style={animated ? { opacity, y, filter } : undefined}>
    <span className="process-node" aria-hidden="true"><motion.span style={animated ? { scale } : undefined}><Check size={15} /></motion.span></span>
    <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
    <p className="type-body">{step}</p>
  </motion.li>
}

export default function Proceso() {
  const reduced = !!useReducedMotion()
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)
  const [listOffset, setListOffset] = useState(0)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start 96px', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 })
  const rotation = useTransform(progress, [0, 1], [0, 360])
  const beamY = useTransform(progress, [0, 0.81], [0, 600])
  useMotionValueEvent(progress, 'change', value => setActive(Math.min(5, Math.max(0, Math.floor(value / 0.15)))))
  useEffect(() => {
    if (!viewport.current || !list.current || reduced) return
    const observer = new ResizeObserver(() => {
      const row = list.current?.children[active] as HTMLElement | undefined
      if (row && viewport.current) setListOffset(Math.max(0, row.offsetTop + row.offsetHeight - viewport.current.clientHeight + 8))
    })
    observer.observe(viewport.current)
    observer.observe(list.current)
    return () => observer.disconnect()
  }, [active, reduced])
  const id = useId().replace(/:/g, '')
  return <section ref={section} id="proceso" className="render-process" data-reduced={reduced} data-active-step={active + 1} aria-labelledby="process-title">
    <div className="process-stage">
    <div className="process-heading">
      <p className="type-meta">CÓMO TRABAJAMOS</p>
      <h2 id="process-title" className="type-section">EL PROCESO</h2>
      <Link to="/contacto/" className="process-quote">COTIZAR UN TRABAJO <span aria-hidden="true">→</span></Link>
    </div>
    <div className="process-card">
      <div className="process-status">
        <motion.span style={reduced ? undefined : { rotate: rotation }}><CircleDashed size={24} aria-hidden="true" /></motion.span>
        <p className="type-body">De la primera idea a la entrega final.</p>
      </div>
      <div className="process-path" aria-hidden="true">
        <svg viewBox="0 0 52 600" preserveAspectRatio="none">
          <path d="M 4 0 v 35 l 9 25 v 540" fill="none" stroke="#dedbd5" />
          <g mask={`url(#${id}-mask)`}><motion.circle className="process-beam" cx="13" cy={reduced ? 600 : beamY} r="50" fill={`url(#${id}-orange)`} /></g>
          <defs>
            <mask id={`${id}-mask`}><path d="M 4 0 v 35 l 9 25 v 540" fill="none" stroke="white" strokeWidth="2" /></mask>
            <radialGradient id={`${id}-orange`}><stop offset="0%" stopColor="#f7ac42" /><stop offset="100%" stopColor="#f7ac42" stopOpacity="0" /></radialGradient>
          </defs>
        </svg>
      </div>
      <div className="process-list-window" ref={viewport}>
        <motion.ol ref={list} className="process-steps" animate={{ y: reduced ? 0 : -listOffset }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 40, damping: 20 }}>
          {proceso.map((step, index) => <ProcessStep key={step} step={step} index={index} progress={progress} reduced={reduced} active={active} />)}
        </motion.ol>
      </div>
    </div>
    </div>
  </section>
}
