import { Navigate, Route, Routes } from 'react-router'
import Layout from '@/layouts/Layout'
import HomePage from '@/pages/HomePage'
import ServiciosPage from '@/pages/ServiciosPage'
import ProyectosPage from '@/pages/ProyectosPage'
import NosotrosPage from '@/pages/NosotrosPage'
import ContactoPage from '@/pages/ContactoPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicios" element={<Navigate to="/servicios/" replace />} />
        <Route path="/servicios/" element={<ServiciosPage />} />
        <Route path="/comercial" element={<Navigate to="/comercial/" replace />} />
        <Route path="/comercial/" element={<ProyectosPage categoria="comercial" />} />
        <Route path="/ongs" element={<Navigate to="/ongs/" replace />} />
        <Route path="/ongs/" element={<ProyectosPage categoria="ongs" />} />
        <Route path="/nosotros" element={<Navigate to="/nosotros/" replace />} />
        <Route path="/nosotros/" element={<NosotrosPage />} />
        <Route path="/contacto" element={<Navigate to="/contacto/" replace />} />
        <Route path="/contacto/" element={<ContactoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
