<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

    <!-- Title Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <BookOpen class="w-3.5 h-3.5" />
        <span>Switch Fiber User Guide</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        Help Center &amp; User Guide
      </h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        Everything you need to get connected — from checking fiber coverage in your barangay to applying online, tracking your installation, and paying your monthly bill.
      </p>
    </div>

    <!-- Quick Task Grid -->
    <div class="space-y-6">
      <div class="text-center space-y-1">
        <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">What do you need help with?</h2>
        <p class="text-xs dark:text-slate-400 text-slate-500">Jump straight to the task you want to complete.</p>
      </div>

      <!-- Help Search Bar -->
      <div class="max-w-xl mx-auto">
        <div class="relative">
          <Search class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search help topics — e.g. wifi password, reference code, payment…"
            aria-label="Search help topics"
            class="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 dark:text-white text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ee2824]/40 focus:border-[#ee2824]/40 transition-shadow shadow-sm"
          />
          <button
            v-if="isSearching"
            type="button"
            @click="searchQuery = ''"
            aria-label="Clear search"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
        <p v-if="isSearching" class="text-center text-xs dark:text-slate-400 text-slate-500 mt-3">
          {{ filteredTasks.length + filteredFaqs.length }} result(s) for “{{ searchQuery.trim() }}” — showing matching tasks and FAQs.
        </p>
      </div>

      <!-- No Results State -->
      <div v-if="isSearching && filteredTasks.length === 0 && filteredFaqs.length === 0" class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 max-w-xl mx-auto text-center space-y-3">
        <MessageCircleQuestion class="w-8 h-8 mx-auto text-slate-400 dark:text-slate-500" />
        <h3 class="font-bold font-heading dark:text-white text-slate-900 text-base">No results for “{{ searchQuery.trim() }}”</h3>
        <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
          Try a different keyword, or call customer support at
          <a href="tel:09154077565" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">0915 407 7565</a> — we're happy to help.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
        <router-link
          v-for="task in filteredTasks"
          :key="task.title"
          :to="task.to"
          class="glass-card p-6 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-3 hover:border-[#ee2824]/40 hover:shadow-lg transition-all group"
        >
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center" :class="task.iconBg">
            <component :is="task.icon" class="w-5 h-5" />
          </div>
          <h3 class="font-bold font-heading dark:text-white text-slate-900 text-base group-hover:text-[#ee2824] dark:group-hover:text-[#ff6b67] transition-colors">
            {{ task.title }}
          </h3>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">{{ task.description }}</p>
          <span class="inline-flex items-center gap-1 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67]">
            <span>{{ task.cta }}</span>
            <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </router-link>
      </div>
    </div>

    <!-- How to Get Connected: 5-Stage Journey -->
    <div v-if="!isSearching" class="space-y-8 max-w-4xl mx-auto">
      <div class="text-center space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase">
          <Route class="w-3.5 h-3.5" />
          <span>Getting Connected</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
          From Sign-Up to Surfing in 5 Stages
        </h2>
        <p class="text-xs sm:text-sm dark:text-slate-400 text-slate-600">
          The complete journey of a new Switch Fiber subscriber, start to finish.
        </p>
      </div>

      <ol class="space-y-6">
        <li v-for="(stage, idx) in journey" :key="stage.title" class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row gap-5">
          <div class="shrink-0 flex sm:flex-col items-center gap-3">
            <span class="w-11 h-11 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center font-heading font-extrabold text-lg border border-[#ee2824]/20">
              {{ idx + 1 }}
            </span>
          </div>
          <div class="space-y-2.5 min-w-0">
            <h3 class="text-lg font-bold font-heading dark:text-white text-slate-900 flex items-center gap-2 flex-wrap">
              <component :is="stage.icon" class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67]" />
              <span>{{ stage.title }}</span>
            </h3>
            <p class="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">{{ stage.description }}</p>
            <ul v-if="stage.tips" class="space-y-1.5 text-xs dark:text-slate-400 text-slate-600 list-disc list-inside">
              <li v-for="tip in stage.tips" :key="tip">{{ tip }}</li>
            </ul>
            <router-link v-if="stage.link" :to="stage.link.to" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline pt-1">
              <span>{{ stage.link.label }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </li>
      </ol>
    </div>

    <!-- Online Application Walkthrough -->
    <div v-if="!isSearching" class="glass-card p-8 sm:p-12 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-8 max-w-6xl mx-auto">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold uppercase">
          <ClipboardList class="w-3.5 h-3.5" />
          <span>Application Walkthrough</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
          The 5-Step Online Application Form
        </h2>
        <p class="text-xs sm:text-sm dark:text-slate-400 text-slate-600">
          What each step of the <router-link to="/register" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">Apply Online</router-link> wizard asks for, and how to breeze through it.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(step, idx) in wizardSteps"
          :key="step.title"
          class="p-6 rounded-2xl dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-3"
        >
          <div class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center font-heading font-extrabold text-sm">
              {{ idx + 1 }}
            </span>
            <h4 class="font-bold font-heading dark:text-white text-slate-900 text-sm">{{ step.title }}</h4>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">{{ step.description }}</p>
          <p v-if="step.tip" class="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed border-t dark:border-slate-800 border-slate-200 pt-2">
            <strong class="text-emerald-600 dark:text-emerald-400">Tip:</strong> {{ step.tip }}
          </p>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs dark:text-amber-200 text-amber-900">
        <AlertCircle class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong class="font-bold">Before you start:</strong> prepare a valid government ID and a clear photo of your house front.
          See the full list of accepted IDs on the
          <router-link to="/tech-support" class="font-bold underline">Requirements Checklist</router-link>.
        </div>
      </div>
    </div>

    <!-- Tracking & Billing How-Tos -->
    <div v-if="!isSearching" class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

      <!-- Track Your Application -->
      <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <div class="flex items-center gap-3 border-b dark:border-slate-800 border-slate-200 pb-4">
          <Search class="w-6 h-6 text-purple-500" />
          <div>
            <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">How to Track Your Application</h3>
            <p class="text-xs dark:text-slate-400 text-slate-500">Follow your installation from submission to activation</p>
          </div>
        </div>

        <ol class="space-y-4 text-sm dark:text-slate-300 text-slate-700 list-decimal list-inside">
          <li class="leading-relaxed">
            Open the <router-link to="/status" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">Track Status</router-link> page.
          </li>
          <li class="leading-relaxed">
            Enter the <strong class="dark:text-white text-slate-900 font-bold">Reference Code</strong> you received by email or SMS after applying.
          </li>
          <li class="leading-relaxed">
            Read your stage on the timeline:
            <ul class="mt-2 ml-6 space-y-1.5 text-xs dark:text-slate-400 text-slate-600 list-disc">
              <li><strong class="dark:text-slate-200 text-slate-900 font-bold">Application Submitted</strong> — we received your details.</li>
              <li><strong class="dark:text-slate-200 text-slate-900 font-bold">Under Verification</strong> — engineering checks line feasibility at your address.</li>
              <li><strong class="dark:text-slate-200 text-slate-900 font-bold">Installation Scheduled</strong> — a field crew has been assigned to your slot.</li>
              <li><strong class="dark:text-slate-200 text-slate-900 font-bold">Connection Active</strong> — installation signed off and your account is live.</li>
            </ul>
          </li>
        </ol>

        <p class="text-[11px] dark:text-slate-500 text-slate-500 border-t dark:border-slate-800 border-slate-200 pt-3">
          Lost your reference code? Call customer support at
          <a href="tel:09154077565" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">0915 407 7565</a> with your full name and installation address.
        </p>
      </div>

      <!-- Pay Your Bill -->
      <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <div class="flex items-center gap-3 border-b dark:border-slate-800 border-slate-200 pb-4">
          <CreditCard class="w-6 h-6 text-cyan-500" />
          <div>
            <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">How to Pay Your Monthly Bill</h3>
            <p class="text-xs dark:text-slate-400 text-slate-500">Cashless online payments or over-the-counter</p>
          </div>
        </div>

        <ol class="space-y-4 text-sm dark:text-slate-300 text-slate-700 list-decimal list-inside">
          <li class="leading-relaxed">
            Open the <router-link to="/pay-bills" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">Pay Bills</router-link> page, which brings you to the secure portal at
            <code class="dark:bg-slate-900 bg-slate-100 text-[#ee2824] dark:text-[#ff6b67] border dark:border-slate-800 border-slate-300 px-2 py-0.5 rounded font-mono text-xs font-bold">pay.switchfiber.ph</code>.
          </li>
          <li class="leading-relaxed">
            Choose your payment channel: <strong class="dark:text-white text-slate-900 font-bold">GCash</strong>,
            <strong class="dark:text-white text-slate-900 font-bold">Maya</strong>,
            <strong class="dark:text-white text-slate-900 font-bold">QR Ph</strong>, or debit/credit card.
          </li>
          <li class="leading-relaxed">
            Enter your account details, confirm the amount, and keep the payment confirmation for your records.
          </li>
        </ol>

        <p class="text-[11px] dark:text-slate-500 text-slate-500 border-t dark:border-slate-800 border-slate-200 pt-3">
          Prefer cash? Over-the-counter payments are accepted at our Binangonan head office, Mon–Sat 8:00 AM – 5:00 PM.
          Billing hotline: <a href="tel:09154077555" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">0915 407 7555</a>.
        </p>
      </div>
    </div>

    <!-- FAQ Accordion -->
    <div v-if="filteredFaqs.length > 0" class="space-y-6 max-w-4xl mx-auto">
      <div class="text-center space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/20 text-xs font-bold uppercase">
          <MessageCircleQuestion class="w-3.5 h-3.5" />
          <span>FAQ</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
          Frequently Asked Questions
        </h2>
      </div>

      <div class="space-y-3">
        <details
          v-for="faq in filteredFaqs"
          :key="faq.q"
          :open="isSearching"
          class="glass-card rounded-2xl border dark:border-slate-800 border-slate-200 overflow-hidden group"
        >
          <summary class="flex items-center justify-between gap-4 p-5 cursor-pointer select-none text-sm font-bold dark:text-white text-slate-900 hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors list-none [&::-webkit-details-marker]:hidden">
            <span>{{ faq.q }}</span>
            <ChevronDown class="w-4 h-4 shrink-0 text-[#ee2824] dark:text-[#ff6b67] transition-transform group-open:rotate-180" />
          </summary>
          <div class="px-5 pb-5 text-sm dark:text-slate-300 text-slate-600 leading-relaxed border-t dark:border-slate-800 border-slate-200 pt-4">
            {{ faq.a }}
          </div>
        </details>
      </div>
    </div>

    <!-- Still Stuck? Contact Panel -->
    <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-[#ee2824]/30 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] text-xs font-bold uppercase">
          <PhoneCall class="w-3.5 h-3.5" />
          <span>Still Need a Hand?</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
          Talk to a Real Person
        </h2>
        <p class="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
          If this guide didn't answer your question, our local customer care team in Rizal is one call or message away.
        </p>

        <div class="space-y-2 pt-2 text-xs dark:text-slate-300 text-slate-700">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Customer Support:</span>
            <span class="font-mono">0915 407 7565 / 0917 876 2440</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Billing Hotline:</span>
            <span class="font-mono">0915 407 7555</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Business Hours:</span>
            <span>Mon–Sat 8:00 AM – 5:00 PM (12 NN–1 PM Lunch Break)</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <router-link to="/tech-support" class="p-5 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 space-y-2 hover:border-[#ee2824]/40 transition-colors shadow-sm">
          <Wrench class="w-5 h-5 text-orange-500" />
          <h4 class="font-bold dark:text-white text-slate-900 text-sm">Router &amp; Wi-Fi Guides</h4>
          <p class="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">Change your Wi-Fi password or SSID at 192.168.1.1, plus the modem warranty policy.</p>
        </router-link>
        <router-link to="/contact" class="p-5 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 space-y-2 hover:border-[#ee2824]/40 transition-colors shadow-sm">
          <PhoneCall class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67]" />
          <h4 class="font-bold dark:text-white text-slate-900 text-sm">Contact &amp; Office Visit</h4>
          <p class="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">All hotlines, email support, and directions to our Binangonan head office for walk-ins.</p>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  BookOpen,
  ArrowRight,
  X,
  Route,
  MapPin,
  Zap,
  Sparkles,
  Search,
  CreditCard,
  Wrench,
  ClipboardList,
  AlertCircle,
  MessageCircleQuestion,
  ChevronDown,
  PhoneCall,
  HardHat
} from 'lucide-vue-next'

