const STACK = [
  { name: 'PHP 8.x', desc: 'Formularios y backend ligero' },
  { name: 'Node.js', desc: 'Apps JavaScript en servidor' },
  { name: 'Python', desc: 'Scripts y aplicaciones' },
  { name: 'Perl', desc: 'Módulos y utilidades' },
  { name: 'WordPress', desc: 'Instalador Softaculous' },
  { name: 'MySQL', desc: 'Bases de datos' },
]

export default function Tecnologia() {
  return (
    <section id="tecnologia" className="bg-[#faf7f2] px-6 md:px-12 py-24 md:py-36 border-y border-[#ececec]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Imagen cPanel */}
        <div className="lg:col-span-7 reveal order-2 lg:order-1">
          <figure className="relative group">
            <div className="absolute -top-4 -left-4 w-full h-full border border-[#f7ac42] pointer-events-none" aria-hidden />
            <div className="relative overflow-hidden bg-white border border-[#e5e5e5] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-2 border-b border-[#ececec] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono2 text-[10px] uppercase tracking-[0.25em] text-[#9a9a9a]">
                  cpanel · rendermultimedia.com
                </span>
              </div>
              <img
                src="/assets/image.png"
                alt="Panel de software de cPanel con las tecnologías disponibles"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <figcaption className="mt-4 font-mono2 text-[10px] uppercase tracking-[0.3em] text-[#9a9a9a]">
              Fig. 01 — Software disponible en nuestro hosting
            </figcaption>
          </figure>
        </div>

        {/* Texto */}
        <div className="lg:col-span-5 order-1 lg:order-2 lg:pl-8">
          <p className="reveal font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">
            Infraestructura
          </p>
          <h2 className="reveal reveal-delay-1 font-display uppercase text-5xl md:text-6xl leading-[0.9] tracking-tight mb-8">
            Tecnología<br />
            <span className="text-stroke">de la casa</span>
          </h2>
          <p className="reveal reveal-delay-2 text-[#5c5c5c] text-sm md:text-base leading-relaxed mb-10">
            Nuestro sitio corre sobre cPanel: HTML, CSS y JavaScript puros con un único
            PHP para el formulario. Sin peso muerto, sin dependencias innecesarias —
            solo las tecnologías que el servidor admite, exprimidas al máximo.
          </p>

          <ul className="reveal reveal-delay-3 divide-y divide-[#e5e0d6] border-y border-[#e5e0d6]">
            {STACK.map((t) => (
              <li key={t.name} className="group flex items-center justify-between py-3.5">
                <span className="font-display uppercase text-lg md:text-xl tracking-tight group-hover:text-[#f7ac42] group-hover:translate-x-2 transition-all duration-300">
                  {t.name}
                </span>
                <span className="font-mono2 text-[10px] uppercase tracking-[0.2em] text-[#9a9a9a] text-right">
                  {t.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
