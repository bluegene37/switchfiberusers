<template>
  <div class="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden border border-[#ee2824]/30">
    <div class="absolute -top-24 -right-24 w-64 h-64 bg-[#ee2824]/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-[#ee2824] animate-ping"></div>
        <span class="text-xs font-bold uppercase tracking-wider text-[#ee2824] dark:text-[#ff6b67]">Live Fiber Performance Simulator</span>
      </div>
      <span class="text-xs dark:text-slate-400 text-slate-500 font-mono">Binangonan Core Node #04</span>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
      <!-- Ping Gauge -->
      <div class="dark:bg-slate-900/80 bg-slate-100 p-4 rounded-xl border dark:border-slate-800 border-slate-200 text-center">
        <span class="text-xs dark:text-slate-400 text-slate-500 uppercase tracking-wider block mb-1">Latency (Ping)</span>
        <div class="text-2xl md:text-3xl font-extrabold font-heading text-emerald-500">
          {{ ping }} <span class="text-xs font-normal dark:text-slate-400 text-slate-500">ms</span>
        </div>
      </div>

      <!-- Download Gauge -->
      <div class="dark:bg-slate-900/80 bg-slate-100 p-4 rounded-xl border dark:border-slate-800 border-slate-200 text-center">
        <span class="text-xs dark:text-slate-400 text-slate-500 uppercase tracking-wider block mb-1">Download</span>
        <div class="text-2xl md:text-3xl font-extrabold font-heading text-[#ee2824] dark:text-[#ff6b67]">
          {{ Math.round(downloadSpeed) }} <span class="text-xs font-normal dark:text-slate-400 text-slate-500">Mbps</span>
        </div>
      </div>

      <!-- Upload Gauge -->
      <div class="dark:bg-slate-900/80 bg-slate-100 p-4 rounded-xl border dark:border-slate-800 border-slate-200 text-center">
        <span class="text-xs dark:text-slate-400 text-slate-500 uppercase tracking-wider block mb-1">Upload</span>
        <div class="text-2xl md:text-3xl font-extrabold font-heading text-amber-500">
          {{ Math.round(uploadSpeed) }} <span class="text-xs font-normal dark:text-slate-400 text-slate-500">Mbps</span>
        </div>
      </div>
    </div>

    <!-- Progress Bar Visualizer -->
    <div class="space-y-2 mb-6">
      <div class="flex justify-between text-xs dark:text-slate-400 text-slate-500">
        <span>Fiber Speed Throughput</span>
        <span>{{ testing ? 'Testing Node Capacity...' : 'Continuous Turbo Bandwidth Ready' }}</span>
      </div>
      <div class="w-full h-3 dark:bg-slate-900 bg-slate-200 rounded-full overflow-hidden p-0.5 border dark:border-slate-800 border-slate-300">
        <div 
          class="h-full rounded-full bg-gradient-to-r from-[#ee2824] via-[#ff5722] to-[#ff8c3b] transition-all duration-300 shadow-lg shadow-[#ee2824]/50"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>
    </div>

    <!-- Test Trigger Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-600">
        <CheckCircle2 class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
        <span>100% Symmetrical Fiber (No Data Cap)</span>
      </div>
      <button 
        @click="runSpeedTest" 
        :disabled="testing"
        class="btn-primary text-xs py-2 px-4"
      >
        <RotateCw v-if="testing" class="w-4 h-4 animate-spin" />
        <Gauge v-else class="w-4 h-4" />
        <span>{{ testing ? 'Testing...' : 'Run Speed Test' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CheckCircle2, RotateCw, Gauge } from 'lucide-vue-next'

const ping = ref(2)
const downloadSpeed = ref(350)
const uploadSpeed = ref(350)
const progressPercent = ref(88)
const testing = ref(false)

function runSpeedTest() {
  if (testing.value) return
  testing.value = true
  progressPercent.value = 5
  downloadSpeed.value = 0
  uploadSpeed.value = 0
  ping.value = 1

  let current = 0
  const interval = setInterval(() => {
    current += 5
    progressPercent.value = current
    
    downloadSpeed.value = Math.min(380, Math.floor(Math.random() * 80) + (current * 3.5))
    uploadSpeed.value = Math.min(380, Math.floor(Math.random() * 80) + (current * 3.4))
    ping.value = Math.floor(Math.random() * 2) + 2

    if (current >= 100) {
      clearInterval(interval)
      testing.value = false
      downloadSpeed.value = 365
      uploadSpeed.value = 360
      ping.value = 2
      progressPercent.value = 100
    }
  }, 100)
}
</script>
