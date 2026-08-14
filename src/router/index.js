import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlansView from '../views/PlansView.vue'
import CoverageView from '../views/CoverageView.vue'

const SITE_NAME = 'Switch Fiber'

// Heavier routes are lazy-loaded so the landing page ships a smaller bundle.
// /register in particular pulls in Leaflet, Dropzone and the signature pad.
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Unlimited Ultra-Fast Fiber Internet in Rizal',
      description: 'Unlimited, no-data-cap fiber internet in Binangonan and across Rizal. Plans from ₱699/mo with free installation and local 24/7 support.'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'About Us',
      description: "Learn about Switch Fiber, Rizal's fast-growing local internet provider delivering affordable, unlimited fiber connections."
    }
  },
  {
    path: '/plans',
    name: 'Plans',
    component: PlansView,
    meta: {
      title: 'Fiber Plans & Pricing',
      description: 'Compare Switch Fiber plans from ₱699/mo. Unlimited data, symmetrical speeds, free router and transparent billing.'
    }
  },
  {
    path: '/coverage',
    name: 'Coverage',
    component: CoverageView,
    meta: {
      title: 'Area Coverage in Rizal',
      description: 'Check whether Switch Fiber is available in your barangay across Binangonan, Angono, Taytay, Antipolo and the rest of Rizal.'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactView.vue'),
    meta: {
      title: 'Contact Us',
      description: 'Reach Switch Fiber customer care hotlines, email support, or visit our office in Binangonan, Rizal.'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: {
      title: 'Apply Online',
      description: 'Apply for a new Switch Fiber connection online in minutes. Upload your valid ID, pin your location and sign digitally.'
    }
  },
  {
    path: '/status',
    name: 'ApplicationStatus',
    component: () => import('../views/ApplicationStatusView.vue'),
    meta: {
      title: 'Track Application Status',
      description: 'Enter your Switch Fiber application reference code to check your verification, survey and installation schedule.'
    }
  },
  {
    path: '/pay-bills',
    name: 'PayBills',
    component: () => import('../views/PayBillsView.vue'),
    meta: {
      title: 'Pay Bills',
      description: 'Settle your Switch Fiber bill using GCash, Maya, QR Ph or debit/credit card via pay.switchfiber.ph.'
    }
  },
  {
    path: '/tech-support',
    name: 'TechSupport',
    component: () => import('../views/TechSupportView.vue'),
    meta: {
      title: 'Router & Wi-Fi Setup Guide',
      description: 'Step-by-step guide to changing your Wi-Fi password and SSID at 192.168.1.1, plus common troubleshooting tips.'
    }
  },
  {
    path: '/careers',
    name: 'Careers',
    component: () => import('../views/CareersView.vue'),
    meta: {
      title: 'Sales Agent Careers',
      description: 'Become an independent Switch Fiber sales agent in Rizal. Earn commission per installed subscriber with flexible hours.'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found',
      robots: 'noindex'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Restore prior scroll offset on browser back/forward
    if (savedPosition) return savedPosition
    // Support in-page anchors, accounting for the sticky header
    if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
    return { top: 0 }
  }
})

function setMetaTag(selector, attr, name, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

router.afterEach((to) => {
  const title = to.meta?.title ? `${SITE_NAME} | ${to.meta.title}` : SITE_NAME
  document.title = title

  if (to.meta?.description) {
    setMetaTag('meta[name="description"]', 'name', 'description', to.meta.description)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', to.meta.description)
  }
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', title)

  // Point the canonical URL at the current route
  const canonical = document.head.querySelector('link[rel="canonical"]')
  if (canonical) {
    const origin = canonical.href.replace(/\/$/, '').replace(/(https?:\/\/[^/]+).*/, '$1')
    canonical.setAttribute('href', origin + to.path)
  }

  // Keep bad URLs out of search results
  const robotsEl = document.head.querySelector('meta[name="robots"]')
  if (to.meta?.robots) {
    setMetaTag('meta[name="robots"]', 'name', 'robots', to.meta.robots)
  } else if (robotsEl) {
    robotsEl.remove()
  }
})

export default router