const searchQuery = ref('')
const isSearching = computed(() => searchQuery.value.trim().length > 0)

function matches(query, ...fields) {
  return fields.some(field => field.toLowerCase().includes(query))
}

const filteredTasks = computed(() => {
  if (!isSearching.value) return quickTasks
  const q = searchQuery.value.trim().toLowerCase()
  return quickTasks.filter(task => matches(q, task.title, task.description))
})

const filteredFaqs = computed(() => {
  if (!isSearching.value) return faqs
  const q = searchQuery.value.trim().toLowerCase()
  return faqs.filter(faq => matches(q, faq.q, faq.a))
})

const quickTasks = [
  {
    title: 'Check Fiber Coverage',
    description: 'See if Switch Fiber already reaches your barangay on our interactive Rizal coverage map.',
    cta: 'Open coverage map',
    to: '/coverage',
    icon: MapPin,
    iconBg: 'bg-emerald-500/10 text-emerald-500'
  },
  {
    title: 'Compare Fiber Plans',
    description: 'Browse symmetrical unlimited plans — Plan 699, 999, 1499 and 1999 — side by side.',
    cta: 'View plans & pricing',
    to: '/plans',
    icon: Zap,
    iconBg: 'bg-amber-500/10 text-amber-500'
  },
  {
    title: 'Apply Online',
    description: 'Complete the 5-step application form in minutes: details, address, plan, documents, submit.',
    cta: 'Start application',
    to: '/register',
    icon: Sparkles,
    iconBg: 'bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67]'
  },
  {
    title: 'Track Your Application',
    description: 'Enter your reference code to follow verification, scheduling and installation progress live.',
    cta: 'Track status',
    to: '/status',
    icon: Search,
    iconBg: 'bg-purple-500/10 text-purple-500'
  },
  {
    title: 'Pay Your Bill',
    description: 'Settle your monthly bill via GCash, Maya, QR Ph or card through pay.switchfiber.ph.',
    cta: 'Go to payments',
    to: '/pay-bills',
    icon: CreditCard,
    iconBg: 'bg-cyan-500/10 text-cyan-500'
  },
  {
    title: 'Fix Wi-Fi & Router Issues',
    description: 'Change your Wi-Fi password or network name, and review the modem warranty policy.',
    cta: 'Open router guides',
    to: '/tech-support',
    icon: Wrench,
    iconBg: 'bg-orange-500/10 text-orange-500'
  }
]

