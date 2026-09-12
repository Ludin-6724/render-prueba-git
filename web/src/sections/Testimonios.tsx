import { testimonios } from '@/content/site'

export default function Testimonios() {
  return (
    <section className="bg-[#faf7f2] border-y border-[#ececec] px-6 md:px-12 py-24 md:py-36">
      <p className="reveal font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-12 text-center">
        Qué dice la gente de nosotros
      </p>
      <div className="max-w-5xl mx-auto space-y-16">
        {testimonios.map((t, i) => (
          <blockquote key={i} className={`reveal ${i ? 'reveal-delay-1' : ''}`}>
            <p className={`font-display uppercase tracking-tight text-[#0f0f0f] leading-[1.12] ${
              i === 0 ? 'text-[5.4vw] md:text-[2.4vw]' : 'text-[4.2vw] md:text-[1.8vw] text-[#3a3a3a]'
            }`}>
              “{t}”
            </p>
          </blockquote>
        ))}
      </div>
    </section>
  )
}
