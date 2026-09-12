import Hero from '@/sections/Hero'
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
      <Manifiesto />
      <Servicios />
      <Portfolio />
      <Testimonios />
      <Nosotros />
      <Contacto />
    </main>
  )
}
