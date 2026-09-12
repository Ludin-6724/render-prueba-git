import { useState } from 'react'

type Props = {
  id: string
  title: string
}

export default function YoutubeEmbed({ id, title }: Props) {
  const [play, setPlay] = useState(false)
  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

  if (!play) {
    return (
      <button
        type="button"
        onClick={() => setPlay(true)}
        className="group relative block aspect-video w-full overflow-hidden bg-[#111] text-left"
        aria-label={`Reproducir ${title}`}
      >
        <img
          src={poster}
          alt=""
          width={480}
          height={360}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f7ac42] text-[#0b0b0b]">
          <span className="ml-0.5 border-y-[7px] border-l-[12px] border-y-transparent border-l-current" />
        </span>
      </button>
    )
  }

  return (
    <div className="aspect-video w-full overflow-hidden bg-black">
      <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
