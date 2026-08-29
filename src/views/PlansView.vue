<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    
    <!-- Title Banner -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Unlimited Fiber Internet & MSME Deals</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        Fiber Plans, Business Bundles & Promos
      </h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        Choose the perfect turbo-speed fiber internet plan for your home or enterprise in Rizal. Enjoy 0 data capping, symmetrical speeds, and transparent billing.
      </p>

      <!-- Live Pricing Status Indicator -->
      <div class="flex items-center justify-center gap-2 pt-2" aria-live="polite">
        <span v-if="isLoading" class="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <RotateCw class="w-3.5 h-3.5 animate-spin" />
          Checking for the latest pricing...
        </span>
        <span v-else-if="plansError" class="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <AlertCircle class="w-3.5 h-3.5" />
          {{ plansError }}
        </span>
        <span v-else class="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          <Wifi class="w-3.5 h-3.5" />
          Live pricing — updated just now
        </span>
        <button
          @click="refreshPlans"
          :disabled="isLoading"
          title="Refresh plans"
          aria-label="Refresh plans"
          class="inline-flex items-center justify-center w-11 h-11 rounded-md text-slate-500 dark:text-slate-400 hover:text-[#ee2824] dark:hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#ee2824]/40"
        >
          <RotateCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        </button>
      </div>
    </div>

    <!-- Section jump nav. Every section stays on the page — these only scroll,
         so nothing is hidden from visitors who never click. -->
    <nav
      ref="jumpNavRef"
      :style="{ top: headerOffset + 'px' }"
      class="sticky z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 dark:bg-[#07080c]/85 bg-[#f8fafc]/85 backdrop-blur-md border-b dark:border-slate-800/70 border-slate-200/70"
      aria-label="Jump to a section"
    >
      <div class="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none">
        <button
          v-for="section in planSections"
          :key="section.id"
          type="button"
          @click="scrollToSection(section.id)"
          :aria-current="activeSection === section.id ? 'true' : undefined"
          class="inline-flex items-center justify-center min-h-11 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2 shrink-0 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#ee2824]/40"
          :class="activeSection === section.id
            ? 'bg-[#ee2824] text-white border-[#ee2824] shadow-lg shadow-[#ee2824]/25'
            : 'dark:bg-slate-900 bg-white dark:text-slate-300 text-slate-700 dark:border-slate-800 border-slate-200 hover:border-[#ee2824]/40'"
        >
          <component :is="section.icon" class="w-4 h-4" />
          <span>{{ section.label }}</span>
        </button>
      </div>
    </nav>

    <!-- SECTION 1: RESIDENTIAL PLANS MATRIX -->
    <section id="residential" ref="residentialRef" :style="{ scrollMarginTop: anchorOffset + 'px' }" class="space-y-16">
      <div v-if="availablePlans.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <PlanCard
          v-for="plan in availablePlans"
          :key="plan.id"
          :plan="plan"
          @select="handleSelect"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="glass-card p-10 rounded-3xl border dark:border-slate-800 border-slate-200 text-center space-y-3 max-w-xl mx-auto">
        <AlertCircle class="w-10 h-10 text-amber-500 mx-auto" />
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">Plans are temporarily unavailable</h2>
        <p class="text-sm dark:text-slate-400 text-slate-600">
          Please try refreshing, or call our hotline at
          <a href="tel:09154077565" class="text-[#ee2824] dark:text-[#ff6b67] font-bold hover:underline">0915 407 7565</a>
          and we'll walk you through the options.
        </p>
        <button @click="refreshPlans" class="btn-secondary text-sm mx-auto">Try Again</button>
      </div>

      <!-- Detailed Plan Features Comparison Table -->
      <div v-if="availablePlans.length" class="glass-panel p-6 md:p-10 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <div class="border-b dark:border-slate-800 border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Residential Plan Comparison Matrix</h2>
            <p class="text-xs dark:text-slate-400 text-slate-500">All plans include free standard installation and ONU Wi-Fi modem.</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <caption class="sr-only">Comparison of Switch Fiber plan pricing, speed, data cap, router and lock-in period</caption>
            <thead>
              <tr class="border-b dark:border-slate-800 border-slate-200 text-xs font-bold dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                <th scope="col" class="py-4 px-4">Feature</th>
                <th
                  v-for="plan in availablePlans"
                  :key="plan.id"
                  scope="col"
                  class="py-4 px-4 text-center font-bold"
                  :class="plan.recommended ? 'text-[#ee2824] dark:text-[#ff6b67]' : 'dark:text-slate-300 text-slate-700'"
                >
                  {{ plan.title.replace(' Plan', '') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-800/60 divide-slate-200 text-sm dark:text-slate-300 text-slate-600">
              <tr>
                <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Monthly Fee</th>
                <td
                  v-for="plan in availablePlans"
                  :key="plan.id"
                  class="py-4 px-4 text-center font-bold"
                  :class="plan.recommended ? 'text-[#ee2824] dark:text-[#ff6b67]' : ''"
                >
                  ₱{{ plan.price }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Speed Tier</th>
                <td
                  v-for="plan in availablePlans"
                  :key="plan.id"
                  class="py-4 px-4 text-center"
                  :class="plan.recommended ? 'text-[#ee2824] dark:text-[#ff6b67] font-bold' : ''"
                >
                  {{ plan.speed.replace('Turbo Speed ', '').replace('(', '').replace(')', '') }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Data Cap</th>
                <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center text-emerald-600 dark:text-emerald-400">
                  {{ plan.dataCap }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Router Included</th>
                <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                  {{ plan.router }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Wi-Fi Mesh</th>
                <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                  {{ plan.mesh }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Support</th>
                <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                  {{ plan.support }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Lock-In Period</th>
                <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                  {{ plan.lockIn }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-4 px-4 text-left font-semibold dark:text-white text-slate-900">Action</th>
                <td v-for="plan in availablePlans" :key="plan.id" class="py-4 px-4 text-center">
                  <button 
                    @click="handleSelect(plan)" 
                    class="text-xs py-1.5 px-3 rounded-xl font-bold transition-all"
                    :class="plan.recommended ? 'btn-primary' : 'btn-secondary'"
                  >
                    Apply
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SECTION 2: MSME SMARTBIZ BUNDLE DEALS -->
    <section id="msme" ref="msmeRef" :style="{ scrollMarginTop: anchorOffset + 'px' }" class="space-y-12 pt-4 border-t dark:border-slate-800/60 border-slate-200/80">
      <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 dark:bg-amber-500/5 bg-amber-50/70 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
          <Briefcase class="w-8 h-8" />
        </div>
        <div class="space-y-1 flex-1">
          <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
            Business Owners & Entrepreneurs
          </span>
          <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900">SmartBiz MSME Internet + Device Bundles</h3>
          <p class="text-xs sm:text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
            Level up your business operations in Rizal with high-speed fiber connection + essential workplace gadgets like Laptops, CCTVs, Wi-Fi Mesh, Tablets, and Smartphones.
          </p>
        </div>
      </div>

      <!-- Step 1: pick a speed tier -->
      <div class="max-w-4xl mx-auto space-y-4">
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-full bg-amber-500 text-white text-sm font-extrabold flex items-center justify-center shrink-0">1</span>
          <h3 class="text-lg sm:text-xl font-bold font-heading dark:text-white text-slate-900">
            Avail any of our MSME internet plans
          </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="plan in msmePlans"
            :key="plan.name"
            class="glass-card p-4 rounded-2xl border flex items-center justify-between gap-3 transition-colors"
            :class="plan.premium
              ? 'dark:border-amber-500/40 border-amber-300 dark:bg-amber-500/5 bg-amber-50/60'
              : 'dark:border-slate-800 border-slate-200'"
          >
            <span class="font-bold text-sm dark:text-white text-slate-900">{{ plan.name }}</span>
            <span class="text-right shrink-0">
              <span class="block text-[10px] uppercase tracking-wider dark:text-slate-400 text-slate-500">Speed up to</span>
              <span class="font-extrabold text-amber-600 dark:text-amber-400">{{ plan.speed }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Step 2: pick one free device -->
      <div class="max-w-4xl mx-auto space-y-4">
        <div class="flex items-center gap-3">
          <span class="w-7 h-7 rounded-full bg-amber-500 text-white text-sm font-extrabold flex items-center justify-center shrink-0">2</span>
          <h3 class="text-lg sm:text-xl font-bold font-heading dark:text-white text-slate-900">
            …and choose one bundle
          </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="device in msmeBundleDevices"
            :key="device.name"
            class="glass-card p-4 rounded-2xl border dark:border-slate-800 border-slate-200 flex items-start gap-3"
          >
            <CheckCircle2 class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div class="min-w-0">
              <span class="block font-bold text-sm dark:text-white text-slate-900">{{ device.name }}</span>
              <span class="block text-xs dark:text-slate-400 text-slate-500">{{ device.type }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pricing is quoted on inquiry, so route to the team rather than invent a rate -->
      <div class="glass-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 max-w-4xl mx-auto space-y-4 text-center">
        <h4 class="font-bold dark:text-white text-slate-900 text-lg font-heading">Ask for an MSME quotation</h4>
        <p class="text-xs sm:text-sm dark:text-slate-300 text-slate-600 max-w-2xl mx-auto leading-relaxed">
          MSME plans are quoted per business based on your chosen speed tier and device bundle.
          Talk to our SmartBiz team and we'll prepare a proposal for your location.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <a href="tel:09154077565" class="btn-primary py-3 px-6 text-sm w-full sm:w-auto">
            <PhoneCall class="w-4 h-4" />
            <span>0915 407 7565</span>
          </a>
          <a href="tel:09178762440" class="btn-secondary py-3 px-6 text-sm w-full sm:w-auto">
            <PhoneCall class="w-4 h-4" />
            <span>0917 876 2440</span>
          </a>
          <router-link to="/contact" class="btn-secondary py-3 px-6 text-sm w-full sm:w-auto">
            <span>Send an inquiry</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </section>

    <!-- SECTION 3: PROMOS & DISCOUNTS -->
    <section id="promos" ref="promosRef" :style="{ scrollMarginTop: anchorOffset + 'px' }" class="space-y-12 pt-4 border-t dark:border-slate-800/60 border-slate-200/80">
      <!-- Back to School Promo Card -->
      <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-sky-500/40 relative overflow-hidden space-y-8 max-w-4xl mx-auto">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2 flex-1">
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border"
              :class="connectEdHasEnded
                ? 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30'
                : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'"
            >
              <Gift class="w-3.5 h-3.5" />
              <span>{{ connectEdHasEnded ? 'Promo period ended' : 'Special Campaign' }}</span>
            </span>
            <h3 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
              Get ConnectED: Back to School Promo!
            </h3>
            <p class="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
              Exclusive discount promo for Parents, Teachers, Educators, and Students residing within Switch Fiber serviceable areas in Rizal!
            </p>
          </div>
          <div class="px-6 py-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center shrink-0">
            <span class="text-3xl font-extrabold text-sky-600 dark:text-sky-400 font-heading block">15% OFF</span>
            <span class="text-xs dark:text-slate-300 text-slate-700 font-bold block">For 6 Billing Cycles</span>
            <span class="text-[10px] text-sky-600 dark:text-sky-400 font-semibold mt-1 block">+ Free Switch Tumbler</span>
          </div>
        </div>

        <!-- Qualifying plans: the promo applies to these three tiers only -->
        <div class="pt-4 border-t dark:border-slate-800 border-slate-200 space-y-3">
          <h5 class="font-bold dark:text-white text-slate-900 text-sm">Qualifying plans</h5>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              v-for="plan in connectEdPlans"
              :key="plan.name"
              class="p-3 rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-slate-50 flex items-baseline justify-between gap-2"
            >
              <span class="text-xs font-bold dark:text-white text-slate-900">{{ plan.name }}</span>
              <span class="text-xs font-extrabold text-sky-600 dark:text-sky-400 shrink-0">{{ plan.speed }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t dark:border-slate-800 border-slate-200">
          <div class="space-y-2 text-xs dark:text-slate-300 text-slate-600">
            <h5 class="font-bold dark:text-white text-slate-900 text-sm">Requirements:</h5>
            <ul class="space-y-1.5 list-disc list-inside">
              <li><strong>Educators:</strong> (PRC) Professional Regulation Commission ID or School ID.</li>
              <li><strong>Students (18 y/o and above only):</strong> any latest Proof of Enrolment or School ID.</li>
              <li><strong>Parents:</strong> parent's Government ID and child's latest Proof of Enrolment.</li>
            </ul>
          </div>

          <div class="space-y-2 text-xs dark:text-slate-300 text-slate-600">
            <h5 class="font-bold dark:text-white text-slate-900 text-sm">Terms &amp; conditions:</h5>
            <ul class="space-y-1.5 list-disc list-inside">
              <li>Promo period: {{ connectEdPromo.periodLabel }}.</li>
              <li>Open to individuals 18 years old and above only.</li>
              <li>Applicable to new customers within Switch Fiber's serviceable areas who submit all subscription requirements and pass validation and facility checking within the promo period.</li>
              <li>Only one (1) promo participant per household or installation address.</li>
              <li>The 15% off and free tumbler can be claimed only after completing payment of the pro-rated billing.</li>
              <li>Personal information is handled per the Data Privacy Act of 2012 (RA No. 10173).</li>
            </ul>
          </div>
        </div>

        <div
          v-if="connectEdHasEnded"
          class="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-xs dark:text-slate-200 text-slate-700 flex items-start gap-2"
        >
          <AlertCircle class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            This promo period ended on June 30, 2026. Please confirm with our team whether it has been extended
            before applying on the strength of this offer.
          </span>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row gap-4">
          <router-link to="/register" class="btn-primary py-3 px-8 text-xs flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500">
            <Sparkles class="w-4 h-4" />
            <span>{{ connectEdHasEnded ? 'Apply Online' : 'Apply Online with Student/Educator Promo' }}</span>
          </router-link>
          <router-link to="/contact" class="btn-secondary py-3 px-6 text-xs text-center">
            <span>Inquire at Office</span>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, RotateCw, Wifi, AlertCircle, Home, Briefcase, Gift, CheckCircle2, ArrowRight, PhoneCall } from 'lucide-vue-next'
import PlanCard from '../components/PlanCard.vue'
import { useRegistrationStore } from '../stores/registration'

const router = useRouter()
const registrationStore = useRegistrationStore()

const planSections = [
  { id: 'residential', label: 'Residential Fiber Plans', icon: Home },
  { id: 'msme', label: 'MSME SmartBiz Bundles', icon: Briefcase },
  { id: 'promos', label: 'Promos & Back-to-School', icon: Gift }
]

const residentialRef = ref(null)
const msmeRef = ref(null)
const promosRef = ref(null)
const jumpNavRef = ref(null)
const activeSection = ref('residential')

const sectionRefs = { residential: residentialRef, msme: msmeRef, promos: promosRef }

// The site header's height changes between breakpoints (the utility bar is
// hidden on small screens), so measure it rather than hardcoding an offset —
// otherwise the jump nav tucks underneath it and section headings land behind.
const headerOffset = ref(0)
const jumpNavHeight = ref(0)
const anchorOffset = computed(() => headerOffset.value + jumpNavHeight.value + 12)

function measureChrome() {
  const header = document.querySelector('header')
  headerOffset.value = header ? Math.round(header.getBoundingClientRect().height) : 0
  jumpNavHeight.value = jumpNavRef.value
    ? Math.round(jumpNavRef.value.getBoundingClientRect().height)
    : 0
}

function scrollToSection(id) {
  const el = sectionRefs[id]?.value
  if (!el) return
  measureChrome()
  const top = el.getBoundingClientRect().top + window.scrollY - anchorOffset.value
  window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' })
  // Reflect the jump immediately; the observer would otherwise lag the animation
  activeSection.value = id
}

// Scrollspy so the pills show where you are while scrolling normally.
let observer = null

onMounted(() => {
  measureChrome()
  window.addEventListener('resize', measureChrome)

  if (typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible?.target?.id) activeSection.value = visible.target.id
    },
    // Top band of the viewport, below the sticky header + jump nav
    { rootMargin: '-150px 0px -55% 0px', threshold: 0 }
  )
  Object.values(sectionRefs).forEach(r => r.value && observer.observe(r.value))
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureChrome)
  observer?.disconnect()
  observer = null
})

const availablePlans = computed(() => registrationStore.availablePlans)
const isLoading = computed(() => registrationStore.isLoadingPlans)
const plansError = computed(() => registrationStore.plansError)

// MSME tiers exactly as published on the official Switch Fiber MSME material.
// That material lists speeds only — no prices, lock-in or per-tier perks are
// published — so none are shown here. Pricing is handled by inquiry.
const msmePlans = [
  { name: 'Start-up Plan', speed: '50 Mbps' },
  { name: 'Flex Plan', speed: '100 Mbps' },
  { name: 'Pro Plan', speed: '200 Mbps' },
  { name: 'Power Plan', speed: '300 Mbps' },
  { name: 'Max Plan', speed: '400 Mbps' },
  { name: 'Turbo Plan', speed: '500 Mbps', premium: true },
  { name: 'Elite Plan', speed: '1 Gbps', premium: true }
]

// Get ConnectED promo, transcribed from the official promo material.
// The promo applies to these three tiers only — not to every plan.
const connectEdPlans = [
  { name: 'SwitchNet Plan 999', speed: 'Up to 120 Mbps' },
  { name: 'SwitchSpeed Plan 1299', speed: 'Up to 150 Mbps' },
  { name: 'SwitchUltra Plan 1499', speed: 'Up to 220 Mbps' }
]

// Dates come from the published terms. Status is derived rather than hardcoded
// so an ended promo can never keep presenting itself as live.
const connectEdPromo = {
  startsOn: '2025-06-09',
  endsOn: '2026-06-30',
  periodLabel: 'June 9, 2025 to June 30, 2026'
}

const connectEdHasEnded = computed(() => {
  const end = new Date(`${connectEdPromo.endsOn}T23:59:59`)
  return Number.isFinite(end.valueOf()) && Date.now() > end.valueOf()
})

// "Avail any MSME plan and choose one bundle" — the five devices offered.
const msmeBundleDevices = [
  { name: 'TP-Link Deco E4 Mesh', type: 'Whole-home Wi-Fi mesh' },
  { name: 'Samsung Galaxy Tab A9+', type: 'Tablet' },
  { name: 'HP 15-FC0413AU', type: 'Laptop' },
  { name: 'TP-Link Tapo C210 CCTV', type: 'Security camera' },
  { name: 'Samsung Galaxy A16 5G', type: 'Smartphone' }
]

function handleSelect(plan) {
  registrationStore.selectPlan(plan)
  router.push({ path: '/register', query: { plan: plan.id } })
}

function refreshPlans() {
  registrationStore.fetchPlans(true)
}
</script>


