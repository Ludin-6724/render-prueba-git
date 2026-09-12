import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { CameraSequence, CAMERA_FRAMES } from '../lib/cameraSequence'

const CHAPTERS = [
  ['Cada pieza cuenta.', 'Explora el equipo detrás de nuestras historias.'],
  ['Una mirada de 360°.', 'El equipo se transforma con cada perspectiva.'],
  ['Todo vuelve a su lugar.', 'Listos para contar la siguiente historia.'],
]
const clamp = (n: number) => Math.min(1, Math.max(0, n))

export default function Hero() {
  const wrapRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!wrap || !stage || !canvas) return
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = matchMedia('(max-width: 767px)')
    const compact = matchMedia('(max-height: 500px)')
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    const chapters = chaptersRef.current?.querySelectorAll<HTMLElement>('[data-chapter]')
    let player: CameraSequence | undefined
    let raf = 0
    let count = 0
    let range = 1
    let start = 0
    let lastFrame = -1
    let lastChapter = -1
    let visible = true

    const draw = () => {
      raf = 0
      const p = player ? clamp((scrollY - start) / range) : 0
      const frame = Math.round(p * (count - 1))
      if (lastFrame === frame) return
      lastFrame = frame
      wrap.dataset.frame = String(frame)
      player?.seek(frame)
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
      const chapter = p < 0.12 ? 0 : p < 0.88 ? 1 : 2
      if (lastChapter !== chapter) chapters?.forEach((el, i) => { el.hidden = chapter !== i })
      lastChapter = chapter
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const measure = () => {
      // Use the actual sticky stage, not innerHeight: mobile browser chrome changes it mid-scroll.
      start = wrap.getBoundingClientRect().top + scrollY
      range = Math.max(1, wrap.offsetHeight - stage.offsetHeight)
      lastFrame = -1
      schedule()
    }
    const setup = () => {
      player?.dispose()
      player = undefined
      wrap.dataset.sequenceReady = 'false'
      const still = motion.matches || compact.matches || !!saveData
      wrap.dataset.static = String(still)
      if (!still) {
        const variant = mobile.matches && canvas.clientWidth * devicePixelRatio <= 960 ? 'mobile' : 'desktop'
        count = CAMERA_FRAMES
        wrap.dataset.variant = variant
        player = new CameraSequence(canvas, variant, index => {
          wrap.dataset.sequenceReady = 'true'
          wrap.dataset.renderedFrame = String(index)
        }, () => {
          wrap.dataset.static = 'true'
          wrap.dataset.sequenceReady = 'false'
        })
        player.setVisible(visible)
      }
      measure()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden
      player?.setVisible(visible)
    })
    const visibility = () => {
      visible = !document.hidden && wrap.getBoundingClientRect().bottom > 0 && wrap.getBoundingClientRect().top < innerHeight
      player?.setVisible(visible)
      if (visible) schedule()
    }
    const resize = new ResizeObserver(measure)
    observer.observe(wrap)
    resize.observe(wrap)
    resize.observe(stage)
    window.addEventListener('scroll', schedule, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    motion.addEventListener('change', setup)
    mobile.addEventListener('change', setup)
    compact.addEventListener('change', setup)
    setup()
    return () => {
      cancelAnimationFrame(raf)
      player?.dispose()
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      document.removeEventListener('visibilitychange', visibility)
      motion.removeEventListener('change', setup)
      mobile.removeEventListener('change', setup)
      compact.removeEventListener('change', setup)
    }
  }, [])

  return (
    <section ref={wrapRef} id="inicio" className="camera-story camera-story-360" aria-label="RENDER Multimedia, producción audiovisual">
      <div ref={stageRef} className="camera-stage">
        <h1 className="camera-brand" aria-label="RENDER Multimedia">RENDER <span>Multimedia</span></h1>
        <div className="camera-scene" role="img" aria-label="Cámara de cine aislada sobre blanco: empieza armada, gira 360 grados y vuelve a armarse con el scroll">
          <picture>
            <source media="(max-width: 767px)" srcSet="/assets/camera/turn-v1/mobile/000.webp 960w, /assets/camera/turn-v1/desktop/000.webp 1280w" sizes="100vw" />
            <img className="camera-poster" src="/assets/camera/turn-v1/desktop/000.webp" width={1280} height={720} alt="" fetchPriority="high" />
          </picture>
          <canvas ref={canvasRef} className="camera-canvas" width={1280} height={720} aria-hidden="true" />
        </div>
        <a className="camera-skip" href="#portfolio">Ver nuestro trabajo <ArrowUpRight size={18} aria-hidden="true" /></a>
        <div className="camera-caption">
          <div ref={chaptersRef} className="camera-chapters">
            {CHAPTERS.map(([title, detail], i) => <div key={title} data-chapter={i} hidden={i !== 0}><p className="camera-chapter-title">{title}</p><p className="camera-chapter-detail">{detail}</p></div>)}
          </div>
          <div className="camera-scroll-hint" aria-hidden="true"><ArrowDown size={18} /><span>Desliza para girar.</span></div>
        </div>
        <div className="camera-progress" aria-hidden="true"><div ref={progressRef} /></div>
      </div>
    </section>
  )
}
