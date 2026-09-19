"use client";

// Adapted from the 21st Squeeze Carousel supplied by the client.
// Retains the strip, slats, append/prepend/settle cycle.
// The active column is now 1, between two symmetric preview panels.
import {
  type ComponentProps, type CSSProperties, type KeyboardEvent, type ReactNode,
  useCallback, useEffect, useId, useLayoutEffect, useRef, useState,
} from 'react'
import { ArrowLeft, ArrowRight, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import './squeeze-carousel.css'

export type SqueezeSlide = {
  id?: string | number
  title: string
  description?: string
  image?: string
  imageFallbacks?: string[]
  imageAlt?: string
  background?: string
  overlay?: ReactNode
  action?: string
  href?: string
  target?: string
  onAction?: () => void
}
type Size = number | string
const size = (value: Size) => typeof value === 'number' ? `${value}px` : value
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))
type Card = { key: number; slide: number }

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    const read = () => setReduced(query.matches)
    query.addEventListener('change', read)
    return () => query.removeEventListener('change', read)
  }, [])
  return reduced
}

export type SqueezeCarouselProps = {
  slides: SqueezeSlide[]
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  height?: Size
  slatWidth?: Size
  slatGap?: Size
  gap?: Size
  radius?: Size
  duration?: number
  autoplay?: boolean
  interval?: number
  controls?: boolean
  accent?: string
  accentForeground?: string
  label?: string
  panelClassName?: string
} & Omit<ComponentProps<'div'>, 'onSelect'>

