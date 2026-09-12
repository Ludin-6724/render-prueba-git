import { useEffect, useRef, useState } from 'react'

const WORDS = ['AUDIOVISUAL', 'DISEÑO GRÁFICO', 'MARKETING']

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stage, setStage] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const video = videoRef.current
    if (reduced) {
      if (video) video.pause()
      return
    }

    let raf = 0
    const sync = () => {
      const el = wrapRef.current
      const vid = videoRef.current
      if (!el || !vid || !Number.isFinite(vid.duration) || vid.duration === 0) return
      const total = Math.max(1, el.offsetHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total))
      setStage(Math.min(WORDS.length - 1, Math.floor(p * WORDS.length)))
      const t = p * vid.duration
      if (Math.abs(vid.currentTime - t) > 0.05) {
        try {
          vid.currentTime = t
        } catch {
          /* seek may throw before data */
        }
      }
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(sync)
    }

    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [ready])

  return (
    <div ref={wrapRef} id="inicio" className="relative h-[280vh] bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#f7f4ee]">
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            muted
            playsInline
            preload="metadata"
            poster="/videos/Video1Render-poster.jpg"
            onLoadedMetadata={(e) => {
              e.currentTarget.pause()
              setReady(true)
            }}
            aria-hidden
          >
            <source src="/videos/Video1Render.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start pt-[12vh] select-none">
          <h1 className="font-display uppercase leading-[0.82] tracking-tight text-center">
            <span className="char-reveal block text-[16vw] md:text-[11vw] text-[#0f0f0f]">
              {'RENDER'.split('').map((ch, i) => (
                <span key={i} style={{ animationDelay: `${0.05 + i * 0.06}s` }}>{ch}</span>
              ))}
            </span>
            <span className="char-reveal block text-[8vw] md:text-[5.2vw] text-stroke">
              {'MULTIMEDIA'.split('').map((ch, i) => (
                <span key={i} style={{ animationDelay: `${0.45 + i * 0.045}s` }}>{ch}</span>
              ))}
            </span>
          </h1>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-6 pb-8 md:px-12 pointer-events-none">
          <div className="max-w-xs">
            <p className="font-mono2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#9a9a9a]">
              Productora audiovisual
            </p>
            <p className="font-mono2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#0f0f0f] mt-1">
              Chiquimula · Guatemala
            </p>
          </div>

          <div className="hidden md:flex flex-col items-center">
            <div className="h-14 w-px bg-[#e5e5e5] overflow-hidden">
              <div className="h-full w-full bg-[#f7ac42] scroll-line" />
            </div>
            <p className="font-mono2 text-[10px] uppercase tracking-[0.35em] mt-3 text-[#9a9a9a]">Scroll</p>
          </div>

          <div className="text-right">
            <p key={stage} className="font-display uppercase text-lg md:text-2xl text-[#f7ac42] rec-stage whitespace-nowrap">
              {WORDS[stage]}
            </p>
            <p className="font-mono2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#9a9a9a] mt-1">
              La cámara avanza con el scroll
            </p>
          </div>
        </div>

        <div className="absolute top-24 right-6 md:right-12 z-20 flex items-center gap-2 pointer-events-none">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff3b30] rec-blink" />
          <span className="font-mono2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#0f0f0f]">Render · Rec</span>
        </div>
      </div>
    </div>
  )
}