const journey = [
  {
    title: 'Check Coverage in Your Area',
    icon: MapPin,
    description: 'Open the coverage map, pick your municipality and barangay, and confirm that active fiber lines or NAP terminals reach your neighborhood.',
    tips: [
      'Covered municipalities include Binangonan, Angono, Taytay, Teresa, Cardona, Morong, Baras, Tanay and Antipolo.',
      'If your barangay is not yet covered, contact us — network expansion is ongoing.'
    ],
    link: { label: 'Open the coverage map', to: '/coverage' }
  },
  {
    title: 'Choose Your Plan',
    icon: Zap,
    description: 'Compare the monthly plans and pick the speed that fits your household — from everyday browsing to heavy streaming and gaming.',
    tips: [
      'All plans are unlimited with no data caps.',
      'You can still change your selected plan inside the application form before submitting.'
    ],
    link: { label: 'Compare plans & pricing', to: '/plans' }
  },
  {
    title: 'Apply Online',
    icon: ClipboardList,
    description: 'Fill out the 5-step application wizard with your personal details, installation address, chosen plan and documents, then submit. Your unique Reference Code is generated instantly and sent by email and SMS.',
    link: { label: 'Start your application', to: '/register' }
  },
  {
    title: 'Track Your Application',
    icon: Search,
    description: 'Use your Reference Code on the Track Status page to follow the four stages: Application Submitted, Under Verification, Installation Scheduled, and Connection Active.',
    link: { label: 'Track your reference code', to: '/status' }
  },
  {
    title: 'Installation Day',
    icon: HardHat,
    description: 'Once your slot is scheduled, our field crew installs the fiber line and modem at your address and activates your account. Keep your ID handy and make sure someone is home during the visit.',
    tips: [
      'After activation, personalize your Wi-Fi name and password using the router guide.'
    ],
    link: { label: 'Set up your Wi-Fi after installation', to: '/tech-support' }
  }
]

