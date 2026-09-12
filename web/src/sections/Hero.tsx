import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

const VIDEO = '/videos/camera-360-studio.mp4'
const POSTER = '/assets/camera/360-studio-poster.webp'
const CHAPTERS = [
  ['Cada pieza cuenta.', 'Explora el equipo detrás de nuestras historias.'],
  ['Una mirada de 360°.', 'El equipo se transforma con cada perspectiva.'],
  ['Todo vuelve a su lugar.', 'Listos para contar la siguiente historia.'],
]
const clamp = (n: number) => Math.min(1, Math.max(0, n))
const smooth = (n: number) => n * n * (3 - 2 * n)

export default function Hero() {
  const wrapRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let desiredTime = 0
    let failed = false
    let lastFrame = -1

    // One seek in flight; reversing the scroll replaces its target immediately.
    const seek = () => {
      if (failed || media.matches || video.readyState < 1 || video.seeking || !Number.isFinite(video.duration)) return
      if (Math.abs(video.currentTime - desiredTime) > 1 / 48) video.currentTime = desiredTime
    }
    const draw = () => {
      raf = 0
      const p = media.matches ? 0 : clamp(-wrap.getBoundingClientRect().top / Math.max(1, wrap.offsetHeight - innerHeight))
      const frame = Math.round(p * 240)
      if (lastFrame === frame) return
      lastFrame = frame
      wrap.dataset.frame = String(frame)
      const duration = Number.isFinite(video.duration) ? video.duration : 10
      // A single continuous turn: assembled at zero, assembled again at the end.
      desiredTime = p * Math.max(0, duration - 1 / 24)
      seek()
      const framing = 1.28 - 0.28 * smooth(clamp((p - 0.08) / 0.12)) + 0.28 * smooth(clamp((p - 0.82) / 0.12))
      sceneRef.current?.style.setProperty('--camera-scale', String(framing))
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
      const chapter = p < 0.12 ? 0 : p < 0.88 ? 1 : 2
      chaptersRef.current?.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el, i) => { el.hidden = chapter !== i })
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const invalidate = () => { lastFrame = -1; schedule() }
    const onReady = () => { failed = false; wrap.dataset.videoReady = 'true'; invalidate() }
    const onError = () => { failed = true; wrap.dataset.videoReady = 'false' }
    const onSeeked = () => { wrap.dataset.videoTime = video.currentTime.toFixed(3); seek() }
    const onMotionChange = () => {
      wrap.dataset.reducedMotion = String(media.matches)
      if (media.matches) video.pause()
      else if (!video.getAttribute('src')) { video.src = VIDEO; video.load() }
      invalidate()
    }
    video.addEventListener('loadeddata', onReady)
    video.addEventListener('loadedmetadata', invalidate)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', invalidate)
    media.addEventListener('change', onMotionChange)
    onMotionChange()
    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('loadeddata', onReady); video.removeEventListener('loadedmetadata', invalidate)
      video.removeEventListener('seeked', onSeeked); video.removeEventListener('error', onError)
      video.pause(); video.removeAttribute('src'); video.load()
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', invalidate)
      media.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <section ref={wrapRef} id="inicio" className="camera-story camera-story-360" aria-label="RENDER Multimedia, producción audiovisual">
      <div className="camera-stage">
        <h1 className="camera-brand" aria-label="RENDER Multimedia">RENDER <span>Multimedia</span></h1>
        <div ref={sceneRef} className="camera-scene" role="img" aria-label="Cámara de cine aislada sobre blanco: empieza armada, gira 360 grados y vuelve a armarse con el scroll">
          <img className="camera-poster" src={POSTER} width={1280} height={720} alt="" fetchPriority="high" />
          <video ref={videoRef} className="camera-video" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" />
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
