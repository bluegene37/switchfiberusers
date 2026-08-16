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

      <!-- Map Action Buttons: even 3-up row on mobile, inline on larger screens -->
      <div class="grid grid-cols-3 gap-2 w-full sm:flex sm:items-center sm:w-auto sm:justify-end">
        <button
          @click="toggleCustomerNodes"
          type="button"
          :aria-pressed="coverageStore.showCustomerNodes"
          class="btn-secondary py-2 px-2 sm:px-3 text-xs flex items-center justify-center gap-1.5 shrink-0 min-w-0"
          :class="coverageStore.showCustomerNodes ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold' : ''"
          title="Toggle active customer drop pins"
        >
          <Home class="w-3.5 h-3.5 shrink-0" />
          <span class="sm:hidden truncate">{{ coverageStore.showCustomerNodes ? 'Hide Pins' : 'Show Pins' }}</span>
          <span class="hidden sm:inline">{{ coverageStore.showCustomerNodes ? 'Hide Customer Pins' : 'Show Customer Pins' }}</span>
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
          <span class="font-bold dark:text-slate-200 text-slate-800">🏠 Connected Customer Drop Point</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-sm inline-block"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Expansion Active</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-4 h-3 rounded-sm border-2 border-dashed border-slate-400 inline-block"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Approximate area</span>
        </div>
      </div>

      <div class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-2 border-t dark:border-slate-800/60 border-slate-200/80">
        <p class="text-[11px] dark:text-slate-400 text-slate-500 font-medium">
          4,500+ Connected Homes &amp; Active Fiber Subscribers across Rizal
        </p>
        <p class="text-[10px] dark:text-slate-500 text-slate-400">
          Solid shapes follow mapped barangay boundaries; dashed shapes are approximate. Please confirm exact serviceability with our team.
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

const coverageStore = useCoverageStore()
const themeStore = useThemeStore()
const router = useRouter()
const mapElementRef = ref(null)
const isLocating = ref(false)
const userLocationMessage = ref('')
const locateError = ref('')
const showTouchHint = ref(false)

let map = null
let markersLayer = null
let customerPinsLayer = null
let circlesLayer = null
let userMarker = null
let tileLayer = null
let touchHintTimer = null
let resizeObserver = null

const RIZAL_DEFAULT_CENTER = [14.4820, 121.1950]
const RIZAL_DEFAULT_ZOOM = 13

// CARTO basemaps read better against the site's dark theme than raw OSM tiles.
const TILE_THEMES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
}
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

