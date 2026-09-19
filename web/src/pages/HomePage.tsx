import ScrollMorphHero from '@/components/hero/scroll-morph-hero'
import Proceso from '@/sections/Proceso'
import Manifiesto from '@/sections/Manifiesto'
import Portfolio from '@/sections/Portfolio'
import Testimonios from '@/sections/Testimonios'
import Nosotros from '@/sections/Nosotros'
import Contacto from '@/sections/Contacto'

export default function HomePage() {
  return (
    <main>
      <ScrollMorphHero />
      <Portfolio />
      <Proceso />
      <Manifiesto />
      <Testimonios />
      <Nosotros />
      <Contacto />
    </main>
  )
}
