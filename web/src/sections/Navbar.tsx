import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { nav, site } from '@/content/site'

const navLinkClass = 'flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.06em] text-[#0f0f0f] underline-offset-8 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f0f0f]'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const portfolioRef = useRef<HTMLDetailsElement>(null)
  const previousOverflow = useRef('')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onPointerDown = (event: PointerEvent) => {
      const portfolio = portfolioRef.current
      if (portfolio && event.target instanceof Node && !portfolio.contains(event.target)) portfolio.open = false
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  useEffect(() => {
    dialogRef.current?.close()
    if (portfolioRef.current) portfolioRef.current.open = false
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
    if (portfolioRef.current) portfolioRef.current.open = false
    previousOverflow.current = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    setOpen(true)
  }

  const closeMenu = () => dialogRef.current?.close()
  const overlay = nav.flatMap<{ label: string; href: string }>((item) => 'children' in item ? [...item.children] : [item])

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
            {nav.slice(1).map((item) => 'children' in item ? (
              <details
                key={item.label}
                ref={portfolioRef}
                className="group relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Escape' && event.currentTarget.open) {
                    event.preventDefault()
                    event.currentTarget.open = false
                    event.currentTarget.querySelector('summary')?.focus()
                  }
                }}
              >
                <summary className={`${navLinkClass} cursor-pointer list-none gap-2 [&::-webkit-details-marker]:hidden`}>
                  {item.label}
                  <svg className="transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </summary>
                <div className="absolute left-0 top-full min-w-44 border border-[#ececec] bg-white p-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      aria-current={location.pathname === child.href ? 'page' : undefined}
                      onClick={() => { if (portfolioRef.current) portfolioRef.current.open = false }}
                      className={`${navLinkClass} px-3 hover:bg-[#faf7f2] focus-visible:outline-offset-[-2px]`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link key={item.href} to={item.href} aria-current={location.pathname === item.href ? 'page' : undefined} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/contacto/"
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
            {overlay.map((item) => (
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
