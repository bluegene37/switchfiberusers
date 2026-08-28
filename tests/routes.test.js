import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const routerSourcePath = path.resolve(__dirname, '../src/router/index.js')
const routerSource = fs.readFileSync(routerSourcePath, 'utf8')

describe('Router & Route Definitions', () => {
  it('reads and validates src/router/index.js source structure', () => {
    assert.ok(routerSource.includes('createRouter'))
    assert.ok(routerSource.includes('createWebHistory'))
    assert.ok(routerSource.includes('const routes = ['))
  })

  it('defines all core application route paths', () => {
    const requiredPaths = [
      "'/'",
      "'/about'",
      "'/plans'",
      "'/coverage'",
      "'/contact'",
      "'/register'",
      "'/status'",
      "'/pay-bills'",
      "'/tech-support'",
      "'/help'",
      "'/careers'",
      "'/:pathMatch(.*)*'"
    ]

    for (const p of requiredPaths) {
      assert.ok(
        routerSource.includes(`path: ${p}`),
        `Route path ${p} missing in src/router/index.js`
      )
    }
  })

  it('defines unique route names for navigation', () => {
    const requiredNames = [
      "name: 'Home'",
      "name: 'About'",
      "name: 'Plans'",
      "name: 'Coverage'",
      "name: 'Contact'",
      "name: 'Register'",
      "name: 'ApplicationStatus'",
      "name: 'PayBills'",
      "name: 'TechSupport'",
      "name: 'HelpCenter'",
      "name: 'Careers'",
      "name: 'NotFound'"
    ]

    for (const name of requiredNames) {
      assert.ok(
        routerSource.includes(name),
        `Route name ${name} missing in src/router/index.js`
      )
    }
  })

  it('configures SEO meta titles and descriptions for routes', () => {
    assert.ok(routerSource.includes("const SITE_NAME = 'SwitchFiber - Public'"))
    assert.ok(routerSource.includes("title: 'Home'"))
    assert.ok(routerSource.includes("title: 'About Us'"))
    assert.ok(routerSource.includes("title: 'Fiber Plans & Pricing'"))
    assert.ok(routerSource.includes("title: 'Area Coverage in Rizal'"))
    assert.ok(routerSource.includes("title: 'Contact Us'"))
    assert.ok(routerSource.includes("title: 'Apply Online'"))
    assert.ok(routerSource.includes("title: 'Track Application Status'"))
    assert.ok(routerSource.includes("title: 'Pay Bills'"))
    assert.ok(routerSource.includes("title: 'Router & Wi-Fi Setup Guide'"))
    assert.ok(routerSource.includes("title: 'Help Center & User Guide'"))
    assert.ok(routerSource.includes("title: 'Sales Agent Careers'"))
    assert.ok(routerSource.includes("title: 'Page Not Found'"))
  })

  it('configures robots noindex for NotFound route', () => {
    assert.ok(routerSource.includes("robots: 'noindex'"))
  })

  it('implements scrollBehavior with sticky header offset for anchors', () => {
    assert.ok(routerSource.includes('scrollBehavior(to, from, savedPosition)'))
    assert.ok(routerSource.includes("top: 96, behavior: 'smooth'"))
  })

  it('implements global navigation guards for dynamic document title and OpenGraph meta tags', () => {
    assert.ok(routerSource.includes('router.afterEach('))
    assert.ok(routerSource.includes('document.title = title'))
    assert.ok(routerSource.includes("setMetaTag('meta[property=\"og:title\"]'"))
    assert.ok(routerSource.includes("setMetaTag('meta[property=\"og:description\"]'"))
    assert.ok(routerSource.includes("setMetaTag('meta[name=\"description\"]'"))
  })
})
