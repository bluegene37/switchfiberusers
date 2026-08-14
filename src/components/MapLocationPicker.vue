<template>
  <!-- Teleported to body: ancestors using backdrop-filter (.glass-panel) become
       the containing block for position:fixed, which would anchor this overlay
       inside the panel instead of the viewport. -->
  <Teleport to="body">
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
    <div class="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl border border-[#ee2824]/40 shadow-2xl flex flex-col dark:bg-slate-900 bg-white overflow-hidden relative">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center">
            <MapPin class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">Pin Your Installation Location</h3>
            <p class="text-xs dark:text-slate-400 text-slate-600">OpenStreetMap - Drag marker or search address</p>
          </div>
        </div>
        <button 
          @click="close" 
          type="button"
          class="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Search Bar & Controls -->
      <div class="p-4 bg-slate-100 dark:bg-slate-950 border-b dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row gap-2 shrink-0">
        <div class="flex items-center gap-2 flex-1">
          <div class="relative flex-1">
            <Search 
              v-if="!isSearchFocused && !searchQuery" 
              class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity" 
            />
            <input 
              v-model="searchQuery" 
              @focus="isSearchFocused = true"
              @blur="isSearchFocused = false"
              @keyup.enter="searchAddress"
              type="text" 
              placeholder="Search landmark, street or barangay (e.g. Batingan, Binangonan)..." 
              class="input-field py-2 text-xs transition-all dark:text-white text-slate-900 bg-white dark:bg-slate-900"
              :class="(!isSearchFocused && !searchQuery) ? 'pl-9' : 'pl-3'"
            />
          </div>

          <button 
            @click="searchAddress" 
            type="button"
            class="btn-primary py-2 px-4 text-xs flex items-center gap-1.5 shrink-0"
            :disabled="isSearching"
          >
            <RotateCw v-if="isSearching" class="w-3.5 h-3.5 animate-spin" />
            <Search v-else class="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>

        <button 
          @click="locateMe" 
          type="button" 
          class="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 shrink-0"
          :disabled="isLocating"
        >
          <RotateCw v-if="isLocating" class="w-3.5 h-3.5 animate-spin" />
          <Navigation v-else class="w-3.5 h-3.5" />
          <span>My GPS</span>
        </button>
      </div>

      <!-- Leaflet Map Canvas Container -->
      <div class="relative flex-1 min-h-[380px] w-full dark:bg-slate-950 bg-slate-100">
        <div ref="mapContainerRef" class="w-full h-full min-h-[380px]"></div>
      </div>

      <!-- Footer Action Bar -->
      <div class="px-6 py-4 border-t dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0 dark:bg-slate-950 bg-slate-50">
        <div class="flex items-center gap-2.5 overflow-hidden max-w-full sm:max-w-[55%]">
          <div class="w-8 h-8 rounded-xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center shrink-0">
            <MapPin class="w-4 h-4" />
          </div>
          <div class="overflow-hidden">
            <span class="text-xs font-bold dark:text-white text-slate-900 block truncate">
              Pinned Location: {{ selectedBarangay ? 'Brgy. ' + selectedBarangay + ', ' : '' }}Binangonan
            </span>
            <span v-if="selectedAddress" class="text-[11px] dark:text-slate-400 text-slate-600 block truncate font-medium">
              {{ selectedAddress }}
            </span>
            <span v-else class="text-[11px] dark:text-slate-400 text-slate-600 block font-mono">
              Lat: {{ currentLat.toFixed(5) }}, Lng: {{ currentLng.toFixed(5) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button @click="close" type="button" class="btn-secondary py-2 px-4 text-xs">
            Cancel
          </button>
          <button @click="confirmPin" type="button" class="btn-primary py-2 px-5 text-xs bg-emerald-600 hover:bg-emerald-500">
            <CheckCircle2 class="w-4 h-4" />
            <span>Confirm Pin Location</span>
          </button>
        </div>
      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, Search, Navigation, RotateCw, CheckCircle2, X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  barangaysList: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'confirm'])

const mapContainerRef = ref(null)
const searchQuery = ref('')
const isSearchFocused = ref(false)
const isSearching = ref(false)
const isLocating = ref(false)

const currentLat = ref(14.4646) // Default Binangonan Rizal center
const currentLng = ref(121.1925)
const selectedAddress = ref('')
const selectedBarangay = ref('')
const selectedRoad = ref('')

let map = null
let marker = null

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    setTimeout(() => {
      initMap()
    }, 150)
  } else {
    destroyMap()
  }
})

