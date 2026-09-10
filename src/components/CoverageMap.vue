<template>
  <div class="glass-card rounded-3xl border dark:border-slate-800 border-slate-200 overflow-hidden shadow-2xl space-y-0 relative">
    
    <!-- Map Toolbar Header -->
    <div class="p-4 sm:p-5 border-b dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 dark:bg-slate-900/90 bg-white/90 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center shrink-0">
          <MapPin class="w-5 h-5" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 class="text-base sm:text-lg font-bold font-heading dark:text-white text-slate-900">
              Interactive Rizal Fiber Coverage Map
            </h3>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider whitespace-nowrap shrink-0">
              Live Network
            </span>
          </div>
          <p class="text-xs dark:text-slate-400 text-slate-600">
            Click any pin to inspect fiber speed, port capacity, or check your GPS location.
          </p>
        </div>
      </div>

      <!-- Map Action Buttons: responsive grid on mobile, inline on larger screens -->
      <div class="grid grid-cols-2 sm:flex sm:items-center sm:w-auto sm:justify-end gap-2 w-full">
        <button
          @click="syncNetwork"
          type="button"
          :disabled="coverageStore.napStatus === 'loading'"
          class="btn-secondary py-2 px-2 sm:px-3 text-xs flex items-center justify-center gap-1.5 shrink-0 min-w-0"
          title="Sync live NAP terminals from network"
        >
          <RotateCw class="w-3.5 h-3.5 shrink-0" :class="coverageStore.napStatus === 'loading' ? 'animate-spin text-[#ee2824]' : ''" />
          <span class="sm:hidden truncate">Sync</span>
          <span class="hidden sm:inline">Sync Network</span>
        </button>

        <button
          @click="toggleNapPoints"
          type="button"
          :aria-pressed="coverageStore.showNapPoints"
          class="btn-secondary py-2 px-2 sm:px-3 text-xs flex items-center justify-center gap-1.5 shrink-0 min-w-0"
          :class="coverageStore.showNapPoints ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold' : ''"
          title="Toggle live fiber NAP terminal pins"
        >
          <Home class="w-3.5 h-3.5 shrink-0" />
          <span class="sm:hidden truncate">{{ coverageStore.showNapPoints ? 'Hide Pins' : 'Show Pins' }}</span>
          <span class="hidden sm:inline">{{ coverageStore.showNapPoints ? 'Hide NAP Points' : 'Show NAP Points' }}</span>
        </button>

        <button
          @click="locateUser"
          type="button"
          :disabled="isLocating"
          class="btn-secondary py-2 px-2 sm:px-3 text-xs flex items-center justify-center gap-1.5 shrink-0 min-w-0"
          title="Detect my current location"
        >
          <RotateCw v-if="isLocating" class="w-3.5 h-3.5 animate-spin" />
          <Navigation v-else class="w-3.5 h-3.5 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Locate Me</span>
        </button>

        <button
          @click="resetView"
          type="button"
          class="btn-secondary py-2 px-2 sm:px-3 text-xs flex items-center justify-center gap-1.5 shrink-0 min-w-0"
          title="Reset to overview of Rizal"
        >
          <Maximize2 class="w-3.5 h-3.5 shrink-0" />
          <span class="truncate">Overview</span>
        </button>
      </div>
    </div>

    <!-- Map Canvas Container -->
    <div class="relative w-full h-[360px] sm:h-[480px] lg:h-[560px] bg-slate-100 dark:bg-slate-950">
      <div
        ref="mapElementRef"
        class="w-full h-full z-10"
        role="application"
        aria-label="Interactive map of Switch Fiber coverage areas in Rizal"
      ></div>

      <!-- Gesture hint: appears when a one-finger drag or plain wheel is used -->
      <div
        v-if="showTouchHint"
        class="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      >
        <span class="px-4 py-2.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold shadow-xl">
          Hold Ctrl (or ⌘) and scroll to zoom the map
        </span>
      </div>

      <!-- Notice when selected municipality has no active NAP points -->
      <div
        v-if="unservedNotice"
        class="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 z-[400] max-w-sm p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-500/40 shadow-xl text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-300"
      >
        <div class="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
          <span>Expansion Planned Area</span>
          <button @click="unservedNotice = ''" aria-label="Dismiss" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5">&times;</button>
        </div>
        <p class="dark:text-slate-200 text-slate-700 leading-relaxed font-medium">{{ unservedNotice }}</p>
      </div>

      <!-- Geolocation failure notice -->
      <div
        v-if="locateError"
        class="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 z-[400] max-w-sm p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-500/40 shadow-xl text-xs space-y-1"
      >
        <div class="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
          <span>Location unavailable</span>
          <button @click="locateError = ''" aria-label="Dismiss" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5">&times;</button>
        </div>
        <p class="dark:text-slate-200 text-slate-700 leading-relaxed font-medium">{{ locateError }}</p>
      </div>

      <!-- Live GPS Banner if detected -->
      <div 
        v-if="userLocationMessage" 
        class="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 z-[400] max-w-sm p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 shadow-xl text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-300"
      >
        <div class="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
          <span class="flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4" />
            <span>GPS Location Detected</span>
          </span>
          <button @click="userLocationMessage = ''" class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5">
            &times;
          </button>
        </div>
        <p class="dark:text-slate-200 text-slate-700 leading-relaxed font-medium">
          {{ userLocationMessage }}
        </p>
      </div>
    </div>

    <!-- Map Legend Footer -->
    <div class="p-4 border-t dark:border-slate-800 border-slate-200 dark:bg-slate-950 bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs">
      <div class="flex flex-wrap items-center gap-4 sm:gap-6">
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-full bg-red-600 border-2 border-white shadow-sm inline-block"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Head Office / NOC Hub</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm inline-block"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Barangay Active Area</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-sky-500 border-2 border-white shadow-sm inline-block"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Live Fiber NAP Point</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-sm inline-block"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Expansion Active</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-3 rounded-sm border-2 border-emerald-500 bg-emerald-500/20 inline-block shadow-sm"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Barangay Boundary / Border</span>
        </div>
      </div>

      <div class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2 border-t dark:border-slate-800/60 border-slate-200/80">
        <p class="text-[11px] dark:text-slate-400 text-slate-500 font-medium">
          <template v-if="coverageStore.napStatus === 'ready'">
            {{ coverageStore.napLocations.length.toLocaleString() }} live fiber NAP points mapped across Rizal
          </template>
          <template v-else-if="coverageStore.napStatus === 'loading'">
            Loading live fiber NAP points&hellip;
          </template>
          <template v-else>
            Fiber coverage across Binangonan and Rizal. Search your barangay to check serviceability.
          </template>
        </p>
        <p class="text-[10px] dark:text-slate-500 text-slate-400">
          Colored borders represent mapped barangay boundaries and active fiber infrastructure footprints.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation, RotateCw, Maximize2, CheckCircle2, Home } from 'lucide-vue-next'
