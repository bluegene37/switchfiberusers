import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LEGAL_ENTITY, PRIVACY_CONTACT_EMAIL } from '../src/data/legal.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const read = (rel) => fs.readFileSync(path.resolve(__dirname, '..', rel), 'utf8')

const routerSource = read('src/router/index.js')
const footerSource = read('src/components/Footer.vue')
const modalSource = read('src/components/TermsModal.vue')
const wizardSource = read('src/components/RegistrationWizard.vue')
const careersSource = read('src/views/CareersView.vue')
const contactSource = read('src/views/ContactView.vue')
const navbarSource = read('src/components/Navbar.vue')
const coverageStoreSource = read('src/stores/coverage.js')
const coverageMapSource = read('src/components/CoverageMap.vue')
const registrationSource = read('src/stores/registration.js')
const indexHtml = read('index.html')

describe('Legal pages — Privacy Policy and Terms', () => {
  it('registers /privacy-policy and /terms routes with titles', () => {
    assert.ok(routerSource.includes("path: '/privacy-policy'"))
    assert.ok(routerSource.includes("path: '/terms'"))
    assert.ok(routerSource.includes("title: 'Privacy Policy'"))
    assert.ok(routerSource.includes("title: 'Terms & Conditions'"))
  })

  it('ships both views, built from the shared legal constants', () => {
    const privacy = read('src/views/PrivacyPolicyView.vue')
    const terms = read('src/views/TermsView.vue')
    for (const src of [privacy, terms]) {
      assert.match(src, /from '\.\.\/data\/legal'/)
      assert.match(src, /LEGAL_LAST_UPDATED/)
      assert.match(src, /LEGAL_ENTITY/)
    }
    assert.match(privacy, /RA 10173|Data Privacy Act/)
    assert.match(privacy, /National Privacy Commission/)
    assert.match(privacy, /Cookies and local storage/)
    assert.match(privacy, /sensitive personal information/)
    assert.match(terms, /Lock-in period and pre-termination/)
    assert.match(terms, /Acceptable use/)
    assert.match(terms, /no application fee and no processing fee/)
  })

  it('links Privacy Policy and Terms from the footer with a copyright line', () => {
    assert.ok(footerSource.includes('to="/privacy-policy"'))
    assert.ok(footerSource.includes('to="/terms"'))
    assert.match(footerSource, /&copy; \{\{ COPYRIGHT_YEAR \}\} \{\{ LEGAL_ENTITY \}\}/)
  })

  it('uses one legal entity name everywhere', () => {
    assert.ok(LEGAL_ENTITY.length > 3)
    assert.ok(!modalSource.includes('Telecommunications Inc.'), 'modal must not hardcode a different entity name')
    assert.match(modalSource, /\{\{ LEGAL_ENTITY \}\}/)
    assert.ok(PRIVACY_CONTACT_EMAIL.includes('@'))
  })

  it('terms modal points to the full pages', () => {
    assert.ok(modalSource.includes('to="/terms"'))
    assert.ok(modalSource.includes('to="/privacy-policy"'))
  })
})

describe('Form consent', () => {
  it('registration consent covers Terms, Privacy Policy and sensitive data', () => {
    assert.ok(wizardSource.includes('to="/terms"'))
    assert.ok(wizardSource.includes('to="/privacy-policy"'))
    assert.match(wizardSource, /government ID, house photo, and location data/)
    assert.match(wizardSource, /RA 10173/)
    assert.match(wizardSource, /agree to the Terms & Conditions and Privacy Policy\./)
  })

  it('careers form requires consent and actually delivers the application', () => {
    assert.match(careersSource, /v-model="form\.consent"/)
    assert.ok(careersSource.includes('to="/privacy-policy"'))
    assert.match(careersSource, /function buildCareersMailto/)
    assert.match(careersSource, /window\.location\.href = mailtoHref\.value/)
    assert.ok(!careersSource.includes('Application Submitted!'), 'must not claim submission when nothing was sent')
  })
})

describe('Third-party embeds', () => {
  it('Google Maps loads only after the visitor opts in', () => {
    assert.match(contactSource, /<iframe\s+v-if="mapConsented"/)
    assert.match(contactSource, /Load Google Map/)
  })

  it('no analytics or tracking scripts in the HTML shell', () => {
    assert.doesNotMatch(indexHtml, /googletagmanager|gtag\(|fbq\(|hotjar|clarity\.ms|analytics\.js/i)
  })
})

describe('Unsupported claims removed', () => {
  it('no fake live network status in the navbar', () => {
    assert.ok(!navbarSource.includes('100% Operational'))
  })

  it('no fabricated subscriber counts on the coverage pages', () => {
    assert.doesNotMatch(coverageStoreSource, /\d+\+ Connected Homes/)
    assert.ok(!coverageMapSource.includes('4,500+'))
  })

  it('no 24/7 support claim while office hours are Mon-Sat 8-5', () => {
    for (const [name, src] of Object.entries({ indexHtml, footerSource, registrationSource, routerSource })) {
      assert.ok(!src.includes('24/7'), `${name} still claims 24/7 support`)
    }
  })

  it('the simulated speed test component is gone', () => {
    assert.ok(!fs.existsSync(path.resolve(__dirname, '../src/components/SpeedTestSim.vue')))
  })

  it('demo tracker codes are gated to dev builds', () => {
    assert.match(registrationSource, /DEMO_TRACKER_CODES_ENABLED = Boolean\(import\.meta\.env\?\.DEV\)/)
    assert.match(registrationSource, /if \(!DEMO_TRACKER_CODES_ENABLED\) return null/)
  })
})

describe('Crawler files', () => {
  it('ships robots.txt and sitemap.xml including the legal pages', () => {
    const robots = read('public/robots.txt')
    const sitemap = read('public/sitemap.xml')
    assert.match(robots, /Sitemap: https:\/\/switchfiber\.ph\/sitemap\.xml/)
    assert.ok(sitemap.includes('https://switchfiber.ph/privacy-policy'))
    assert.ok(sitemap.includes('https://switchfiber.ph/terms'))
  })
})
