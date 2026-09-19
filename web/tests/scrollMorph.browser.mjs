import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const base = process.env.RENDER_TEST_URL || 'http://127.0.0.1:7101/'
const errors = []
async function setup(options) {
  const page = await browser.newPage(options)
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(base)
  await page.locator('.scroll-morph, .morph-static').waitFor()
  return page
}
async function align(page) {
  await page.locator('.scroll-morph').evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' }))
  await page.mouse.move(100, 300)
}
async function act(page, expected) {
  await page.waitForFunction(value => document.querySelector('.scroll-morph')?.dataset.act === String(value), expected)
  await page.waitForTimeout(1800)
}
async function stepTo(page, expected, dir = 1) {
  for (let i = 0; i < 48; i++) {
    if (await page.locator('.scroll-morph').getAttribute('data-act') === String(expected)) break
    await page.mouse.wheel(0, dir > 0 ? 400 : -400)
    await page.waitForTimeout(700)
  }
  await act(page, expected)
  const service = ['audiovisuales', 'audiovisuales', 'marketing', 'diseno'][expected]
  const srcs = await page.locator('.morph-card img').evaluateAll(imgs => imgs.map(img => img.getAttribute('src')))
  assert.equal(srcs.length, expected === 0 ? 20 : Math.max(20, Number(await page.locator('.morph-ring').getAttribute('data-photo-count')) + 6))
  if (expected === 0) {
    for (const group of ['audiovisuales', 'marketing', 'diseno']) assert(srcs.some(src => src.includes(group)))
    assert.equal(await page.locator('.morph-logo').count(), 1)
    assert.equal(await page.locator('.morph-service-list, .morph-multimedia, .morph-intro-hint').count(), 0)
    assert.equal(await page.locator('.morph-editorial').textContent(), 'Producimos. Diseñamos. Hacemos que se vea.')
  } else assert(srcs.every(src => src.includes(service)))
  if (expected !== 1 && await page.locator('.morph-camera').count()) assert.equal(await page.locator('.morph-camera-stage').evaluate(el=>getComputedStyle(el).visibility),'hidden')
}
try {
  const page = await setup({ viewport: { width: 1440, height: 900 } })
  const timeline = await page.locator('.scroll-morph').evaluate(el => ({ marketing: Number(el.dataset.marketingStart), design: Number(el.dataset.designStart), max: Number(el.dataset.scrollMax) }))
  assert.equal(await page.locator('.hero-panel, .services-section').count(), 0)
  assert.equal(await page.locator('main > section').first().getAttribute('id'), 'inicio')
  assert.equal(await page.locator('main > section').first().getAttribute('class'), 'scroll-morph')
  assert.equal(await page.locator('.intro-overlay, .av-section, .sd-section, .camera-story').count(), 0)
  assert.equal(await page.locator('h1').count(), 1)
  assert.equal(await page.locator('.scroll-morph').evaluate(el => el.offsetHeight), 900)
  assert.equal(await page.locator('.av-scene').count(), 0)
  assert.equal(await page.locator('a[aria-label="Escríbenos por WhatsApp"]').count(), 1)
  await align(page)
  await act(page, 0)
  await page.screenshot({ path: '/tmp/render-morph-desktop-intro.png' })
  const beforeIdle = await page.locator('.morph-card').first().getAttribute('style')
  await page.waitForTimeout(500)
  assert.notEqual(await page.locator('.morph-card').first().getAttribute('style'), beforeIdle, 'Ring rotates before any scroll')
  const circleWidth = await page.locator('.morph-card').first().evaluate(el => el.getBoundingClientRect().width)
  await page.mouse.wheel(0, 300); await act(page, 1)
  const pinnedY = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, 80); await page.waitForTimeout(350)
  assert.equal(await page.evaluate(() => scrollY), pinnedY, 'Document stays pinned while the morph advances')
  await page.screenshot({ path: '/tmp/render-morph-first-av.png' })
  await page.mouse.wheel(0, 80)
  await page.waitForTimeout(900)
  const frameTurn = Number(await page.locator('.morph-camera').getAttribute('data-target-frame'))
  assert(frameTurn > 0, 'Camera turns with scroll')
  await page.screenshot({ path: '/tmp/render-morph-camera-turn.png' })
  await page.mouse.wheel(0, -80)
  await page.waitForTimeout(900)
  assert(Number(await page.locator('.morph-camera').getAttribute('data-target-frame')) < frameTurn, 'Camera reverses with scroll')
  await page.mouse.wheel(0, 80); await page.waitForTimeout(350)
  await page.mouse.wheel(0, 80); await act(page, 1)
  const workWidth = await page.locator('.morph-card').evaluateAll(els => Math.max(...els.map(el => el.getBoundingClientRect().width)))
  assert(workWidth > circleWidth * 1.5, 'Work cards grow after the intro')
  await page.screenshot({ path: '/tmp/render-morph-desktop-av.png' })
  await stepTo(page, 2)
  await stepTo(page, 3)
  await page.screenshot({ path: '/tmp/render-morph-desktop-design.png' })
  assert.equal(await page.locator('.morph-ring').getAttribute('data-photo-count'), '3')
  const beforeLeave = await page.evaluate(() => scrollY)
  let stayed = 0
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(350)
    if (await page.evaluate(() => scrollY) > beforeLeave) break
    stayed++
  }
  assert(stayed >= 1, 'Design keeps at least one extra slide before leaving')
  assert((await page.evaluate(() => scrollY)) > beforeLeave, 'Last design photo releases into the page')
  assert.equal(await page.locator('#after-scroll-morph + section').getAttribute('id'), 'portafolio')
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await page.waitForFunction(() => document.querySelector('.scroll-morph')?.dataset.virtualScroll === '0')
  assert.equal(await page.locator('.scroll-morph').getAttribute('data-reentered-intro'), 'true')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(400)
  await act(page, 0)
  assert.equal(await page.locator('.morph-logo').count(), 1)
  await align(page)
  await page.locator('.scroll-morph').focus(); await page.keyboard.press('End'); await act(page, 3)
  await stepTo(page, 2, -1)
  await stepTo(page, 0, -1)
  const start = await page.evaluate(() => scrollY)
  await page.mouse.wheel(0, -200); await page.waitForTimeout(500)
  assert.equal(await page.evaluate(() => scrollY), start, 'Hero remains at top when reverse scroll reaches zero')
  await align(page)
  await page.locator('.scroll-morph').focus(); await page.keyboard.press('End'); await act(page, 3)
  await page.keyboard.press('Tab'); assert.equal(await page.locator('.morph-skip').evaluate(el => el === document.activeElement), true)
  await page.keyboard.press('Enter'); await page.waitForTimeout(500)
  assert.equal(await page.evaluate(() => location.hash), '#after-scroll-morph')
  await page.getByRole('link', { name: 'Cotizar', exact: true }).first().click()
  await page.waitForURL(/contacto/)
  await page.locator('#contacto, form').first().waitFor()

  const mobile = await setup({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 })
  await align(mobile); await act(mobile, 0)
  await mobile.screenshot({ path: '/tmp/render-morph-mobile-intro.png' })
  const cdp = await mobile.context().newCDPSession(mobile)
  const swipe = async (dir = 1) => {
    const startY = dir > 0 ? 680 : 160
    const endY = dir > 0 ? 160 : 680
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: startY }] })
    for (let y = startY; dir > 0 ? y >= endY : y <= endY; y += dir > 0 ? -60 : 60) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] })
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await mobile.waitForTimeout(700)
  }
  await swipe(1)
  await mobile.waitForFunction(() => Number(document.querySelector('.scroll-morph')?.dataset.act) >= 1)
  assert.equal(await mobile.evaluate(() => scrollY), 0, 'First mobile swipe stays inside the hero')
  const firstBeat = await mobile.evaluate(() => {
    const copy = document.querySelector('.morph-copy')
    const cam = document.querySelector('.morph-camera-stage')
    const cards = [...document.querySelectorAll('.morph-card')].map(el => el.getBoundingClientRect())
    const vis = cards.filter(r => r.height > 40 && r.bottom > 80 && r.top < innerHeight - 24)
    return {
      copyH: Math.round(copy.getBoundingClientRect().height),
      camH: cam && getComputedStyle(cam).visibility !== 'hidden' ? Math.round(cam.getBoundingClientRect().height) : 0,
      photoH: vis.length ? Math.round(Math.max(...vis.map(r => r.height))) : 0,
    }
  })
  assert(firstBeat.copyH < 170, `Mobile copy should stay compact, got ${firstBeat.copyH}`)
  assert(firstBeat.camH > 120 || firstBeat.photoH > 160, `First mobile swipe should show camera or a readable photo, got ${JSON.stringify(firstBeat)}`)
  await mobile.screenshot({ path: '/tmp/render-morph-mobile-first-swipe.png' })
  for (let n = 0; n < 24; n++) {
    if (await mobile.locator('.scroll-morph').getAttribute('data-act') === '3') break
    await swipe(1)
  }
  await act(mobile, 3)
  await mobile.screenshot({ path: '/tmp/render-morph-mobile-design.png' })
  await mobile.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await mobile.waitForFunction(() => document.querySelector('.scroll-morph')?.dataset.virtualScroll === '0')
  await mobile.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await mobile.waitForTimeout(400)
  await act(mobile, 0)
  await mobile.screenshot({ path: '/tmp/render-morph-mobile-reentry.png' })
  assert(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  await mobile.getByRole('button', { name: 'Abrir menú' }).click()
  await mobile.getByRole('navigation', { name: 'Menú completo' }).waitFor({ state: 'visible' })
  await mobile.getByRole('button', { name: 'Cerrar menú' }).click()

  const reduced = await setup({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  assert.equal(await reduced.locator('.scroll-morph').count(), 0)
  assert.equal(await reduced.locator('.morph-static-service').count(), 3)
  assert.equal(await reduced.locator('.morph-static-photos img').count(), 28)
  await reduced.locator('.morph-static').scrollIntoViewIfNeeded()
  await reduced.screenshot({ path: '/tmp/render-morph-reduced.png' })
  assert(await reduced.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  const fallback = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await fallback.route('**/assets/camera/turn-v1/**/*.webp', route => route.abort())
  await fallback.goto(base)
  await fallback.locator('.morph-logo').waitFor()
  await fallback.mouse.move(100, 300)
  await stepTo(fallback, 2)
  await fallback.close()
  assert.deepEqual(errors, [])
  console.log('PASS: desktop acts, exclusive image groups, camera lifetime, reverse scroll, boundary release, keyboard/skip, cotizar, WhatsApp, mobile touch, reduced motion, no page errors.')
} finally { await browser.close() }
