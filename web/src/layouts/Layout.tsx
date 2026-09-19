import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Navbar from '@/sections/Navbar'
import Footer from '@/sections/Footer'
import CustomCursor from '@/components/CustomCursor'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { useReveal } from '@/hooks/useReveal'

export default function Layout() {
  useReveal()
  const contentRef = useRef<HTMLDivElement>(null)
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
    let id: string
    try { id = decodeURIComponent(hash.slice(1)) } catch { return }
    const target = ['portfolio', 'portafolio', 'trabajo'].includes(id) ? 'portafolio' : id
    const frame = requestAnimationFrame(() => {
      if (['audiovisuales', 'marketing', 'diseno'].includes(target) && document.querySelector('.scroll-morph')) {
        window.dispatchEvent(new CustomEvent('render:morph-navigate', { detail: target }))
        return
      }
      document.getElementById(target)?.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start',
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash, key])

  return (
    <div className="bg-white text-[#0f0f0f]">
      <a
        href="#contenido"
        onClick={(event) => {
          event.preventDefault()
          contentRef.current?.focus({ preventScroll: true })
          contentRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' })
        }}
        className="fixed left-6 top-4 z-[100] flex min-h-11 -translate-y-24 items-center bg-[#0f0f0f] px-5 text-base font-semibold text-white focus:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f0f0f]"
      >
        Saltar al contenido
      </a>
      <CustomCursor />
      <Navbar />
      <div id="contenido" ref={contentRef} tabIndex={-1} className="scroll-mt-24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0f0f0f]">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