import { useCoverageStore } from '../stores/coverage'
import { useThemeStore } from '../stores/theme'
import { barangayBoundaries } from '../data/barangayBoundaries'
import { samePlace } from '../data/calabarzonLocations'

const coverageStore = useCoverageStore()
const themeStore = useThemeStore()
const router = useRouter()
const mapElementRef = ref(null)
const isLocating = ref(false)
const userLocationMessage = ref('')
const locateError = ref('')
const showTouchHint = ref(false)
const unservedNotice = ref('')

let map = null
let markersLayer = null
let napPointsLayer = null
let napRenderer = null
let circlesLayer = null
let userMarker = null
let tileLayer = null
let touchHintTimer = null
let resizeObserver = null

const RIZAL_DEFAULT_CENTER = [14.4820, 121.1950]
const RIZAL_DEFAULT_ZOOM = 13

// Plain OSM tiles need no API key (CARTO's basemaps now watermark every
// tile with "API KEY REQUIRED"). Both themes share the same source; dark mode
// re-tiles with a class that inverts the raster via CSS so the map still
// reads against the site's dark surfaces.
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_THEMES = {
  dark: { url: TILE_URL, className: 'coverage-tiles coverage-tiles--dark' },
  light: { url: TILE_URL, className: 'coverage-tiles' }
}
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function applyTileTheme() {
  if (!map) return
  if (tileLayer) map.removeLayer(tileLayer)
  const theme = themeStore.isDark ? TILE_THEMES.dark : TILE_THEMES.light
  tileLayer = L.tileLayer(theme.url, {
    attribution: TILE_ATTRIBUTION,
    className: theme.className,
    maxZoom: 19,
    minZoom: 9
  }).addTo(map)
  tileLayer.bringToBack()
}

