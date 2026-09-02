import fs from 'fs'
import path from 'path'
import http from 'http'
import { spawn } from 'child_process'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 4199
const DIST_DIR = path.resolve('dist')
const SCREENSHOT_DIRS = [
  path.resolve('scratch/screenshots'),
  path.resolve('documents/switchfiberusers/screenshots'),
  path.resolve('personal_projects/documents/switchfiberusers/screenshots')
]

SCREENSHOT_DIRS.forEach(dir => fs.mkdirSync(dir, { recursive: true }))

function startServer() {
  const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff2': 'font/woff2'
  }

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0]
    let filePath = path.join(DIST_DIR, reqPath)

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html')
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    try {
      const data = fs.readFileSync(filePath)
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    } catch (err) {
      res.writeHead(404)
      res.end('Not found')
    }
  })

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Static server running on http://localhost:${PORT}`)
      resolve(server)
    })
  })
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl)
    this.id = 0
    this.callbacks = new Map()
  }

  ready() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve()
      this.ws.onerror = (err) => reject(err)
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id)
          this.callbacks.delete(msg.id)
          if (msg.error) reject(msg.error)
          else resolve(msg.result)
        }
      }
    })
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id
      this.callbacks.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params }))
    })
  }

  close() {
    this.ws.close()
  }
}

