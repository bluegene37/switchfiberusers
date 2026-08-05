<template>
  <div class="min-h-screen flex flex-col transition-colors duration-300 dark:bg-[#07080c] dark:text-slate-100 bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-[#ee2824] selection:text-white">
    <Navbar />
    
    <main class="flex-1">
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
