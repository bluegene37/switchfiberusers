<template>
  <div class="glass-card rounded-3xl border dark:border-slate-800 border-slate-200 overflow-hidden shadow-2xl space-y-0 relative">
    
    <!-- Map Toolbar Header -->
    <div class="p-4 sm:p-5 border-b dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 dark:bg-slate-900/90 bg-white/90 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center shrink-0">
          <MapPin class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base sm:text-lg font-bold font-heading dark:text-white text-slate-900">
              Interactive Rizal Fiber Coverage Map
            </h3>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
              Live Network
            </span>
          </div>
          <p class="text-xs dark:text-slate-400 text-slate-600">
            Click any pin to inspect fiber speed, port capacity, or check your GPS location.
          </p>
        </div>
      </div>

      <!-- Map Action Buttons -->
      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          @click="locateUser"
          type="button"
          :disabled="isLocating"
          class="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 shrink-0"
          title="Detect my current location"
        >
          <RotateCw v-if="isLocating" class="w-3.5 h-3.5 animate-spin" />
          <Navigation v-else class="w-3.5 h-3.5 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Locate Me</span>
        </button>

        <button
          @click="resetView"
          type="button"
          class="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 shrink-0"
          title="Reset to overview of Rizal"
        >
          <Maximize2 class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Overview</span>
        </button>
      </div>
    </div>

    <!-- Map Canvas Container -->
    <div class="relative w-full h-[420px] sm:h-[500px] bg-slate-100 dark:bg-slate-950">
      <div ref="mapElementRef" class="w-full h-full z-10"></div>

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
          <span class="font-bold dark:text-slate-200 text-slate-800">Head Office / NOC Hub (Binangonan)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm inline-block"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Available Now (Ready for Dispatch)</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-sm inline-block"></span>
          <span class="font-bold dark:text-slate-200 text-slate-800">Expansion Active (Inquire for Port)</span>
        </div>
      </div>

      <div class="text-[11px] dark:text-slate-400 text-slate-500 font-medium">
        Serving 49+ Barangays & Communities across Rizal
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Navigation, RotateCw, Maximize2, CheckCircle2 } from 'lucide-vue-next'
import { useCoverageStore } from '../stores/coverage'

const coverageStore = useCoverageStore()
const mapElementRef = ref(null)
const isLocating = ref(false)
const userLocationMessage = ref('')

let map = null
let markersLayer = null
let circlesLayer = null
let userMarker = null

const RIZAL_DEFAULT_CENTER = [14.485, 121.185]
const RIZAL_DEFAULT_ZOOM = 12

function initMap() {
  if (!mapElementRef.value || map) return

  map = L.map(mapElementRef.value, {
    center: RIZAL_DEFAULT_CENTER,
    zoom: RIZAL_DEFAULT_ZOOM,
    zoomControl: true,
    scrollWheelZoom: true
  })

  // OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 10
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
  circlesLayer = L.layerGroup().addTo(map)

  renderCoverageItems()
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

function renderCoverageItems() {
  if (!map || !markersLayer || !circlesLayer) return

  markersLayer.clearLayers()
  circlesLayer.clearLayers()

  const items = coverageStore.filteredCoverage

  items.forEach(item => {
    const isHq = item.name.includes('HQ')
    const isAvailable = item.status === 'Available Now'
    const type = isHq ? 'hq' : (isAvailable ? 'active' : 'expansion')

    const icon = createPinIcon(type)
    const marker = L.marker([item.lat, item.lng], { icon })

    // Popup card
    const popupContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 220px; padding: 2px;">
        <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: ${isHq ? '#ee2824' : (isAvailable ? '#059669' : '#d97706')}; margin-bottom: 2px;">
          ${item.municipality}, Rizal
        </div>
        <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">
          Brgy. ${item.name}
        </div>
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; font-size: 12px; color: #334155;">
          <span style="font-weight: 700;">Speed:</span>
          <span>${item.speed}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px; font-size: 12px; color: #334155;">
          <span style="font-weight: 700;">Port Status:</span>
          <span style="font-weight: 700; color: ${isAvailable ? '#059669' : '#d97706'};">${item.slots}</span>
        </div>
        <a 
          href="/register?barangay=${encodeURIComponent(item.name)}&city=${encodeURIComponent(item.municipality)}" 
          style="
            display: block;
            text-align: center;
            background-color: #ee2824;
            color: #ffffff;
            font-weight: 700;
            font-size: 11px;
            padding: 7px 12px;
            border-radius: 8px;
            text-decoration: none;
            box-shadow: 0 2px 6px rgba(238,40,36,0.35);
          "
        >
          Apply Online Now
        </a>
      </div>
    `

    marker.bindPopup(popupContent)
    markersLayer.addLayer(marker)

    // Soft coverage radius
    const circleColor = isHq ? '#ee2824' : (isAvailable ? '#10b981' : '#f59e0b')
    const circle = L.circle([item.lat, item.lng], {
      radius: isHq ? 800 : 500,
      color: circleColor,
      fillColor: circleColor,
      fillOpacity: 0.12,
      weight: 1
    })
    circlesLayer.addLayer(circle)
  })

  // Fit bounds if searching or specific municipality
  if (items.length > 0 && (coverageStore.selectedMunicipality !== 'All' || coverageStore.searchQuery)) {
    const group = L.featureGroup(markersLayer.getLayers())
    if (group.getLayers().length > 0) {
      map.fitBounds(group.getBounds().pad(0.2))
    }
  }
}

function resetView() {
  if (!map) return
  coverageStore.selectedMunicipality = 'All'
  coverageStore.searchQuery = ''
  map.flyTo(RIZAL_DEFAULT_CENTER, RIZAL_DEFAULT_ZOOM, { duration: 1 })
}

function locateUser() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.')
    return
  }

  isLocating.value = true
  userLocationMessage.value = ''

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
      alert('Unable to retrieve your location: ' + err.message)
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
  if (newMun && coverageStore.municipalityCenters[newMun]) {
    const target = coverageStore.municipalityCenters[newMun]
    map.flyTo([target.lat, target.lng], target.zoom, { duration: 1 })
  }
})

// Watch search query to update markers
watch(() => coverageStore.searchQuery, () => {
  renderCoverageItems()
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
  })
})

onUnmounted(() => {
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
