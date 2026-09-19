import { useState } from 'react'
import { Users, Pause, Play } from 'lucide-react'
import { team } from '@/content/site'
import TeamMarquee from '@/components/TeamMarquee'
import './Nosotros.css'

function TeamPhoto({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const initials = name.split(/\s+/).map(part => part[0]).slice(0, 2).join('')
  return src && !failed
    ? <img src={src} alt={name} width={640} height={800} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    : <div className="render-team-initials" role="img" aria-label={`Foto pendiente de ${name}`}>{initials}</div>
}

// Adapted from the supplied team marquee; only RENDER's local people and assets.
export default function Nosotros() {
  const [paused, setPaused] = useState(false)
  return (
    <section id="nosotros" className="render-team" aria-labelledby="team-title">
      <div className="render-team-heading section-shell">
        <span className="render-team-icon" aria-hidden="true"><Users size={26} /></span>
        <h2 id="team-title" className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tight">Quién está detrás de RENDER</h2>
        <p className="type-body">Un solo equipo en Chiquimula. Se planifica, se produce y se publica bajo el mismo techo.</p>
        <button type="button" className="render-team-pause" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
          {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          {paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
        </button>
      </div>
      <TeamMarquee pauseOnHover paused={paused}>
        {team.map(member => <li className="render-team-card" key={member.nombre}>
          <figure>
            <TeamPhoto src={member.img} name={member.nombre} />
            <figcaption><h3>{member.nombre}</h3><p>{member.cargo}</p></figcaption>
          </figure>
        </li>)}
      </TeamMarquee>
    </section>
  )
}
