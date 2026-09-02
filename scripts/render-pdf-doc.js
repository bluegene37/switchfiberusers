import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const [, , inputArg, outputArg, docTitleArg] = process.argv
if (!inputArg || !outputArg) {
  console.error('Usage: node render-pdf-doc.js <input.md> <output.pdf> [docTitle]')
  process.exit(1)
}

const MD_FILE = path.resolve(inputArg)
const OUTPUT_PDF = path.resolve(outputArg)
const DOC_TITLE = docTitleArg || path.basename(MD_FILE, '.md').replace(/_/g, ' ')
const BASE_DIR = path.dirname(MD_FILE)
const TMP_HTML = path.join(path.dirname(OUTPUT_PDF), `.tmp-render-${Date.now()}.html`)

const mdContent = fs.readFileSync(MD_FILE, 'utf8')

// Pure Node.js GFM Markdown to HTML converter
function markdownToHtml(md) {
  const lines = md.split('\n')
  const out = []
  let inCodeBlock = false
  let codeLang = ''
  let codeLines = []
  let inTable = false
  let tableHeaderDone = false
  let inList = false
  let listType = '' // 'ul' or 'ol'
  let inBlockquote = false

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  function inlineFormat(text) {
    // 1. Extract and protect images: ![alt](src)
    const images = []
    text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      images.push(`<img alt="${alt}" src="${src}" />`)
      return `%%IMG_${images.length - 1}%%`
    })

    // 2. Extract and protect links: [label](url)
    const links = []
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
      links.push(`<a href="${url}" target="_blank">${label}</a>`)
      return `%%LINK_${links.length - 1}%%`
    })

    // 3. Extract and protect inline code: `code`
    const codes = []
    text = text.replace(/`([^`]+)`/g, (match, code) => {
      codes.push(`<code>${escapeHtml(code)}</code>`)
      return `%%CODE_${codes.length - 1}%%`
    })

    // 4. Extract and protect inline math: $...$
    const maths = []
    text = text.replace(/\$([^$]+)\$/g, (match, math) => {
      maths.push(`<code class="math">${escapeHtml(math)}</code>`)
      return `%%MATH_${maths.length - 1}%%`
    })

    // 5. Bold + Italic: ***text***
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold: **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic: *text* (avoiding bare _ in URLs or filenames)
    text = text.replace(/(^|\s)\*([^*\s][^*]*[^*\s]|\S)\*(\s|$|[.,!?:;])/g, '$1<em>$2</em>$3')
    text = text.replace(/(^|\s)_([^_\s][^_]*[^_\s]|\S)_(\s|$|[.,!?:;])/g, '$1<em>$2</em>$3')

    // Restore protected tokens
    text = text.replace(/%%MATH_(\d+)%%/g, (m, idx) => maths[idx])
    text = text.replace(/%%CODE_(\d+)%%/g, (m, idx) => codes[idx])
    text = text.replace(/%%LINK_(\d+)%%/g, (m, idx) => links[idx])
    text = text.replace(/%%IMG_(\d+)%%/g, (m, idx) => images[idx])

    return text
  }

  function closeList() {
    if (inList) {
      out.push(`</${listType}>`)
      inList = false
      listType = ''
    }
  }

  function closeTable() {
    if (inTable) {
      out.push('</tbody></table></div>')
      inTable = false
      tableHeaderDone = false
    }
  }

  function closeBlockquote() {
    if (inBlockquote) {
      out.push('</blockquote>')
      inBlockquote = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false
        out.push(`<pre><code class="language-${codeLang}">${escapeHtml(codeLines.join('\n'))}</code></pre>`)
        codeLines = []
      } else {
        closeList()
        closeTable()
        closeBlockquote()
        inCodeBlock = true
        codeLang = line.trim().slice(3).trim()
        codeLines = []
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    // Horizontal Rule
    if (/^(---|___|\*\*\*)$/.test(line.trim())) {
      closeList()
      closeTable()
      closeBlockquote()
      out.push('<hr />')
      continue
    }

    // Tables: | col | col |
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      closeList()
      closeBlockquote()
      const cells = line.trim().slice(1, -1).split('|').map(c => c.trim())

      // Check if it's separator row: | :--- | ---: |
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        tableHeaderDone = true
        continue
      }

      if (!inTable) {
        inTable = true
        tableHeaderDone = false
        out.push('<div class="table-container"><table><thead><tr>')
        cells.forEach(c => out.push(`<th>${inlineFormat(c)}</th>`))
        out.push('</tr></thead><tbody>')
      } else {
        out.push('<tr>')
        cells.forEach(c => out.push(`<td>${inlineFormat(c)}</td>`))
        out.push('</tr>')
      }
      continue
    } else {
      closeTable()
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      closeList()
      closeBlockquote()
      const level = headingMatch[1].length
      const text = inlineFormat(headingMatch[2])
      out.push(`<h${level}>${text}</h${level}>`)
      continue
    }

    // Alerts / Blockquotes: > [!NOTE] or > text
    if (line.trim().startsWith('>')) {
      closeList()
      const bqContent = line.trim().replace(/^>\s?/, '')

      if (bqContent.startsWith('[!NOTE]') || bqContent.startsWith('[!IMPORTANT]') || bqContent.startsWith('[!WARNING]') || bqContent.startsWith('[!CAUTION]')) {
        closeBlockquote()
        let alertClass = 'note'
        let alertTitle = 'NOTE'
        if (bqContent.includes('WARNING') || bqContent.includes('CAUTION')) {
          alertClass = 'warning'
          alertTitle = 'WARNING'
        } else if (bqContent.includes('IMPORTANT')) {
          alertClass = 'important'
          alertTitle = 'IMPORTANT'
        }
        out.push(`<blockquote class="alert alert-${alertClass}"><strong>[${alertTitle}]</strong> `)
        inBlockquote = true
        continue
      }

      if (!inBlockquote) {
        out.push('<blockquote>')
        inBlockquote = true
      }
      out.push(inlineFormat(bqContent))
      continue
    } else {
      closeBlockquote()
    }

    // Lists: Ordered (1. ) or Unordered (- or * )
    const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/)
    const ulMatch = line.match(/^(\s*)[-*]\s+(.*)$/)

    if (olMatch) {
      if (!inList || listType !== 'ol') {
        closeList()
        inList = true
        listType = 'ol'
        out.push('<ol>')
      }
      out.push(`<li>${inlineFormat(olMatch[3])}</li>`)
      continue
    } else if (ulMatch) {
      if (!inList || listType !== 'ul') {
        closeList()
        inList = true
        listType = 'ul'
        out.push('<ul>')
      }
      out.push(`<li>${inlineFormat(ulMatch[2])}</li>`)
      continue
    } else {
      closeList()
    }

    // Blank line
    if (!line.trim()) {
      continue
    }

    // Paragraph
    out.push(`<p>${inlineFormat(line)}</p>`)
  }

  closeList()
  closeTable()
  closeBlockquote()

  return out.join('\n')
}

let htmlContent = markdownToHtml(mdContent)

// Embed all local images as Base64 data URIs
let embedded = 0
let missing = 0
htmlContent = htmlContent.replace(/<img([^>]+)src="([^"]+)"([^>]*)>/g, (match, before, src, after) => {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return match
  }

  let file = path.resolve(BASE_DIR, src)
  if (!fs.existsSync(file)) {
    file = path.resolve(process.cwd(), src)
  }
  if (!fs.existsSync(file)) {
    file = path.resolve(process.cwd(), 'documents/switchfiberusers', src)
  }
  if (!fs.existsSync(file)) {
    file = path.resolve(process.cwd(), 'public', src)
  }

  if (!fs.existsSync(file)) {
    missing++
    console.warn(`  ! Missing image: ${src}`)
    return match
  }

  embedded++
  const ext = path.extname(file).toLowerCase().replace('.', '')
  const mime = ext === 'webp' ? 'image/webp' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png'
  const b64 = fs.readFileSync(file).toString('base64')
  return `<img${before}src="data:${mime};base64,${b64}"${after}>`
})

const fullHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${DOC_TITLE}</title>
<style>
  @page { 
    size: A4; 
    margin: 14mm 13mm 14mm 13mm; 
  }
  * { box-sizing: border-box; }
  body { 
    font: 9.5pt/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
    color: #1e293b; 
    margin: 0; 
    background: #ffffff;
  }
  
  /* Headings */
  h1 { 
    font-size: 20pt; 
    margin: 0 0 8pt; 
    color: #ee2824; 
    letter-spacing: -0.4pt; 
    line-height: 1.25;
    border-bottom: 2.5px solid #ee2824;
    padding-bottom: 6pt;
    break-after: avoid;
  }
  h2 { 
    font-size: 13pt; 
    margin: 16pt 0 6pt; 
    padding-bottom: 3.5pt; 
    border-bottom: 1.5px solid #cbd5e1; 
    color: #0f172a; 
    break-after: avoid; 
  }
  h3 { 
    font-size: 11pt; 
    margin: 12pt 0 4pt; 
    color: #ee2824; 
    break-after: avoid; 
  }
  h4 {
    font-size: 10pt;
    margin: 9pt 0 3pt;
    color: #334155;
    break-after: avoid;
  }

  p { margin: 0 0 7pt; }
  
  /* Tables */
  .table-container {
    width: 100%;
    margin: 8pt 0 12pt;
    overflow-x: auto;
    break-inside: avoid;
  }
  table { 
    border-collapse: collapse; 
    width: 100%; 
    font-size: 8.5pt; 
    break-inside: avoid;
  }
  th { 
    background: #f1f5f9; 
    color: #0f172a;
    text-align: left; 
    font-weight: 700; 
    padding: 4.5pt 6pt;
    border: 1px solid #cbd5e1;
  }
  td { 
    border: 1px solid #e2e8f0; 
    padding: 4pt 6pt; 
    vertical-align: top; 
  }
  tr:nth-child(even) td {
    background: #f8fafc;
  }
  tr { break-inside: avoid; }
  
  /* Code & Pre */
  code { 
    background: #f1f5f9; 
    color: #ee2824;
    padding: 1pt 3pt; 
    border-radius: 3px; 
    font-family: "SF Mono", Menlo, Consolas, Monaco, monospace; 
    font-size: 8.5pt; 
    border: 1px solid #e2e8f0;
  }
  code.math {
    background: #f8fafc;
    color: #0369a1;
    border-color: #bae6fd;
    font-style: italic;
  }
  pre { 
    background: #0f172a; 
    color: #f8fafc;
    border-radius: 6px; 
    padding: 7pt 9pt; 
    overflow-x: auto; 
    break-inside: avoid; 
    font-size: 8pt;
    line-height: 1.4;
  }
  pre code { 
    background: none; 
    color: inherit;
    padding: 0; 
    border: none;
    font-size: inherit; 
  }

  /* Images */
  img { 
    max-width: 100%; 
    max-height: 340pt;
    height: auto; 
    border: 1px solid #cbd5e1; 
    border-radius: 6px; 
    margin: 6pt auto; 
    break-inside: avoid; 
    display: block;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }
  
  hr { 
    border: 0; 
    border-top: 1.5px solid #e2e8f0; 
    margin: 14pt 0; 
  }
  
  ul, ol { 
    margin: 0 0 7pt; 
    padding-left: 16pt; 
  }
  li { 
    margin-bottom: 2.5pt; 
  }
  
  blockquote {
    border-left: 3.5px solid #ee2824;
    background: #fff1f2;
    margin: 7pt 0;
    padding: 5pt 9pt;
    border-radius: 0 5px 5px 0;
    font-size: 8.8pt;
    color: #9f1239;
    break-inside: avoid;
  }
  blockquote.alert-warning {
    border-left-color: #f59e0b;
    background: #fefce8;
    color: #854d0e;
  }
  blockquote.alert-important {
    border-left-color: #0284c7;
    background: #f0f9ff;
    color: #075985;
  }
  
  strong { color: #0f172a; font-weight: 700; }
  a { color: #ee2824; text-decoration: none; }
</style>
</head>
<body>
${htmlContent}
</body>
</html>`

fs.writeFileSync(TMP_HTML, fullHtml)

if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}`)
  process.exit(1)
}

try {
  execSync(
    `"${CHROME}" --headless --disable-gpu --no-pdf-header-footer ` +
    `--print-to-pdf="${OUTPUT_PDF}" "file://${TMP_HTML}"`,
    { stdio: 'pipe' }
  )
} finally {
  if (fs.existsSync(TMP_HTML)) fs.unlinkSync(TMP_HTML)
}

const kb = (fs.statSync(OUTPUT_PDF).size / 1024).toFixed(0)
console.log(`✓ Generated PDF: ${OUTPUT_PDF} (${kb} KB, ${embedded} images embedded, ${missing} missing)`)
