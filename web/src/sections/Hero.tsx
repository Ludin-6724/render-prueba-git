import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import parts from '@/content/camera-parts.json'

const SOURCE = '/assets/camera/segments/'
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const chaptersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || !video) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let alive = true
    let raf = 0
    let width = 0
    let height = 0
    let desiredTime = 0
    let ready = false
    let videoFailed = false
    let assembledLayer: HTMLCanvasElement | null = null
    let layers: HTMLCanvasElement[] = []
    let rootLayer: HTMLCanvasElement | null = null
    let lastFrame = -1

    // One seek in flight. Fast scrolling replaces the target, never queues stale seeks.
    const seek = () => {
      if (videoFailed || video.readyState < 1 || video.seeking || !Number.isFinite(video.duration)) return
      if (Math.abs(video.currentTime - desiredTime) > 1 / 48) video.currentTime = desiredTime
    }
    const draw = () => {
      raf = 0
      if (!alive) return
      const p = media.matches ? 0 : clamp(-wrap.getBoundingClientRect().top / Math.max(1, wrap.offsetHeight - innerHeight))
      const frame = Math.round(p * 300)
      if (lastFrame === frame) return
      lastFrame = frame
      wrap.dataset.frame = String(frame)
      const duration = Number.isFinite(video.duration) ? video.duration : 10
      desiredTime = clamp((p - 0.22) / 0.78) * Math.max(0, duration - 1 / 24)
      if (!media.matches) seek()
      const local = videoFailed ? p : clamp(p / 0.22)
      const spread = smooth(Math.sin(Math.PI * local))
      // The entire segmented rig first opens and closes. Its matching side view
      // dissolves into the supplied 360 video, which opens, rotates and closes again.
      canvas.style.opacity = videoFailed || media.matches ? '1' : String(1 - smooth(clamp((p - 0.20) / 0.05)))
      wrap.dataset.spread = spread.toFixed(3)
      if (ready && rootLayer) {
        ctx.clearRect(0, 0, width, height)
        const scale = Math.min(width / 1280, height / 720)
        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.scale(scale, scale)
        ctx.fillStyle = '#171a19'
        ctx.fillRect(-640, -360, 1280, 720)
        const detailScale = 1 - spread * (width < 760 ? 0.24 : 0.17)
        ctx.scale(detailScale, detailScale)
        ctx.translate(-459, -350)
        if ((local < 0.005 || media.matches) && assembledLayer) ctx.drawImage(assembledLayer, 2, 0)
        else {
          ctx.drawImage(rootLayer, 0, 0)
          parts.forEach((part, i) => ctx.drawImage(layers[i], part.x + part.dx * spread, part.y + part.dy * spread))
        }
        ctx.restore()
      }
      if (titleRef.current) titleRef.current.style.opacity = String(1 - smooth(clamp(p * 5)) * 0.9)
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
      const chapter = p < 0.23 ? 0 : p < 0.86 ? 1 : 2
      chaptersRef.current?.querySelectorAll<HTMLElement>('[data-chapter]').forEach((el, i) => { el.hidden = chapter !== i })
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }
    const invalidate = () => { lastFrame = -1; schedule() }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width; height = rect.height
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      invalidate()
    }
    const onVideoReady = () => {
      videoFailed = false
      wrap.dataset.videoReady = 'true'
      invalidate()
    }
    const onVideoError = () => { videoFailed = true; invalidate() }
    const onSeeked = () => { wrap.dataset.videoTime = video.currentTime.toFixed(3); seek() }
    const onMotionChange = () => {
      if (!media.matches && !video.getAttribute('src')) { video.src = '/videos/camera-360.mp4'; video.load() }
      if (media.matches) video.pause()
      invalidate()
    }
    const files = ['camera-body/camera-body-2.png', 'professional-cinema-camera.png', 'black-background/black-background-1.png', ...parts.map(p => p.file)]
    Promise.all(files.map(file => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = SOURCE + file
    }))).then(images => {
      if (!alive) return
      const makeLayer = (img: HTMLImageElement) => {
        const target = document.createElement('canvas'); target.width = img.width; target.height = img.height
        target.getContext('2d')!.drawImage(img, 0, 0); return target
      }
      assembledLayer = makeLayer(images[1])
      const assembled = assembledLayer.getContext('2d')!
      assembled.globalCompositeOperation = 'destination-out'
      assembled.drawImage(images[2], -9, -4)
      rootLayer = makeLayer(images[0])
      const root = rootLayer.getContext('2d')!
      root.globalCompositeOperation = 'destination-out'
      // The negative-space segment trims the surrounding matte, never floats as a part.
      root.drawImage(images[2], -7, -4)
      parts.forEach((part, i) => root.drawImage(images[i + 3], part.x, part.y))
      layers = parts.map((part, i) => {
        const target = makeLayer(images[i + 3]); const layer = target.getContext('2d')!
        layer.globalCompositeOperation = 'destination-out'
        // Nested crops (screen, labels, logos) are removed from their larger parent
        // before moving, so the source isn't duplicated during the exploded view.
        parts.forEach((child, j) => {
          if (i !== j && child.width * child.height < part.width * part.height && child.x >= part.x && child.y >= part.y && child.x + child.width <= part.x + part.width && child.y + child.height <= part.y + part.height) {
            layer.drawImage(images[j + 3], child.x - part.x, child.y - part.y)
          }
        })
        return target
      })
      ready = true
      wrap.dataset.parts = String(files.length)
      wrap.dataset.ready = 'true'
      resize()
    }).catch(() => {
      // If a crop fails, the supplied video's poster and its complete 360 remain usable.
      if (alive) { canvas.style.display = 'none'; wrap.dataset.partsError = 'true' }
    })
    video.addEventListener('loadeddata', onVideoReady)
    video.addEventListener('loadedmetadata', invalidate)
    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onVideoError)
    if (!media.matches) { video.src = '/videos/camera-360.mp4'; video.load() }
    const observer = new ResizeObserver(resize); observer.observe(canvas)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', resize)
    media.addEventListener('change', onMotionChange)
    return () => {
      alive = false; cancelAnimationFrame(raf); observer.disconnect()
      video.pause(); video.removeEventListener('loadeddata', onVideoReady); video.removeEventListener('loadedmetadata', invalidate)
      video.removeEventListener('seeked', onSeeked); video.removeEventListener('error', onVideoError)
      video.removeAttribute('src'); video.load()
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', resize)
      media.removeEventListener('change', onMotionChange)
    }
  }, [])

  return (
    <section ref={wrapRef} id="inicio" className="camera-story camera-story-360" aria-label="RENDER Multimedia, producción audiovisual">
      <div className="camera-stage">
        <h1 ref={titleRef} className="camera-brand" aria-label="RENDER Multimedia">RENDER <span>Multimedia</span></h1>
        <div className="camera-scene" role="img" aria-label="Cámara de cine que se desarma, gira 360 grados y se vuelve a armar con el scroll">
          <video ref={videoRef} className="camera-video" poster="/assets/camera/360-poster.png" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" />
          <canvas ref={canvasRef} className="camera-canvas" aria-hidden="true" />
        </div>
        <a className="camera-skip" href="#portfolio">Ver nuestro trabajo <ArrowUpRight size={18} aria-hidden="true" /></a>
        <div className="camera-caption">
          <div ref={chaptersRef} className="camera-chapters">
            {CHAPTERS.map(([title, detail], i) => <div key={title} data-chapter={i} hidden={i !== 0}><p className="camera-chapter-title">{title}</p><p className="camera-chapter-detail">{detail}</p></div>)}
          </div>
          <div className="camera-scroll-hint" aria-hidden="true"><ArrowDown size={18} /><span>Desarma. Gira. Vuelve a armar.</span></div>
        </div>
        <div className="camera-progress" aria-hidden="true"><div ref={progressRef} /></div>
      </div>
    </section>
  )
}
