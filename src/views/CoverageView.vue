<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    
    <!-- Title Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ff6b67] uppercase tracking-widest">
        <MapPin class="w-3.5 h-3.5" />
        <span>Rizal Fiber Network Expansion</span>
      </div>
      <h1 class="text-4xl sm:text-5xl font-extrabold font-heading text-white">Area Coverage Directory</h1>
      <p class="text-slate-300 text-base leading-relaxed">
        Switch Fiber is rapidly expanding across the province of Rizal! Search your barangay below to check live port availability and dispatch status.
      </p>
    </div>

    <!-- Filters & Search Bar -->
    <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div class="flex flex-col md:flex-row items-center gap-4">
        
        <!-- Search Input -->
        <div class="relative flex-1 w-full">
          <Search class="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            v-model="coverageStore.searchQuery"
            type="text" 
            placeholder="Search Barangay (e.g. Bilibiran, Darangan, San Isidro)" 
            class="input-field pl-11 py-3"
          />
        </div>

        <!-- Municipality Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button 
            v-for="mun in coverageStore.municipalities" 
            :key="mun"
            @click="coverageStore.selectedMunicipality = mun"
            class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border"
            :class="coverageStore.selectedMunicipality === mun ? 'bg-[#ee2824] text-white border-red-400 shadow-md shadow-[#ee2824]/30' : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'"
          >
            {{ mun }}
          </button>
        </div>

      </div>
    </div>

    <!-- Coverage Grid Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="item in coverageStore.filteredCoverage" 
        :key="item.id"
        class="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 relative flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-[#ff6b67] uppercase tracking-wider">{{ item.municipality }}</span>
            <span 
              class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border"
              :class="item.status === 'Available Now' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'"
            >
              {{ item.status }}
            </span>
          </div>

          <h3 class="text-xl font-bold font-heading text-white">Brgy. {{ item.name }}</h3>

          <div class="mt-4 space-y-2 text-xs text-slate-300">
            <div class="flex justify-between border-b border-slate-800/80 pb-2">
              <span class="text-slate-500">Max Supported Speed:</span>
              <span class="font-bold text-slate-200">{{ item.speed }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-800/80 pb-2">
              <span class="text-slate-500">Port Capacity:</span>
              <span class="font-bold text-emerald-400">{{ item.slots }}</span>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <router-link to="/register" class="btn-primary w-full text-xs py-2">
            <CheckCircle2 class="w-4 h-4" />
            <span>Apply in Brgy. {{ item.name }}</span>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { MapPin, Search, CheckCircle2 } from 'lucide-vue-next'
import { useCoverageStore } from '../stores/coverage'

const coverageStore = useCoverageStore()
</script>