async function capture() {
  const server = await startServer()

  const CDP_PORT = 9333
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + CDP_PORT,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--hide-scrollbars',
    '--user-data-dir=/tmp/sf_chrome_profile_' + Date.now()
  ], { stdio: 'ignore' })

  await new Promise(r => setTimeout(r, 1500))

  const versionRes = await fetch(`http://localhost:${CDP_PORT}/json/version`)
  const versionData = await versionRes.json()
  const cdp = new CDPClient(versionData.webSocketDebuggerUrl)
  await cdp.ready()

  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' })
  const targetCdp = new CDPClient(`ws://localhost:${CDP_PORT}/devtools/page/${targetId}`)
  await targetCdp.ready()

  await targetCdp.send('Page.enable')
  await targetCdp.send('Runtime.enable')
  await targetCdp.send('DOM.enable')

  async function takeScreenshot(name, { width = 1440, height = 900, deviceScaleFactor = 2, clip = null } = {}) {
    await targetCdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile: width < 600
    })
    await new Promise(r => setTimeout(r, 600))

    const params = { format: 'png', quality: 100 }
    if (clip) {
      params.clip = clip
      params.captureBeyondViewport = true
    }

    const { data } = await targetCdp.send('Page.captureScreenshot', params)
    const buffer = Buffer.from(data, 'base64')

    for (const dir of SCREENSHOT_DIRS) {
      fs.writeFileSync(path.join(dir, name), buffer)
    }
    console.log(`Saved screenshot: ${name} (${(buffer.length / 1024).toFixed(1)} KB)`)
  }

  async function navigate(urlPath, waitMs = 1200) {
    await targetCdp.send('Page.navigate', { url: `http://localhost:${PORT}${urlPath}` })
    await new Promise(r => setTimeout(r, waitMs))
  }

  async function evaluate(expression) {
    return await targetCdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  }

  console.log('--- Starting Screenshot Captures ---')

  // 1. Home Page
  await navigate('/')
  await takeScreenshot('01_home_hero.png', { width: 1440, height: 900 })

  await evaluate(`window.scrollTo(0, 1100)`)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('02_home_speedtest.png', { width: 1440, height: 900 })

  // 2. Plans Page
  await navigate('/plans')
  await takeScreenshot('04_plans_residential.png', { width: 1440, height: 900 })

  await evaluate(`document.querySelector('#msme')?.scrollIntoView({ behavior: 'instant', block: 'start' })`)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('06_plans_msme_smartbiz.png', { width: 1440, height: 900 })

  await evaluate(`document.querySelector('#promos')?.scrollIntoView({ behavior: 'instant', block: 'start' })`)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('07_plans_promos.png', { width: 1440, height: 900 })

  // 3. Coverage Map Page
  await navigate('/coverage')
  await new Promise(r => setTimeout(r, 1500))
  await takeScreenshot('08_coverage_map.png', { width: 1440, height: 950 })

  await evaluate(`window.scrollTo(0, 750)`)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('09_coverage_search_filters.png', { width: 1440, height: 900 })

  // 4. Registration Wizard (All 5 Steps!)
  await navigate('/register')
  await new Promise(r => setTimeout(r, 800))
  await takeScreenshot('10_register_step1_personal.png', { width: 1440, height: 950 })

  // Fill Step 1 and proceed to Step 2
  await evaluate(`
    const fn = document.getElementById('reg-first-name'); if (fn) { fn.value = 'Juan'; fn.dispatchEvent(new Event('input', { bubbles: true })); }
    const mn = document.getElementById('reg-middle-name'); if (mn) { mn.value = 'Reyes'; mn.dispatchEvent(new Event('input', { bubbles: true })); }
    const ln = document.getElementById('reg-last-name'); if (ln) { ln.value = 'Dela Cruz'; ln.dispatchEvent(new Event('input', { bubbles: true })); }
    const em = document.getElementById('reg-email'); if (em) { em.value = 'juan.delacruz@gmail.com'; em.dispatchEvent(new Event('input', { bubbles: true })); }
    const mb = document.getElementById('reg-mobile'); if (mb) { mb.value = '09171234567'; mb.dispatchEvent(new Event('input', { bubbles: true })); }
  `)
  await new Promise(r => setTimeout(r, 400))
  await evaluate(`
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Address'));
    if (nextBtn) nextBtn.click();
  `)
  await new Promise(r => setTimeout(r, 1000))
  await takeScreenshot('11_register_step2_address_map.png', { width: 1440, height: 1000 })

  // Fill Step 2 and proceed to Step 3
  await evaluate(`
    const street = document.getElementById('reg-street'); if (street) { street.value = 'Block 12 Lot 4, Sunrise Village'; street.dispatchEvent(new Event('input', { bubbles: true })); }
    const landmark = document.getElementById('reg-landmark'); if (landmark) { landmark.value = 'Near San Isidro Chapel & Elementary School'; landmark.dispatchEvent(new Event('input', { bubbles: true })); }
    const nextBtn2 = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Plan'));
    if (nextBtn2) nextBtn2.click();
  `)
  await new Promise(r => setTimeout(r, 1000))
  await takeScreenshot('12_register_step3_plans.png', { width: 1440, height: 950 })

  // Proceed to Step 4 (Documents & Signature)
  await evaluate(`
    const nextBtn3 = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Documents'));
    if (nextBtn3) nextBtn3.click();
  `)
  await new Promise(r => setTimeout(r, 1000))
  await takeScreenshot('13_register_step4_documents_signature.png', { width: 1440, height: 1000 })

  // Proceed to Step 5 (Review & Terms)
  await evaluate(`
    const nextBtn4 = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Review'));
    if (nextBtn4) nextBtn4.click();
  `)
  await new Promise(r => setTimeout(r, 1000))
  await takeScreenshot('14_register_step5_review_submit.png', { width: 1440, height: 1000 })

  // 5. Application Status Tracker
  await navigate('/status')
  await takeScreenshot('15_status_tracker_initial.png', { width: 1440, height: 850 })

  await navigate('/status?code=13295', 1500)
  await takeScreenshot('16_status_tracker_active_timeline.png', { width: 1440, height: 950 })

  // 6. Pay Bills
  await navigate('/pay-bills')
  await takeScreenshot('17_pay_bills_portal.png', { width: 1440, height: 950 })

  // 7. Tech Support & Router Guide
  await navigate('/tech-support')
  await takeScreenshot('19_tech_support_wifi_router.png', { width: 1440, height: 950 })

  await evaluate(`window.scrollTo(0, 800)`)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('20_tech_support_requirements_warranty.png', { width: 1440, height: 950 })

  // 8. Help Center & FAQ
  await navigate('/help')
  await takeScreenshot('21_help_center_search_tasks.png', { width: 1440, height: 950 })

  await evaluate(`window.scrollTo(0, 1200)`)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('22_help_center_faq_accordion.png', { width: 1440, height: 950 })

  // 9. Contact & Advisories
  await navigate('/contact')
  await takeScreenshot('23_contact_hotlines_map.png', { width: 1440, height: 950 })

  await evaluate(`window.scrollTo(0, 950)`)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('24_contact_advisories.png', { width: 1440, height: 950 })

  // 10. Careers
  await navigate('/careers')
  await takeScreenshot('25_careers_sales_agent.png', { width: 1440, height: 950 })

  // 11. About Us
  await navigate('/about')
  await takeScreenshot('26_about_us_mission_vision.png', { width: 1440, height: 950 })

  // Mobile Screenshots (iPhone 14 / modern mobile 390x844)
  console.log('--- Capturing Mobile Screenshots ---')
  await navigate('/')
  await takeScreenshot('m01_mobile_home.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  await navigate('/plans')
  await takeScreenshot('m02_mobile_plans.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  await navigate('/coverage')
  await new Promise(r => setTimeout(r, 1200))
  await takeScreenshot('m03_mobile_coverage.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  await navigate('/register')
  await takeScreenshot('m04_mobile_register_wizard.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  await navigate('/status?code=13295', 1200)
  await takeScreenshot('m05_mobile_status_tracker.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  await navigate('/pay-bills')
  await takeScreenshot('m06_mobile_pay_bills.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  await navigate('/tech-support')
  await takeScreenshot('m07_mobile_tech_support.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  await navigate('/help')
  await takeScreenshot('m08_mobile_help_center.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  console.log('--- All Screenshots Successfully Captured! ---')

  targetCdp.close()
  cdp.close()
  chromeProcess.kill()
  server.close()
  process.exit(0)
}

capture().catch(err => {
  console.error('Capture failed:', err)
  process.exit(1)
})