const wizardSteps = [
  {
    title: 'Personal Info',
    description: 'Your full name, active 11-digit mobile number and email address. This is where your Reference Code and updates will be sent.',
    tip: 'Double-check your mobile number and email — typos here mean missed notifications.'
  },
  {
    title: 'Installation Address',
    description: 'Select your municipality and barangay, pin your exact location on the map, and add a nearby landmark so our crew can find you.',
    tip: 'Allow location access in your browser to auto-center the map pin on your position.'
  },
  {
    title: 'Plan Selection',
    description: 'Pick your monthly plan. You can review speeds and inclusions before locking in your choice.',
    tip: 'Not sure which speed you need? Compare plans first on the Fiber Plans page.'
  },
  {
    title: 'Document Uploads',
    description: 'Upload a photo of your valid government ID and a clear picture of your house front. Photos taken on your phone can auto-fill GPS data.',
    tip: 'Take the house photo in daylight showing your gate or facade — it helps the survey crew locate you.'
  },
  {
    title: 'Review & Submit',
    description: 'Check all your details, read and agree to the Terms & Conditions, then submit. Your Reference Code appears on screen — save or screenshot it.',
    tip: 'Your Reference Code is also delivered by email and SMS as a backup.'
  }
]

const faqs = [
  {
    q: 'How do I know if Switch Fiber is available at my address?',
    a: 'Use the Area Coverage page to browse the interactive map of our fiber network across Rizal. Select your municipality and barangay to see covered zones. If your barangay is not highlighted yet, call customer support — coverage expands regularly.'
  },
  {
    q: 'What documents do I need to apply?',
    a: 'One valid primary government ID (Passport, PhilSys National ID, Driver\'s License, PhilHealth, UMID, TIN, SSS, or Voter\'s ID) or two secondary IDs, plus a clear photo of your house front and an active mobile number and email address. Expired IDs, PWD ID, OFW E-Card, Solo Parent ID, Police Clearance, and Pag-IBIG Loyalty Card Plus are not accepted.'
  },
  {
    q: 'Is there an installation fee?',
    a: 'Installation is free for standard residential installations. Our team will advise you during the survey if your location needs special provisions.'
  },
  {
    q: 'How long does installation take after I apply?',
    a: 'It depends on the engineering verification and crew schedule for your area. Track your Reference Code on the Track Status page to see your live stage — you will move from Under Verification to Installation Scheduled once a slot is confirmed.'
  },
  {
    q: 'I lost my Reference Code. What do I do?',
    a: 'Check your email inbox and SMS messages first — a copy was sent to both when you applied. If you still can\'t find it, call customer support at 0915 407 7565 with your full name and installation address.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Online: GCash, Maya, QR Ph, and debit/credit cards through pay.switchfiber.ph. In person: over-the-counter cash payments at our Binangonan head office, plus GCash, Maya, Bayad Center, and 7-Eleven channels.'
  },
  {
    q: 'Can I apply in person instead of online?',
    a: 'Yes. Walk-in applications are welcome at our head office: 315 Sampaloc St., Sta. Ursula Subd., Brgy. Batingan, Binangonan, Rizal — Monday to Saturday, 8:00 AM to 5:00 PM. Bring the same requirements listed above.'
  },
  {
    q: 'How do I change my Wi-Fi name or password?',
    a: 'Open 192.168.1.1 in your browser while connected to your home network and log in with the default credentials. The full step-by-step walkthrough for both the password and the network name (SSID) is on the Router & Wi-Fi Setup Guide page.'
  },
  {
    q: 'What happens if my modem gets damaged?',
    a: 'Manufacturing defects are replaced free of charge. Damage from misuse, liquid, power surges, pests, or force majeure events is a paid replacement at standard market cost. Report any modem issue to customer support at 0915 407 7565 — the full warranty table is on the Router & Wi-Fi Setup Guide page.'
  },
  {
    q: 'I\'m moving to a new house. Can I transfer my connection?',
    a: 'Yes, as long as your new address is within our coverage area. Check the new location on the coverage map first, then call customer support to arrange the transfer and relocation schedule.'
  }
]
</script>
