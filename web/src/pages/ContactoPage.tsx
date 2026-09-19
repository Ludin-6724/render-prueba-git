import { useSearchParams } from 'react-router'
import Contacto from '@/sections/Contacto'
import { site } from '@/content/site'

export default function ContactoPage() {
  const [params] = useSearchParams()
  const error = params.get('error')
    ? 'No se pudo enviar el mensaje. Revisá los campos e intentá de nuevo.'
    : null

  return (
    <main>
      <Contacto error={error} />
      <section className="bg-[#f7f4ee] px-6 md:px-12 pb-24">
        <p className="font-mono2 text-[10px] uppercase tracking-[0.3em] text-[#65625c] mb-4">Ubicación</p>
        <div className="aspect-[16/9] w-full overflow-hidden border border-[#ded9d0]">
          <iframe
            title="Mapa de RENDER Multimedia en Chiquimula"
            src={site.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full grayscale"
          />
        </div>
      </section>
    </main>
  )
}
