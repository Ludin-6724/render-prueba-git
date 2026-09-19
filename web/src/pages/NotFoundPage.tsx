import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">404</p>
      <h1 className="font-display uppercase text-5xl md:text-7xl tracking-tight mb-6">Página no encontrada</h1>
      <Link to="/" className="font-mono2 text-[11px] uppercase tracking-[0.25em] hover:text-[#f7ac42]">
        Volver al inicio →
      </Link>
    </main>
  )
}
