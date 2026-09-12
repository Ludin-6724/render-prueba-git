import { Link } from 'react-router'
import { proceso, servicios } from '@/content/site'
import Contacto from '@/sections/Contacto'

export default function ServiciosPage() {
  return (
    <main>
      <section className="bg-white px-6 md:px-12 pt-32 pb-16 md:pt-40 md:pb-24">
        <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">Servicios</p>
        <h1 className="font-display uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-4xl">
          Conoce nuestros servicios
        </h1>
      </section>

      {servicios.map((s) => (
        <section key={s.slug} className="px-6 md:px-12 py-16 md:py-24 border-t border-[#0f0f0f]">
          <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">{s.n}</p>
          <h2 className="font-display uppercase text-4xl md:text-6xl tracking-tight mb-6">{s.titulo}</h2>
          <p className="max-w-2xl text-[#5c5c5c] text-base leading-relaxed mb-10">{s.desc}</p>
          <ul className="max-w-3xl divide-y divide-[#ececec] border-y border-[#ececec]">
            {s.items.map((item) => (
              <li key={item} className="py-4 text-sm md:text-base leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="bg-[#faf7f2] px-6 md:px-12 py-20 md:py-28 border-t border-[#ececec]">
        <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">Cómo trabajamos</p>
        <h2 className="font-display uppercase text-4xl md:text-6xl tracking-tight mb-12">El proceso</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {proceso.map((paso, i) => (
            <li key={paso} className="flex gap-4">
              <span className="font-display text-3xl text-[#f7ac42]">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-base leading-relaxed pt-1">{paso}</p>
            </li>
          ))}
        </ol>
        <Link to="/contacto/" className="inline-block mt-12 font-mono2 text-[11px] uppercase tracking-[0.25em] hover:text-[#f7ac42]">
          Cotizar un trabajo →
        </Link>
      </section>

      <Contacto />
    </main>
  )
}
