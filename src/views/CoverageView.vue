<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    
    <!-- Title Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
        <MapPin class="w-3.5 h-3.5" />
        <span>Rizal Fiber Network Coverage</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        Area Coverage & Network Map
      </h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        Switch Fiber provides high-speed fiber internet in Binangonan and is expanding across Rizal. Explore the interactive map below or browse the full list of serviceable barangays.
      </p>
    </div>

    <!-- Interactive Leaflet Coverage Map -->
    <CoverageMap id="coverage-map-section" />

    <!-- Filters & Search Bar -->
    <div class="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">

        <!-- Search Input -->
        <div class="relative flex-1 w-full">
          <label for="coverage-search" class="sr-only">Search barangay</label>
          <Search class="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="coverage-search"
            v-model="coverageStore.searchQuery"
            type="search"
            placeholder="Search Barangay or Municipality (e.g. Bilibiran, Darangan, San Isidro, Taytay)..."
            class="input-field pl-11 py-3 text-sm"
          />
        </div>

        <!-- Result Counter Badge -->
        <div class="shrink-0 text-xs font-bold dark:text-slate-400 text-slate-600">
          Showing <span class="text-[#ee2824] dark:text-[#ff6b67] font-mono font-extrabold text-sm">{{ coverageStore.filteredCoverage.length }}</span> locations
        </div>

      </div>

      <!-- Municipality Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto w-full pt-2 pb-1 scrollbar-none" role="group" aria-label="Filter by municipality">
        <button
          v-for="mun in coverageStore.municipalities"
          :key="mun"
          @click="coverageStore.selectedMunicipality = mun"
          :aria-pressed="coverageStore.selectedMunicipality === mun"
          class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border focus:outline-none focus:ring-2 focus:ring-[#ee2824]/40"
          :class="coverageStore.selectedMunicipality === mun
            ? 'bg-[#ee2824] text-white border-[#ee2824] shadow-md shadow-[#ee2824]/30'
            : 'dark:bg-slate-900 bg-white dark:text-slate-300 text-slate-700 dark:border-slate-800 border-slate-200 hover:border-[#ee2824]/40'"
        >
          {{ mun }}
        </button>
      </div>
    </div>

    <!-- Coverage Grid Cards -->
    <div v-if="coverageStore.filteredCoverage.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in coverageStore.filteredCoverage"
        :key="item.id"
        class="glass-card p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4 relative flex flex-col justify-between hover:border-[#ee2824]/50 transition-all duration-300 group"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-wider">{{ item.municipality }}</span>
            <span
              class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border"
              :class="item.status === 'Available Now'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'"
            >
              {{ item.status }}
            </span>
          </div>

          <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900 flex items-center justify-between">
            <span>Brgy. {{ item.name }}</span>
            <button
              @click="locateOnMap(item.id)"
              type="button"
              class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#ee2824] transition-all text-xs flex items-center gap-1 font-sans font-medium"
              title="Locate on Map"
            >
              <Compass class="w-3.5 h-3.5" />
              <span class="text-[10px]">Map</span>
            </button>
          </h3>

          <div class="mt-4 space-y-2 text-xs dark:text-slate-300 text-slate-600">
            <div class="flex justify-between border-b dark:border-slate-800/80 border-slate-100 pb-2">
              <span class="dark:text-slate-500 text-slate-500">Max Supported Speed:</span>
              <span class="font-bold dark:text-slate-200 text-slate-800">{{ item.speed }}</span>
            </div>
            <div class="flex justify-between border-b dark:border-slate-800/80 border-slate-100 pb-2">
              <span class="dark:text-slate-500 text-slate-500">Port Capacity:</span>
              <span class="font-bold" :class="item.status === 'Available Now' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">{{ item.slots }}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 flex gap-2">
          <button
            @click="locateOnMap(item.id)"
            type="button"
            class="btn-secondary text-xs py-2 px-3 flex items-center justify-center shrink-0"
            title="Focus this barangay on the interactive map"
          >
            <Compass class="w-3.5 h-3.5" />
          </button>
          <router-link 
            :to="`/register?barangay=${encodeURIComponent(item.name)}&city=${encodeURIComponent(item.municipality)}`" 
            class="btn-primary flex-1 text-xs py-2 text-center flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>Apply Online</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- No Results State -->
    <div v-else class="glass-card p-10 rounded-3xl border dark:border-slate-800 border-slate-200 text-center space-y-3 max-w-xl mx-auto">
      <MapPin class="w-10 h-10 text-[#ee2824] dark:text-[#ff6b67] mx-auto" />
      <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">No barangays match your search</h2>
      <p class="text-sm dark:text-slate-400 text-slate-600">
        We're expanding fast across Rizal. Try a different spelling or municipality — or
        <router-link to="/contact" class="text-[#ee2824] dark:text-[#ff6b67] font-bold hover:underline">let us know your area</router-link>
        so we can prioritize it.
      </p>
    </div>

  </div>
</template>

<script setup>
import { MapPin, Search, CheckCircle2, Compass } from 'lucide-vue-next'
import { useCoverageStore } from '../stores/coverage'
import CoverageMap from '../components/CoverageMap.vue'

const coverageStore = useCoverageStore()

function locateOnMap(barangayId) {
  coverageStore.focusedBarangayId = barangayId
  const mapElement = document.getElementById('coverage-map-section')
  if (mapElement) {
    mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
</script>
