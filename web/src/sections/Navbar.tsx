import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { nav, site } from '@/content/site'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const overlay = [
    { label: 'INICIO', href: '/', n: '01' },
    { label: 'SERVICIOS', href: '/servicios/', n: '02' },
    { label: 'COMERCIAL', href: '/comercial/', n: '03' },
    { label: "ONG'S", href: '/ongs/', n: '04' },
    { label: 'NOSOTROS', href: '/nosotros/', n: '05' },
    { label: 'CONTACTO', href: '/contacto/', n: '06' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/85 backdrop-blur-md border-b border-[#ececec]' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src="/brand/logo.svg" alt={site.name} className="h-8 md:h-10 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Principal">
            {nav.slice(1).map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="font-mono2 text-[11px] uppercase tracking-[0.25em] text-[#0f0f0f] hover:text-[#f7ac42] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/contacto/"
              className="hidden md:inline-flex items-center gap-2 border border-[#0f0f0f] px-5 py-2.5 font-mono2 text-[11px] uppercase tracking-[0.25em] hover:bg-[#0f0f0f] hover:text-white transition-colors"
            >
              Cotizar
              <span className="text-[#f7ac42]">→</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              className="relative z-[70] flex h-11 w-11 flex-col items-center justify-center gap-[7px]"
            >
              <span className={`block h-[2px] w-7 transition-all duration-300 ${open ? 'translate-y-[9px] rotate-45 bg-white' : 'bg-[#0f0f0f]'}`} />
              <span className={`block h-[2px] w-7 transition-all duration-300 ${open ? 'opacity-0' : 'bg-[#0f0f0f]'}`} />
              <span className={`block h-[2px] w-7 transition-all duration-300 ${open ? '-translate-y-[9px] -rotate-45 bg-white' : 'bg-[#0f0f0f]'}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-[#0b0b0b] transition-[clip-path] duration-700 ${
          open ? '[clip-path:inset(0_0_0%_0)]' : '[clip-path:inset(0_0_100%_0)]'
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col justify-between px-6 md:px-12 pt-28 pb-10">
          <nav className="flex flex-col" aria-label="Menú completo">
            {overlay.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="group flex items-baseline gap-4 border-b border-white/10 py-3 md:py-4 overflow-hidden"
              >
                <span className="font-mono2 text-xs text-[#f7ac42]">{l.n}</span>
                <span className="font-display uppercase text-[9vw] md:text-[4.2vw] leading-none text-[#FFF4E9] transition-transform duration-500 group-hover:translate-x-4 group-hover:text-[#f7ac42]">
                  {l.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40">Escríbenos</p>
              <a href={`mailto:${site.email}`} className="font-mono2 text-sm text-[#FFF4E9] hover:text-[#f7ac42] transition-colors">
                {site.email}
              </a>
            </div>
            <div className="text-right">
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40">Estudio</p>
              <p className="font-mono2 text-sm text-[#FFF4E9]">10 avenida 4-40, Chiquimula 20001</p>
            </div>
          </div>
        </div>

        <img
          src="/brand/isotipo.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-16 -bottom-24 w-[420px] opacity-[0.07] animate-spin-slow"
        />
      </div>
    </>
  )
}
