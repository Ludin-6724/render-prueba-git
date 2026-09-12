import { equipo } from '@/content/site'

export default function Nosotros() {
  return (
    <section id="nosotros" className="bg-white px-6 md:px-12 py-24 md:py-36 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16 md:mb-24">
        <div className="lg:col-span-8">
          <p className="reveal font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">Nosotros</p>
          <h2 className="reveal reveal-delay-1 font-display uppercase text-[9vw] md:text-[4.8vw] leading-[0.92] tracking-tight">
            ¿Quién está detrás<br />de <span className="text-[#f7ac42]">Render</span>?
          </h2>
        </div>
        <p className="reveal reveal-delay-2 lg:col-span-4 max-w-sm text-[#5c5c5c] text-sm md:text-base leading-relaxed">
          Un equipo de seis personas en Chiquimula que produce, diseña, edita y publica.
          Cada proyecto pasa por estas manos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
        {equipo.map((p, i) => (
          <figure key={p.nombre} className={`reveal ${i % 3 === 1 ? 'reveal-delay-1' : i % 3 === 2 ? 'reveal-delay-2' : ''} group`}>
            <div className="relative overflow-hidden rounded-[28px] bg-[#faf7f2] border border-[#f0e9dd]">
              <img
                src={p.img}
                alt={`${p.nombre} — ${p.cargo}`}
                width={640}
                height={690}
                loading="lazy"
                className="w-full aspect-[5/5.4] object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <span className="absolute top-4 left-4 font-mono2 text-[10px] uppercase tracking-[0.25em] bg-white/85 backdrop-blur px-3 py-1.5 rounded-full text-[#0f0f0f]">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <figcaption className="mt-5 flex items-baseline justify-between gap-3 border-b border-[#ececec] pb-4">
              <h3 className="font-display uppercase text-2xl md:text-[1.7rem] tracking-tight leading-none group-hover:text-[#f7ac42] transition-colors">
                {p.nombre}
              </h3>
              <p className="font-mono2 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-[#9a9a9a] text-right whitespace-nowrap">
                {p.cargo}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
