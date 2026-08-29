/**
 * Render a QA markdown report to a self-contained PDF.
 *
 * Node built-ins only. Markdown conversion shells out to `npx marked`, so this
 * adds no dependency to package.json and can run from anywhere.
 *
 * Usage: node render-qa-report-pdf.js <input.md> <output.pdf>
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const [, , inputArg, outputArg] = process.argv
if (!inputArg || !outputArg) {
  console.error('Usage: node render-qa-report-pdf.js <input.md> <output.pdf>')
  process.exit(1)
}

const MD_FILE = path.resolve(inputArg)
const OUTPUT_PDF = path.resolve(outputArg)
const BASE_DIR = path.dirname(MD_FILE)
const TMP_HTML = path.join(path.dirname(OUTPUT_PDF), '.qa-report-render.html')
const TMP_FRAGMENT = path.join(path.dirname(OUTPUT_PDF), '.qa-report-fragment.html')

// marked writes straight to a file: capturing its stdout through execSync
// truncates at 8KB in some sandboxed shells, silently dropping the tail of the
// report (and every <img> in it).
execSync(`npx -y marked@18 --gfm -i "${MD_FILE}" -o "${TMP_FRAGMENT}"`, { stdio: 'pipe' })
let html = fs.readFileSync(TMP_FRAGMENT, 'utf8')
fs.unlinkSync(TMP_FRAGMENT)

let embedded = 0
let missing = 0
html = html.replace(/src="(?!https?:|data:)([^"]+)"/g, (match, rel) => {
  const file = path.resolve(BASE_DIR, decodeURIComponent(rel))
  if (!fs.existsSync(file)) {
    missing++
    console.warn(`  ! missing image: ${rel}`)
    return match
  }
  embedded++
  return `src="data:image/png;base64,${fs.readFileSync(file).toString('base64')}"`
})

const page = `<!doctype html>
<html><head><meta charset="utf-8"><title>Switch Fiber QA Report</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.55 -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #1a1d23; margin: 0; }
  h1 { font-size: 22pt; margin: 0 0 4pt; color: #b91c1c; letter-spacing: -0.4pt; }
  h2 { font-size: 14pt; margin: 20pt 0 6pt; padding-bottom: 4pt; border-bottom: 2px solid #b91c1c; color: #111827; break-after: avoid; }
  h3 { font-size: 11.5pt; margin: 14pt 0 4pt; color: #b91c1c; break-after: avoid; }
  p { margin: 0 0 7pt; }
  table { border-collapse: collapse; width: 100%; margin: 8pt 0 12pt; font-size: 9pt; }
  th { background: #f3f4f6; text-align: left; font-weight: 700; }
  th, td { border: 1px solid #d1d5db; padding: 4pt 6pt; vertical-align: top; }
  tr { break-inside: avoid; }
  code { background: #f3f4f6; padding: 1pt 3pt; border-radius: 3px; font-family: "SF Mono", Menlo, Consolas, monospace; font-size: 8.8pt; }
  pre { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 5px; padding: 7pt 9pt; overflow-x: auto; break-inside: avoid; }
  pre code { background: none; padding: 0; font-size: 8.5pt; }
  img { max-width: 100%; height: auto; border: 1px solid #d1d5db; border-radius: 4px; margin: 4pt 0; break-inside: avoid; }
  td img { max-height: 260pt; width: auto; }
  hr { border: 0; border-top: 1px solid #e5e7eb; margin: 16pt 0; }
  ul, ol { margin: 0 0 8pt; padding-left: 18pt; }
  li { margin-bottom: 3pt; }
  strong { color: #111827; }
</style></head><body>${html}</body></html>`

fs.writeFileSync(TMP_HTML, page)

if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME} — cannot render PDF.`)
  process.exit(1)
}

execSync(
  `"${CHROME}" --headless --disable-gpu --no-pdf-header-footer ` +
  `--print-to-pdf="${OUTPUT_PDF}" "file://${TMP_HTML}"`,
  { stdio: 'pipe' }
)
fs.unlinkSync(TMP_HTML)

const kb = (fs.statSync(OUTPUT_PDF).size / 1024).toFixed(0)
console.log(`PDF written: ${OUTPUT_PDF} (${kb} KB, ${embedded} images embedded, ${missing} missing)`)
