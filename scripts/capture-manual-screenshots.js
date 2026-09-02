// Captures fresh screenshots of the built app (dist/) for the user manual.
// Usage: npm run build && node scripts/capture-manual-screenshots.js . documents/switchfiberusers/screenshots/manual
import fs from 'fs'
import path from 'path'
import http from 'http'
import { spawn } from 'child_process'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const [, , repoRootArg, outDirArg] = process.argv
const REPO = path.resolve(repoRootArg)
const DIST_DIR = path.join(REPO, 'dist')
const OUT_DIR = path.resolve(outDirArg)
const PORT = 4287
const CDP_PORT = 9411
fs.mkdirSync(OUT_DIR, { recursive: true })

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }

function startServer() {
  const server = http.createServer((req, res) => {
    const reqPath = req.url.split('?')[0]
    // No backend here: let API calls 404 so the app uses its built-in fallbacks.
    if (reqPath.startsWith('/api/')) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{}'); return }
    let filePath = path.join(DIST_DIR, reqPath)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) filePath = path.join(DIST_DIR, 'index.html')
    try {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' })
      res.end(fs.readFileSync(filePath))
    } catch { res.writeHead(404); res.end() }
  })
  return new Promise(resolve => server.listen(PORT, () => resolve(server)))
}

class CDP {
  constructor(url) { this.ws = new WebSocket(url); this.id = 0; this.cb = new Map() }
  ready() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve()
      this.ws.onerror = e => reject(e)
      this.ws.onmessage = ev => {
        const m = JSON.parse(ev.data)
        if (m.id && this.cb.has(m.id)) { const { resolve, reject } = this.cb.get(m.id); this.cb.delete(m.id); m.error ? reject(m.error) : resolve(m.result) }
      }
    })
  }
  send(method, params = {}) { return new Promise((resolve, reject) => { const id = ++this.id; this.cb.set(id, { resolve, reject }); this.ws.send(JSON.stringify({ id, method, params })) }) }
  close() { this.ws.close() }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  const server = await startServer()
  const chrome = spawn(CHROME_PATH, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--window-size=1440,1000', `--user-data-dir=${path.join(OUT_DIR, '.chrome-profile')}`], { stdio: ['ignore', 'ignore', 'pipe'] })
  chrome.stderr.on('data', d => { const t = String(d); if (/error|fail|denied|abort/i.test(t)) process.stderr.write(t) })
  chrome.on('exit', code => console.error('chrome exited with code', code))
  let ver = null
  for (let i = 0; i < 40 && !ver; i++) { await sleep(500); try { ver = await (await fetch(`http://localhost:${CDP_PORT}/json/version`)).json() } catch {} }
  if (!ver) throw new Error('Chrome did not open the debugging port')
  const browser = new CDP(ver.webSocketDebuggerUrl); await browser.ready()
  const { targetId } = await browser.send('Target.createTarget', { url: 'about:blank' })
  const page = new CDP(`ws://localhost:${CDP_PORT}/devtools/page/${targetId}`); await page.ready()
  await page.send('Page.enable'); await page.send('Runtime.enable')

  let viewport = { width: 1440, height: 1000, mobile: false }
  async function setViewport(width, height) {
    viewport = { width, height, mobile: width < 600 }
    await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: viewport.mobile })
    if (viewport.mobile) await page.send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' })
    else await page.send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' })
  }
  async function shot(name) {
    await sleep(500)
    const { data } = await page.send('Page.captureScreenshot', { format: 'png' })
    fs.writeFileSync(path.join(OUT_DIR, name), Buffer.from(data, 'base64'))
    console.log('saved', name)
  }
  async function go(route, wait = 1500) {
    await page.send('Page.navigate', { url: `http://localhost:${PORT}${route}` })
    await sleep(wait)
  }
  async function js(expr) {
    const r = await page.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })
    if (r.exceptionDetails) console.warn('JS error:', r.exceptionDetails.text, r.exceptionDetails.exception?.description)
    return r.result?.value
  }
  const STORE = `document.getElementById('app').__vue_app__.config.globalProperties.$pinia._s.get('registration')`
  const setInput = (id, value) => `(() => { const el = document.getElementById('${id}'); if (!el) return 'missing ${id}'; el.value = ${JSON.stringify(value)}; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); el.dispatchEvent(new Event('blur', { bubbles: true })); return 'ok' })()`
  const scrollToText = (sel, re, offset = 120) => `(() => { const el = Array.from(document.querySelectorAll(${JSON.stringify(sel)})).find(e => ${re}.test(e.textContent)); if (!el) return 'missing'; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - ${offset}, behavior: 'instant' }); return 'ok' })()`
  const scrollToId = (id, offset = 120) => `(() => { const el = document.getElementById(${JSON.stringify(id)}); if (!el) return 'missing'; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - ${offset}, behavior: 'instant' }); return 'ok' })()`
  const clickText = text => `(() => { const b = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.trim().includes(${JSON.stringify(text)})); if (b) { b.click(); return 'clicked' } return 'not found' })()`

  await setViewport(1440, 1000)
  const CLEAR_PLAN_BANNER = `(() => { try { ${STORE}.plansError = null } catch (e) {} })()`

  // Light theme for print
  await go('/', 1500)
  await js(`localStorage.setItem('switch_theme', 'light')`)

  // Home
  await go('/', 2500)
  await shot('01_home.png')
  await js(`window.scrollTo(0, 1500)`); await sleep(700)
  await shot('02_home_features.png')

  // Coverage
  await go('/coverage', 3500)
  await shot('03_coverage_map.png')
  await js(setInput('coverage-search', 'Bilibiran')); await sleep(800)
  await js(`(() => { const el = Array.from(document.querySelectorAll('span, p, div')).find(e => e.children.length === 0 && /Max Supported Speed/i.test(e.textContent)); const card = el && el.closest('article, li, .rounded-2xl, .rounded-3xl, div'); (card || el)?.scrollIntoView({ block: 'center' }); return !!el })()`); await sleep(800)
  await shot('04_coverage_search.png')

  // Plans
  await go('/plans', 2000)
  await js(CLEAR_PLAN_BANNER); await sleep(400)
  await shot('05_plans.png')
  console.log('matrix:', await js(scrollToText('h2, h3', '/Comparison Matrix/i'))); await sleep(800)
  await shot('05b_plans_matrix.png')
  console.log('msme:', await js(scrollToId('msme', 100))); await sleep(800)
  await shot('05c_plans_msme.png')

  // Registration wizard
  await go('/register', 2000)
  await js(`${STORE}.resetForm()`); await js(CLEAR_PLAN_BANNER); await sleep(500)
  await shot('07_register_step1.png')
  for (const [id, v] of [['reg-first-name', 'Juan'], ['reg-middle-name', 'Santos'], ['reg-last-name', 'Dela Cruz'], ['reg-email', 'juan.delacruz@gmail.com'], ['reg-mobile', '09171234567']]) console.log(id, await js(setInput(id, v)))
  await sleep(600)
  await shot('08_register_step1_filled.png')

  await js(`(() => { const s = ${STORE}; Object.assign(s.formData, { region: 'Rizal', city: 'Binangonan', barangay: 'Bilibiran', installationAddress: 'House No. 123, Block 5 Lot 12 Sunshine Village, National Road', firstNearestLandmark: 'Beside Barangay Hall', secondNearestLandmark: 'Across from San Isidro Chapel' }); s.currentStep = 2; return s.currentStep })()`)
  await sleep(2500)
  await js(`window.scrollTo(0, 0)`); await sleep(400)
  await shot('09_register_step2.png')
  console.log('pin:', await js(clickText('Pin on Interactive Map'))); await sleep(3000)
  await js(`(() => { const m = document.querySelector('.leaflet-container'); m?.scrollIntoView({ block: 'center' }); return !!m })()`); await sleep(1500)
  await shot('10_register_step2_map.png')
  console.log('confirm pin:', await js(clickText('Confirm Pin Location'))); await sleep(1200)
  await js(`window.scrollTo(0, 0)`); await sleep(400)
  await shot('10b_register_step2_pinned.png')

  await js(CLEAR_PLAN_BANNER)
  await js(`(() => { const s = ${STORE}; s.currentStep = 3; const p = s.availablePlans[1] || s.availablePlans[0]; if (p) s.selectPlan(p.id); return p && p.title })()`)
  await sleep(1200)
  await js(`window.scrollTo(0, 0)`); await sleep(400)
  await shot('11_register_step3.png')
  console.log('compare:', await js(clickText('Compare All Side-by-Side'))); await sleep(1500)
  await shot('11b_register_compare.png')
  console.log('close:', await js(`(() => { const b = Array.from(document.querySelectorAll('button')).find(b => /close/i.test(b.getAttribute('aria-label') || '') || /close/i.test(b.title || '')); if (b) { b.click(); return 'clicked' } document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); return 'escape' })()`)); await sleep(800)

  await js(`${STORE}.currentStep = 4`); await sleep(1200)
  await js(`window.scrollTo(0, 0)`); await sleep(400)
  await shot('12_register_step4.png')

  await js(`${STORE}.currentStep = 5`); await sleep(1200)
  await js(`window.scrollTo(0, 0)`); await sleep(400)
  await shot('13_register_step5.png')
  await js(`window.scrollTo(0, 900)`); await sleep(600)
  await shot('14_register_step5_terms.png')

  await js(`${STORE}.submittedCode = '13295'`); await sleep(1500)
  await js(`window.scrollTo(0, 0)`); await sleep(400)
  await shot('15_register_success.png')

  // Status tracker
  await go('/status', 1800)
  await shot('16_status_empty.png')
  await js(`(() => { const el = document.querySelector('.sf-tracker-input-wrapper input'); el.value = '13295'; el.dispatchEvent(new Event('input', { bubbles: true })); return el.value })()`)
  await js(`document.querySelector('.sf-tracker-submit-btn')?.click()`); await sleep(2500)
  await shot('17_status_found.png')
  await js(`window.scrollTo(0, 700)`); await sleep(600)
  await shot('18_status_stages.png')
  await go('/status', 1800)
  await js(`(() => { const el = document.querySelector('.sf-tracker-input-wrapper input'); el.value = '99999999'; el.dispatchEvent(new Event('input', { bubbles: true })); return el.value })()`)
  await js(`document.querySelector('.sf-tracker-submit-btn')?.click()`); await sleep(2500)
  await shot('19_status_not_found.png')

  // Pay bills, tech support, help, contact, careers, about
  await go('/pay-bills', 1800); await shot('20_pay_bills.png')
  await js(`window.scrollTo(0, 430)`); await sleep(600); await shot('21_pay_bills_steps.png')
  await go('/tech-support', 1800); await shot('22_tech_support.png')
  console.log('wifi:', await js(scrollToText('h2, h3', '/Change Wi-Fi Password/i', 140))); await sleep(600); await shot('23_tech_support_wifi.png')
  await go('/help', 1800); await shot('24_help_center.png')
  await go('/contact', 2500); await shot('25_contact.png')
  console.log('form:', await js(scrollToText('h2, h3', '/Send Us a Direct Message/i', 140))); await sleep(600); await shot('26_contact_form.png')
  console.log('advisories:', await js(scrollToText('h2, h3', '/Understand Your Bill/i', 140))); await sleep(600); await shot('26b_contact_advisories.png')
  await go('/careers', 1800); await shot('27_careers.png')

  // Dark mode
  await go('/', 2000)
  console.log('theme:', await js(`(() => { const b = document.querySelector('button[aria-label="Toggle light or dark theme"]'); if (b) { b.click(); return 'clicked' } return 'missing' })()`)); await sleep(900)
  await shot('28_home_dark.png')
  await js(`document.querySelector('button[aria-label="Toggle light or dark theme"]')?.click()`); await sleep(500)

  // Mobile
  await setViewport(390, 844)
  await go('/', 2000); await shot('m01_home.png')
  console.log('menu:', await js(`(() => { const b = document.querySelector('button[aria-label="Toggle navigation menu"]'); if (b) { b.click(); return 'clicked' } return 'missing' })()`)); await sleep(900)
  await shot('m02_menu.png')
  await go('/register', 2000); await js(`${STORE}.resetForm()`); await sleep(500); await shot('m03_register.png')
  await go('/status', 1800); await shot('m04_status.png')
  await go('/coverage', 3000); await shot('m05_coverage.png')

  page.close(); browser.close(); chrome.kill(); server.close()
  console.log('done')
}

main().catch(err => { console.error(err); process.exit(1) })