function applyTileTheme() {
  if (!map) return
  if (tileLayer) map.removeLayer(tileLayer)
  tileLayer = L.tileLayer(themeStore.isDark ? TILE_THEMES.dark : TILE_THEMES.light, {
    attribution: TILE_ATTRIBUTION,
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
  customerPinsLayer = L.layerGroup().addTo(map)

  setupGestureHandling()
  renderCoverageItems()
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

function createCustomerPinIcon() {
  const html = `
    <div style="position: relative; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: relative;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #0284c7;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 9px;
      ">
        🏠
      </div>
    </div>
  `

  return L.divIcon({
    className: 'customer-subnode-marker',
    html: html,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  })
}

// Backed by the store so the card list and any other view stay in sync
function toggleCustomerNodes() {
  coverageStore.showCustomerNodes = !coverageStore.showCustomerNodes
}

function applyCustomerPinVisibility() {
  if (!map || !customerPinsLayer) return
  const shouldShow = coverageStore.showCustomerNodes
  if (shouldShow && !map.hasLayer(customerPinsLayer)) {
    map.addLayer(customerPinsLayer)
  } else if (!shouldShow && map.hasLayer(customerPinsLayer)) {
    map.removeLayer(customerPinsLayer)
  }
}

function renderCoverageItems() {
  if (!map || !markersLayer || !circlesLayer || !customerPinsLayer) return

  markersLayer.clearLayers()
  circlesLayer.clearLayers()
  customerPinsLayer.clearLayers()

  const items = coverageStore.filteredCoverage

  items.forEach(item => {
    const isHq = item.name.includes('HQ')
    const isAvailable = item.status === 'Available Now'
    const type = isHq ? 'hq' : (isAvailable ? 'active' : 'expansion')

    const icon = createPinIcon(type)
    const marker = L.marker([item.lat, item.lng], { icon })

    const coveredAreasHtml = item.coveredAreas && item.coveredAreas.length
      ? item.coveredAreas.map(a => `<span style="display:inline-block; font-size:10px; background:#f1f5f9; color:#334155; padding:2px 6px; border-radius:4px; margin:2px 2px 0 0; font-weight:600;">${escapeHtml(a)}</span>`).join('')
      : ''

    const registerHref = `/register?barangay=${encodeURIComponent(item.name)}&city=${encodeURIComponent(item.municipality)}`

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
          🏠 ${escapeHtml(item.connectedHomes || 'Connected Subscribers')} • ${escapeHtml(item.activeNodes || 'Fiber Terminal Active')}
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
    markersLayer.addLayer(marker)

    // Render SubNodes (Customer Connection Points)
    if (item.subNodes && item.subNodes.length) {
      item.subNodes.forEach(sub => {
        const subIcon = createCustomerPinIcon()
        const subMarker = L.marker([sub.lat, sub.lng], { icon: subIcon })

        const subPopup = `
          <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px; padding: 2px;">
            <div style="font-size: 10px; font-weight: 800; color: #0284c7; text-transform: uppercase;">
              🏠 Active Customer Connection Point
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 3px 0;">
              ${escapeHtml(sub.name)}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
              Brgy. ${escapeHtml(item.name)}, ${escapeHtml(item.municipality)} (${escapeHtml(sub.status)})
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
        `
        subMarker.bindPopup(subPopup)
        customerPinsLayer.addLayer(subMarker)
      })
    }

    // Service area footprint: use the real barangay boundary when OpenStreetMap
    // has one, otherwise fall back to an approximate radius around the centre.
    const shapeColor = isHq ? '#ee2824' : (isAvailable ? '#10b981' : '#f59e0b')
    const boundary = barangayBoundaries[`${item.municipality}::${item.name}`]

    if (boundary) {
      // Solid outline = real mapped boundary. Status is conveyed by colour, so
      // the dash pattern is reserved for "this footprint is only approximate".
      const shape = L.geoJSON(boundary, {
        style: {
          color: shapeColor,
          fillColor: shapeColor,
          fillOpacity: 0.14,
          weight: 2
        }
      })
      shape.bindTooltip(`Brgy. ${escapeHtml(item.name)} — mapped service area`, { sticky: true })
      circlesLayer.addLayer(shape)
    } else {
      const circle = L.circle([item.lat, item.lng], {
        radius: isHq ? 450 : 300,
        color: shapeColor,
        fillColor: shapeColor,
        fillOpacity: 0.10,
        weight: 1,
        dashArray: '4,4'
      })
      circle.bindTooltip(`Brgy. ${escapeHtml(item.name)} — approximate area`, { sticky: true })
      circlesLayer.addLayer(circle)
    }
  })

  applyCustomerPinVisibility()
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
  userLocationMessage.value = ''
  locateError.value = ''
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

      // Find closest coverage point
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
  const target = coverageStore.municipalityCenters[newMun]
  if (target) {
    map.flyTo([target.lat, target.lng], target.zoom, { duration: 1 })
  } else {
    fitToVisibleMarkers()
  }
})

// Watch search query to update markers, framing whatever matched
watch(() => coverageStore.searchQuery, (q) => {
  if (!map) return
  renderCoverageItems()
  if (q) fitToVisibleMarkers()
})

watch(() => coverageStore.showCustomerNodes, () => {
  applyCustomerPinVisibility()
})

// Re-tile when the site theme flips
watch(() => themeStore.isDark, () => {
  applyTileTheme()
})

// Watch focused item from cards
watch(() => coverageStore.focusedBarangayId, (newId) => {
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
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
