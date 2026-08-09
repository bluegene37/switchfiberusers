<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
    <div class="glass-panel w-full max-w-5xl max-h-[90vh] rounded-3xl border border-[#ee2824]/40 shadow-2xl flex flex-col dark:bg-slate-900 bg-white overflow-hidden">
      
      <!-- Modal Header -->
      <div class="px-6 py-5 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center">
            <Zap class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">Switch Fiber Plan Comparison</h3>
            <p class="text-xs dark:text-slate-400 text-slate-500">Compare speeds, router hardware, and features side by side</p>
          </div>
        </div>
        <button 
          @click="close" 
          class="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Comparison Matrix Table -->
      <div class="p-6 overflow-x-auto overflow-y-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b dark:border-slate-800 border-slate-200">
              <th class="p-3 text-slate-400 font-semibold w-40">Features</th>
              <th 
                v-for="plan in plans" 
                :key="plan.id"
                class="p-3 min-w-[150px] text-center"
                :class="selectedPlanId === plan.id ? 'bg-[#ee2824]/10 rounded-t-2xl' : ''"
              >
                <div v-if="plan.recommended" class="inline-block bg-[#ee2824] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase mb-1">
                  Popular
                </div>
                <div class="font-bold dark:text-white text-slate-900 text-sm">{{ plan.title }}</div>
                <div class="text-lg font-extrabold text-[#ee2824] dark:text-[#ff6b67] mt-0.5">₱{{ plan.price }}<span class="text-[10px] font-normal dark:text-slate-400 text-slate-500">/mo</span></div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y dark:divide-slate-800/80 divide-slate-200">
            <tr>
              <td class="p-3 font-semibold dark:text-slate-300 text-slate-700">Bandwidth Speed</td>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center font-bold text-emerald-500" :class="selectedPlanId === plan.id ? 'bg-[#ee2824]/5' : ''">
                {{ plan.speed.replace('Turbo Speed ', '') }}
              </td>
            </tr>
            <tr>
              <td class="p-3 font-semibold dark:text-slate-300 text-slate-700">Data Allowance</td>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center dark:text-slate-300 text-slate-600" :class="selectedPlanId === plan.id ? 'bg-[#ee2824]/5' : ''">
                Unlimited (No Cap)
              </td>
            </tr>
            <tr>
              <td class="p-3 font-semibold dark:text-slate-300 text-slate-700">Router Unit Included</td>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center dark:text-slate-300 text-slate-600" :class="selectedPlanId === plan.id ? 'bg-[#ee2824]/5' : ''">
                {{ plan.price >= 1299 ? 'Wi-Fi 6 Dual Band' : 'Dual-Band ONU' }}
              </td>
            </tr>
            <tr>
              <td class="p-3 font-semibold dark:text-slate-300 text-slate-700">Wi-Fi Mesh Included</td>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center dark:text-slate-300 text-slate-600" :class="selectedPlanId === plan.id ? 'bg-[#ee2824]/5' : ''">
                <span v-if="plan.price >= 1499" class="text-emerald-500 font-bold">2 Nodes</span>
                <span v-else-if="plan.price >= 1299" class="text-emerald-500 font-bold">1 Node</span>
                <span v-else class="text-slate-400">Optional</span>
              </td>
            </tr>
            <tr>
              <td class="p-3 font-semibold dark:text-slate-300 text-slate-700">Lock-in Period</td>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center dark:text-slate-300 text-slate-600" :class="selectedPlanId === plan.id ? 'bg-[#ee2824]/5' : ''">
                12 Months
              </td>
            </tr>
            <tr>
              <td class="p-3 font-semibold dark:text-slate-300 text-slate-700">Priority Support</td>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center" :class="selectedPlanId === plan.id ? 'bg-[#ee2824]/5' : ''">
                <Check v-if="plan.price >= 799" class="w-4 h-4 text-emerald-500 mx-auto" />
                <span v-else class="text-slate-400">Standard</span>
              </td>
            </tr>
            <tr>
              <td class="p-3 font-semibold dark:text-slate-300 text-slate-700">Action</td>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center" :class="selectedPlanId === plan.id ? 'bg-[#ee2824]/10 rounded-b-2xl' : ''">
                <button 
                  @click="onSelect(plan)" 
                  class="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all"
                  :class="selectedPlanId === plan.id ? 'bg-[#ee2824] text-white shadow-md shadow-[#ee2824]/30' : 'btn-secondary'"
                >
                  {{ selectedPlanId === plan.id ? 'Selected' : 'Choose' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0 dark:bg-slate-950 bg-slate-50">
        <span class="text-[11px] dark:text-slate-400 text-slate-500">All plans include standard free fiber installation.</span>
        <button @click="close" class="btn-secondary py-2 px-4 text-xs">
          Close Matrix
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Zap, Check, X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  plans: { type: Array, default: () => [] },
  selectedPlanId: { type: String, default: '' }
})

const emit = defineEmits(['close', 'select'])

function close() {
  emit('close')
}

function onSelect(plan) {
  emit('select', plan)
  emit('close')
}
</script>
