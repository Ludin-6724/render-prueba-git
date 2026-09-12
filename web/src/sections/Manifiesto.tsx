export default function Manifiesto() {
  return (
    <section className="bg-white px-6 md:px-12 py-28 md:py-44">
      <div className="max-w-6xl">
        <p className="reveal font-mono2 text-[11px] uppercase tracking-[0.35em] text-[#f7ac42] mb-8">
          Manifiesto
        </p>
        <h2 className="reveal reveal-delay-1 font-display uppercase text-[8.5vw] md:text-[4.6vw] leading-[1.02] tracking-tight text-[#0f0f0f]">
          Cada historia merece
          <span className="text-stroke-accent"> renderizarse </span>
          con la calidad que
          <span className="text-[#f7ac42]"> tu marca </span>
          se merece.
        </h2>
        <div className="reveal reveal-delay-2 mt-12 flex items-center gap-6">
          <div className="h-px flex-1 bg-[#e5e5e5]" />
          <p className="font-mono2 text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#9a9a9a] whitespace-nowrap">
            Desde Chiquimula para el mundo
          </p>
        </div>
      </div>
    </section>
  )
}