function initMap() {
  if (!mapElementRef.value || map) return

  map = L.map(mapElementRef.value, {
    center: RIZAL_DEFAULT_CENTER,
    zoom: RIZAL_DEFAULT_ZOOM,
    zoomControl: true,
    // Require Ctrl/⌘ + wheel so scrolling the page doesn't get swallowed by the map
    scrollWheelZoom: false
  })

  applyTileTheme()

  circlesLayer = L.layerGroup().addTo(map)
  markersLayer = L.layerGroup().addTo(map)
  napPointsLayer = L.layerGroup().addTo(map)
  // ~1,500 live NAP points — canvas keeps them cheap to draw, where one DOM
  // node per pin would make panning noticeably janky.
  napRenderer = L.canvas({ padding: 0.5 })

  setupGestureHandling()

  map.on('click', () => {
    coverageStore.focusedBarangayId = null
    highlightBarangayBoundary(null)
  })

  renderCoverageItems()
  renderNapPoints()
}

// Dragging stays enabled at all times — L.Browser.touch is true for any
// touch-capable machine (touchscreen laptops included), so gating panning on a
// two-finger gesture would leave mouse users unable to drag the map at all.
// Only the wheel is guarded, so scrolling past the map doesn't zoom it.
function setupGestureHandling() {
  const container = map.getContainer()

  container.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      map.scrollWheelZoom.enable()
      flashTouchHint(false)
    } else {
      map.scrollWheelZoom.disable()
      flashTouchHint(true)
    }
  }, { passive: true })

  // A pointer device should always be able to drag, whatever Leaflet detected
  container.addEventListener('pointerdown', () => {
    if (!map.dragging.enabled()) map.dragging.enable()
  }, { passive: true })
}

function flashTouchHint(show) {
  showTouchHint.value = show
  clearTimeout(touchHintTimer)
  if (show) {
    touchHintTimer = setTimeout(() => { showTouchHint.value = false }, 1600)
  }
}

// Popup CTAs are plain anchors inside Leaflet's DOM, so route them through
// vue-router instead of letting the browser do a full page reload.
function onPopupClick(e) {
  const link = e.target.closest('a[data-route]')
  if (!link) return
  e.preventDefault()
  router.push(link.getAttribute('data-route'))
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

function createPinIcon(type) {
  let color = '#10b981' // emerald
  let pulse = '#10b981'
  let label = '⚡'

  if (type === 'hq') {
    color = '#ee2824'
    pulse = '#ee2824'
    label = '★'
  } else if (type === 'expansion') {
    color = '#f59e0b'
    pulse = '#f59e0b'
    label = '⏳'
  }

  const html = `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: ${pulse};
        opacity: 0.35;
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 11px;
        font-weight: 900;
      ">
        ${label}
      </div>
    </div>
  `

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  })
}

// Backed by the store so the card list and any other view stay in sync
function syncNetwork() {
  coverageStore.refreshNapLocations()
}

