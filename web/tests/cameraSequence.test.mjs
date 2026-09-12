import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CameraSequence } from '../src/lib/cameraSequence.ts'

const tick = () => new Promise(resolve => setTimeout(resolve, 5))
const until = async predicate => { for (let i = 0; i < 100; i++) { if (predicate()) return; await tick() } assert.fail('Timed out') }

function environment({ fail = false } = {}) {
  const originals = Object.fromEntries(['fetch', 'createImageBitmap', 'requestAnimationFrame', 'cancelAnimationFrame'].map(k => [k, globalThis[k]]))
  let active = 0, peak = 0, live = 0, maxLive = 0, draws = [], urls = []
  globalThis.requestAnimationFrame = callback => setTimeout(callback, 0)
  globalThis.cancelAnimationFrame = clearTimeout
  globalThis.fetch = async (url, { signal }) => {
    urls.push(url); active++; peak = Math.max(peak, active)
    await tick(); active--
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
    return { ok: !fail, blob: async () => new Blob([url.match(/(\d+)\.webp/)[1]]) }
  }
  globalThis.createImageBitmap = async blob => {
    const index = Number(await blob.text()); await tick(); live++; maxLive = Math.max(maxLive, live)
    return { index, close: () => { live-- } }
  }
  const canvas = { getContext: () => ({ drawImage: bitmap => draws.push(bitmap.index) }) }
  return { canvas, draws, urls, get peak() { return peak }, get live() { return live }, get maxLive() { return maxLive }, restore() { Object.assign(globalThis, originals) } }
}

test('latest scroll target wins, reverse works, requests and decoded memory stay bounded', async () => {
  const env = environment(); let rendered = -1
  const player = new CameraSequence(env.canvas, 'mobile', index => rendered = index, () => assert.fail('Unexpected failure'))
  try {
    player.seek(0)
    await until(() => rendered === 0)
    player.seek(15); player.seek(80); player.seek(120)
    await until(() => rendered === 120)
    player.seek(45)
    await until(() => rendered === 45)
    player.seek(0)
    await until(() => rendered === 0)
    assert.ok(env.peak <= 4, `Concurrent requests: ${env.peak}`)
    assert.ok(env.maxLive <= 11, `Decoded allocations: ${env.maxLive}`)
    assert.equal(new Set(env.urls).size, env.urls.length, 'No repeated downloads')
  } finally { player.dispose(); await tick(); assert.equal(env.live, 0); env.restore() }
})

test('offscreen loading pauses; disposal releases decoded frames and cancels pending work', async () => {
  const env = environment(); let rendered = -1
  const player = new CameraSequence(env.canvas, 'desktop', index => rendered = index, () => {})
  try {
    player.setVisible(false); player.seek(40); await tick()
    assert.equal(env.urls.length, 0)
    player.setVisible(true); await until(() => rendered === 40)
    player.setVisible(false); await tick(); await tick()
    const requests = env.urls.length
    player.seek(100); await tick(); assert.equal(env.urls.length, requests)
    player.dispose(); const draws = env.draws.length
    await tick(); await tick()
    assert.equal(env.draws.length, draws)
    assert.equal(env.live, 0)
  } finally { player.dispose(); env.restore() }
})

test('failed assets use the poster without downloading an endless failed sequence', async () => {
  const env = environment({ fail: true }); let failed = 0
  const player = new CameraSequence(env.canvas, 'mobile', () => assert.fail('No valid image'), () => failed++)
  try {
    player.seek(0); await until(() => failed > 0); await tick()
    assert.equal(failed, 1)
    assert.ok(env.urls.length <= 7)
  } finally { player.dispose(); env.restore() }
})
