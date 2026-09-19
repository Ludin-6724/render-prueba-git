import { useId } from 'react'
import { site } from '@/content/site'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import './Contacto.css'

type Props = { error?: string | null }

export default function Contacto({ error = null }: Props) {
  const id = useId()
  return (
    <section id="contacto" className="render-contact" aria-labelledby={`${id}-title`}>
      <div className="section-shell contact-layout">
        <div className="contact-intro">
          <h2 id={`${id}-title`} className="type-section">Quiero cotizar un trabajo</h2>
          <p className="type-body contact-subtitle">Cuéntanos qué necesitas. Respondemos desde Chiquimula.</p>
          <address className="contact-details">
            <div><p>Correo</p><a href={`mailto:${site.email}`}>{site.email}</a></div>
            <div><p>Teléfono / WhatsApp</p><a href={`tel:${site.phoneTel}`}>{site.phone}</a></div>
            <div><p>Estudio</p><span>{site.address}</span></div>
          </address>
        </div>
        <form action={site.formAction} method="POST" className="contact-form" aria-label="Solicitar cotización">
          {error && <p role="alert" className="contact-error">{error}</p>}
          <div className="contact-honeypot" aria-hidden="true">
            <label>Sitio web<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <div className="contact-fields">
            <div>
              <Label htmlFor={`${id}-nombre`}>Nombre <span aria-hidden="true">*</span></Label>
              <Input id={`${id}-nombre`} name="nombre" type="text" autoComplete="name" maxLength={120} required />
            </div>
            <div>
              <Label htmlFor={`${id}-email`}>Email <span aria-hidden="true">*</span></Label>
              <Input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required />
            </div>
            <div>
              <Label htmlFor={`${id}-telefono`}>Teléfono / WhatsApp</Label>
              <Input id={`${id}-telefono`} name="telefono" type="tel" autoComplete="tel" maxLength={40} />
            </div>
            <div>
              <Label htmlFor={`${id}-servicio`}>Servicio</Label>
              <Select name="servicio" defaultValue="Audiovisuales">
                <SelectTrigger id={`${id}-servicio`}><SelectValue /></SelectTrigger>
                <SelectContent className="contact-service-options" position="popper">
                  {site.formServices.map(service => <SelectItem key={service} value={service}>{service}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="contact-message">
              <Label htmlFor={`${id}-mensaje`}>Mensaje <span aria-hidden="true">*</span></Label>
              <Textarea id={`${id}-mensaje`} name="mensaje" rows={6} maxLength={4000} required />
            </div>
          </div>
          <Separator className="contact-separator" />
          <div className="contact-actions"><Button type="submit" className="contact-send">Enviar</Button></div>
        </form>
      </div>
    </section>
  )
}