let lastFocusSync = 0
function handleWindowFocus() {
  const now = Date.now()
  if (now - lastFocusSync > 30000) {
    lastFocusSync = now
    coverageStore.fetchNapLocations(true)
  }
}

function toggleNapPoints() {
  coverageStore.showNapPoints = !coverageStore.showNapPoints
}

function applyNapPinVisibility() {
  if (!map || !napPointsLayer) return
  const shouldShow = coverageStore.showNapPoints
  if (shouldShow && !map.hasLayer(napPointsLayer)) {
    map.addLayer(napPointsLayer)
  } else if (!shouldShow && map.hasLayer(napPointsLayer)) {
    map.removeLayer(napPointsLayer)
  }
}

// Live LCP/NAP terminal locations from the fiber backend, drawn as lightweight
// canvas dots. These replace the old hand-placed "customer drop point" pins.
function renderNapPoints() {
  if (!map || !napPointsLayer) return

  napPointsLayer.clearLayers()

  coverageStore.filteredNapPoints.forEach(point => {
    const dot = L.circleMarker([point.lat, point.lng], {
      renderer: napRenderer,
      radius: 4,
      color: '#ffffff',
      weight: 1,
      fillColor: '#0284c7',
      fillOpacity: 0.9
    })

    const locationLine = [point.street, point.city].filter(Boolean).join(', ')
    const registerHref = `/register?city=${encodeURIComponent(point.city || '')}`

    dot.bindPopup(`
      <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px; padding: 2px;">
        <div style="font-size: 10px; font-weight: 800; color: #0284c7; text-transform: uppercase;">
          Live Fiber NAP Terminal
        </div>
        <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 3px 0;">
          ${escapeHtml(point.name)}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
          ${escapeHtml(locationLine || 'Rizal service area')}${point.portTotal ? ` • ${escapeHtml(point.portTotal)} ports` : ''}
        </div>
        <a
          href="${registerHref}"
          data-route="${registerHref}"
          style="
            display: block;
            text-align: center;
            background-color: #0284c7;
            color: #ffffff;
            font-weight: 700;
            font-size: 10px;
            padding: 6px 10px;
            border-radius: 6px;
            text-decoration: none;
          "
        >
          Connect My Residence
        </a>
      </div>
    `)
    napPointsLayer.addLayer(dot)
  })

  applyNapPinVisibility()
}

function crossProduct(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
}

function computeConvexHull(points) {
  if (!points || points.length <= 2) return points || []
  const pts = points.slice().sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0])
  const lower = []
  for (const p of pts) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop()
    }
    lower.push(p)
  }
  const upper = []
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop()
    }
    upper.push(p)
  }
  lower.pop()
  upper.pop()
  return lower.concat(upper)
}

function generateCircleRing(lat, lng, radiusMeters = 350) {
  const latDeg = radiusMeters / 111139
  const lngDeg = radiusMeters / (111139 * Math.cos(lat * Math.PI / 180))
  const ring = []
  const steps = 16
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI
    ring.push([
      Number((lng + lngDeg * Math.cos(angle)).toFixed(5)),
      Number((lat + latDeg * Math.sin(angle)).toFixed(5))
    ])
  }
  ring.push(ring[0])
  return ring
}

