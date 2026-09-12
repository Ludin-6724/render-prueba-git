import { Link } from 'react-router'
import { site } from '@/content/site'

export default function Footer() {
  return (
    <footer className="bg-[#0b0b0b] text-[#FFF4E9] border-t border-white/10">
      <div className="px-6 md:px-12 pt-16 pb-8">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <img src="/brand/logo.svg" alt={site.name} className="h-10 w-auto mb-6" />
            <p className="text-white/50 text-sm leading-relaxed">
              Productora audiovisual en Chiquimula, Guatemala.
              Producción audiovisual, diseño gráfico y marketing digital bajo un mismo techo.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Mapa del sitio</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  ['Inicio', '/'],
                  ['Servicios', '/servicios/'],
                  ['Comercial', '/comercial/'],
                  ["ONG's", '/ongs/'],
                  ['Nosotros', '/nosotros/'],
                  ['Contacto', '/contacto/'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link to={href} className="text-white/70 hover:text-[#f7ac42] transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Síguenos</p>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#f7ac42] transition-colors">Instagram</a>
                </li>
                <li>
                  <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-[#f7ac42] transition-colors">LinkedIn</a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">Información</p>
              <p className="text-sm text-white/70 leading-relaxed">
                Render Multimedia<br />
                {site.address}<br />
                <a href={`tel:${site.phoneTel}`} className="hover:text-[#f7ac42] transition-colors">{site.phone}</a><br />
                <a href={`mailto:${site.email}`} className="hover:text-[#f7ac42] transition-colors">{site.email}</a>
              </p>
            </div>
          </div>
        </div>

        <p className="font-display uppercase text-[13.5vw] leading-none text-center text-white/[0.06] select-none mt-16 -mb-4 tracking-tight">
          RENDER
        </p>
      </div>

      <div className="border-t border-white/10 px-6 md:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-white/35">
          © {new Date().getFullYear()} RENDER Multimedia — rendermultimedia.com
        </p>
        <p className="font-mono2 text-[10px] uppercase tracking-[0.25em] text-white/35">
          VISCODE
        </p>
      </div>
    </footer>
  )
}
