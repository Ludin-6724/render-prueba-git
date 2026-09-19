import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { nav, site } from '@/content/site'

const navLinkClass = 'flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.06em] text-[#0f0f0f] underline-offset-8 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f0f0f]'

const serviceLinks = [
  { label: 'Audiovisuales', href: '/#audiovisuales' },
  { label: 'Marketing digital', href: '/#marketing' },
  { label: 'Diseño gráfico', href: '/#diseno' },
]

function ServicesMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const details = useRef<HTMLDetailsElement>(null)
  return <details ref={details} className="relative" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
  }} onKeyDown={event => {
    if (event.key === 'Escape' && details.current?.open) { event.preventDefault(); event.stopPropagation(); details.current!.open = false; details.current?.querySelector('summary')?.focus() }
  }}>
    <summary className={mobile ? 'cursor-pointer border-b border-white/15 py-3 text-[clamp(2rem,4.2vw,4rem)] font-semibold uppercase tracking-[0.06em] focus-visible:outline' : `${navLinkClass} cursor-pointer gap-2`}>
      SERVICIOS <span aria-hidden="true" className="text-sm">⌄</span>
    </summary>
    <div className={mobile ? 'grid gap-1 border-b border-white/15 py-3 pl-4' : 'absolute left-0 top-full min-w-64 border border-[#ececec] bg-white p-3 shadow-lg'}>
      {serviceLinks.map(item => <Link key={item.href} to={item.href} onClick={() => { if (details.current) details.current.open = false; onNavigate?.() }}
        className={`flex min-h-11 items-center px-3 text-sm font-semibold uppercase tracking-[0.06em] underline-offset-4 hover:underline focus-visible:outline ${mobile ? 'text-white' : 'text-[#0f0f0f]'}`}>{item.label}</Link>)}
    </div>
  </details>
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const previousOverflow = useRef('')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    dialogRef.current?.close()
  }, [location.pathname])

  useEffect(() => {
    const dialog = dialogRef.current
    return () => {
      if (dialog?.open) document.body.style.overflow = previousOverflow.current
    }
  }, [])

  const openMenu = () => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    previousOverflow.current = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    setOpen(true)
  }

  const closeMenu = () => dialogRef.current?.close()
  const overlay = nav

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 border-b bg-white/95 transition-[border-color] duration-300 motion-reduce:transition-none ${scrolled ? 'border-[#ececec]' : 'border-transparent'}`}
      >
        <div className="flex items-center justify-between gap-6 px-6 md:px-12 h-20">
          <Link to="/" className="flex min-h-11 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f0f0f]">
            <img src="/brand/logo.svg" alt={site.name} width="1211" height="465" className="h-8 md:h-10 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Principal">
            {nav.slice(1).map((item) => item.label === 'SERVICIOS' ? <ServicesMenu key={item.href} /> : (
              <Link key={item.href} to={item.href} aria-current={location.pathname === item.href ? 'page' : undefined} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/#contacto"
              className="hidden md:inline-flex min-h-11 items-center border border-[#0f0f0f] px-5 text-sm font-semibold hover:bg-[#0f0f0f] hover:text-white transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f0f0f]"
            >
              Cotizar
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={openMenu}
              aria-label="Abrir menú"
              aria-expanded={open}
              aria-controls="menu-completo"
              aria-haspopup="dialog"
              className="flex h-11 w-11 shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f0f0f]"
            >
              <svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
                <path d="M1 3h26M1 12h26M1 21h26" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <dialog
        id="menu-completo"
        ref={dialogRef}
        aria-labelledby="menu-title"
        onClose={() => {
          document.body.style.overflow = previousOverflow.current
          setOpen(false)
          menuButtonRef.current?.focus({ preventScroll: true })
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-y-auto overscroll-contain border-0 bg-[#0b0b0b] p-0 text-[#FFF4E9] backdrop:bg-[#0b0b0b]"
      >
        <h2 id="menu-title" className="sr-only">Menú principal</h2>
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Cerrar menú"
          className="fixed right-6 top-[18px] z-10 flex h-11 w-11 items-center justify-center bg-[#0b0b0b] text-[#FFF4E9] hover:text-white md:right-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF4E9]"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="m5 5 18 18M23 5 5 23" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <div className="relative flex min-h-full flex-col justify-between gap-12 px-6 md:px-12 pt-28 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <nav className="relative z-[1] flex flex-col" aria-label="Menú completo">
            {overlay.map((item) => item.label === 'SERVICIOS' ? <ServicesMenu key={item.href} mobile onNavigate={closeMenu} /> : (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeMenu}
                aria-current={location.pathname === item.href ? 'page' : undefined}
                className="flex min-h-11 items-center border-b border-white/15 py-3 text-[clamp(2rem,4.2vw,4rem)] font-semibold uppercase leading-tight tracking-[0.06em] underline-offset-8 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF4E9]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-[1] flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-sm text-[#c9c1b9]">Escríbenos</p>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center break-all text-base underline-offset-4 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFF4E9]">
                {site.email}
              </a>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-[#c9c1b9]">Estudio</p>
              <p className="mt-2 text-base">10 avenida 4-40, Chiquimula 20001</p>
            </div>
          </div>

          <img
            src="/brand/isotipo.svg"
            alt=""
            width="764"
            height="950"
            className="pointer-events-none absolute bottom-0 right-0 w-56 opacity-[0.07] md:w-80"
          />
        </div>
      </dialog>
    </>
  )
}