function bufferPolygonRing(hull, bufferMeters = 140) {
  if (!hull || hull.length === 0) return []
  const latDeg = bufferMeters / 111139
  const lngDeg = bufferMeters / (111139 * Math.cos(14.5 * Math.PI / 180))

  if (hull.length === 1) {
    return generateCircleRing(hull[0][1], hull[0][0], bufferMeters)
  }

  if (hull.length === 2) {
    const [p1, p2] = hull
    const dx = p2[0] - p1[0]
    const dy = p2[1] - p1[1]
    const len = Math.sqrt(dx * dx + dy * dy) || 0.0001
    const nx = (-dy / len) * lngDeg
    const ny = (dx / len) * latDeg
    const ex = (dx / len) * lngDeg
    const ey = (dy / len) * latDeg
    return [
      [Number((p1[0] - ex + nx).toFixed(5)), Number((p1[1] - ey + ny).toFixed(5))],
      [Number((p2[0] + ex + nx).toFixed(5)), Number((p2[1] + ey + ny).toFixed(5))],
      [Number((p2[0] + ex - nx).toFixed(5)), Number((p2[1] + ey - ny).toFixed(5))],
      [Number((p1[0] - ex - nx).toFixed(5)), Number((p1[1] - ey - ny).toFixed(5))],
      [Number((p1[0] - ex + nx).toFixed(5)), Number((p1[1] - ey + ny).toFixed(5))]
    ]
  }

  const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length
  const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length

  const buffered = hull.map(p => {
    const dx = p[0] - cx
    const dy = p[1] - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist === 0) return [p[0] + lngDeg, p[1] + latDeg]
    const scale = (dist + Math.max(lngDeg, latDeg)) / dist
    return [
      Number((cx + dx * scale).toFixed(5)),
      Number((cy + dy * scale).toFixed(5))
    ]
  })
  buffered.push(buffered[0])
  return buffered
}

function getBarangayBoundary(item) {
  if (!item) return null
  const directKey = `${item.municipality}::${item.name}`
  if (barangayBoundaries[directKey]) return barangayBoundaries[directKey]

  // Fallback: match using canonical place comparison
  for (const [key, bData] of Object.entries(barangayBoundaries)) {
    const [mun, brgy] = key.split('::')
    if (samePlace(mun, item.municipality) && samePlace(brgy, item.name)) {
      return bData
    }
  }

  // Fallback: if newly added live NAPs exist for this barangay, compute boundary hull on the fly
  const naps = coverageStore.napLocations || []
  const itemNaps = naps.filter(p => {
    const res = coverageStore.resolveNapBarangay(p)
    return res && samePlace(res.municipality, item.municipality) && samePlace(res.name, item.name)
  })

  if (itemNaps.length >= 3) {
    const pts = itemNaps.map(p => [p.lng, p.lat])
    const hull = computeConvexHull(pts)
    const ring = bufferPolygonRing(hull, 140)
    return { type: 'Polygon', coordinates: [ring] }
  } else if (itemNaps.length > 0) {
    const pts = itemNaps.map(p => [p.lng, p.lat])
    const ring = bufferPolygonRing(pts, 140)
    return { type: 'Polygon', coordinates: [ring] }
  }

  // Smooth circular polygon for expansion areas
  return {
    type: 'Polygon',
    coordinates: [generateCircleRing(item.lat, item.lng, 350)]
  }
}

function getBoundaryStyle(item, isHighlighted = false) {
  const isHq = item.name && item.name.includes('HQ')
  const isAvailable = item.status === 'Available Now'
  const shapeColor = isHq ? '#ee2824' : (isAvailable ? '#10b981' : '#f59e0b')

  if (isHighlighted) {
    return {
      color: shapeColor,
      fillColor: shapeColor,
      fillOpacity: 0.28,
      weight: 3.5,
      opacity: 1
    }
  }

  return {
    color: shapeColor,
    fillColor: shapeColor,
    fillOpacity: 0.08,
    weight: 1.5,
    opacity: 0.35
  }
}

function highlightBarangayBoundary(focusedId) {
  if (!circlesLayer) return
  circlesLayer.eachLayer(layer => {
    const item = layer._barangayItem
    if (!item) return
    const isFocused = Boolean(focusedId && layer._barangayIds && layer._barangayIds.has(focusedId))
    if (typeof layer.setStyle === 'function') {
      layer.setStyle(getBoundaryStyle(item, isFocused))
    }
    if (isFocused && typeof layer.bringToFront === 'function') {
      layer.bringToFront()
    }
  })
}

