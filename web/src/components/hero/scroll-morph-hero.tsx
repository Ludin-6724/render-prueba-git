"use client";

// Adapted from Scroll Morph Hero by Prashant Som (21st), supplied by the client.
// Retains virtual scroll and circle interpolation; spacing and spring timing are adapted.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { CameraSequence, CAMERA_FRAMES } from '@/lib/cameraSequence'
import images from '@/content/scroll-morph-images.json'
import MorphPhotoViewer, { type MorphPhoto, type OpenMorphPhoto } from './morph-photo-viewer'
import './scroll-morph-hero.css'

const TOTAL_IMAGES = 20
const ORIGINAL_MORPH_SPRING = { stiffness: 40, damping: 20 }
const AUDIOVISUAL_START = 180
const CAMERA_MOTION_START = 360
const CAMERA_TURN_MID = 810
const CAMERA_MOTION_END = 1260
const PHOTO_HANDOFF_START = 1380
const PHOTO_HANDOFF_END = 1640
const DESIGN_IMAGES = images.filter(image => image.service === 'diseno')
const uniqueDesign = DESIGN_IMAGES.filter((image, index, list) => list.findIndex(item => item.src === image.src) === index)
const FEATURED_IMAGES = {
  // Keep the fold ring dense, but make the audiovisual act a short, curated
  // sequence so the handoff reaches Marketing without exhausting the scroll.
  audiovisuales: [
    ...images.filter(image => image.service === 'audiovisuales' && /Julio y Kenny/i.test(image.source)),
    ...images.filter(image => image.service === 'audiovisuales' && !/fondo|Julio y Kenny/i.test(image.source)).slice(0, 7),
  ],
  marketing: images.filter(image => image.service === 'marketing').sort((a, b) =>
    Number(b.src.endsWith('marketing-01.webp')) - Number(a.src.endsWith('marketing-01.webp'))),
  // Until more design photos exist, repeat the available artwork so the act has three slides.
  diseno: uniqueDesign.length >= 3 ? uniqueDesign : Array.from({ length: 3 }, (_, i) => uniqueDesign[i % Math.max(1, uniqueDesign.length)]),
}
const MARKETING_START = PHOTO_HANDOFF_END + FEATURED_IMAGES.audiovisuales.length * 100 + 80
const DESIGN_START = MARKETING_START + 280 + FEATURED_IMAGES.marketing.length * 120 + 80
const MAX_SCROLL = DESIGN_START + 280 + Math.max(320, FEATURED_IMAGES.diseno.length * 120)
// Every input device follows the same discrete waypoints. Keeping one list for
// wheel and touch prevents a large delta or a quick flick from skipping photos.
const SCROLL_STEPS = [
  0,
  AUDIOVISUAL_START,
  CAMERA_MOTION_START,
  CAMERA_TURN_MID,
  CAMERA_MOTION_END,
  PHOTO_HANDOFF_START,
  PHOTO_HANDOFF_END,
  ...FEATURED_IMAGES.audiovisuales.slice(1).map((_, index) => PHOTO_HANDOFF_END + (index + 1) * 100),
  MARKETING_START,
  ...FEATURED_IMAGES.marketing.map((_, index) => MARKETING_START + 320 + index * 120),
  DESIGN_START,
  ...FEATURED_IMAGES.diseno.slice(1).map((_, index) => DESIGN_START + (index + 1) * 120),
  MAX_SCROLL,
].filter((point, index, points) => index === 0 || point > points[index - 1])
// Same camera beats on phone and desktop: appear, half turn, full turn, then
// one spring into the photos. Skip the empty dock-only beat on small screens.
const stepsForWidth = (width: number) => SCROLL_STEPS.filter(point => {
  if (point === PHOTO_HANDOFF_START) return false
  if (width < 768 && point === AUDIOVISUAL_START) return false
  return true
})
const IMG_WIDTH = 60
const IMG_HEIGHT = 85
const LOGO = '/brand/logo.svg'
const ISOTYPE = '/brand/isotipo.svg'
const BRAND_LINE = 'Producimos. Diseñamos. Hacemos que se vea.'
const BRAND_BEAT = 0.45
const CAMERA = '/assets/camera/turn-v1/desktop/000.webp'
const SERVICES = [
  { id: 'audiovisuales', title: 'AUDIOVISUALES', sub: 'Capturamos la esencia de tu mensaje mediante producción audiovisual profesional. Creamos videos que inspiran, comunican y elevan la identidad de tu marca, con un enfoque en calidad y creatividad.', tags: 'Comerciales · Documental · Eventos · Reels', start: AUDIOVISUAL_START },
  { id: 'marketing', title: 'MARKETING DIGITAL', sub: 'Impulsamos tu negocio en el mundo digital con estrategias de marketing innovadoras. Gestionamos redes sociales, campañas publicitarias y contenido visual que aumenta tu visibilidad y conexión con el público.', tags: 'Estrategia · Pauta digital · Contenidos · Analítica', start: MARKETING_START },
  { id: 'diseno', title: 'DISEÑO GRÁFICO', sub: 'Diseñamos materiales visuales que destacan. Desde branding hasta contenido para redes sociales, nuestro diseño gráfico refleja la esencia de tu marca, conectando visualmente con tu audiencia.', tags: 'Branding · Editorial · Campañas · Social media', start: DESIGN_START },
].map(service => ({ ...service, images: images.filter(image => image.service === service.id) }))
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t
const clamp = (value: number) => Math.min(Math.max(value, 0), MAX_SCROLL)
type Target = { x: number; y: number; rotation: number; scale: number; opacity: number; zIndex: number; width?: number; height?: number }

