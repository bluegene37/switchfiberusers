<template>
  <!-- Teleported to body: the wizard's .glass-panel uses backdrop-filter, which
       makes it the containing block for position:fixed and would otherwise
       anchor this overlay inside the panel instead of the viewport. -->
  <Teleport to="body">
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    role="dialog"
    aria-modal="true"
    aria-labelledby="compare-modal-title"
    @click.self="close"
  >
    <div class="glass-panel w-full max-w-5xl max-h-[92vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl border border-[#ee2824]/40 shadow-2xl flex flex-col dark:bg-slate-900 bg-white overflow-hidden">

      <!-- Modal Header -->
      <div class="px-4 sm:px-6 py-4 sm:py-5 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center shrink-0">
            <Zap class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <h3 id="compare-modal-title" class="text-base sm:text-xl font-bold font-heading dark:text-white text-slate-900 truncate">Switch Fiber Plan Comparison</h3>
            <p class="text-xs dark:text-slate-400 text-slate-500 hidden sm:block">Compare speeds, router hardware, and features side by side</p>
          </div>
        </div>
        <button
          @click="close"
          aria-label="Close comparison"
          class="p-2 rounded-xl shrink-0 text-slate-500 dark:text-slate-400 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Horizontal scroll affordance on narrow screens -->
      <p v-if="plans.length" class="sm:hidden px-4 pt-3 text-[11px] dark:text-slate-400 text-slate-500 flex items-center gap-1.5">
        <MoveHorizontal class="w-3.5 h-3.5 shrink-0" />
        <span>Swipe sideways to see all {{ plans.length }} plans</span>
      </p>

      <!-- Empty state (API returned nothing and no fallback available) -->
      <div v-if="!plans.length" class="p-10 text-center space-y-2">
        <p class="text-sm font-semibold dark:text-white text-slate-900">No plans to compare right now</p>
        <p class="text-xs dark:text-slate-400 text-slate-500">Please close this window and try refreshing the page.</p>
      </div>

      <!-- Comparison Matrix Table -->
      <div v-else class="p-4 sm:p-6 overflow-x-auto overflow-y-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b dark:border-slate-800 border-slate-200">
              <th scope="col" class="p-3 text-slate-500 dark:text-slate-400 font-semibold w-40 sticky left-0 z-10 dark:bg-slate-900 bg-white">Features</th>
              <th 
                v-for="plan in plans" 
                :key="plan.id"
                class="p-3 min-w-[150px] text-center"
                :class="isSelected(plan) ? 'bg-[#ee2824]/10 rounded-t-2xl' : ''"
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
              <th scope="row" class="p-3 text-left font-semibold dark:text-slate-300 text-slate-700 sticky left-0 z-10 dark:bg-slate-900 bg-white">Bandwidth Speed</th>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center font-bold text-emerald-600 dark:text-emerald-500" :class="isSelected(plan) ? 'bg-[#ee2824]/5' : ''">
                {{ plan.speed.replace('Turbo Speed ', '') }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="p-3 text-left font-semibold dark:text-slate-300 text-slate-700 sticky left-0 z-10 dark:bg-slate-900 bg-white">Data Allowance</th>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center dark:text-slate-300 text-slate-600" :class="isSelected(plan) ? 'bg-[#ee2824]/5' : ''">
                {{ plan.dataCap }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="p-3 text-left font-semibold dark:text-slate-300 text-slate-700 sticky left-0 z-10 dark:bg-slate-900 bg-white">Router Unit Included</th>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center dark:text-slate-300 text-slate-600" :class="isSelected(plan) ? 'bg-[#ee2824]/5' : ''">
                {{ plan.router }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="p-3 text-left font-semibold dark:text-slate-300 text-slate-700 sticky left-0 z-10 dark:bg-slate-900 bg-white">Wi-Fi Mesh Included</th>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center dark:text-slate-300 text-slate-600" :class="isSelected(plan) ? 'bg-[#ee2824]/5' : ''">
                <span :class="/node/i.test(plan.mesh) ? 'text-emerald-600 dark:text-emerald-500 font-bold' : 'text-slate-500 dark:text-slate-400'">
                  {{ plan.mesh }}
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row" class="p-3 text-left font-semibold dark:text-slate-300 text-slate-700 sticky left-0 z-10 dark:bg-slate-900 bg-white">Lock-in Period</th>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center dark:text-slate-300 text-slate-600" :class="isSelected(plan) ? 'bg-[#ee2824]/5' : ''">
                {{ plan.lockIn }}
              </td>
            </tr>
            <tr>
              <th scope="row" class="p-3 text-left font-semibold dark:text-slate-300 text-slate-700 sticky left-0 z-10 dark:bg-slate-900 bg-white">Support</th>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center" :class="isSelected(plan) ? 'bg-[#ee2824]/5' : ''">
                <span class="inline-flex items-center gap-1 justify-center" :class="/priority/i.test(plan.support) ? 'text-emerald-600 dark:text-emerald-500 font-bold' : 'text-slate-500 dark:text-slate-400'">
                  <Check v-if="/priority/i.test(plan.support)" class="w-4 h-4" />
                  {{ plan.support }}
                </span>
              </td>
            </tr>
            <tr>
              <th scope="row" class="p-3 text-left font-semibold dark:text-slate-300 text-slate-700 sticky left-0 z-10 dark:bg-slate-900 bg-white">Action</th>
              <td v-for="plan in plans" :key="plan.id" class="p-3 text-center" :class="isSelected(plan) ? 'bg-[#ee2824]/10 rounded-b-2xl' : ''">
                <button 
                  @click="onSelect(plan)" 
                  class="w-full py-2 px-3 rounded-xl text-xs font-bold transition-all"
                  :class="isSelected(plan) ? 'bg-[#ee2824] text-white shadow-md shadow-[#ee2824]/30' : 'btn-secondary'"
                >
                  {{ isSelected(plan) ? 'Selected' : 'Choose' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Footer -->
      <div class="px-4 sm:px-6 py-4 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between gap-3 shrink-0 dark:bg-slate-950 bg-slate-50">
        <span class="text-[11px] dark:text-slate-400 text-slate-500">All plans include standard free fiber installation.</span>
        <button @click="close" class="btn-secondary py-2 px-4 text-xs shrink-0">
          Close
        </button>
      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { Zap, Check, X, MoveHorizontal } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  plans: { type: Array, default: () => [] },
  selectedPlanId: { type: [String, Number], default: '' }
})

const emit = defineEmits(['close', 'select'])

// Compare as strings — the API returns numeric ids while the form stores strings
function isSelected(plan) {
  return String(props.selectedPlanId) === String(plan.id)
}

// Lock background scroll while open — otherwise the page behind the
// modal scrolls under your finger on mobile.
watch(() => props.isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

function onKeydown(e) {
  if (e.key === 'Escape' && props.isOpen) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

function close() {
  emit('close')
}

function onSelect(plan) {
  emit('select', plan)
  emit('close')
}
</script>
