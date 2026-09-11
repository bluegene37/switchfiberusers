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
            Click any pin to open its details in the side panel, or check your GPS location.
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
        class="absolute top-4 left-4 right-16 sm:left-auto z-[400] max-w-sm p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-500/40 shadow-xl text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-300"
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
        class="absolute top-4 left-4 right-16 sm:left-auto z-[400] max-w-sm p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-amber-500/40 shadow-xl text-xs space-y-1"
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
        class="absolute top-4 left-4 right-16 sm:left-auto z-[400] max-w-sm p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 shadow-xl text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-300"
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

      <!-- Detail side panel: replaces Leaflet popups so the pins stay visible.
           Docked to the left on tablet/desktop (that side of the map is mostly
           Laguna de Bay, so it hides the fewest pins); a bottom sheet on phones. -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-3 sm:translate-y-0 sm:-translate-x-4"
        enter-to-class="opacity-100 translate-y-0 sm:translate-x-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 sm:translate-x-0"
        leave-to-class="opacity-0 translate-y-3 sm:translate-y-0 sm:-translate-x-4"
      >
        <aside
          v-if="selectedDetail"
          :key="selectedDetailKey"
          ref="detailPanelRef"
          class="absolute z-[450] left-3 right-3 bottom-3 max-h-[58%] sm:right-auto sm:top-4 sm:left-4 sm:bottom-auto sm:max-h-[calc(100%-2rem)] sm:w-80 flex flex-col rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border dark:border-slate-700 border-slate-200 shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="false"
          :aria-label="detailPanelTitle"
          tabindex="-1"
        >
          <!-- Header -->
          <div class="flex items-start justify-between gap-3 p-4 border-b dark:border-slate-800 border-slate-200 shrink-0">
            <div class="min-w-0">
              <div
                class="text-[10px] font-extrabold uppercase tracking-wider"
                :class="detailAccentClass"
              >
                {{ detailEyebrow }}
              </div>
              <h4 class="text-base font-bold font-heading dark:text-white text-slate-900 leading-snug break-words">
                {{ detailPanelTitle }}
              </h4>
            </div>
            <button
              type="button"
              @click="closeDetail"
              aria-label="Close details"
              class="shrink-0 w-8 h-8 -mr-1 -mt-1 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-4 overflow-y-auto text-sm space-y-3 min-h-0">
            <!-- Barangay coverage pin -->
            <template v-if="selectedDetail.kind === 'barangay'">
              <p class="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-start gap-1.5">
                <Home class="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{{ selectedDetail.item.connectedHomes || 'Fiber Coverage Active' }} &bull; {{ selectedNapCountLabel }}</span>
              </p>
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
                <dt class="font-bold dark:text-slate-300 text-slate-700">Speed</dt>
                <dd class="text-right dark:text-slate-200 text-slate-800">{{ selectedDetail.item.speed }}</dd>
                <dt class="font-bold dark:text-slate-300 text-slate-700">Status</dt>
                <dd class="text-right font-bold" :class="selectedDetail.item.status === 'Available Now' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                  {{ selectedDetail.item.slots }}
                </dd>
              </dl>
              <div v-if="selectedDetail.item.coveredAreas && selectedDetail.item.coveredAreas.length" class="pt-3 border-t dark:border-slate-800 border-slate-200">
                <div class="text-[10px] font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-1.5">
                  Covered Subdivisions &amp; Streets
                </div>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="area in selectedDetail.item.coveredAreas"
                    :key="area"
                    class="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >{{ area }}</span>
                </div>
              </div>
            </template>

            <!-- Live NAP terminal dot -->
            <template v-else-if="selectedDetail.kind === 'nap'">
              <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
                {{ selectedNapLocationLine || 'Rizal service area' }}
              </p>
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
                <template v-if="selectedDetail.point.portTotal">
                  <dt class="font-bold dark:text-slate-300 text-slate-700">Port capacity</dt>
                  <dd class="text-right dark:text-slate-200 text-slate-800">{{ selectedDetail.point.portTotal }} ports</dd>
                </template>
                <dt class="font-bold dark:text-slate-300 text-slate-700">Coordinates</dt>
                <dd class="text-right dark:text-slate-200 text-slate-800 tabular-nums">
                  {{ Number(selectedDetail.point.lat).toFixed(5) }}, {{ Number(selectedDetail.point.lng).toFixed(5) }}
                </dd>
              </dl>
            </template>

            <!-- User GPS pin -->
            <template v-else-if="selectedDetail.kind === 'user'">
              <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
                <dt class="font-bold dark:text-slate-300 text-slate-700">Latitude</dt>
                <dd class="text-right dark:text-slate-200 text-slate-800 tabular-nums">{{ selectedDetail.lat.toFixed(4) }}</dd>
                <dt class="font-bold dark:text-slate-300 text-slate-700">Longitude</dt>
                <dd class="text-right dark:text-slate-200 text-slate-800 tabular-nums">{{ selectedDetail.lng.toFixed(4) }}</dd>
              </dl>
              <p v-if="userLocationMessage" class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
                {{ userLocationMessage }}
              </p>
            </template>
          </div>

          <!-- CTA -->
          <div v-if="detailCta" class="p-4 pt-0 shrink-0">
            <RouterLink
              :to="detailCta.to"
              class="block text-center text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition hover:brightness-110"
              :class="detailCta.className"
            >
              {{ detailCta.label }}
            </RouterLink>
          </div>
        </aside>
      </Transition>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation, RotateCw, Maximize2, CheckCircle2, Home, X } from 'lucide-vue-next'
