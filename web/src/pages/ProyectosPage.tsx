import { Link } from 'react-router'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { comercial, ongs, type Proyecto } from '@/content/site'

type Props = {
  categoria: 'comercial' | 'ongs'
}

export default function ProyectosPage({ categoria }: Props) {
  const list: Proyecto[] = categoria === 'comercial' ? comercial : ongs
  const title = categoria === 'comercial' ? 'Comercial' : "ONG's"
  const otherHref = categoria === 'comercial' ? '/ongs/' : '/comercial/'
  const otherLabel = categoria === 'comercial' ? "Ver ONG's" : 'Ver comercial'

  return (
    <main>
      <section className="bg-[#0b0b0b] text-[#FFF4E9] px-6 md:px-12 pt-32 pb-16 md:pt-40">
        <p className="font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">Nuestro trabajo</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="font-display uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight">{title}</h1>
          <Link to={otherHref} className="font-mono2 text-[11px] uppercase tracking-[0.25em] text-[#f7ac42] hover:text-[#FFF4E9]">
            {otherLabel} →
          </Link>
        </div>
      </section>

      <section className="bg-[#0b0b0b] text-[#FFF4E9] px-6 md:px-12 pb-24 space-y-20">
        {list.map((p, i) => (
          <article key={p.youtube} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-white/10 pt-12">
            <div className={`lg:col-span-6 ${i % 2 ? 'lg:order-2' : ''}`}>
              <YoutubeEmbed id={p.youtube} title={p.titulo} />
            </div>
            <div className="lg:col-span-6">
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-[#f7ac42] mb-3">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="font-display uppercase text-3xl md:text-5xl tracking-tight mb-5">{p.titulo}</h2>
              <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-xl">{p.desc}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
