<template>
  <header class="sticky top-0 z-50 w-full glass-panel border-b transition-colors duration-300 dark:border-slate-800/80 dark:bg-[#07080c]/90 border-slate-200/80 bg-white/90 backdrop-blur-xl">
    
    <!-- Top Utility Bar (for Hotline, Social Icons & Quick Info) -->
    <div class="hidden md:block dark:bg-slate-950/80 bg-slate-100/80 border-b dark:border-slate-900 border-slate-200 text-xs py-1.5 px-4 lg:px-8">
      <div class="max-w-[1440px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-6 dark:text-slate-400 text-slate-600">
          <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Rizal Fiber Network: <strong class="text-emerald-500 font-bold">100% Operational</strong></span>
          </span>
          <span class="hidden lg:inline-block">•</span>
          <span class="hidden lg:flex items-center gap-1.5">
            <span>Customer Hotline:</span>
            <a href="tel:09154077565" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">0915 407 7565</a>
          </span>
        </div>

        <div class="flex items-center gap-6">
          <!-- Social Media Icons -->
          <div class="flex items-center gap-3 border-r dark:border-slate-800 border-slate-300 pr-6">
            <a href="https://facebook.com/switchfiber.ph" target="_blank" rel="noopener" class="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-[#1877F2] transition-colors" title="Facebook Page">
              <Facebook class="w-3.5 h-3.5" />
            </a>
            <a href="https://instagram.com/switchfiber.ph" target="_blank" rel="noopener" class="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-rose-500 transition-colors" title="Instagram">
              <Instagram class="w-3.5 h-3.5" />
            </a>
            <a href="https://m.me/switchfiber.ph" target="_blank" rel="noopener" class="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-cyan-500 transition-colors" title="Messenger Chat">
              <MessageCircle class="w-3.5 h-3.5" />
            </a>
          </div>

          <router-link to="/careers" class="dark:text-slate-400 text-slate-600 hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors font-medium">
            Join Sales Agent Team
          </router-link>
          <span>•</span>
          <router-link to="/pay-bills" class="dark:text-slate-400 text-slate-600 hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors font-medium">
            pay.switchfiber.ph
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
      
      <!-- Brand Logo -->
      <router-link to="/" class="flex items-center gap-3 group shrink-0">
        <img src="/logo.png" alt="Switch Fiber Logo" class="w-11 h-11 object-contain group-hover:scale-105 transition-transform drop-shadow-md" />
        <div>
          <div class="flex items-center gap-1.5">
            <span class="font-heading font-extrabold text-2xl tracking-tight dark:text-white text-slate-900">SWITCH</span>
            <span class="font-heading font-extrabold text-2xl tracking-tight text-gradient-red">FIBER</span>
          </div>
          <span class="text-[10px] uppercase font-bold tracking-widest text-[#ee2824] dark:text-[#ff6b67] block -mt-1">Rizal Fiber Internet</span>
        </div>
      </router-link>

      <!-- Center Desktop Main Navigation Menu & Apply Online CTA -->
      <div class="hidden lg:flex items-center gap-2 xl:gap-3">
        <nav class="flex items-center gap-1.5 xl:gap-2">
          <router-link 
            to="/" 
            class="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="$route.path === '/' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-700 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
          >
            Home
          </router-link>
          
          <router-link 
            to="/plans" 
            class="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="$route.path === '/plans' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-700 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
          >
            Fiber Plans
          </router-link>

          <router-link 
            to="/coverage" 
            class="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="$route.path === '/coverage' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-700 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
          >
            Area Coverage
          </router-link>

          <router-link 
            to="/pay-bills" 
            class="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="$route.path === '/pay-bills' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-700 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
          >
            Pay Bills
          </router-link>

          <router-link 
            to="/tech-support" 
            class="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="$route.path === '/tech-support' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-700 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
          >
            Router Setup
          </router-link>

          <router-link 
            to="/status" 
            class="px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5"
            :class="$route.path === '/status' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-700 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
          >
            <Search class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
            <span>Track Status</span>
          </router-link>
        </nav>

        <!-- Apply Online CTA Button adjacent to menu items -->
        <router-link to="/register" @click="registrationStore.resetForm()" class="btn-primary py-2 px-4 text-xs font-bold shadow-md ml-1 whitespace-nowrap">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Apply Online</span>
        </router-link>
      </div>

      <!-- Extreme Right Action (Light/Dark Mode Switch Pill) -->
      <div class="hidden lg:flex items-center shrink-0">
        <button 
          id="theme-toggle-btn"
          @click="themeStore.toggleTheme()"
          class="px-3.5 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-200 dark:bg-slate-900 dark:border-slate-800 bg-slate-100 border-slate-200 hover:border-[#ee2824]/40 cursor-pointer"
          :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <div class="flex items-center gap-1.5 text-xs font-semibold">
            <Sun v-if="themeStore.isDark" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-slate-700" />
            <span class="dark:text-slate-300 text-slate-700">{{ themeStore.isDark ? 'Dark' : 'Light' }}</span>
          </div>
        </button>
      </div>

      <!-- Mobile Controls: Theme Toggle, Apply Now & Mobile Menu -->
      <div class="flex lg:hidden items-center gap-2">
        <button 
          id="theme-toggle-btn-mobile"
          @click="themeStore.toggleTheme()"
          class="p-2 rounded-xl border dark:bg-slate-900 dark:border-slate-800 bg-slate-100 border-slate-200 text-slate-700 dark:text-slate-300"
          :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <Sun v-if="themeStore.isDark" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4 text-slate-700" />
        </button>

        <router-link to="/register" @click="registrationStore.resetForm()" class="btn-primary text-xs px-3 py-2">
          Apply Now
        </router-link>

        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 rounded-xl dark:bg-slate-900 dark:border-slate-800 bg-slate-100 border border-slate-200 text-slate-700 dark:text-slate-300"
        >
          <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>

    </div>

    <!-- Mobile Drawer Menu -->
    <div 
      v-if="mobileMenuOpen" 
      class="lg:hidden border-b dark:border-slate-800 dark:bg-[#07080c] border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200"
    >
      <router-link 
        to="/" 
        @click="mobileMenuOpen = false"
        class="block px-4 py-3 rounded-lg font-medium dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        Home
      </router-link>
      <router-link 
        to="/plans" 
        @click="mobileMenuOpen = false"
        class="block px-4 py-3 rounded-lg font-medium dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        Fiber Plans & Pricing
      </router-link>
      <router-link 
        to="/coverage" 
        @click="mobileMenuOpen = false"
        class="block px-4 py-3 rounded-lg font-medium dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        Area Coverage (Rizal)
      </router-link>
      <router-link 
        to="/register" 
        @click="registrationStore.resetForm(); mobileMenuOpen = false"
        class="block px-4 py-3 rounded-lg font-medium text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 border border-[#ee2824]/30"
      >
        ✨ Client Online Application
      </router-link>
      <router-link 
        to="/status" 
        @click="mobileMenuOpen = false"
        class="block px-4 py-3 rounded-lg font-medium dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        Track Application Reference
      </router-link>
      <router-link 
        to="/pay-bills" 
        @click="mobileMenuOpen = false"
        class="block px-4 py-3 rounded-lg font-medium dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        Pay Bills (GCash / Maya)
      </router-link>
      <router-link 
        to="/tech-support" 
        @click="mobileMenuOpen = false"
        class="block px-4 py-3 rounded-lg font-medium dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        Router & Wi-Fi Setup
      </router-link>
      <router-link 
        to="/careers" 
        @click="mobileMenuOpen = false"
        class="block px-4 py-3 rounded-lg font-medium dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
      >
        Sales Agent Careers
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Zap, Sparkles, Menu, X, Search, Sun, Moon, Facebook, Instagram, MessageCircle } from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import { useRegistrationStore } from '../stores/registration'

const themeStore = useThemeStore()
const registrationStore = useRegistrationStore()
const mobileMenuOpen = ref(false)
</script>