function initMap() {
  if (!mapContainerRef.value) return
  if (map) {
    map.remove()
    map = null
  }

  // Create custom marker icon using Red Pin Drop SVG (exact pixel tip alignment)
  const customIcon = L.divIcon({
    className: 'custom-pin-marker',
    html: `
      <div class="w-8 h-8 text-[#ee2824] drop-shadow-xl pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ee2824" stroke="#ffffff" stroke-width="1.5" class="w-8 h-8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  })

  map = L.map(mapContainerRef.value).setView([currentLat.value, currentLng.value], 15)

  // Use Free OpenStreetMap Tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  marker = L.marker([currentLat.value, currentLng.value], {
    draggable: true,
    icon: customIcon
  }).addTo(map)

  marker.on('dragend', (e) => {
    const latLng = e.target.getLatLng()
    updatePosition(latLng.lat, latLng.lng)
  })

  map.on('click', (e) => {
    updatePosition(e.latlng.lat, e.latlng.lng)
  })

  // Initial reverse geocode
  updatePosition(currentLat.value, currentLng.value)
}

function destroyMap() {
  if (map) {
    map.remove()
    map = null
  }
}

async function updatePosition(lat, lng) {
  currentLat.value = lat
  currentLng.value = lng
  if (marker) {
    marker.setLatLng([lat, lng])
  }

  const latFixed = lat.toFixed(5)
  const lngFixed = lng.toFixed(5)

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
    if (response.ok) {
      const data = await response.json()
      const address = data.address || {}
      const detectedSub = (address.suburb || address.quarter || address.village || address.neighbourhood || address.residential || address.hamlet || '').trim()
      const detectedCity = address.city || address.town || address.municipality || 'Binangonan'
      const detectedRoad = address.road || address.pedestrian || address.highway || ''

      selectedRoad.value = detectedRoad

      // Match barangay
      if (detectedSub) {
        const matched = props.barangaysList.find(b => 
          b.toLowerCase() === detectedSub.toLowerCase() ||
          detectedSub.toLowerCase().includes(b.toLowerCase()) || 
          b.toLowerCase().includes(detectedSub.toLowerCase())
        )
        selectedBarangay.value = matched || ''
      } else {
        selectedBarangay.value = ''
      }

      const parts = []
      if (detectedRoad) parts.push(detectedRoad)
      if (selectedBarangay.value) parts.push(`Brgy. ${selectedBarangay.value}`)
      else if (detectedSub) parts.push(detectedSub)
      if (detectedCity) parts.push(detectedCity)
      parts.push(`GPS: ${latFixed}, ${lngFixed}`)

      selectedAddress.value = parts.join(', ')
    } else {
      selectedAddress.value = `Binangonan, Rizal (GPS: ${latFixed}, ${lngFixed})`
    }
  } catch (err) {
    console.warn('Reverse geocode error:', err)
    selectedAddress.value = `Binangonan, Rizal (GPS: ${latFixed}, ${lngFixed})`
  }
}

async function searchAddress() {
  if (!searchQuery.value.trim()) return
  isSearching.value = true
  try {
    const query = `${searchQuery.value}, Binangonan, Rizal, Philippines`
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
    if (response.ok) {
      const results = await response.json()
      if (results && results.length > 0) {
        const first = results[0]
        const lat = parseFloat(first.lat)
        const lon = parseFloat(first.lon)
        if (map) {
          map.setView([lat, lon], 17)
        }
        await updatePosition(lat, lon)
      } else {
        alert('No exact location found for search query. Try typing a street or barangay name.')
      }
    }
  } catch (err) {
    console.warn('Search geocode error:', err)
  } finally {
    isSearching.value = false
  }
}

function locateMe() {
  if (!navigator.geolocation) return
  isLocating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      if (map) {
        map.setView([lat, lng], 17)
      }
      updatePosition(lat, lng)
      isLocating.value = false
    },
    (err) => {
      console.warn('GPS locate error:', err)
      isLocating.value = false
      alert('Could not retrieve device location. Please enable GPS permissions.')
    },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

function close() {
  emit('close')
}

function confirmPin() {
  emit('confirm', {
    lat: currentLat.value,
    lng: currentLng.value,
    address: selectedAddress.value,
    barangay: selectedBarangay.value,
    road: selectedRoad.value
  })
  close()
}

onUnmounted(() => {
  destroyMap()
})
</script>

<style>
.leaflet-container {
  font-family: inherit;
  z-index: 1;
  color: #0f172a;
}
.dark .leaflet-container {
  color: #f8fafc;
}
.leaflet-control-attribution {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.85) !important;
  color: #475569 !important;
}
.dark .leaflet-control-attribution {
  background: rgba(15, 23, 42, 0.85) !important;
  color: #94a3b8 !important;
}
.leaflet-control-attribution a {
  color: #ee2824 !important;
}
</style>
