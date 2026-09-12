import Hero from '@/sections/Hero'
import Marquee from '@/sections/Marquee'
import Manifiesto from '@/sections/Manifiesto'
import Servicios from '@/sections/Servicios'
import Portfolio from '@/sections/Portfolio'
import Testimonios from '@/sections/Testimonios'
import Nosotros from '@/sections/Nosotros'
import Contacto from '@/sections/Contacto'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Manifiesto />
      <Servicios />
      <Portfolio />
      <Testimonios />
      <Marquee invert />
      <Nosotros />
      <Contacto />
    </main>
  )
}