export function SqueezeCarousel({
  slides, defaultIndex = 0, onIndexChange,
  height = 'clamp(180px, 38cqi, 500px)', slatWidth = 8, slatGap = 8, gap = 16,
  radius = 12, duration = 850, autoplay = false, interval = 3000,
  controls = true, accent = '#f7ac42', accentForeground = '#0f0f0f',
  label = 'Nuestro trabajo', panelClassName, className, style, ...props
}: SqueezeCarouselProps) {
  const count = slides.length
  const wrap = useCallback((i: number) => count ? ((i % count) + count) % count : 0, [count])
  const slats = clamp(count - 4, 1, 3)
  const visible = 4 + slats
  const reduced = useReducedMotion()
  const ms = reduced ? 0 : duration
  const ids = useId()
  const seed = useRef(visible)
  const strip = useRef<HTMLDivElement>(null)
  const [cards, setCards] = useState<Card[]>(() => Array.from({ length: visible }, (_, p) => ({ key: p, slide: wrap(defaultIndex + p - 1) })))
  const [column, setColumn] = useState(0)
  const columnRef = useRef(0)
  const forward = useRef(true)
  const [slid, setSlid] = useState(0)
  const [still, setStill] = useState(false)
  const open = cards[1 - column]?.slide ?? defaultIndex
  const timers = useRef<number[]>([])
  const moving = useRef(false)
  const keyboardFocus = useRef(false)

  useEffect(() => {
    const scheduled = timers.current
    return () => { scheduled.forEach(clearTimeout); timers.current.forEach(clearTimeout) }
  }, [])

  const settle = useCallback(() => {
    setCards(strip => forward.current ? strip.slice(-visible) : strip.slice(0, visible))
    columnRef.current = 0
    setColumn(0)
    setSlid(0)
    setStill(true)
    moving.current = false
  }, [visible])

  useLayoutEffect(() => {
    if (!still) return
    if (keyboardFocus.current) strip.current?.querySelector<HTMLButtonElement>('[data-front="true"]')?.focus({ preventScroll: true })
    keyboardFocus.current = false
    const id = requestAnimationFrame(() => setStill(false))
    return () => cancelAnimationFrame(id)
  }, [still])

  const step = useCallback((by: number) => {
    // Avoid a second direction change halfway through the original settle cycle.
    if (count < 2 || by === 0 || moving.current) return
    moving.current = true
    timers.current.forEach(clearTimeout)
    timers.current = []
    forward.current = by > 0
    const keys = Array.from({ length: Math.abs(by) }, () => seed.current++)
    if (by > 0) {
      setCards(strip => [...strip, ...keys.map((key, k) => ({ key, slide: wrap(strip[strip.length - 1].slide + 1 + k) }))])
      columnRef.current -= by
      setColumn(columnRef.current)
      setSlid(s => s - by)
    } else {
      setCards(strip => [...keys.map((key, k) => ({ key, slide: wrap(strip[0].slide - (-by - k)) })), ...strip])
      setSlid(s => s + by)
      setStill(true)
      timers.current.push(window.setTimeout(() => setSlid(0), 0))
    }
    timers.current.push(window.setTimeout(settle, ms + 20))
  }, [count, ms, settle, wrap])

  const go = useCallback((to: number) => {
    if (to === open) return
    const distance = wrap(to - open)
    step(distance <= count / 2 ? distance : distance - count)
  }, [open, count, step, wrap])

  useEffect(() => { onIndexChange?.(open) }, [open, onIndexChange])

  // The video modal is the only autoplay pause condition. Reduced motion removes transitions.
  const running = autoplay && count > 1
  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => step(1), interval)
    return () => clearTimeout(timer)
  }, [running, open, interval, step])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    keyboardFocus.current = true
    if (event.key === 'Home') go(0)
    else if (event.key === 'End') go(count - 1)
    else step(event.key === 'ArrowRight' ? 1 : -1)
  }
  if (!count) return null
  const slat = size(slatWidth)
  const widthOf = (col: number) => {
    if (col === 1) return 'var(--sq-hero)'
    if (col === 0 || col === 2) return 'var(--sq-peek)'
    return slat
  }
  const vars = {
    '--sq-h': size(height), '--sq-gap': size(gap), '--sq-slat-gap': size(slatGap),
    '--sq-radius': size(radius), '--sq-ms': `${ms}ms`,
    '--sq-ease': 'cubic-bezier(0.45, 0, 0.25, 1)', '--sq-fill': accent, '--sq-on-fill': accentForeground,
    // Original 16:9 sizing; clamp only the narrow-screen case to avoid negative columns.
    '--sq-hero': 'min(calc(var(--sq-h) * 16 / 9), 74cqi)',
    '--sq-peek': 'max(8px, calc((100cqi - var(--sq-hero)) / 2 - var(--sq-gap)))',
  } as CSSProperties
  const move = `translateX(calc(${slid} * (${slat} + var(--sq-gap))))`

  return (
    <div {...props} className={cn('squeeze-carousel', className)} style={{ containerType: 'inline-size', ...vars, ...style }}
      role="region" aria-roledescription="carrusel" aria-label={label} data-index={open} data-rotating={running}
      >
      {controls && count > 1 && <div className="sq-controls">
        <span className="sq-counter">{String(open + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
        <Arrow back label="Proyecto anterior" onClick={() => step(-1)} />
        <Arrow label="Proyecto siguiente" onClick={() => step(1)} />
      </div>}
      <div className="sq-viewport" style={{ height: 'var(--sq-h)' }}>
        <div ref={strip} role="group" aria-label="Proyectos en video" onKeyDown={onKeyDown} className="sq-strip"
          style={{ transform: move, transition: still ? 'none' : 'transform var(--sq-ms) var(--sq-ease)' }}>
          {cards.map((card, place) => {
            const col = place + column
            const slide = slides[card.slide]
            const front = col === 1
            return <button key={card.key} type="button" data-front={front} aria-label={`Ver video: ${slide.title}`} tabIndex={front ? 0 : -1}
              onClick={() => { if (slide.onAction) slide.onAction(); else if (col !== 1) step(col - 1) }}
              className={cn('sq-panel', panelClassName)}
              style={{ width: widthOf(col), height: front ? '100%' : '72%', marginLeft: place === 0 ? 0 : col < 4 ? 'var(--sq-gap)' : 'var(--sq-slat-gap)',
                borderRadius: `min(var(--sq-radius), calc(${widthOf(col)} / 2))`, transitionProperty: 'width, height, margin-left',
                transitionDuration: still ? '0s' : 'var(--sq-ms)', transitionTimingFunction: 'var(--sq-ease)' }}>
              <div className="sq-panel-media" style={{ opacity: front ? 1 : 0.72,
                transform: `translateY(${front || reduced ? 0 : 40}px)`,
                transition: still ? 'none' : 'opacity var(--sq-ms) var(--sq-ease), transform var(--sq-ms) var(--sq-ease)' }}>
                <Picture key={slide.image ?? slide.id} slide={slide} />
              </div>
              {slide.overlay && <span aria-hidden="true" className="sq-overlay" style={{ opacity: front ? 1 : 0, transition: 'opacity var(--sq-ms) var(--sq-ease)' }}>{slide.overlay}</span>}
            </button>
          })}
        </div>
      </div>
      <div id={`${ids}-panel`} aria-live={running ? 'off' : 'polite'} aria-atomic="true" className="sq-captions">
        {slides.map((slide, i) => {
          const shown = i === open
          return <div key={slide.id ?? i} aria-hidden={!shown} inert={!shown} className="sq-caption"
            style={{ opacity: shown ? 1 : 0, visibility: shown ? 'visible' : 'hidden', pointerEvents: shown ? 'auto' : 'none',
              transform: `translateY(${shown || reduced ? 0 : 40}px)`,
              transition: 'opacity var(--sq-ms) var(--sq-ease), transform var(--sq-ms) var(--sq-ease), visibility var(--sq-ms)' }}>
            <div><h4>{slide.title}</h4>{slide.description && <p>{slide.description}</p>}</div>
            {slide.action && <Action slide={slide} shown={shown} />}
          </div>
        })}
      </div>
    </div>
  )
}

function Picture({ slide }: { slide: SqueezeSlide }) {
  const [fallback, setFallback] = useState(0)
  const sources = [slide.image, ...(slide.imageFallbacks ?? [])].filter(Boolean) as string[]
  const box = { width: 'var(--sq-hero)', minWidth: '100%' } as const
  if (sources[fallback]) return <img src={sources[fallback]} alt={slide.imageAlt ?? ''} draggable={false} width={1280} height={720}
    loading="lazy" decoding="async" className="sq-picture" style={box}
    onError={() => setFallback(index => index + 1)}
    onLoad={event => { if (event.currentTarget.naturalWidth <= 120 && fallback < sources.length - 1) setFallback(index => index + 1) }} />
  return <span aria-hidden="true" className="sq-picture sq-poster-fallback" style={{ background: slide.background, ...box }}>Ver video</span>
}

function Arrow({ back = false, label, onClick }: { back?: boolean; label: string; onClick: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className="sq-arrow">
    {back ? <ArrowLeft size={20} aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}
  </button>
}
function Action({ slide, shown }: { slide: SqueezeSlide; shown: boolean }) {
  const inside = <>{slide.action}<Play size={16} aria-hidden="true" /></>
  if (slide.href) return <a href={slide.href} target={slide.target} rel={slide.target === '_blank' ? 'noreferrer' : undefined} tabIndex={shown ? 0 : -1}
    onClick={slide.onAction ? event => { event.preventDefault(); slide.onAction?.() } : undefined} className="sq-action">{inside}</a>
  return <button type="button" tabIndex={shown ? 0 : -1} onClick={slide.onAction} className="sq-action">{inside}</button>
}
export default SqueezeCarousel
