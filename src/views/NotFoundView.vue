<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center space-y-8">

    <div class="space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Unplug class="w-3.5 h-3.5" />
        <span>Error 404</span>
      </div>

      <h1 class="text-6xl sm:text-8xl font-extrabold font-heading text-gradient-red leading-none">404</h1>

      <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
        This page dropped its connection
      </h2>

      <p class="dark:text-slate-400 text-slate-600 text-base max-w-lg mx-auto leading-relaxed">
        The page you're looking for doesn't exist or has moved. Your internet is fine — it's just this link.
      </p>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <router-link to="/" class="btn-primary py-3.5 px-7 w-full sm:w-auto">
        <Home class="w-5 h-5" />
        <span>Back to Home</span>
      </router-link>
      <router-link to="/plans" class="btn-secondary py-3.5 px-7 w-full sm:w-auto">
        <span>Browse Fiber Plans</span>
        <ArrowRight class="w-5 h-5" />
      </router-link>
    </div>

    <!-- Helpful shortcuts so a dead link still converts -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 text-left space-y-4">
      <h3 class="text-sm font-bold uppercase tracking-wider dark:text-slate-300 text-slate-700">
        Looking for one of these?
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <router-link
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 p-3 rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-slate-50 hover:border-[#ee2824]/50 transition-colors group"
        >
          <component :is="link.icon" class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67] shrink-0" />
          <span class="text-sm font-semibold dark:text-slate-200 text-slate-800 group-hover:text-[#ee2824] dark:group-hover:text-[#ff6b67] transition-colors">
            {{ link.label }}
          </span>
        </router-link>
      </div>

      <div class="pt-3 border-t dark:border-slate-800 border-slate-200 text-xs dark:text-slate-400 text-slate-600">
        Still stuck? Call our hotline at
        <a href="tel:09154077565" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">0915 407 7565</a>
        (Mon–Sat, 8:00 AM – 5:00 PM).
      </div>
    </div>

  </div>
</template>

<script setup>
import { Unplug, Home, ArrowRight, Sparkles, MapPin, CreditCard, Search, Wrench, PhoneCall } from 'lucide-vue-next'

const quickLinks = [
  { to: '/register', label: 'Apply for a New Connection', icon: Sparkles },
  { to: '/coverage', label: 'Check Area Coverage', icon: MapPin },
  { to: '/pay-bills', label: 'Pay Your Bill', icon: CreditCard },
  { to: '/status', label: 'Track Your Application', icon: Search },
  { to: '/tech-support', label: 'Router & Wi-Fi Setup', icon: Wrench },
  { to: '/contact', label: 'Contact Support', icon: PhoneCall }
]
</script>
