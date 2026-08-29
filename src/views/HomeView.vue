<template>
  <div class="space-y-24 pb-20">

    <!-- HERO SECTION -->
    <section class="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      <!-- Glow Gradients in Background -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ee2824]/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute top-1/3 right-10 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Column: Copy & CTAs -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest animate-pulse-glow">
              <Zap class="w-3.5 h-3.5 text-[#ee2824] dark:text-[#ff6b67]" />
              <span>Rizal's Fastest Growing Fiber ISP</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading dark:text-white text-slate-900 leading-tight tracking-tight">
              Get the <span class="text-gradient-red">Quality Internet Speed</span> You Deserve!
            </h1>

            <p class="text-lg dark:text-slate-300 text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Enjoy the freedom of endless possibilities with Switch Fiber. Download & upload songs, stream in 4K, play online games with ultra-low ping, and work seamlessly with no data caps.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <router-link to="/register" class="btn-primary py-4 px-8 text-base shadow-xl shadow-[#ee2824]/25 w-full sm:w-auto">
                <Sparkles class="w-5 h-5" />
                <span>Apply Online Now</span>
              </router-link>
              <router-link to="/plans" class="btn-secondary py-4 px-8 text-base w-full sm:w-auto">
                <span>View Fiber Plans</span>
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>

            <!-- Bullet Stats Bar -->
            <div class="pt-6 grid grid-cols-3 gap-4 border-t dark:border-slate-800/80 border-slate-200 max-w-lg mx-auto lg:mx-0">
              <div>
                <div class="text-2xl font-extrabold font-heading dark:text-white text-slate-900">100%</div>
                <div class="text-xs dark:text-slate-400 text-slate-500">Pure Fiber Optic</div>
              </div>
              <div>
                <div class="text-2xl font-extrabold font-heading text-[#ee2824] dark:text-[#ff6b67]">₱{{ minPlanPrice }}</div>
                <div class="text-xs dark:text-slate-400 text-slate-500">Plans Starting at</div>
              </div>
              <div>
                <div class="text-2xl font-extrabold font-heading text-emerald-500">0 GB</div>
                <div class="text-xs dark:text-slate-400 text-slate-500">Data Capping</div>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Live Speed Simulator -->
          <div class="lg:col-span-5">
            <SpeedTestSim />
          </div>

        </div>
      </div>
    </section>

    <!-- FIBER ADVANTAGE HIGHLIGHTS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold font-heading dark:text-white text-slate-900">
          Why Choose <span class="text-gradient-red">Switch Fiber</span>?
        </h2>
        <p class="dark:text-slate-400 text-slate-600 text-base">
          Built locally in Rizal for everyday Filipinos. High-speed, affordable, and dependable connection tailored for your home and business.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-[#ee2824]/10 border border-[#ee2824]/30 flex items-center justify-center text-[#ee2824] dark:text-[#ff6b67]">
            <Zap class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold font-heading dark:text-white text-slate-900">Turbo-Speed Bandwidth</h3>
          <p class="dark:text-slate-400 text-slate-600 text-sm">Lightning fast upload and download speeds for smooth gaming, video calls, and HD streaming.</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <Infinity class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold font-heading dark:text-white text-slate-900">Unlimited Fiber Data</h3>
          <p class="dark:text-slate-400 text-slate-600 text-sm">No data capping or throttling. Use as much data as you want, anytime of the day.</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold font-heading dark:text-white text-slate-900">Transparent Pricing</h3>
          <p class="dark:text-slate-400 text-slate-600 text-sm">No hidden charges or surprise fees on your monthly Statement of Account (SOA).</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <HeartHandshake class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold font-heading dark:text-white text-slate-900">Local 24/7 Support</h3>
          <p class="dark:text-slate-400 text-slate-600 text-sm">As your local Rizal internet partner, our friendly support team is always just a call away.</p>
        </div>
      </div>
    </section>

    <!-- INTERACTIVE COVERAGE CHECKER -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <CoverageChecker />
    </section>

    <!-- POPULAR PLANS MATRIX -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="badge-neon mb-2">Flexible Rates</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold font-heading dark:text-white text-slate-900">Explore Switch Fiber Plans</h2>
        </div>
        <router-link to="/plans" class="btn-secondary text-sm">
          <span>Compare All Plans</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <div v-if="isLoadingPlans && !featuredPlans.length" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="n in 3" :key="n" class="glass-card rounded-2xl p-6 md:p-8 animate-pulse space-y-4 border dark:border-slate-800 border-slate-200">
          <div class="h-4 w-1/3 rounded dark:bg-slate-800 bg-slate-200"></div>
          <div class="h-7 w-2/3 rounded dark:bg-slate-800 bg-slate-200"></div>
          <div class="h-10 w-1/2 rounded dark:bg-slate-800 bg-slate-200"></div>
          <div class="h-12 w-full rounded dark:bg-slate-800 bg-slate-200"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PlanCard 
          v-for="plan in featuredPlans" 
          :key="plan.id" 
          :plan="plan" 
          @select="handlePlanSelect"
        />
      </div>
    </section>

    <!-- PAY BILLS & PROMOS CALLOUT -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      <!-- Special Back to School & MSME Campaign Banner -->
      <div class="glass-panel p-8 md:p-10 rounded-3xl border border-sky-500/30 dark:bg-sky-500/5 bg-sky-50/70 relative overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-3">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold uppercase">
                <Gift class="w-3.5 h-3.5" />
                <span>Active Campaign</span>
              </span>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase">
                <Briefcase class="w-3.5 h-3.5" />
                <span>MSME Deals</span>
              </span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
              Get ConnectED Back to School & SmartBiz MSME Bundles!
            </h3>
            <p class="dark:text-slate-300 text-slate-600 text-sm leading-relaxed max-w-2xl">
              Enjoy <strong>15% OFF for 6 months + Free Switch Tumbler</strong> for students & teachers, or scale your enterprise with our <strong>SmartBiz Bundle Deals</strong> (Free CCTV, Mesh & Laptop).
            </p>
          </div>

          <div class="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <router-link to="/plans" class="btn-primary text-xs min-h-11 py-3 px-6 text-center bg-sky-600 hover:bg-sky-500 shadow-sky-500/25">
              <span>View Active Deals & Bundles</span>
            </router-link>
            <router-link to="/register" class="btn-secondary text-xs min-h-11 py-3 px-6 text-center">
              <span>Apply Online Now</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Payment Portal Direct Card -->
      <div class="glass-panel p-8 md:p-12 rounded-3xl border border-[#ee2824]/30 relative overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67]">
              <CreditCard class="w-3.5 h-3.5" />
              <span>Official Online Payment Portal</span>
            </div>
            <h3 class="text-3xl font-extrabold font-heading dark:text-white text-slate-900">Settle Bills Instantly with pay.switchfiber.ph</h3>
            <p class="dark:text-slate-300 text-slate-600 text-sm leading-relaxed">
              Transfer money safely using GCash (QR Ph), Maya, WeChat Pay, or Debit/Credit cards anytime, anywhere.
            </p>
            <div class="flex items-center gap-4 pt-2">
              <router-link to="/pay-bills" class="btn-primary">
                <span>View Payment Guide</span>
                <ArrowRight class="w-4 h-4" />
              </router-link>
            </div>
          </div>
          <div class="dark:bg-slate-950/80 bg-white p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-4">
            <div class="flex items-center justify-between border-b dark:border-slate-800 border-slate-200 pb-3">
              <span class="text-xs font-bold dark:text-slate-400 text-slate-500 uppercase">Accepted Payment Channels</span>
              <span class="text-xs text-emerald-500 font-bold">Instant Credit</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-semibold dark:text-slate-300 text-slate-700">
              <div class="p-3 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200">GCash</div>
              <div class="p-3 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200">Maya</div>
              <div class="p-3 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200">QR Ph</div>
              <div class="p-3 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200">Visa/Mastercard</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center space-y-3 mb-12">
        <h2 class="text-3xl font-extrabold font-heading dark:text-white text-slate-900">Frequently Asked Questions</h2>
        <p class="dark:text-slate-400 text-slate-600 text-sm">Everything you need to know about applying and using Switch Fiber.</p>
      </div>

      <div class="space-y-4">
        <div
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="glass-card rounded-2xl border dark:border-slate-800 border-slate-200 overflow-hidden"
        >
          <button
            type="button"
            :id="`faq-btn-${idx}`"
            :aria-expanded="activeFaq === idx"
            :aria-controls="`faq-panel-${idx}`"
            class="w-full text-left p-6 flex items-center justify-between gap-4 font-bold dark:text-slate-100 text-slate-900 text-base cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ee2824]/50 focus-visible:ring-inset"
            @click="activeFaq = activeFaq === idx ? null : idx"
          >
            <span>{{ faq.question }}</span>
            <ChevronDown
              class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67] transition-transform shrink-0"
              :class="activeFaq === idx ? 'rotate-180' : ''"
            />
          </button>
          <div
            v-show="activeFaq === idx"
            :id="`faq-panel-${idx}`"
            role="region"
            :aria-labelledby="`faq-btn-${idx}`"
            class="px-6 pb-6 text-sm dark:text-slate-300 text-slate-600 leading-relaxed"
          >
            <div class="border-t dark:border-slate-800/80 border-slate-200 pt-4">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Zap, Sparkles, ArrowRight, Infinity, ShieldCheck, 
  HeartHandshake, CreditCard, ChevronDown, Gift, Briefcase 
} from 'lucide-vue-next'
import SpeedTestSim from '../components/SpeedTestSim.vue'
import CoverageChecker from '../components/CoverageChecker.vue'
import PlanCard from '../components/PlanCard.vue'
import { useRegistrationStore } from '../stores/registration'

