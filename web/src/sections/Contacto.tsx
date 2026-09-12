import { site } from '@/content/site'

type Props = {
  error?: string | null
}

export default function Contacto({ error = null }: Props) {
  return (
    <section id="contacto" className="bg-[#0b0b0b] text-[#FFF4E9] px-6 md:px-12 py-24 md:py-36">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
        <div className="lg:col-span-6">
          <p className="reveal font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-4">Contacto</p>
          <h2 className="reveal reveal-delay-1 font-display uppercase text-[12vw] md:text-[5.6vw] leading-[0.88] tracking-tight">
            Quiero cotizar<br />un <span className="text-[#f7ac42]">trabajo</span>
          </h2>
          <div className="reveal reveal-delay-2 mt-12 space-y-6">
            <div>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Correo</p>
              <a href={`mailto:${site.email}`} className="text-lg md:text-xl hover:text-[#f7ac42] transition-colors">
                {site.email}
              </a>
            </div>
            <div>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Teléfono / WhatsApp</p>
              <a href={`tel:${site.phoneTel}`} className="text-lg md:text-xl hover:text-[#f7ac42] transition-colors">
                {site.phone}
              </a>
            </div>
            <div>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">Estudio</p>
              <p className="text-lg md:text-xl">{site.address}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 reveal reveal-delay-2">
          {error ? (
            <p role="alert" className="mb-8 border border-[#f7ac42] px-4 py-3 text-sm text-[#f7ac42]">
              {error}
            </p>
          ) : null}
          <form action={site.formAction} method="POST" className="relative space-y-8">
            <div className="absolute -left-[9999px]" aria-hidden>
              <label>
                Sitio web
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <label className="block">
                <span className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40">Nombre *</span>
                <input
                  required
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  className="mt-3 w-full bg-transparent border-b border-white/25 pb-3 text-lg outline-none placeholder:text-white/25 focus:border-[#f7ac42] transition-colors"
                />
              </label>
              <label className="block">
                <span className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40">Empresa *</span>
                <input
                  required
                  name="empresa"
                  type="text"
                  autoComplete="organization"
                  className="mt-3 w-full bg-transparent border-b border-white/25 pb-3 text-lg outline-none placeholder:text-white/25 focus:border-[#f7ac42] transition-colors"
                />
              </label>
            </div>

            <label className="block">
              <span className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40">Email *</span>
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                className="mt-3 w-full bg-transparent border-b border-white/25 pb-3 text-lg outline-none placeholder:text-white/25 focus:border-[#f7ac42] transition-colors"
              />
            </label>

            <fieldset>
              <legend className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40">Servicio requerido *</legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {site.formServices.map((s, i) => (
                  <label key={s} className="cursor-pointer">
                    <input type="radio" name="servicio" value={s} defaultChecked={i === 0} className="peer sr-only" required={i === 0} />
                    <span className="inline-block border border-white/25 px-5 py-2.5 font-mono2 text-[11px] uppercase tracking-[0.2em] transition-all peer-checked:bg-[#f7ac42] peer-checked:text-[#0b0b0b] peer-checked:border-[#f7ac42] hover:border-[#f7ac42]">
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40">Mensaje *</span>
              <textarea
                required
                name="mensaje"
                rows={4}
                className="mt-3 w-full bg-transparent border-b border-white/25 pb-3 text-lg outline-none placeholder:text-white/25 focus:border-[#f7ac42] transition-colors resize-none"
              />
            </label>

            <button
              type="submit"
              className="group inline-flex items-center gap-4 bg-[#f7ac42] text-[#0b0b0b] px-10 py-5 font-display uppercase tracking-tight text-lg hover:bg-[#FFF4E9] transition-colors"
            >
              Enviar
              <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
