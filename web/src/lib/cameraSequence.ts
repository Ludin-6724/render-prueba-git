const ROOT = '/assets/camera/turn-v1'

export type CameraVariant = 'mobile' | 'desktop'
export const CAMERA_FRAMES = 121

/** Keep compressed frames, but decode only a small window around the scroll position. */
export class CameraSequence {
  private blobs = new Map<number, Blob>()
  private decoded = new Map<number, ImageBitmap>()
  private fetching = new Set<number>()
  private decoding = new Set<number>()
  private failed = new Set<number>()
  private abort = new AbortController()
  private target = 0
  private direction = 1
  private visible = true
  private stopped = false
  private raf = 0
  private drawn = -1
  private count: number
  private context: CanvasRenderingContext2D | null
  private variant: CameraVariant
  private onDraw: (index: number) => void
  private onFailure: () => void

  constructor(canvas: HTMLCanvasElement, variant: CameraVariant, onDraw: (index: number) => void, onFailure: () => void) {
    this.variant = variant
    this.count = CAMERA_FRAMES
    this.onDraw = onDraw
    this.onFailure = onFailure
    canvas.width = variant === 'mobile' ? 960 : 1280
    canvas.height = canvas.width * 9 / 16
    this.context = canvas.getContext('2d', { alpha: false })
    if (!this.context || typeof createImageBitmap !== 'function') {
      this.stopped = true
      onFailure()
    }
  }

  seek(index: number) {
    const next = Math.max(0, Math.min(this.count - 1, Math.round(index)))
    if (next !== this.target) this.direction = Math.sign(next - this.target)
    this.target = next
    this.schedulePaint()
    this.pump()
  }

  setVisible(visible: boolean) {
    this.visible = visible
    if (visible) { this.schedulePaint(); this.pump() }
  }

  private nearby() {
    const order = [this.target]
    for (let offset = 1; offset <= 4; offset++) {
      order.push(this.target + offset * this.direction, this.target - offset * this.direction)
    }
    return order.filter(index => index >= 0 && index < this.count)
  }

  private pump() {
    if (this.stopped || !this.visible) return
    const nearby = this.nearby()
    // The current position always takes precedence over background preloading.
    // Sparse anchors make large jumps useful before the whole turn downloads.
    const stride = (this.count - 1) / 10
    const anchors = Array.from({ length: 11 }, (_, i) => Math.round(i * stride))
    const rest = Array.from({ length: this.count }, (_, i) => i)
      .sort((a, b) => Math.abs(a - this.target) - Math.abs(b - this.target))
    for (const index of new Set([...nearby, ...anchors, ...rest])) {
      if (this.fetching.size >= 4) break
      if (this.blobs.has(index) || this.fetching.has(index) || this.failed.has(index)) continue
      this.fetching.add(index)
      void this.download(index)
    }
    for (const index of nearby) {
      if (this.decoding.size >= 2) break
      if (!this.blobs.has(index) || this.decoded.has(index) || this.decoding.has(index) || this.failed.has(index)) continue
      this.decoding.add(index)
      void this.decode(index)
    }
  }

  private async download(index: number) {
    try {
      const response = await fetch(`${ROOT}/${this.variant}/${String(index).padStart(3, '0')}.webp`, { signal: this.abort.signal, cache: 'force-cache' })
      if (!response.ok) throw new Error('Frame unavailable')
      const blob = await response.blob()
      if (!this.stopped) this.blobs.set(index, blob)
    } catch {
      if (!this.stopped) this.failed.add(index)
    } finally {
      this.fetching.delete(index)
      if (!this.stopped && this.failed.size >= 4 && this.blobs.size === 0) {
        this.onFailure()
        this.dispose()
      }
      this.pump()
    }
  }

  private async decode(index: number) {
    try {
      const bitmap = await createImageBitmap(this.blobs.get(index)!)
      if (this.stopped) { bitmap.close(); return }
      this.decoded.set(index, bitmap)
      // 10 decoded images maximum: ~20 MiB mobile / 35 MiB desktop.
      while (this.decoded.size > 10) {
        const farthest = [...this.decoded.keys()].sort((a, b) => Math.abs(b - this.target) - Math.abs(a - this.target))[0]
        this.decoded.get(farthest)!.close()
        this.decoded.delete(farthest)
      }
      this.schedulePaint()
    } catch {
      if (!this.stopped) this.failed.add(index)
    } finally {
      this.decoding.delete(index)
      this.pump()
    }
  }

  private schedulePaint() {
    if (this.stopped || !this.visible || this.raf) return
    this.raf = requestAnimationFrame(() => {
      this.raf = 0
      const nearest = [...this.decoded.keys()].sort((a, b) => Math.abs(a - this.target) - Math.abs(b - this.target))[0]
      if (nearest === undefined || nearest === this.drawn || !this.context) return
      // A completed old decode must never pull the image away from the new target.
      if (this.drawn >= 0 && Math.abs(nearest - this.target) > Math.abs(this.drawn - this.target)) return
      this.context.drawImage(this.decoded.get(nearest)!, 0, 0)
      this.drawn = nearest
      this.onDraw(nearest)
    })
  }

  dispose() {
    this.stopped = true
    this.abort.abort()
    cancelAnimationFrame(this.raf)
    this.decoded.forEach(bitmap => bitmap.close())
    this.decoded.clear()
    this.blobs.clear()
  }
}