const router = useRouter()
const registrationStore = useRegistrationStore()
const availablePlans = computed(() => registrationStore.availablePlans)
const isLoadingPlans = computed(() => registrationStore.isLoadingPlans)
const featuredPlans = computed(() => registrationStore.availablePlans.slice(0, 3))
const minPlanPrice = computed(() => {
  if (!registrationStore.availablePlans.length) return 699
  return Math.min(...registrationStore.availablePlans.map(p => p.price))
})

const activeFaq = ref(0)
const faqs = [
  {
    question: 'What are the basic requirements to apply for Switch Fiber?',
    answer: 'You only need (1) valid primary government-issued ID, (1) active mobile number, (1) email address, and (1) photo of your house front to help our technicians locate your premises.'
  },
  {
    question: 'Is there a lock-in period for Switch Fiber plans?',
    answer: 'Standard plans come with a 1-Year Lock-In period with no data capping or hidden charges.'
  },
  {
    question: 'How do I change my Wi-Fi password or network name (SSID)?',
    answer: 'Open your web browser, navigate to 192.168.1.1, log in using username "user" and password "user", then go to Network Settings to modify your 2.4GHz and 5GHz passphrases.'
  },
  {
    question: 'Where can I pay my monthly bills?',
    answer: 'You can safely settle your bills through our official portal at pay.switchfiber.ph using GCash, Maya, QR Ph, or Debit/Credit cards.'
  }
]

function handlePlanSelect(plan) {
  registrationStore.selectPlan(plan)
  router.push({ path: '/register', query: { plan: plan.id } })
}
</script>
