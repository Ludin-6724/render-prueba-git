import { Outlet } from 'react-router'
import Navbar from '@/sections/Navbar'
import Footer from '@/sections/Footer'
import CustomCursor from '@/components/CustomCursor'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { useReveal } from '@/hooks/useReveal'

export default function Layout() {
  useReveal()

  return (
    <div className="bg-white text-[#0f0f0f]">
      <CustomCursor />
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