function FlipCard({ src, label, target, interactive, onOpen, onHover, slot, relative }: { src: string; label: string; target: Target; interactive: boolean; onOpen: OpenMorphPhoto; onHover: (hovering: boolean) => void; slot?: number; relative?: number }) {
  return (
    <motion.button
      type="button" className={`morph-card${slot !== undefined ? ' morph-card-service' : ''}${relative === 0 ? ' morph-card-active' : ''}`} aria-label={`Ampliar foto: ${label}`}
      data-photo-slot={slot} data-relative={relative}
      disabled={!interactive || target.opacity < 0.25}
      onClick={event => onOpen(src, label, event.currentTarget)}
      onPointerEnter={() => onHover(true)} onPointerLeave={() => onHover(false)}
      initial={false}
      animate={{ x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity, width: target.width ?? IMG_WIDTH, height: target.height ?? IMG_HEIGHT }}
      transition={{ type: 'spring', stiffness: 40, damping: 15 }}
      style={{ zIndex: target.zIndex, transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      <AnimatePresence initial={false}>
        <motion.img key={src} src={src} alt="" width={IMG_WIDTH} height={IMG_HEIGHT}
          loading={relative !== undefined && Math.abs(relative) <= 2 ? 'eager' : 'lazy'} decoding="async" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} />
      </AnimatePresence>
    </motion.button>
  )
}

/** Original camera sequence: hold the opening pose, explode/assemble with scroll, then hand off to photos. */
function ScrollCamera({ scroll }: { scroll: MotionValue<number> }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const opacity = useTransform(scroll, [60, AUDIOVISUAL_START, PHOTO_HANDOFF_START, PHOTO_HANDOFF_END], [0, 1, 1, 0])
  const y = useTransform(scroll, [PHOTO_HANDOFF_START, PHOTO_HANDOFF_END], [0, 16])
  const scale = useTransform(scroll, [PHOTO_HANDOFF_START, PHOTO_HANDOFF_END], [1, 0.88])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const variant = matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop'
    const player = new CameraSequence(canvas, variant, frame => {
      wrap.dataset.ready = 'true'
      wrap.dataset.frame = String(frame)
    }, () => { wrap.dataset.ready = 'false' })
    let inView = true
    const visible = () => player.setVisible(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      visible()
    })
    observer.observe(wrap)
    document.addEventListener('visibilitychange', visible)
    const seek = (value: number) => {
      const progress = Math.min(1, Math.max(0, (value - CAMERA_MOTION_START) / (CAMERA_MOTION_END - CAMERA_MOTION_START)))
      const frame = progress * (CAMERA_FRAMES - 1)
      wrap.dataset.targetFrame = String(Math.round(frame))
      player.seek(frame)
    }
    seek(scroll.get())
    const unsubscribe = scroll.on('change', seek)
    return () => {
      unsubscribe()
      observer.disconnect()
      document.removeEventListener('visibilitychange', visible)
      player.dispose()
    }
  }, [scroll])

  return (
    <motion.div ref={wrapRef} className="morph-camera" style={{ opacity, y, scale }} role="img" aria-label="Cámara del equipo de producción audiovisual de RENDER" data-ready="false">
      <img src={CAMERA} width={1280} height={720} alt="" fetchPriority="high" />
      <canvas ref={canvasRef} width={1280} height={720} aria-hidden="true" />
    </motion.div>
  )
}