function renderCoverageItems() {
  if (!map || !markersLayer || !circlesLayer) return

  markersLayer.clearLayers()
  circlesLayer.clearLayers()

  // Only render barangays that are physically verified within the LCP NAP data
  const items = coverageStore.mapCoverageItems

  // Several coverage entries can share one official boundary (e.g. the two
  // Darangan phases). Draw each boundary once and let any of their pins own it.
  const shapesByBoundary = new Map()

  items.forEach(item => {
    if (!coverageStore.isBarangayInNapData(item)) return

    const isHq = item.name.includes('HQ')
    const isAvailable = item.status === 'Available Now'
    const type = isHq ? 'hq' : (isAvailable ? 'active' : 'expansion')

    const icon = createPinIcon(type)
    const marker = L.marker([item.lat, item.lng], { icon })

    const coveredAreasHtml = item.coveredAreas && item.coveredAreas.length
      ? item.coveredAreas.map(a => `<span style="display:inline-block; font-size:10px; background:#f1f5f9; color:#334155; padding:2px 6px; border-radius:4px; margin:2px 2px 0 0; font-weight:600;">${escapeHtml(a)}</span>`).join('')
      : ''

    const registerHref = `/register?barangay=${encodeURIComponent(item.name)}&city=${encodeURIComponent(item.municipality)}`

    const liveNapCount = coverageStore.getNapCountForBarangay(item)
    const napCountLabel = liveNapCount > 0
      ? `${liveNapCount} Live NAP Terminal${liveNapCount === 1 ? '' : 's'} Mapped`
      : escapeHtml(item.activeNodes || 'Fiber Terminal Active')

    // Main Barangay Popup
    const popupContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 240px; padding: 4px;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: ${isHq ? '#ee2824' : (isAvailable ? '#059669' : '#d97706')}; margin-bottom: 2px;">
          ${escapeHtml(item.municipality)}, Rizal
        </div>
        <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
          Brgy. ${escapeHtml(item.name)}
        </div>
        <div style="font-size: 11px; font-weight: 700; color: #0284c7; margin-bottom: 8px;">
          🏠 ${escapeHtml(item.connectedHomes || 'Fiber Coverage Active')} • ${napCountLabel}
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px; color: #334155;">
          <span style="font-weight: 700;">Speed:</span>
          <span>${escapeHtml(item.speed)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #334155;">
          <span style="font-weight: 700;">Status:</span>
          <span style="font-weight: 700; color: ${isAvailable ? '#059669' : '#d97706'};">${escapeHtml(item.slots)}</span>
        </div>
        ${coveredAreasHtml ? `<div style="margin-bottom: 10px; border-top: 1px solid #e2e8f0; pt: 6px;"><div style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:3px;">Covered Subdivisions & Streets:</div><div>${coveredAreasHtml}</div></div>` : ''}
        <a
          href="${registerHref}"
          data-route="${registerHref}"
          style="
            display: block;
            text-align: center;
            background-color: #ee2824;
            color: #ffffff;
            font-weight: 700;
            font-size: 11px;
            padding: 8px 12px;
            border-radius: 8px;
            text-decoration: none;
            box-shadow: 0 2px 6px rgba(238,40,36,0.35);
          "
        >
          Apply for my House in this Barangay
        </a>
      </div>
    `

    marker.bindPopup(popupContent)
    marker.on('click', (e) => {
      if (e) {
        if (typeof e.stopPropagation === 'function') e.stopPropagation()
        if (e.originalEvent) L.DomEvent.stopPropagation(e.originalEvent)
      }
      coverageStore.focusedBarangayId = item.id
      highlightBarangayBoundary(item.id)
    })
    markersLayer.addLayer(marker)

    // Service area footprint: official barangay boundary or dynamic network border
    const boundary = getBarangayBoundary(item)
    if (!boundary) return

    const shared = shapesByBoundary.get(boundary)
    if (shared) {
      shared._barangayIds.add(item.id)
      return
    }

    const isFocused = Boolean(coverageStore.focusedBarangayId && item.id === coverageStore.focusedBarangayId)
    const shape = L.geoJSON(boundary, {
      style: getBoundaryStyle(item, isFocused)
    })
    shape._barangayIds = new Set([item.id])
    shape._barangayItem = item

    // Shared boundaries are labelled with the base barangay name ("Darangan"
    // rather than "Darangan (Phase 2 & 3)").
    shape.bindTooltip(() => {
      const label = shape._barangayIds.size > 1 ? item.name.replace(/\s*\([^)]*\)/g, '') : item.name
      return `Brgy. ${escapeHtml(label)} — ${napCountLabel}`
    }, { sticky: true })

    // Only highlight border on click, not on hover
    shape.on('click', (e) => {
      if (e) {
        if (typeof e.stopPropagation === 'function') e.stopPropagation()
        if (e.originalEvent) L.DomEvent.stopPropagation(e.originalEvent)
      }
      coverageStore.focusedBarangayId = item.id
      highlightBarangayBoundary(item.id)
      marker.openPopup()
    })
    circlesLayer.addLayer(shape)
    shapesByBoundary.set(boundary, shape)
  })
}

// Frame the visible pins. Called after rendering rather than inside it, so the
// municipality watcher can choose between fitting bounds and flying to a centre
// instead of doing both and fighting itself.
function fitToVisibleMarkers() {
  if (!map || !markersLayer) return false
  const layers = markersLayer.getLayers()
  if (!layers.length) return false
  const group = L.featureGroup(layers)
  map.fitBounds(group.getBounds().pad(0.25), { maxZoom: 15 })
  return true
}

function resetView() {
  if (!map) return
  coverageStore.selectedMunicipality = 'All'
  coverageStore.searchQuery = ''
  coverageStore.focusedBarangayId = null
  highlightBarangayBoundary(null)
  userLocationMessage.value = ''
  locateError.value = ''
  unservedNotice.value = ''
  map.closePopup()
  map.flyTo(RIZAL_DEFAULT_CENTER, RIZAL_DEFAULT_ZOOM, { duration: 1 })
}

function locateUser() {
  if (!navigator.geolocation) {
    locateError.value = 'Location isn\'t supported by this browser.'
    return
  }

  isLocating.value = true
  userLocationMessage.value = ''
  locateError.value = ''

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      isLocating.value = false
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude

      if (userMarker) {
        map.removeLayer(userMarker)
      }

      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: #3b82f6; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 18px; height: 18px; border-radius: 50%; background-color: #2563eb; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })

      userMarker = L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<strong>Your Location</strong><br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
        .openPopup()

      map.flyTo([lat, lng], 14, { duration: 1.2 })

      // Measure against the live NAP terminals when they've loaded — real
      // installed hardware beats the hand-placed barangay centres.
      const napPoints = coverageStore.napLocations
      if (napPoints.length) {
        let closest = null
        let minDistance = Infinity
        napPoints.forEach(point => {
          const d = getDistanceKm(lat, lng, point.lat, point.lng)
          if (d < minDistance) {
            minDistance = d
            closest = point
          }
        })
        const place = [closest.street, closest.city].filter(Boolean).join(', ')
        if (minDistance <= 3.5) {
          userLocationMessage.value = `You are approximately ${(minDistance * 1000).toFixed(0)}m from our nearest fiber NAP terminal (${closest.name}${place ? `, ${place}` : ''}).`
        } else {
          userLocationMessage.value = `Nearest fiber NAP terminal: ${closest.name}${place ? `, ${place}` : ''} (~${minDistance.toFixed(1)} km away).`
        }
      } else {
        let closest = null
        let minDistance = Infinity
        coverageStore.coverageList.forEach(item => {
          const d = getDistanceKm(lat, lng, item.lat, item.lng)
          if (d < minDistance) {
            minDistance = d
            closest = item
          }
        })
        if (closest && minDistance <= 3.5) {
          userLocationMessage.value = `You are approximately ${(minDistance * 1000).toFixed(0)}m from our ${closest.name}, ${closest.municipality} fiber zone (${closest.status}).`
        } else if (closest) {
          userLocationMessage.value = `Nearest coverage node: ${closest.name}, ${closest.municipality} (~${minDistance.toFixed(1)} km away).`
        }
      }
    },
    (err) => {
      isLocating.value = false
      locateError.value = err.code === err.PERMISSION_DENIED
        ? 'Location permission was denied. You can still browse the map or search your barangay below.'
        : `Couldn't get your location (${err.message}). Try searching your barangay instead.`
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Watch for municipality changes to fly to that center
watch(() => coverageStore.selectedMunicipality, (newMun) => {
  if (!map) return
  renderCoverageItems()
  renderNapPoints()
  const target = coverageStore.municipalityCenters[newMun]
  if (target) {
    map.flyTo([target.lat, target.lng], target.zoom, { duration: 1 })
  } else {
    fitToVisibleMarkers()
  }

  const hasNaps = coverageStore.mapCoverageItems.some(item =>
    newMun === 'All' || item.municipality.toLowerCase() === newMun.toLowerCase()
  )
  if (!hasNaps && newMun !== 'All') {
    unservedNotice.value = `No active fiber NAP terminals currently mapped in ${newMun}. Only barangays with verified LCP NAP data are shown on the map.`
  } else {
    unservedNotice.value = ''
  }
})

// Watch search query to update markers, framing whatever matched
watch(() => coverageStore.searchQuery, (q) => {
  if (!map) return
  renderCoverageItems()
  renderNapPoints()
  if (q) fitToVisibleMarkers()
})

watch(() => coverageStore.showNapPoints, () => {
  applyNapPinVisibility()
})

// Redraw once the live NAP fetch resolves (or if the list ever refreshes)
watch(() => coverageStore.napLocations, () => {
  renderCoverageItems()
  renderNapPoints()
})

// Re-tile when the site theme flips
watch(() => themeStore.isDark, () => {
  applyTileTheme()
})

// Watch focused item from cards
watch(() => coverageStore.focusedBarangayId, (newId) => {
  highlightBarangayBoundary(newId)
  if (!map || !newId) return
  const item = coverageStore.coverageList.find(b => b.id === newId)
  if (item) {
    map.flyTo([item.lat, item.lng], 15, { duration: 1 })
    // Open popup for this marker
    markersLayer.eachLayer(layer => {
      const latlng = layer.getLatLng()
      if (Math.abs(latlng.lat - item.lat) < 0.0001 && Math.abs(latlng.lng - item.lng) < 0.0001) {
        layer.openPopup()
      }
    })
  }
})

onMounted(() => {
  coverageStore.fetchNapLocations()
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleWindowFocus)
  }
  nextTick(() => {
    initMap()
    mapElementRef.value?.addEventListener('click', onPopupClick)

    // Leaflet caches the container size at init. If fonts, images or the
    // surrounding layout settle afterwards the map keeps requesting tiles for
    // the stale (smaller) size, leaving blank gutters. Watch the element and
    // re-measure whenever it actually changes size.
    if (typeof ResizeObserver !== 'undefined' && mapElementRef.value) {
      resizeObserver = new ResizeObserver(() => {
        if (map) map.invalidateSize({ animate: false })
      })
      resizeObserver.observe(mapElementRef.value)
    }
  })
})

onUnmounted(() => {
  clearTimeout(touchHintTimer)
  if (typeof window !== 'undefined') {
    window.removeEventListener('focus', handleWindowFocus)
  }
  resizeObserver?.disconnect()
  resizeObserver = null
  mapElementRef.value?.removeEventListener('click', onPopupClick)
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style>
/* Dark theme: invert the OSM raster and swing the hue back so water stays
   blue-ish and roads read as light lines on a charcoal ground. */
.coverage-tiles--dark .leaflet-tile {
  filter: invert(1) hue-rotate(180deg) brightness(0.82) contrast(0.92) saturate(0.55);
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
