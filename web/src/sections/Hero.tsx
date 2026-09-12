import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

// Coordinates in the supplied 864 × 679 photograph; crops retain their original alpha.
const PARTS = [
  { file: 'monitor', x: 471, y: 1, dx: 48, dy: -130, angle: 0.06 },
  { file: 'battery', x: 4, y: 270, dx: -145, dy: 12, angle: -0.12 },
  { file: 'body', x: 228, y: 335, dx: -24, dy: 0, angle: 0 },
  { file: 'lens', x: 549, y: 321, dx: 175, dy: 28, angle: 0.06 },
  { file: 'baseplate', x: 237, y: 616, dx: 0, dy: 100, angle: 0 },
]
const SHOTS = [
  { at: 0, spread: 0, zoom: 1, x: 432, y: 339, focus: -1 },
  { at: 0.34, spread: 1, zoom: 0.78, x: 432, y: 339, focus: -1 },
  { at: 0.67, spread: 1, zoom: 1.7, x: 782, y: 440, focus: 3 },
  { at: 1, spread: 1, zoom: 1.65, x: 636, y: 4, focus: 0 },
]
const CHAPTERS = [
  ['Todo empieza con una mirada.', 'Producción audiovisual en Chiquimula, Guatemala.'],
  ['Cada pieza tiene un propósito.', 'Una mirada al equipo detrás de la imagen.'],
  ['La historia, en cada detalle.', 'Óptica. Encuadre. Intención.'],
  ['Una nueva perspectiva.', 'Del primer encuadre a la entrega final.'],
]
const clamp = (n: number) => Math.min(1, Math.max(0, n))
const smooth = (n: number) => n * n * (3 - 2 * n)

export default function Hero() {
  const wrapRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let alive = true
    let raf = 0
    let lastFrame = -1
    let lastChapter = -1
    let images: HTMLImageElement[] = []
    let chassis: HTMLCanvasElement | null = null
    let width = 0
    let height = 0

    const draw = () => {
      raf = 0
      if (!alive || !chassis) return
      const box = wrap.getBoundingClientRect()
      const p = motion.matches ? 0 : clamp(-box.top / Math.max(1, wrap.offsetHeight - window.innerHeight))
      const frame = Math.round(p * 180)
      if (frame === lastFrame) return
      lastFrame = frame
      canvas.dataset.frame = String(frame)
      const position = frame / 180
      const stop = Math.min(2, Math.max(0, SHOTS.findIndex((s) => s.at >= position) - 1))
      const a = SHOTS[stop]
      const b = SHOTS[stop + 1]
      const t = smooth(clamp((position - a.at) / (b.at - a.at)))
      const mix = (start: number, end: number) => start + (end - start) * t
      const spread = mix(a.spread, b.spread)
      const scale = Math.min(width / 1110, height / 860) * mix(a.zoom, b.zoom)
      const emphasis = (i: number) => mix(a.focus === -1 || a.focus === i ? 1 : 0.24, b.focus === -1 || b.focus === i ? 1 : 0.24)
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(scale, scale)
      ctx.translate(-mix(a.x, b.x), -mix(a.y, b.y))
      if (frame === 0) ctx.drawImage(images[0], 0, 0)
      else {
        ctx.globalAlpha = emphasis(-1) * (1 - smooth(clamp(spread * 2)))
        ctx.drawImage(chassis, 0, 0)
        PARTS.forEach((part, i) => {
          const img = images[i + 1]
          ctx.save()
          ctx.globalAlpha = emphasis(i)
          ctx.translate(part.x + img.width / 2 + part.dx * spread, part.y + img.height / 2 + part.dy * spread)
          ctx.rotate(part.angle * spread)
          ctx.drawImage(img, -img.width / 2, -img.height / 2)
          ctx.restore()
        })
      }
      ctx.restore()
      const chapter = position < 0.16 ? 0 : position < 0.49 ? 1 : position < 0.83 ? 2 : 3
      if (chapter !== lastChapter) {
        lastChapter = chapter
        chaptersRef.current?.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el, i) => { el.hidden = chapter !== i })
      }
      if (titleRef.current) titleRef.current.style.opacity = String(1 - clamp(position * 4) * 0.87)
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${position})`
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      lastFrame = -1
      schedule()
    }
    const sources = ['assembled', ...PARTS.map((p) => p.file)]
    Promise.all(sources.map((file) => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = `/assets/camera/${file}.png`
    }))).then((loaded) => {
      if (!alive) return
      images = loaded
      chassis = document.createElement('canvas')
      chassis.width = 864
      chassis.height = 679
      const layer = chassis.getContext('2d')!
      layer.drawImage(images[0], 0, 0)
      layer.globalCompositeOperation = 'destination-out'
      PARTS.forEach((part, i) => layer.drawImage(images[i + 1], part.x, part.y))
      resize()
      wrap.dataset.ready = 'true'
    }).catch(() => { /* Preserve the complete-camera fallback on network/canvas failure. */ })
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', resize)
    motion.addEventListener('change', resize)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', resize)
      motion.removeEventListener('change', resize)
    }
  }, [])

  return (
    <section ref={wrapRef} id="inicio" className="camera-story" aria-label="RENDER Multimedia, producción audiovisual">
      <div className="camera-stage">
        <h1 ref={titleRef} className="camera-brand" aria-label="RENDER Multimedia">RENDER <span>Multimedia</span></h1>
        <div className="camera-scene">
          <img className="camera-fallback" src="/assets/camera/assembled.png" alt="Cámara de cine con monitor, batería y óptica" width={864} height={679} fetchPriority="high" />
          <canvas ref={canvasRef} className="camera-canvas" aria-hidden="true" />
        </div>
        <a className="camera-skip" href="#portfolio">Ver nuestro trabajo <ArrowUpRight size={18} aria-hidden="true" /></a>
        <div className="camera-caption">
          <div ref={chaptersRef} className="camera-chapters">
            {CHAPTERS.map(([title, detail], i) => (
              <div key={title} data-chapter={i} hidden={i !== 0}>
                <p className="camera-chapter-title">{title}</p>
                <p className="camera-chapter-detail">{detail}</p>
              </div>
            ))}
          </div>
          <div className="camera-scroll-hint" aria-hidden="true"><ArrowDown size={18} /> <span>Explora los detalles</span></div>
        </div>
        <div className="camera-progress" aria-hidden="true"><div ref={progressRef} /></div>
      </div>
    </section>
  )
}
