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
          <span class="hidden lg:inline-block">|</span>
          <router-link to="/help" class="hidden lg:flex items-center gap-1.5 font-medium hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">
            <BookOpen class="w-3.5 h-3.5" />
            <span>Help</span>
          </router-link>
        </div>

        <div class="flex items-center gap-6">
          <!-- Social Media Icons -->
          <div class="flex items-center gap-3 border-r dark:border-slate-800 border-slate-300 pr-6">
            <a href="https://facebook.com/switchfiber.ph" target="_blank" rel="noopener noreferrer" class="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-[#1877F2] transition-colors" title="Facebook Page">
              <Facebook class="w-3.5 h-3.5" />
            </a>
            <a href="https://instagram.com/switchfiber.ph" target="_blank" rel="noopener noreferrer" class="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-rose-500 transition-colors" title="Instagram">
              <Instagram class="w-3.5 h-3.5" />
            </a>
            <a href="https://m.me/switchfiber.ph" target="_blank" rel="noopener noreferrer" class="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-cyan-500 transition-colors" title="Messenger Chat">
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
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
      
      <!-- Brand Logo -->
      <router-link to="/" class="flex items-center min-h-11 gap-2.5 sm:gap-3 group shrink-0">
        <img src="/logo.png" alt="Switch Fiber Logo" class="w-9 h-9 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform drop-shadow-md" />
        <div>
          <div class="flex items-center">
            <span class="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#ee2824] dark:text-[#ff6b67]">SWITCHFIBER</span>
          </div>
          <span class="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#ee2824] dark:text-[#ff6b67] block -mt-1">Your life-long connection</span>
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
            to="/about" 
            class="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="$route.path === '/about' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-700 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
          >
            About Us
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
            to="/contact" 
            class="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
            :class="$route.path === '/contact' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-700 hover:text-[#ee2824] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'"
          >
            Contact Us
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
        <router-link 
          v-if="$route.path !== '/register'" 
          to="/register" 
          @click="registrationStore.clearCompletedApplication()" 
          class="btn-primary py-2 px-4 text-xs font-bold shadow-md ml-1 whitespace-nowrap"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>Apply Online</span>
        </router-link>
        <button 
          v-else 
          disabled 
          type="button"
          class="py-2 px-3.5 text-xs font-bold rounded-xl border border-slate-300/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-default ml-1 flex items-center gap-1.5 whitespace-nowrap shadow-inner select-none opacity-80"
          title="You are currently filling out an application"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Applying Now</span>
        </button>
      </div>

      <!-- Extreme Right Action (Light/Dark Mode Switch Pill for Desktop) -->
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

      <!-- Mobile Controls: Theme Toggle & Hamburger Mobile Menu -->
      <div class="flex lg:hidden items-center gap-2 shrink-0">
        <!-- Light / Dark Mode Toggle Button -->
        <button 
          id="theme-toggle-btn-mobile"
          @click="themeStore.toggleTheme()"
          class="w-11 h-11 flex items-center justify-center rounded-xl border dark:bg-slate-900/90 dark:border-slate-800 bg-slate-100 border-slate-200 text-slate-700 dark:text-slate-300 hover:border-[#ee2824]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ee2824]/30"
          :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          aria-label="Toggle light or dark theme"
        >
          <Sun v-if="themeStore.isDark" class="w-4 h-4 text-amber-400" />
          <Moon v-else class="w-4 h-4 text-slate-700" />
        </button>

        <!-- Clean Mobile Hamburger Button on far right -->
        <button 
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="w-11 h-11 flex items-center justify-center rounded-xl dark:bg-slate-900/90 dark:border-slate-800 bg-slate-100 border border-slate-200 text-slate-700 dark:text-slate-300 hover:border-[#ee2824]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#ee2824]/30"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <Menu v-if="!mobileMenuOpen" class="w-5 h-5 transition-transform duration-200" />
          <X v-else class="w-5 h-5 transition-transform duration-200 rotate-90 text-[#ee2824] dark:text-[#ff6b67]" />
        </button>
      </div>

    </div>

    <!-- Mobile Drawer Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div 
        v-if="mobileMenuOpen" 
        class="lg:hidden border-b dark:border-slate-800/90 dark:bg-[#07080c]/95 border-slate-200/90 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 max-h-[calc(100vh-4.5rem)] overflow-y-auto shadow-2xl"
      >
        <!-- Prominent Online Application Button inside Mobile Drawer -->
        <router-link 
          v-if="$route.path !== '/register'"
          to="/register" 
          @click="registrationStore.clearCompletedApplication(); mobileMenuOpen = false"
          class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#ee2824] to-[#cc1814] shadow-md hover:opacity-95 transition-all text-sm"
        >
          <Sparkles class="w-4 h-4" />
          <span>Apply Online Now</span>
        </router-link>
        <div 
          v-else 
          class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm cursor-default shadow-inner select-none opacity-80"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Currently in Application Flow</span>
        </div>

        <div class="h-px bg-slate-200 dark:bg-slate-800/80 my-2"></div>

        <!-- Mobile Navigation Links with Icons -->
        <nav class="space-y-1">
          <router-link 
            to="/" 
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <Home class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
            <span>Home</span>
          </router-link>

          <router-link 
            to="/about" 
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/about' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <Info class="w-4 h-4 text-blue-500" />
            <span>About Us</span>
          </router-link>

          <router-link 
            to="/plans" 
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/plans' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <Zap class="w-4 h-4 text-amber-500" />
            <span>Fiber Plans & Pricing</span>
          </router-link>

          <router-link 
            to="/coverage" 
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/coverage' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <MapPin class="w-4 h-4 text-emerald-500" />
            <span>Area Coverage (Rizal)</span>
          </router-link>

          <router-link 
            to="/status" 
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/status' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <Search class="w-4 h-4 text-purple-500" />
            <span>Track Application</span>
          </router-link>

          <router-link 
            to="/pay-bills" 
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/pay-bills' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <CreditCard class="w-4 h-4 text-cyan-500" />
            <span>Pay Bills (GCash / Maya)</span>
          </router-link>

          <router-link
            to="/help"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/help' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <BookOpen class="w-4 h-4 text-teal-500" />
            <span>Help Center & User Guide</span>
          </router-link>

          <router-link
            to="/tech-support"
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/tech-support' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <Wrench class="w-4 h-4 text-orange-500" />
            <span>Router & Wi-Fi Setup</span>
          </router-link>

          <router-link 
            to="/contact" 
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/contact' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <PhoneCall class="w-4 h-4 text-[#ee2824]" />
            <span>Contact Us</span>
          </router-link>

          <router-link 
            to="/careers" 
            @click="mobileMenuOpen = false"
            class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
            :class="$route.path === '/careers' ? 'text-[#ee2824] dark:text-[#ff6b67] bg-[#ee2824]/10 font-bold' : 'dark:text-slate-200 text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'"
          >
            <Users class="w-4 h-4 text-indigo-500" />
            <span>Sales Agent Careers</span>
          </router-link>
        </nav>

        <!-- Quick Hotline Footer inside Mobile Menu -->
        <div class="pt-3 border-t dark:border-slate-800 border-slate-200 flex flex-col gap-2.5">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
            <span>Customer Hotline:</span>
            <a href="tel:09154077565" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">0915 407 7565</a>
          </div>
          <div class="flex items-center justify-center gap-4 pt-1">
            <a href="https://facebook.com/switchfiber.ph" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#1877F2]" title="Facebook">
              <Facebook class="w-4 h-4" />
            </a>
            <a href="https://instagram.com/switchfiber.ph" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-rose-500" title="Instagram">
              <Instagram class="w-4 h-4" />
            </a>
            <a href="https://m.me/switchfiber.ph" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-cyan-500" title="Messenger">
              <MessageCircle class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import {
  Home,
  Info,
  BookOpen,
  Zap,
  MapPin,
  Search,
  CreditCard,
  Wrench,
  PhoneCall,
  Users,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  Facebook,
  Instagram,
  MessageCircle
} from 'lucide-vue-next'
import { useThemeStore } from '../stores/theme'
import { useRegistrationStore } from '../stores/registration'

const themeStore = useThemeStore()
const registrationStore = useRegistrationStore()
const route = useRoute()
const mobileMenuOpen = ref(false)

// Close the drawer on any navigation, including browser back/forward
watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

// Lock background scroll while the drawer is open
watch(mobileMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

function onKeydown(e) {
  if (e.key === 'Escape' && mobileMenuOpen.value) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>