import { useCoverageStore } from '../stores/coverage'
import { useThemeStore } from '../stores/theme'
import { barangayBoundaries } from '../data/barangayBoundaries'
import { samePlace } from '../data/calabarzonLocations'

const coverageStore = useCoverageStore()
const themeStore = useThemeStore()
const mapElementRef = ref(null)
const detailPanelRef = ref(null)
const isLocating = ref(false)
const userLocationMessage = ref('')
const locateError = ref('')
const showTouchHint = ref(false)
const unservedNotice = ref('')

// What the side panel is showing. Pins used to open Leaflet popups anchored to
// the marker, which hid the neighbouring pins; the panel keeps the map clear.
//   { kind: 'barangay', item }  – a coverage pin or its boundary
//   { kind: 'nap', point }      – a live NAP terminal dot
//   { kind: 'user', lat, lng }  – the GPS marker
const selectedDetail = ref(null)

const selectedDetailKey = computed(() => {
  const d = selectedDetail.value
  if (!d) return ''
  if (d.kind === 'barangay') return `barangay:${d.item.id}`
  if (d.kind === 'nap') return `nap:${d.point.id ?? `${d.point.lat},${d.point.lng}`}`
  return 'user'
})

const detailEyebrow = computed(() => {
  const d = selectedDetail.value
  if (!d) return ''
  if (d.kind === 'barangay') return `${d.item.municipality}, Rizal`
  if (d.kind === 'nap') return 'Live Fiber NAP Terminal'
  return 'GPS Location'
})

const detailPanelTitle = computed(() => {
  const d = selectedDetail.value
  if (!d) return ''
  if (d.kind === 'barangay') return `Brgy. ${d.item.name}`
  if (d.kind === 'nap') return d.point.name
  return 'Your Location'
})

const detailAccentClass = computed(() => {
  const d = selectedDetail.value
  if (!d) return ''
  if (d.kind === 'barangay') {
    if (d.item.name.includes('HQ')) return 'text-[#ee2824] dark:text-[#ff6b67]'
    return d.item.status === 'Available Now'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-amber-600 dark:text-amber-400'
  }
  if (d.kind === 'nap') return 'text-sky-600 dark:text-sky-400'
  return 'text-blue-600 dark:text-blue-400'
})

const selectedNapCountLabel = computed(() => {
  const d = selectedDetail.value
  if (!d || d.kind !== 'barangay') return ''
  const count = coverageStore.getNapCountForBarangay(d.item)
  return count > 0
    ? `${count} Live NAP Terminal${count === 1 ? '' : 's'} Mapped`
    : (d.item.activeNodes || 'Fiber Terminal Active')
})

const selectedNapLocationLine = computed(() => {
  const d = selectedDetail.value
  if (!d || d.kind !== 'nap') return ''
  return [d.point.street, d.point.city].filter(Boolean).join(', ')
})

