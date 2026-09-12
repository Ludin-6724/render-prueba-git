import { useEffect, useRef, useState, type FocusEvent, type RefObject } from 'react'

/** Rotation is suspended offscreen, while reading/focusing, and during video playback. */
export function useCarouselAutoplay(containerRef: RefObject<HTMLDivElement | null>, advance: () => void, blocked = false, delay = 6500) {
  const latestAdvance = useRef(advance)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => { latestAdvance.current = advance }, [advance])
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReduced(media.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35), { threshold: 0.35 })
    if (containerRef.current) observer.observe(containerRef.current)
    document.addEventListener('visibilitychange', updateVisibility)
    media.addEventListener('change', updateMotion)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', updateVisibility); media.removeEventListener('change', updateMotion) }
  }, [containerRef])
  const running = !paused && !blocked && !reduced && visible && pageVisible && !hovered && !focused
  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => latestAdvance.current(), delay)
    return () => clearInterval(timer)
  }, [running, delay])
  return {
    paused, reduced, running,
    toggle: () => setPaused((value) => !value),
    interaction: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      },
    },
  }
}
