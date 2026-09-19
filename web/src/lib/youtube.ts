/** Extract only IDs from trusted YouTube URL shapes, never interpolate an arbitrary URL into an iframe. */
export function youtubeId(value: string): string | null {
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol)) return null
    const host = url.hostname.toLowerCase()
    const id = host === 'youtu.be' ? url.pathname.split('/')[1]
      : ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host) && url.pathname === '/watch' ? url.searchParams.get('v') : null
    return id && /^[\w-]{11}$/.test(id) ? id : null
  } catch { return null }
}
export function youtubePosters(id: string): string[] {
  return ['maxresdefault', 'sddefault', 'hqdefault'].map(size => `https://img.youtube.com/vi/${id}/${size}.jpg`)
}
