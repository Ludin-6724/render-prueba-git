import { Link } from 'react-router'
import { servicios } from '@/content/site'

export default function Servicios() {
  return (
    <section id="servicios" className="bg-white px-6 md:px-12 py-24 md:py-36">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
        <div className="reveal">
          <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">Qué hacemos</p>
          <h2 className="font-display uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight">
            Servicios
          </h2>
        </div>
        <p className="reveal reveal-delay-1 max-w-sm text-[#5c5c5c] text-sm md:text-base leading-relaxed">
          Tres disciplinas, un solo equipo. Se planifica, se produce y se publica bajo el mismo techo.
        </p>
      </div>

      <div className="border-t border-[#0f0f0f]">
        {servicios.map((s, i) => (
          <article
            key={s.n}
            className={`reveal ${i > 0 ? 'reveal-delay-' + i : ''} group grid grid-cols-12 items-start gap-4 border-b border-[#0f0f0f] py-10 md:py-14 transition-colors duration-500 hover:bg-[#faf7f2] px-2 md:px-4`}
          >
            <span className="col-span-2 md:col-span-1 font-display text-2xl md:text-4xl text-stroke-accent group-hover:text-[#f7ac42] group-hover:[-webkit-text-stroke:0px] transition-all">
              {s.n}
            </span>
            <h3 className="col-span-10 md:col-span-4 font-display uppercase text-3xl md:text-5xl tracking-tight transition-transform duration-500 group-hover:translate-x-3">
              {s.titulo}
            </h3>
            <p className="col-span-12 md:col-span-4 text-[#5c5c5c] text-sm md:text-base leading-relaxed md:pl-4">
              {s.desc}
            </p>
            <div className="col-span-12 md:col-span-3 flex flex-wrap gap-2 md:justify-end">
              {s.tags.map((t) => (
                <span key={t} className="font-mono2 text-[10px] uppercase tracking-[0.2em] border border-[#dcdcdc] px-3 py-1.5 group-hover:border-[#f7ac42] transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12">
        <Link
          to="/servicios/"
          className="font-mono2 text-[11px] uppercase tracking-[0.25em] text-[#0f0f0f] hover:text-[#f7ac42] transition-colors"
        >
          Ver el detalle de cada servicio →
        </Link>
      </div>
    </section>
  )
}