const detailCta = computed(() => {
  const d = selectedDetail.value
  if (!d) return null
  if (d.kind === 'barangay') {
    return {
      to: { path: '/register', query: { barangay: d.item.name, city: d.item.municipality } },
      label: 'Apply for my House in this Barangay',
      className: 'bg-[#ee2824] shadow-[#ee2824]/30'
    }
  }
  if (d.kind === 'nap') {
    return {
      to: { path: '/register', query: { city: d.point.city || '' } },
      label: 'Connect My Residence',
      className: 'bg-sky-600 shadow-sky-600/30'
    }
  }
  return null
})

function closeDetail() {
  selectedDetail.value = null
}

function onDocumentKeydown(e) {
  if (e.key === 'Escape' && selectedDetail.value) closeDetail()
}

// Keep the clicked pin out from under the panel: nudge the map only as far as
// needed, instead of recentring on every click.
function keepPinVisible(latlng) {
  if (!map) return
  const isDocked = typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches
  const opts = isDocked
    ? { paddingTopLeft: [352, 24], paddingBottomRight: [24, 24] }
    : { paddingTopLeft: [24, 24], paddingBottomRight: [24, Math.round(map.getSize().y * 0.58) + 24] }
  map.panInside(latlng, { ...opts, animate: true })
}

// Leaflet re-dispatches a layer click to the map unless the *Leaflet* event is
// stopped (it checks originalEvent._stopped, which native stopPropagation never
// sets). Path layers — the canvas NAP dots and the boundary polygons — bubble
// by default, so without this the map's click handler would close the panel
// the instant it opened.
function stopMapClick(e) {
  if (e?.originalEvent) L.DomEvent.stopPropagation(e)
}

function openDetail(detail, latlng) {
  selectedDetail.value = detail
  if (latlng) nextTick(() => keepPinVisible(latlng))
}

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
    // Zoom buttons sit top-right; the detail panel docks on the left edge
    zoomControl: false,
    // Require Ctrl/⌘ + wheel so scrolling the page doesn't get swallowed by the map
    scrollWheelZoom: false
  })
  L.control.zoom({ position: 'topright' }).addTo(map)

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
    closeDetail()
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
    iconAnchor: [14, 14]
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

    dot.on('click', (e) => {
      stopMapClick(e)
      openDetail({ kind: 'nap', point }, dot.getLatLng())
    })
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

    const liveNapCount = coverageStore.getNapCountForBarangay(item)
    const napCountLabel = liveNapCount > 0
      ? `${liveNapCount} Live NAP Terminal${liveNapCount === 1 ? '' : 's'} Mapped`
      : escapeHtml(item.activeNodes || 'Fiber Terminal Active')

    marker.on('click', (e) => {
      stopMapClick(e)
      coverageStore.focusedBarangayId = item.id
      highlightBarangayBoundary(item.id)
      openDetail({ kind: 'barangay', item }, marker.getLatLng())
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
      stopMapClick(e)
      coverageStore.focusedBarangayId = item.id
      highlightBarangayBoundary(item.id)
      openDetail({ kind: 'barangay', item }, marker.getLatLng())
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
  closeDetail()
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

      userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map)
      userMarker.on('click', (e) => {
        stopMapClick(e)
        openDetail({ kind: 'user', lat, lng }, userMarker.getLatLng())
      })
      openDetail({ kind: 'user', lat, lng })

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
    // Show this barangay in the side panel (no latlng: flyTo already centres it)
    openDetail({ kind: 'barangay', item })
  }
})

// A re-render (search, municipality filter, NAP refresh) can drop the pin the
// panel describes; close it rather than showing details for a hidden pin.
watch(() => coverageStore.mapCoverageItems, (items) => {
  const d = selectedDetail.value
  if (!d || d.kind !== 'barangay') return
  if (!items.some(i => i.id === d.item.id)) closeDetail()
})

// Move focus into the panel when it opens so keyboard users land on it
watch(selectedDetailKey, (key) => {
  if (!key) return
  nextTick(() => detailPanelRef.value?.focus({ preventScroll: true }))
})

onMounted(() => {
  coverageStore.fetchNapLocations()
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', handleWindowFocus)
    document.addEventListener('keydown', onDocumentKeydown)
  }
  nextTick(() => {
    initMap()

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
    document.removeEventListener('keydown', onDocumentKeydown)
  }
  resizeObserver?.disconnect()
  resizeObserver = null
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
