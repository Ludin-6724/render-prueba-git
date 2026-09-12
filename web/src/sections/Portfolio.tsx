import { Link } from 'react-router'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { comercial, ongs } from '@/content/site'

export default function Portfolio() {
  const destacados = [comercial[0], ongs[0], comercial[2], ongs[4]]

  return (
    <section id="portfolio" className="bg-[#0b0b0b] text-[#FFF4E9]">
      <div className="px-6 md:px-12 pt-24 md:pt-36 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="reveal font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">Trabajo seleccionado</p>
          <h2 className="reveal reveal-delay-1 font-display uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight">
            Portfolio
          </h2>
        </div>
        <div className="reveal reveal-delay-2 flex gap-6 font-mono2 text-[10px] uppercase tracking-[0.25em]">
          <Link to="/comercial/" className="text-[#f7ac42] hover:text-[#FFF4E9]">Comercial</Link>
          <Link to="/ongs/" className="text-[#f7ac42] hover:text-[#FFF4E9]">ONG&apos;s</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {destacados.map((p, i) => (
          <article key={p.youtube} className={`reveal ${i ? 'reveal-delay-1' : ''} border-t border-white/10 p-6 md:p-10`}>
            <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-[#f7ac42] mb-3">
              {p.categoria === 'comercial' ? 'Comercial' : "ONG's"}
            </p>
            <h3 className="font-display uppercase text-2xl md:text-4xl tracking-tight mb-6">{p.titulo}</h3>
            <YoutubeEmbed id={p.youtube} title={p.titulo} />
            <p className="mt-5 text-white/60 text-sm leading-relaxed max-w-lg">{p.desc}</p>
          </article>
        ))}
      </div>

      <div className="border-t border-white/10 px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="font-mono2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
          {comercial.length} comerciales · {ongs.length} proyectos institucionales
        </p>
        <Link to="/comercial/" className="font-mono2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#f7ac42] hover:text-[#FFF4E9] transition-colors">
          Ver todo el trabajo →
        </Link>
      </div>
    </section>
  )
}
