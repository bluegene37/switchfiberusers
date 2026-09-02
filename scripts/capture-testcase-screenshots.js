import fs from 'fs'
import path from 'path'
import http from 'http'
import { spawn } from 'child_process'

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 4198
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
      console.log(`Test capture server running on http://localhost:${PORT}`)
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

async function captureTestCases() {
  const server = await startServer()

  const CDP_PORT = 9444
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=' + CDP_PORT,
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--user-data-dir=/tmp/sf_tc_profile_' + Date.now()
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

  async function takeScreenshot(name, { width = 1440, height = 900, deviceScaleFactor = 2 } = {}) {
    await targetCdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile: width < 600
    })
    await new Promise(r => setTimeout(r, 500))

    const { data } = await targetCdp.send('Page.captureScreenshot', { format: 'png', quality: 100 })
    const buffer = Buffer.from(data, 'base64')

    for (const dir of SCREENSHOT_DIRS) {
      fs.writeFileSync(path.join(dir, name), buffer)
    }
    console.log(`✓ Saved test screenshot: ${name} (${(buffer.length / 1024).toFixed(1)} KB)`)
  }

  async function navigate(urlPath, waitMs = 1000) {
    await targetCdp.send('Page.navigate', { url: `http://localhost:${PORT}${urlPath}` })
    await new Promise(r => setTimeout(r, waitMs))
  }

  async function evaluate(expression) {
    return await targetCdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  }

  console.log('--- Capturing Test Case Screenshots ---')

  // ==========================================
  // SCENARIO 1: Step 1 Validation Errors (Negative Test)
  // ==========================================
  await navigate('/register')
  await evaluate(`
    // Touch fields and enter invalid data
    const fn = document.getElementById('reg-first-name'); if (fn) { fn.value = 'J'; fn.dispatchEvent(new Event('input', { bubbles: true })); fn.dispatchEvent(new Event('blur', { bubbles: true })); }
    const ln = document.getElementById('reg-last-name'); if (ln) { ln.value = ''; fn.dispatchEvent(new Event('input', { bubbles: true })); ln.dispatchEvent(new Event('blur', { bubbles: true })); }
    const em = document.getElementById('reg-email'); if (em) { em.value = 'invalid-email-address'; em.dispatchEvent(new Event('input', { bubbles: true })); em.dispatchEvent(new Event('blur', { bubbles: true })); }
    const mb = document.getElementById('reg-mobile'); if (mb) { mb.value = '12345'; mb.dispatchEvent(new Event('input', { bubbles: true })); mb.dispatchEvent(new Event('blur', { bubbles: true })); }
  `)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('tc06_scenario_step1_validation_errors.png', { width: 1440, height: 950 })

  // ==========================================
  // SCENARIO 2: Normal Flow (Happy Path) - Step 1 Valid
  // ==========================================
  await evaluate(`
    const fn = document.getElementById('reg-first-name'); if (fn) { fn.value = 'Juan'; fn.dispatchEvent(new Event('input', { bubbles: true })); fn.dispatchEvent(new Event('blur', { bubbles: true })); }
    const mn = document.getElementById('reg-middle-name'); if (mn) { mn.value = 'Santos'; mn.dispatchEvent(new Event('input', { bubbles: true })); }
    const ln = document.getElementById('reg-last-name'); if (ln) { ln.value = 'Dela Cruz'; ln.dispatchEvent(new Event('input', { bubbles: true })); ln.dispatchEvent(new Event('blur', { bubbles: true })); }
    const em = document.getElementById('reg-email'); if (em) { em.value = 'juan.delacruz@gmail.com'; em.dispatchEvent(new Event('input', { bubbles: true })); em.dispatchEvent(new Event('blur', { bubbles: true })); }
    const mb = document.getElementById('reg-mobile'); if (mb) { mb.value = '09171234567'; mb.dispatchEvent(new Event('input', { bubbles: true })); mb.dispatchEvent(new Event('blur', { bubbles: true })); }
  `)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('tc01_normal_step1_valid.png', { width: 1440, height: 950 })

  // ==========================================
  // SCENARIO 3: Normal Flow - Step 2 Address & Map Pin
  // ==========================================
  await evaluate(`
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Address'));
    if (nextBtn) nextBtn.click();
  `)
  await new Promise(r => setTimeout(r, 800))
  await evaluate(`
    const street = document.getElementById('reg-street'); if (street) { street.value = 'Block 12 Lot 4, Sunrise Village'; street.dispatchEvent(new Event('input', { bubbles: true })); }
    const landmark = document.getElementById('reg-landmark'); if (landmark) { landmark.value = 'Near San Isidro Chapel & Elementary School'; landmark.dispatchEvent(new Event('input', { bubbles: true })); }
  `)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('tc02_normal_step2_address_pin.png', { width: 1440, height: 1000 })

  // ==========================================
  // SCENARIO 4: Normal Flow - Step 3 Plan Selection
  // ==========================================
  await evaluate(`
    const nextBtn2 = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Plan'));
    if (nextBtn2) nextBtn2.click();
  `)
  await new Promise(r => setTimeout(r, 800))
  await takeScreenshot('tc03_normal_step3_plan_selected.png', { width: 1440, height: 950 })

  // ==========================================
  // SCENARIO 5: Normal Flow - Step 4 Documents & Signature
  // ==========================================
  await evaluate(`
    const nextBtn3 = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Documents'));
    if (nextBtn3) nextBtn3.click();
  `)
  await new Promise(r => setTimeout(r, 800))
  await takeScreenshot('tc04_normal_step4_docs_signature.png', { width: 1440, height: 1000 })

  // ==========================================
  // SCENARIO 6: Normal Flow - Step 5 Review & Submission
  // ==========================================
  await evaluate(`
    const nextBtn4 = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next') || b.textContent.includes('Review'));
    if (nextBtn4) nextBtn4.click();
  `)
  await new Promise(r => setTimeout(r, 800))
  await takeScreenshot('tc05_normal_step5_review_terms.png', { width: 1440, height: 1000 })

  // ==========================================
  // SCENARIO 7: Application Tracker - Success Lookup
  // ==========================================
  await navigate('/status?code=13295', 1200)
  await takeScreenshot('tc08_scenario_tracker_success.png', { width: 1440, height: 950 })

  // ==========================================
  // SCENARIO 8: Application Tracker - Not Found Lookup
  // ==========================================
  await navigate('/status?code=99999999', 1200)
  await takeScreenshot('tc09_scenario_tracker_not_found.png', { width: 1440, height: 900 })

  // ==========================================
  // SCENARIO 9: Application Tracker - Empty Submit Error
  // ==========================================
  await navigate('/status', 800)
  await evaluate(`
    const trackBtn = document.querySelector('.sf-tracker-submit-btn');
    if (trackBtn) trackBtn.click();
  `)
  await new Promise(r => setTimeout(r, 500))
  await takeScreenshot('tc10_scenario_tracker_empty_error.png', { width: 1440, height: 850 })

  // ==========================================
  // SCENARIO 10: Coverage Filter Scenario
  // ==========================================
  await navigate('/coverage', 1200)
  await evaluate(`
    const searchInput = document.getElementById('coverage-search');
    if (searchInput) {
      searchInput.value = 'Bilibiran';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  `)
  await new Promise(r => setTimeout(r, 600))
  await takeScreenshot('tc11_scenario_coverage_filter.png', { width: 1440, height: 900 })

  // ==========================================
  // SCENARIO 11: Mobile Application Flow (iPhone 14)
  // ==========================================
  await navigate('/register', 800)
  await takeScreenshot('tc14_scenario_mobile_app_flow.png', { width: 390, height: 844, deviceScaleFactor: 2 })

  console.log('--- All Test Case Screenshots Captured! ---')

  targetCdp.close()
  cdp.close()
  chromeProcess.kill()
  server.close()
  process.exit(0)
}

captureTestCases().catch(err => {
  console.error('Test case capture failed:', err)
  process.exit(1)
})
