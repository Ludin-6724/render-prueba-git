import type { ReactNode } from 'react'

/** Local React adaptation of the supplied Marquee: matching tracks loop seamlessly. */
export default function TeamMarquee({ children, pauseOnHover = true, paused = false }: { children: ReactNode; pauseOnHover?: boolean; paused?: boolean }) {
  return <div className="render-team-marquee" data-pause-on-hover={pauseOnHover} data-paused={paused}>
    <div className="render-team-track">
      <ul className="render-team-group" aria-label="Equipo de RENDER">{children}</ul>
      <ul className="render-team-group render-team-clone" aria-hidden="true">{children}</ul>
    </div>
  </div>
}
