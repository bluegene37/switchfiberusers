<template>
  <div 
    class="glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between relative transition-all duration-300 group"
    :class="plan.recommended ? 'border-[#ee2824]/50 shadow-xl shadow-[#ee2824]/15 dark:bg-slate-900/80 bg-white ring-1 ring-[#ee2824]/30' : 'dark:border-slate-800 border-slate-200'"
  >
    <!-- Recommended Tag Badge -->
    <div v-if="plan.recommended" class="absolute -top-3.5 left-1/2 -translate-x-1/2">
      <span class="badge-neon shadow-lg shadow-[#ee2824]/30">
        <Sparkles class="w-3.5 h-3.5" />
        <span>{{ plan.tag || 'Most Popular' }}</span>
      </span>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500">{{ plan.tag || 'Fiber Plan' }}</span>
        <span class="text-xs font-medium dark:text-slate-400 text-slate-600 dark:bg-slate-800/80 bg-slate-100 px-2.5 py-1 rounded-full border dark:border-slate-700 border-slate-300">
          {{ plan.lockIn }}
        </span>
      </div>

      <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900 group-hover:text-[#ee2824] dark:group-hover:text-[#ff6b67] transition-colors mb-2">
        {{ plan.title }}
      </h3>

      <div class="flex items-baseline gap-1 my-4">
        <span class="text-4xl md:text-5xl font-extrabold font-heading dark:text-white text-slate-900">₱{{ plan.price }}</span>
        <span class="dark:text-slate-400 text-slate-500 text-sm font-medium">/ month</span>
      </div>

      <div class="p-3 rounded-xl dark:bg-slate-900/80 bg-slate-100 border dark:border-slate-800 border-slate-200 text-center mb-6">
        <span class="text-xs dark:text-slate-400 text-slate-500 block mb-0.5 uppercase tracking-wider">Speed Throughput</span>
        <span class="text-lg font-bold font-heading text-gradient-red">{{ plan.speed }}</span>
      </div>

      <ul class="space-y-3 mb-8">
        <li v-for="(feat, idx) in plan.features" :key="idx" class="flex items-center gap-3 text-sm dark:text-slate-300 text-slate-700">
          <Check class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67] shrink-0" />
          <span>{{ feat }}</span>
        </li>
      </ul>
    </div>

    <div>
      <button 
        @click="$emit('select', plan)" 
        class="w-full"
        :class="plan.recommended ? 'btn-primary' : 'btn-secondary'"
      >
        <span>Apply Now</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Sparkles, Check, ArrowRight } from 'lucide-vue-next'

defineProps({
  plan: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])
</script>
