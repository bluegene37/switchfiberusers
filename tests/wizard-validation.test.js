import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const wizardSource = fs.readFileSync(
  path.resolve(__dirname, '../src/components/RegistrationWizard.vue'),
  'utf8'
)
const mapPickerSource = fs.readFileSync(
  path.resolve(__dirname, '../src/components/MapLocationPicker.vue'),
  'utf8'
)
const footerSource = fs.readFileSync(
  path.resolve(__dirname, '../src/components/Footer.vue'),
  'utf8'
)
const navbarSource = fs.readFileSync(
  path.resolve(__dirname, '../src/components/Navbar.vue'),
  'utf8'
)
const statusSource = fs.readFileSync(
  path.resolve(__dirname, '../src/views/ApplicationStatusView.vue'),
  'utf8'
)
const mainCss = fs.readFileSync(
  path.resolve(__dirname, '../src/styles/main.css'),
  'utf8'
)
const coverageSource = fs.readFileSync(
  path.resolve(__dirname, '../src/views/CoverageView.vue'),
  'utf8'
)
const plansSource = fs.readFileSync(
  path.resolve(__dirname, '../src/views/PlansView.vue'),
  'utf8'
)

/**
 * These assertions run against the SHIPPING component source, not a local copy
 * of the rule. The original mobile-number bug survived a green suite precisely
 * because qa-forms.test.js validated its own helper while the wizard used a
 * different, weaker check.
 */
