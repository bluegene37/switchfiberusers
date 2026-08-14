<template>
  <div class="min-h-screen flex flex-col transition-colors duration-300 dark:bg-[#07080c] dark:text-slate-100 bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-[#ee2824] selection:text-white">
    <!-- Keyboard users can jump straight past the nav -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-[#ee2824] focus:text-white focus:font-bold focus:shadow-lg"
    >
      Skip to main content
    </a>

    <Navbar />

    <main id="main-content" class="flex-1">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>
