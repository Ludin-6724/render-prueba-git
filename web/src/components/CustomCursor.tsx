import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf = 0

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const t = e.target as HTMLElement
      const interactive = t.closest('a, button, input, textarea, select, [data-cursor]')
      ring.current?.classList.toggle('is-hover', !!interactive)
    }

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      if (dot.current) dot.current.style.transform = `translate(${pos.x - 4}px, ${pos.y - 4}px)`
      if (ring.current) {
        const size = ring.current.classList.contains('is-hover') ? 32 : 18
        ring.current.style.transform = `translate(${ringPos.x - size}px, ${ringPos.y - size}px)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot hidden md:block" />
      <div ref={ring} className="cursor-ring hidden md:block" />
    </>
  )
}