describe('Registration Wizard — live validation wiring', () => {
  const validateBlock = wizardSource.slice(
    wizardSource.indexOf('function validateValue'),
    wizardSource.indexOf('function isFieldValid')
  )

  it('declares the Philippine mobile regex requiring the 09 prefix', () => {
    assert.match(wizardSource, /const phMobileRegex = \/\^09\\d\{9\}\$\//)
  })

  it('validates the primary mobile with the regex and nothing weaker', () => {
    const line = validateBlock
      .split('\n')
      .find((l) => l.includes("key === 'mobileNumber'"))
    assert.ok(line, 'mobileNumber validation branch not found')
    assert.ok(
      line.includes('phMobileRegex.test(val)'),
      'primary mobile must be checked against phMobileRegex'
    )
    assert.ok(
      !/val\.length === 11/.test(line),
      'length-only fallback would accept non-09 numbers like 12345678901'
    )
  })

  it('validates the secondary mobile with the regex when present', () => {
    const line = validateBlock
      .split('\n')
      .find((l) => l.includes("key === 'secondaryMobileNumber'"))
    assert.ok(line, 'secondaryMobileNumber validation branch not found')
    assert.ok(line.includes('phMobileRegex.test(val)'))
    assert.ok(
      !/val\.length === 11/.test(line),
      'length-only fallback would accept non-09 secondary numbers'
    )
  })

  it('tells the applicant the 09 prefix is required', () => {
    assert.match(wizardSource, /11-digit mobile number starting with 09/)
  })

  it('exposes exactly one h1 so the apply page has a page heading', () => {
    const h1Count = (wizardSource.match(/<h1[\s>]/g) || []).length
    assert.equal(h1Count, 1, 'the apply page must have exactly one h1')
  })

  it('associates every step-1 input with a label', () => {
    const ids = [
      'reg-first-name',
      'reg-middle-name',
      'reg-last-name',
      'reg-email',
      'reg-mobile',
      'reg-secondary-mobile'
    ]
    for (const id of ids) {
      assert.ok(wizardSource.includes(`for="${id}"`), `missing label for="${id}"`)
      assert.ok(wizardSource.includes(`id="${id}"`), `missing input id="${id}"`)
    }
  })
})

describe('Map Location Picker — modal semantics', () => {
  it('marks the overlay as a labelled modal dialog', () => {
    assert.match(mapPickerSource, /role="dialog"/)
    assert.match(mapPickerSource, /aria-modal="true"/)
    assert.match(mapPickerSource, /aria-labelledby="map-picker-title"/)
    assert.match(mapPickerSource, /id="map-picker-title"/)
  })

  it('closes on Escape and keeps Tab inside the dialog', () => {
    assert.match(mapPickerSource, /e\.key === 'Escape'/)
    assert.match(mapPickerSource, /e\.key !== 'Tab'/)
  })

  it('restores focus and page scroll when it closes', () => {
    assert.match(mapPickerSource, /function releaseModal/)
    assert.match(mapPickerSource, /document\.body\.style\.overflow = ''/)
    assert.match(mapPickerSource, /previouslyFocused/)
  })
})

describe('Outbound links and touch targets', () => {
  it('gives every new-tab link a noopener rel across the app', () => {
    const sources = [footerSource, mapPickerSource, wizardSource, statusSource]
    for (const src of sources) {
      const anchors = src.match(/<a\b[^>]*target="_blank"[^>]*>/g) || []
      for (const a of anchors) {
        assert.match(a, /rel="noopener noreferrer"/, `missing rel on: ${a.slice(0, 90)}`)
      }
    }
  })

  it('names the footer social icon links for screen readers', () => {
    assert.match(footerSource, /aria-label="Switch Fiber on Facebook"/)
    assert.match(footerSource, /aria-label="Switch Fiber on Instagram"/)
    assert.match(footerSource, /aria-label="Join the Switch Fiber Viber community"/)
  })

  it('sizes footer social links to the 44px touch minimum', () => {
    const socialAnchors = footerSource.match(/<a[^>]*aria-label="(Switch Fiber on|Join the Switch)[^"]*"[^>]*>/g) || []
    assert.equal(socialAnchors.length, 3)
    for (const a of socialAnchors) {
      assert.match(a, /w-11 h-11/, 'social link below the 44px touch target minimum')
    }
  })

  it('gives footer navigation links a 44px minimum tap height', () => {
    const count = (footerSource.match(/min-h-11/g) || []).length
    assert.ok(count >= 12, `expected >=12 footer links with min-h-11, found ${count}`)
  })
})

describe('Application Status tracker — empty submit', () => {
  it('reports an error instead of returning silently', () => {
    assert.match(statusSource, /const emptyError = ref\(false\)/)
    assert.match(statusSource, /emptyError\.value = true/)
    assert.ok(
      !/const code = inputCode\.value\.trim\(\)\s*\n\s*if \(!code\) return/.test(statusSource),
      'empty submit must not return silently'
    )
  })

  it('surfaces the message to assistive tech', () => {
    assert.match(statusSource, /v-if="emptyError"[^>]*role="alert"/)
  })
})

describe('Social handles — navbar and footer must agree', () => {
  const handleOf = (src, host) => {
    const re = new RegExp(`https://(?:www\\.)?${host}\\.com/([A-Za-z0-9_.]+)`, 'g')
    return [...new Set([...src.matchAll(re)].map((m) => m[1]))]
  }

  for (const host of ['facebook', 'instagram']) {
    it(`uses one ${host} handle across navbar and footer`, () => {
      const nav = handleOf(navbarSource, host)
      const foot = handleOf(footerSource, host)
      assert.ok(nav.length, `no ${host} link found in the navbar`)
      assert.ok(foot.length, `no ${host} link found in the footer`)
      assert.deepEqual(
        foot,
        nav,
        `footer ${host} handle(s) ${foot.join(',')} must match navbar ${nav.join(',')}`
      )
    })
  }

  it('points both surfaces at the switchfiber.ph account', () => {
    for (const src of [navbarSource, footerSource]) {
      assert.ok(
        !/switchfiberph/.test(src),
        'the legacy switchfiberph handle must not come back'
      )
    }
  })
})

describe('Touch target minimums (WCAG 2.5.5)', () => {
  it('gives every shared button a 44px height floor', () => {
    const btnRule = mainCss.slice(
      mainCss.indexOf('.btn-primary,'),
      mainCss.indexOf('.btn-primary {', mainCss.indexOf('.btn-primary,') + 10)
    )
    assert.match(btnRule, /min-height:\s*2\.75rem/)
  })

  it('overrides Leaflet 30x30 zoom controls to 44x44', () => {
    assert.match(mainCss, /leaflet-control-zoom a/)
    assert.match(mainCss, /width:\s*2\.75rem\s*!important/)
  })

  it('sizes the coverage municipality filters and row actions', () => {
    assert.ok(
      coverageSource.includes('min-h-11'),
      'municipality filter chips need a 44px min height'
    )
    assert.ok(
      coverageSource.includes('min-w-11'),
      'the icon-only locate button needs a 44px min width'
    )
  })

  it('sizes the plans category tabs and refresh control', () => {
    assert.ok(plansSource.includes('min-h-11'), 'plan category tabs need a 44px min height')
    assert.ok(plansSource.includes('w-11 h-11'), 'the refresh button needs to be 44x44')
  })
})