/** One shared clock drives the official R, wordmark reveal and ring launch. */
function BrandIntro({ time, dock, lineOffset }: { time: MotionValue<number>; dock: MotionValue<number>; lineOffset: number }) {
  const rScale = useTransform(time, [0, BRAND_BEAT, 0.58, 0.82], [1, 1, 1.13, 0.94])
  const rOpacity = useTransform(time, [0.58, 0.84], [1, 0])
  const wordOpacity = useTransform(time, [0.62, 0.9], [0, 1])
  const wordReveal = useTransform(time, [0.62, 1.18], ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'])
  const wordScale = useTransform(time, [0.62, 0.86, 1.18], [0.96, 1.025, 1])
  const lineReveal = useTransform(time, [1, 1.4], [0, 1])
  const lineOpacity = useTransform(() => lineReveal.get() * Math.max(0, 1 - dock.get() * 3))
  return <>
    <h1 className="morph-title morph-brand" aria-label="RENDER">
      <motion.img className="morph-isotype" src={ISOTYPE} alt="" width={764} height={950}
        fetchPriority="high" style={{ opacity: rOpacity, scale: rScale }} />
      <motion.img className="morph-logo" src={LOGO} alt="" width={1211} height={465}
        fetchPriority="high" style={{ opacity: wordOpacity, clipPath: wordReveal, scale: wordScale }} />
    </h1>
    <motion.p className="morph-editorial" style={{ opacity: lineOpacity, top: `calc(50% + ${lineOffset}px)` }}>{BRAND_LINE}</motion.p>
  </>
}

function StaticServices({ onPhotoOpen }: { onPhotoOpen: OpenMorphPhoto }) {
  return (
    <section id="inicio" className="morph-static section-shell" aria-label="Servicios de RENDER Multimedia">
      <h1 className="morph-title"><img className="morph-logo" src={LOGO} alt="RENDER" width={1211} height={465} /></h1>
      <p className="morph-editorial">{BRAND_LINE}</p>
      {SERVICES.map(service => (
        <div id={service.id} className="morph-static-service" key={service.id}>
          <h2 className="type-section">{service.title}</h2>
          <p className="type-body">{service.sub}</p>
          <p className="morph-tags">{service.tags}</p>
          <div className="morph-static-photos">
            {service.images.map((image, i) => <button type="button" key={image.src} aria-label={`Ampliar foto: ${service.title} ${i + 1}`} onClick={event => onPhotoOpen(image.src, `${service.title}: trabajo de RENDER ${i + 1}`, event.currentTarget)}><img src={image.src} alt="" width={240} height={300} loading="lazy" /></button>)}
          </div>
        </div>
      ))}
    </section>
  )
}

function AnimatedServices({ onPhotoOpen, photoOpen }: { onPhotoOpen: OpenMorphPhoto; photoOpen: boolean }) {
  const containerRef = useRef<HTMLElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const [copyHeight, setCopyHeight] = useState(180)
  const [navSlot, setNavSlot] = useState({ x: 76, y: 40, width: 104, bottom: 80 })
  const rewinding = useRef(false)
  const rewindAnimation = useRef<ReturnType<typeof animate> | null>(null)
  const scrollRef = useRef(0)
  const designSlideRef = useRef(0)
  const designVisibleSwipesRef = useRef(0)
  const designHoldUntilRef = useRef(0)
  const [containerSize, setContainerSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const [act, setAct] = useState(0)
  const [showCamera, setShowCamera] = useState(true)
  const virtualScroll = useMotionValue(0)
  const presentationScroll = useSpring(virtualScroll, ORIGINAL_MORPH_SPRING)
  const dockTarget = useTransform(presentationScroll, [0, 180], [0, 1])
  const dock = useSpring(dockTarget, { stiffness: 90, damping: 22, restDelta: 0.001, restSpeed: 0.001 })
  const brandTime = useMotionValue(0)
  const inView = useRef(true)
  const hoveringPhoto = useRef(false)
  const [ringInteractive, setRingInteractive] = useState(true)
  const [idleAngle, setIdleAngle] = useState(0)
  useAnimationFrame((_, delta) => {
    if (document.hidden || !inView.current || photoOpen || hoveringPhoto.current) return
    if (rewinding.current) {
      if (virtualScroll.get() > 0.01 || dock.get() > 0.01 || window.scrollY > 2) return
      rewinding.current = false
      brandTime.set(0)
      setIdleAngle(0)
      containerRef.current?.setAttribute('data-intro-replayed', 'true')
      return
    }
    if (virtualScroll.get() > 0) {
      // Scrolling can interrupt the intro immediately; returning never replays the beat.
      if (brandTime.get() < 1.4) brandTime.set(1.4)
      return
    }
    const time = brandTime.get() + Math.min(delta, 50) / 1000
    brandTime.set(time)
    if (time >= 1.4) {
      const speed = containerSize.width < 768 ? 22 : 12
      setIdleAngle(angle => angle + Math.min(delta, 50) / 1000 * speed)
    }
  })
  // Original circle → arc interpolation, 40/20 springs and continuous scroll rotation.
  const morphProgress = useTransform(virtualScroll, [AUDIOVISUAL_START, 650], [0, 1])
  const smoothMorph = useSpring(morphProgress, ORIGINAL_MORPH_SPRING)
  const scrollRotate = useTransform(virtualScroll, [PHOTO_HANDOFF_END, MAX_SCROLL], [0, 360])
  const smoothScrollRotate = useSpring(scrollRotate, ORIGINAL_MORPH_SPRING)
  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })
  const [morphValue, setMorphValue] = useState(0)
  const [rotateValue, setRotateValue] = useState(0)
  const [photoScroll, setPhotoScroll] = useState(0)
  const [parallaxValue, setParallaxValue] = useState(0)
  const logoLeft = useTransform(dock, [0, 1], [containerSize.width / 2, navSlot.x])
  // Original radius (35% of the smaller dimension, capped at 350), fitted inside the navbar margins.
  const originalRadius = Math.min(Math.min(containerSize.width, containerSize.height) * 0.35, 350)
  const introAvailable = Math.max(60, Math.min(containerSize.width / 2 - 16, containerSize.height / 2 - navSlot.bottom - 28, containerSize.height / 2 - 24))
  const introScale = Math.min(1, originalRadius / 250, introAvailable / (250 + IMG_HEIGHT / 2))
  const halfCardWidth = IMG_WIDTH * introScale / 2
  const halfCardHeight = IMG_HEIGHT * introScale / 2
  const introRadius = Math.max(0, Math.min(originalRadius, Math.sqrt(Math.max(0, introAvailable ** 2 - halfCardWidth ** 2)) - halfCardHeight))
  const introCenter = containerSize.height / 2
  const logoTop = useTransform(dock, [0, 1], [introCenter, navSlot.y])
  const introLogoWidth = Math.max(100, Math.min(390, containerSize.width * 0.48, (introRadius - halfCardHeight - 8) * 2))
  // The full-size sentence sits below the ring on narrow screens, clear of rotating photos.
  const introLineOffset = containerSize.width < 600
    ? introRadius + Math.hypot(halfCardWidth, halfCardHeight) + 16
    : introLogoWidth * 465 / 1211 / 2 + 16
  const logoWidth = useTransform(dock, [0, 1], [introLogoWidth, navSlot.width])
  const ringOpacity = useTransform(presentationScroll,
    [0, 60, 240, PHOTO_HANDOFF_START, PHOTO_HANDOFF_END, MARKETING_START - 120, MARKETING_START, MARKETING_START + 160, MARKETING_START + 320, DESIGN_START - 120, DESIGN_START, DESIGN_START + 160, DESIGN_START + 320],
    [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1])
  const featuredOpacity = useTransform(() => presentationScroll.get() < PHOTO_HANDOFF_START ? 0 : ringOpacity.get())
  const photoMode = act !== 0
  // One persistent copy block throughout each service, including the camera/photo handoff.
  const copyOpacity = useTransform(() => Math.min(1, Math.max(0, (dock.get() - 0.6) / 0.25)))
  const progress = useTransform(virtualScroll, [0, MAX_SCROLL], [0, 1])
  const snapToIntro = () => {
    if (scrollRef.current === 0 && virtualScroll.get() === 0) return
    rewindAnimation.current?.stop()
    rewinding.current = false
    scrollRef.current = 0
    designSlideRef.current = 0
    designVisibleSwipesRef.current = 0
    designHoldUntilRef.current = 0
    virtualScroll.jump(0)
    presentationScroll.jump(0)
    dock.jump(0)
    smoothMorph.jump(0)
    smoothScrollRotate.jump(0)
    brandTime.set(0)
    setIdleAngle(0)
    setAct(0)
    setShowCamera(true)
    setPhotoScroll(0)
    containerRef.current?.removeAttribute('data-intro-replayed')
    containerRef.current?.setAttribute('data-virtual-scroll', '0')
    containerRef.current?.setAttribute('data-reentered-intro', 'true')
    document.documentElement.classList.remove('morph-docked')
  }
  const snapToIntroRef = useRef(snapToIntro)
  snapToIntroRef.current = snapToIntro

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    // The browser otherwise restores the previous scroll position after a
    // reload, which makes the morph appear halfway through an act.
    window.history.scrollRestoration = 'manual'
    const resetOnEntry = () => {
      rewindAnimation.current?.stop()
      rewinding.current = false
      scrollRef.current = 0
      designSlideRef.current = 0
      designVisibleSwipesRef.current = 0
      designHoldUntilRef.current = 0
      virtualScroll.set(0)
      brandTime.set(0)
      setIdleAngle(0)
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }))
    }
    resetOnEntry()
    window.addEventListener('pageshow', resetOnEntry)
    return () => {
      window.removeEventListener('pageshow', resetOnEntry)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [brandTime, virtualScroll])

  useEffect(() => {
    const link = document.querySelector<HTMLImageElement>('header img[src="/brand/logo.svg"]')?.closest('a')
    if (!link) return
    const restart = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      rewindAnimation.current?.stop()
      rewinding.current = true
      containerRef.current?.removeAttribute('data-intro-replayed')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      rewindAnimation.current = animate(virtualScroll, 0, {
        duration: 1.1, ease: [0.4, 0, 0.2, 1],
        onUpdate: value => { scrollRef.current = value },
      })
    }
    link.addEventListener('click', restart)
    return () => { link.removeEventListener('click', restart); rewindAnimation.current?.stop() }
  }, [virtualScroll])

  useEffect(() => {
    const navigate = (event: Event) => {
      const service = SERVICES.find(item => item.id === (event as CustomEvent<string>).detail)
      if (!service) return
      rewindAnimation.current?.stop()
      rewinding.current = false
      window.scrollTo({ top: containerRef.current!.offsetTop, behavior: 'smooth' })
      rewindAnimation.current = animate(virtualScroll, service.start + 40, {
        duration: 0.9, ease: [0.4, 0, 0.2, 1],
        onUpdate: value => { scrollRef.current = value },
      })
    }
    window.addEventListener('render:morph-navigate', navigate)
    return () => window.removeEventListener('render:morph-navigate', navigate)
  }, [virtualScroll])

  useEffect(() => {
    const navLogo = document.querySelector<HTMLImageElement>('header img[src="/brand/logo.svg"]')
    const copy = copyRef.current
    const measure = () => {
      if (navLogo) {
        const rect = navLogo.getBoundingClientRect()
        setNavSlot({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, bottom: navLogo.closest('header')?.getBoundingClientRect().bottom ?? 80 })
      }
      if (copy) setCopyHeight(copy.getBoundingClientRect().height)
    }
    const observer = new ResizeObserver(measure)
    if (navLogo) observer.observe(navLogo)
    if (copy) observer.observe(copy)
    window.addEventListener('resize', measure)
    measure()
    return () => { observer.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(([entry]) => setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height }))
    observer.observe(container)
    const visibility = new IntersectionObserver(([entry]) => { inView.current = entry.isIntersecting })
    visibility.observe(container)
    const resetIfLeftBelow = () => {
      const rect = container.getBoundingClientRect()
      // Only reset after a committed leave. A short leak used to snap the
      // timeline to intro and yank the phone back to the logo.
      if (rect.bottom < -window.innerHeight * 0.4) snapToIntroRef.current()
    }
    window.addEventListener('scroll', resetIfLeftBelow, { passive: true })
    return () => {
      observer.disconnect()
      visibility.disconnect()
      window.removeEventListener('scroll', resetIfLeftBelow)
    }
  }, [])

  useEffect(() => {
    const unsubscribers = [
      smoothMorph.on('change', setMorphValue),
      smoothScrollRotate.on('change', setRotateValue),
      smoothMouseX.on('change', setParallaxValue),
      ringOpacity.on('change', value => setRingInteractive(value > 0.5)),
      dock.on('change', value => document.documentElement.classList.toggle('morph-docked', value > 0.85)),
      virtualScroll.on('change', value => { containerRef.current?.setAttribute('data-virtual-scroll', String(value)) }),
      presentationScroll.on('change', value => {
        setAct(value < AUDIOVISUAL_START ? 0 : value < MARKETING_START ? 1 : value < DESIGN_START ? 2 : 3)
        setShowCamera(value < PHOTO_HANDOFF_END + 100)
        setPhotoScroll(value)
      }),
    ]
    return () => unsubscribers.forEach(unsubscribe => unsubscribe())
  }, [smoothMorph, smoothScrollRotate, smoothMouseX, ringOpacity, presentationScroll, virtualScroll])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const RELEASE_SLACK = 64
    const holdPage = (holding: boolean) => document.documentElement.classList.toggle('morph-holding', holding)
    const pinHero = () => {
      const rect = container.getBoundingClientRect()
      if (Math.abs(rect.top) > 0.5) window.scrollTo({ top: Math.max(0, window.scrollY + rect.top), behavior: 'instant' })
    }
    const ownsGesture = (rect: DOMRect, delta: number) => {
      if (photoOpen) return false
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return false
      if (scrollRef.current > 0 && scrollRef.current < MAX_SCROLL) return true
      if (scrollRef.current <= 0) return delta > 0 && rect.top < 8
      // At the last act: keep the hero until the next section has clearly taken over.
      if (rect.top < -RELEASE_SLACK) return delta < 0
      return true
    }
    const advance = (delta: number, event: Event, force = false) => {
      if (photoOpen || delta === 0) return
      if (!force && !event.cancelable) return
      if (event.target instanceof Element && event.target.closest('header, dialog, [role="dialog"], input, textarea, select')) return
      const rect = container.getBoundingClientRect()
      if (!ownsGesture(rect, delta)) {
        if (scrollRef.current >= MAX_SCROLL && delta > 0 && rect.bottom > 0) {
          if (event.cancelable) event.preventDefault()
          holdPage(false)
          window.scrollBy({ top: delta, behavior: 'instant' })
        }
        return
      }
      if (event.cancelable) event.preventDefault()
      rewindAnimation.current?.stop()
      rewinding.current = false
      const requested = scrollRef.current + delta
      const next = clamp(requested)
      if (next !== scrollRef.current) {
        pinHero()
        scrollRef.current = next
        virtualScroll.set(next)
        holdPage(next > 0 && next < MAX_SCROLL)
      } else if (next > 0 && next < MAX_SCROLL) {
        pinHero()
      }
    }

    const steps = () => stepsForWidth(container.clientWidth)
    const nearestStep = (value: number) => {
      const points = steps()
      return points.reduce((best, point, index) =>
        Math.abs(point - value) < Math.abs(points[best] - value) ? index : best, 0)
    }
    let stepLocked = false
    let stepUnlockTimer = 0
    const DESIGN_SLIDE_COUNT = FEATURED_IMAGES.diseno.length
    const designPoint = (slide: number) => DESIGN_START + (slide - 1) * 120
    const releaseToPage = (pixels: number) => {
      holdPage(false)
      const distance = Math.max(120, pixels)
      window.scrollBy({ top: distance, behavior: 'instant' })
      requestAnimationFrame(() => {
        holdPage(false)
        if (window.scrollY < 24) window.scrollBy({ top: distance, behavior: 'instant' })
      })
    }
    const moveOneStep = (direction: 1 | -1, event: Event, force = false, leftover = 0) => {
      const points = steps()
      const current = scrollRef.current
      const index = nearestStep(current)
      const targetIndex = Math.max(0, Math.min(points.length - 1, index + direction))
      const rawTarget = points[targetIndex]
      const reachingDesign = current >= DESIGN_START || rawTarget >= DESIGN_START
      if (direction > 0 && reachingDesign && current < MAX_SCROLL) {
        const now = performance.now()
        if (designSlideRef.current < 1) {
          designSlideRef.current = 1
          designVisibleSwipesRef.current = 0
          designHoldUntilRef.current = now + 800
          advance(DESIGN_START - current, event, force)
          return
        }
        if (now < designHoldUntilRef.current) {
          if (event.cancelable) event.preventDefault()
          pinHero()
          return
        }
        if (designVisibleSwipesRef.current < DESIGN_SLIDE_COUNT) {
          designVisibleSwipesRef.current += 1
          designSlideRef.current = Math.min(DESIGN_SLIDE_COUNT, 1 + designVisibleSwipesRef.current)
          advance(designPoint(designSlideRef.current) - current, event, force)
          return
        }
        if (event.cancelable) event.preventDefault()
        scrollRef.current = MAX_SCROLL
        virtualScroll.set(MAX_SCROLL)
        releaseToPage(leftover)
        return
      }
      if (direction < 0 && (current >= DESIGN_START || designSlideRef.current > 0)) {
        if (designSlideRef.current > 1) {
          designSlideRef.current -= 1
          advance(designPoint(designSlideRef.current) - current, event, force)
          return
        }
        designSlideRef.current = 0
        designVisibleSwipesRef.current = 0
      }
      const target = rawTarget
      if (target === current) {
        if (direction > 0 && current >= MAX_SCROLL) releaseToPage(leftover)
        return
      }
      advance(target - current, event, force)
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      if (Math.abs(event.deltaY) < 1) return
      const rect = container.getBoundingClientRect()
      const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1
      if (!ownsGesture(rect, event.deltaY)) {
        if (scrollRef.current >= MAX_SCROLL && direction > 0 && rect.bottom > 0) {
          if (event.cancelable) event.preventDefault()
          holdPage(false)
          window.scrollBy({ top: event.deltaY, behavior: 'instant' })
        }
        return
      }
      if (event.cancelable) event.preventDefault()
      pinHero()
      if (stepLocked) return
      stepLocked = true
      window.clearTimeout(stepUnlockTimer)
      const inCamera = scrollRef.current >= CAMERA_MOTION_START && scrollRef.current < PHOTO_HANDOFF_END
      stepUnlockTimer = window.setTimeout(() => { stepLocked = false }, inCamera ? 520 : 320)
      moveOneStep(direction, event, true, Math.abs(event.deltaY))
    }
    let lastTouchY = 0
    let lastTouchX = 0
    let gestureY = 0
    let axisLocked: 'x' | 'y' | null = null
    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0].clientY
      lastTouchX = event.touches[0].clientX
      gestureY = 0
      axisLocked = null
      if (scrollRef.current > 0 && scrollRef.current < MAX_SCROLL) pinHero()
    }
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      const touch = event.touches[0]
      const deltaX = lastTouchX - touch.clientX
      const deltaY = lastTouchY - touch.clientY
      if (!axisLocked && Math.hypot(deltaX, deltaY) > 6) axisLocked = Math.abs(deltaY) >= Math.abs(deltaX) ? 'y' : 'x'
      if (axisLocked === 'x') return
      const rect = container.getBoundingClientRect()
      if (!ownsGesture(rect, deltaY)) {
        if (scrollRef.current >= MAX_SCROLL && deltaY > 0 && rect.bottom > 0) {
          event.preventDefault()
          holdPage(false)
          window.scrollBy({ top: deltaY, behavior: 'instant' })
          lastTouchY = touch.clientY
        }
        return
      }
      event.preventDefault()
      pinHero()
      gestureY += deltaY
      lastTouchY = touch.clientY
      lastTouchX = touch.clientX
    }
    const handleTouchEnd = (event: TouchEvent) => {
      if (axisLocked !== 'y' || Math.abs(gestureY) < 28) return
      const direction: 1 | -1 = gestureY > 0 ? 1 : -1
      moveOneStep(direction, event, true, Math.abs(gestureY))
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.target !== container || event.ctrlKey || event.metaKey || event.altKey) return
      const direction = ({ ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, ' ': event.shiftKey ? -1 : 1 } as Record<string, 1 | -1 | undefined>)[event.key]
      if (direction !== undefined) moveOneStep(direction, event, true)
      if (event.key === 'Home') advance(-scrollRef.current, event, true)
      if (event.key === 'End') advance(MAX_SCROLL - scrollRef.current, event, true)
    }
    const handleMouseMove = (event: MouseEvent) => {
      if (hoveringPhoto.current || photoOpen) return
      const rect = container.getBoundingClientRect()
      mouseX.set(((event.clientX - rect.left) / rect.width * 2 - 1) * 100)
    }
    const resetMouse = () => mouseX.set(0)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    container.addEventListener('keydown', handleKey)
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', resetMouse)
    return () => {
      holdPage(false)
      window.clearTimeout(stepUnlockTimer)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      container.removeEventListener('keydown', handleKey)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', resetMouse)
    }
  }, [virtualScroll, mouseX, photoOpen])

  const narrowStage = containerSize.width < 768
  const copyTop = narrowStage ? 88 : Math.min(128, Math.max(96, containerSize.height * 0.12))
  const leftoverTop = copyTop + copyHeight + (narrowStage ? 12 : 24)
  const leftoverBottom = containerSize.height - (narrowStage ? 72 : 40)
  const leftover = Math.max(120, leftoverBottom - leftoverTop)
  const cameraWidth = Math.min(
    containerSize.width * (narrowStage ? 0.82 : 0.88),
    narrowStage ? 320 : 620,
    leftover * 16 / 9,
  )
  const cameraHeight = cameraWidth * 9 / 16
  const cameraTop = leftoverTop + Math.max(0, (leftover - cameraHeight) / 2)
  const service = SERVICES[Math.max(0, act - 1)]
  const featuredImages = FEATURED_IMAGES[service.id as keyof typeof FEATURED_IMAGES]
  const photoStart = act === 1 ? PHOTO_HANDOFF_END : act === 3 ? DESIGN_START : service.start + 320
  const photoStep = act === 1 ? 100 : 120
  const featuredIndex = Math.min(featuredImages.length - 1, Math.max(0, Math.floor((photoScroll - photoStart) / photoStep)))
  const featuredAreaTop = copyTop + copyHeight + 20
  const featuredHeight = Math.max(100, Math.min(580, containerSize.height - featuredAreaTop - (narrowStage ? 84 : 32)))
  const featuredWidth = Math.min(narrowStage ? containerSize.width - 64 : Math.min(700, containerSize.width * 0.64), featuredHeight * 1.78)
  const featuredTop = featuredAreaTop + Math.max(0, (containerSize.height - featuredAreaTop - (narrowStage ? 84 : 32) - featuredHeight) / 2)
  const ringImages = act === 0
    ? Array.from({ length: TOTAL_IMAGES }, (_, i) => {
      const group = SERVICES[i % SERVICES.length].images
      return group[Math.floor(i / SERVICES.length) % group.length]
    })
    : service.images
  return (
    <section id="inicio" ref={containerRef} className="scroll-morph" tabIndex={0} aria-label="Explora los servicios de RENDER" aria-describedby="morph-instructions" data-act={act} data-marketing-start={MARKETING_START} data-design-start={DESIGN_START} data-scroll-max={MAX_SCROLL}>
      {SERVICES.map(service => <span key={service.id} id={service.id} className="morph-anchor" aria-hidden="true" />)}
      <p id="morph-instructions" className="sr-only">Desliza o usa las flechas para explorar Audiovisuales, Marketing digital y Diseño gráfico. Tab permite saltar la animación.</p>
      <a className="morph-skip" href="#after-scroll-morph">Saltar presentación</a>
      {showCamera && <div className="morph-camera-stage" aria-hidden={act !== 1} style={{ top: cameraTop, width: cameraWidth, height: cameraHeight, visibility: act === 1 ? 'visible' : 'hidden' }}><ScrollCamera scroll={presentationScroll} /></div>}
      {createPortal(<motion.div className="morph-brand-flight" style={{ left: logoLeft, top: logoTop, width: logoWidth, x: '-50%', y: '-50%' }}>
        <BrandIntro time={brandTime} dock={dock} lineOffset={introLineOffset} />
      </motion.div>, document.body)}
      <motion.div ref={copyRef} style={{ opacity: copyOpacity }} className="morph-copy morph-copy-service" aria-live="polite" aria-atomic="true">
          <motion.div key={act} initial={{ opacity: 0.65, filter: 'blur(3px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.22 }}>
            {act !== 0 && <>
              <h1 className="morph-title">{service.title}</h1>
              <p className="morph-sub">{service.sub}</p>
              <p className="morph-tags">{service.tags}</p>
            </>}
          </motion.div>
      </motion.div>
      <motion.div className="morph-ring" role="group" aria-label="Fotografías de RENDER"
        data-photo-index={photoMode ? featuredIndex : undefined} data-photo-count={photoMode ? featuredImages.length : undefined}
        inert={!ringInteractive || photoOpen || (photoMode && photoScroll < PHOTO_HANDOFF_START)} style={{ opacity: photoMode ? featuredOpacity : ringOpacity }}>
        {Array.from({ length: photoMode ? Math.max(TOTAL_IMAGES, featuredImages.length + 6) : TOTAL_IMAGES }, (_, i) => {
          // Original geometry and springs; idle only offsets the starting circle angle.
          const isMobile = containerSize.width < 768
          const circleRadius = introRadius
          const circleAngle = (i / TOTAL_IMAGES) * 360 + idleAngle
          const circleRad = circleAngle * Math.PI / 180
          const circlePos = { x: Math.cos(circleRad) * circleRadius, y: Math.sin(circleRad) * circleRadius + introCenter - containerSize.height / 2, rotation: circleAngle + 90 }
          // Original convex arc geometry; smaller responsive cards keep the strip dense and readable.
          const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5)
          const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1)
          const spreadAngle = isMobile ? 100 : 130
          const startAngle = -90 - spreadAngle / 2
          const step = spreadAngle / (TOTAL_IMAGES - 1)
          const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1)
          // Limit the original sweep so the final service still has images at the apex.
          const boundedRotation = -scrollProgress * spreadAngle * 0.3
          const currentArcAngle = startAngle + i * step + boundedRotation
          const arcRad = currentArcAngle * Math.PI / 180
          const arcScale = Math.min(isMobile ? 1.4 : 1.8, arcRadius * step * Math.PI / 180 * 0.72 / IMG_WIDTH)
          const cardExtent = Math.hypot(IMG_WIDTH, IMG_HEIGHT) * arcScale / 2
          const arcApexY = Math.max(containerSize.height * 0.60, copyTop + copyHeight + 24 + cardExtent,
            photoMode && narrowStage ? featuredTop + featuredHeight + 18 + cardExtent : 0) - containerSize.height / 2
          const arcCenterY = arcApexY + arcRadius
          const arcPos = { x: Math.cos(arcRad) * arcRadius + parallaxValue,
            y: Math.sin(arcRad) * arcRadius + arcCenterY, rotation: currentArcAngle + 90, scale: arcScale }
          const edgeRoom = Math.min(containerSize.width / 2 - Math.abs(arcPos.x) - cardExtent - 8,
            containerSize.height / 2 - arcPos.y - cardExtent - 12)
          const centerRoom = narrowStage ? 1 : Math.max(0, Math.min(1, (Math.abs(arcPos.x) - featuredWidth / 2 - cardExtent - 18) / 20))
          const photoOpacity = Math.max(0, Math.min(1, edgeRoom / 24)) * centerRoom
          const layoutProgress = morphValue
          let target: Target = {
            x: lerp(circlePos.x, arcPos.x, layoutProgress), y: lerp(circlePos.y, arcPos.y, layoutProgress),
            rotation: lerp(circlePos.rotation, arcPos.rotation, layoutProgress), scale: lerp(introScale, arcPos.scale, layoutProgress),
            opacity: !photoMode ? 1 : photoOpacity, zIndex: 100 - Math.round(Math.abs(currentArcAngle + 90)),
          }
          // One keyed strip: the same right-hand card moves to center and grows.
          // Width and position share the original spring, preserving the gap in transit.
          const slot = i - 3
          const relative = slot - featuredIndex
          if (photoMode) {
            const sideWidth = narrowStage ? 56 : 112
            const sideHeight = sideWidth * IMG_HEIGHT / IMG_WIDTH
            const gap = narrowStage ? 10 : 24
            const distance = Math.abs(relative)
            const stripX = relative === 0 ? 0 : Math.sign(relative) * (featuredWidth / 2 + sideWidth / 2 + gap + (distance - 1) * (sideWidth + gap))
            const limitedX = Math.min(Math.abs(stripX), arcRadius * 0.8)
            const stripY = featuredTop + featuredHeight / 2 - containerSize.height / 2 + arcRadius - Math.sqrt(arcRadius ** 2 - limitedX ** 2)
            const width = relative === 0 ? featuredWidth : sideWidth
            const height = relative === 0 ? featuredHeight : sideHeight
            target = {
              x: lerp(circlePos.x, stripX, layoutProgress), y: lerp(circlePos.y, stripY, layoutProgress),
              rotation: lerp(circlePos.rotation, Math.max(-8, Math.min(8, relative * 4)), layoutProgress),
              scale: lerp(introScale, 1, layoutProgress),
              width: lerp(IMG_WIDTH, width, layoutProgress), height: lerp(IMG_HEIGHT, height, layoutProgress),
              opacity: Math.abs(stripX) - width / 2 < containerSize.width / 2 ? 1 : 0,
              zIndex: 200 - distance,
            }
          }
          const photoIndex = (slot % featuredImages.length + featuredImages.length) % featuredImages.length
          const photo = photoMode ? featuredImages[photoIndex] : ringImages[i % ringImages.length]
          const label = `${SERVICES.find(item => item.id === photo.service)?.title ?? service.title}: trabajo de RENDER ${photoMode ? photoIndex + 1 : i + 1}`
          return <FlipCard key={`${photoMode ? service.id : 'intro'}-${i}`} src={photo.src} label={label} target={target}
            slot={photoMode ? slot : undefined} relative={photoMode ? relative : undefined}
            interactive={ringInteractive && (!photoMode || photoScroll >= PHOTO_HANDOFF_START)} onOpen={onPhotoOpen}
            onHover={hovering => {
              hoveringPhoto.current = hovering
              if (hovering) {
                // Keep a photo under the pointer while it is being selected.
                const position = smoothMouseX.get()
                mouseX.set(position)
                smoothMouseX.jump(position)
              }
            }} />
        })}
      </motion.div>
      <div className="morph-progress" aria-hidden="true"><motion.div style={{ scaleX: progress }} /></div>
    </section>
  )
}

