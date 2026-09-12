const ITEMS = ['PRODUCCIÓN AUDIOVISUAL', 'DISEÑO GRÁFICO', 'MARKETING DIGITAL', 'RENDER MULTIMEDIA', 'CHIQUIMULA']

export default function Marquee({ invert = false }: { invert?: boolean }) {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className={`overflow-hidden border-y py-4 md:py-5 select-none ${invert ? 'bg-[#0b0b0b] border-[#1c1c1c]' : 'bg-white border-[#ececec]'}`}>
      <div className="flex w-max animate-marquee gap-0">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className={`font-display uppercase text-2xl md:text-4xl tracking-tight whitespace-nowrap ${invert ? 'text-[#FFF4E9]' : 'text-[#0f0f0f]'}`}>
                  {item}
                </span>
                <img src="/brand/isotipo.svg" alt="" className="mx-6 md:mx-8 h-7 md:h-9 w-auto" aria-hidden />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