export default function ScrollMorphHero() {
  const reducedMotion = useReducedMotion()
  const [photo, setPhoto] = useState<MorphPhoto | null>(null)
  const [photoOpen, setPhotoOpen] = useState(false)
  const photoOpener = useRef<HTMLButtonElement | null>(null)
  const openPhoto: OpenMorphPhoto = (src, label, trigger) => {
    const rect = trigger.getBoundingClientRect()
    const image = trigger.querySelector('img')
    const naturalWidth = image?.naturalWidth || IMG_WIDTH
    const naturalHeight = image?.naturalHeight || IMG_HEIGHT
    const fit = Math.min((window.innerWidth - 48) / naturalWidth, (window.innerHeight - 128) / naturalHeight)
    const width = naturalWidth * fit
    const height = naturalHeight * fit
    photoOpener.current = trigger
    setPhoto({ src, label, width, height, originX: rect.left + rect.width / 2 - window.innerWidth / 2,
      originY: rect.top + rect.height / 2 - window.innerHeight / 2,
      scale: Math.min(rect.width / width, rect.height / height) })
    setPhotoOpen(true)
  }
  useEffect(() => {
    const hero = document.getElementById('inicio')
    if (!hero) return
    // Keep the official mark in one place while the hero is on screen.
    const observer = new IntersectionObserver(([entry]) => {
      document.documentElement.classList.toggle('morph-in-view', !reducedMotion && entry.isIntersecting)
    }, { threshold: 0, rootMargin: '-100px 0px 0px 0px' })
    observer.observe(hero)
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('morph-in-view')
      document.documentElement.classList.remove('morph-docked')
    }
  }, [reducedMotion])
  return <>
    {reducedMotion ? <StaticServices onPhotoOpen={openPhoto} /> : <AnimatedServices onPhotoOpen={openPhoto} photoOpen={photoOpen} />}
    <MorphPhotoViewer photo={photo} open={photoOpen} onOpenChange={setPhotoOpen} restoreFocus={() => {
      const target = photoOpener.current?.isConnected ? photoOpener.current : document.getElementById('inicio')
      target?.focus({ preventScroll: true })
    }} />
    <div id="after-scroll-morph" tabIndex={-1} />
  </>
}
