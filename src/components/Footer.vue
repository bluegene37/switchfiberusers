<template>
  <footer class="transition-colors duration-300 dark:bg-[#050609] dark:border-slate-900/80 bg-slate-100 border-slate-200 border-t pt-16 pb-12 relative overflow-hidden">
    <!-- Glow accent background -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-t from-[#ee2824]/10 via-rose-600/5 to-transparent blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b dark:border-slate-900 border-slate-200">
        
        <!-- Brand Summary Column -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="Switch Fiber Logo" class="w-10 h-10 object-contain drop-shadow-md" />
            <div>
              <span class="font-heading font-extrabold text-2xl tracking-tight text-[#ee2824] dark:text-[#ff6b67]">SWITCHFIBER</span>
            </div>
          </div>
          
          <p class="text-sm dark:text-slate-400 text-slate-600 max-w-sm leading-relaxed">
            Rizal’s fast-growing and affordable internet provider. Delivering ultra-fast, unlimited fiber internet with transparent pricing and local 24/7 dedicated support.
          </p>

          <div class="pt-2 flex items-center gap-3">
            <a href="https://www.facebook.com/switchfiberph" target="_blank" class="w-9 h-9 rounded-lg dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200 border flex items-center justify-center dark:text-slate-400 text-slate-600 hover:text-[#ee2824] dark:hover:text-[#ff6b67] hover:border-[#ee2824]/40 transition-colors">
              <Facebook class="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/switchfiberph/" target="_blank" class="w-9 h-9 rounded-lg dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200 border flex items-center justify-center dark:text-slate-400 text-slate-600 hover:text-[#ee2824] dark:hover:text-[#ff6b67] hover:border-[#ee2824]/40 transition-colors">
              <Instagram class="w-4 h-4" />
            </a>
            <a href="https://invite.viber.com/?g=HF_4mUx80VGD5igbMKZi5lV0ai8R6_ld&lang=en" target="_blank" class="w-9 h-9 rounded-lg dark:bg-slate-900 dark:border-slate-800 bg-white border-slate-200 border flex items-center justify-center dark:text-slate-400 text-slate-600 hover:text-[#ee2824] dark:hover:text-[#ff6b67] hover:border-[#ee2824]/40 transition-colors">
              <MessageSquare class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-heading font-bold dark:text-slate-200 text-slate-800 text-sm tracking-wider uppercase mb-4">Quick Navigation</h4>
          <ul class="space-y-2.5 text-sm dark:text-slate-400 text-slate-600">
            <li><router-link to="/" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">Home Page</router-link></li>
            <li><router-link to="/about" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">About Switch Fiber</router-link></li>
            <li><router-link to="/plans" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">Fiber Plans & Speed</router-link></li>
            <li><router-link to="/coverage" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">Rizal Area Coverage</router-link></li>
            <li><router-link to="/contact" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">Contact Support</router-link></li>
            <li><router-link to="/register" @click="registrationStore.resetForm()" class="hover:text-[#ee2824] text-[#ee2824] dark:text-[#ff6b67] font-medium">Apply Online Now</router-link></li>
            <li><router-link to="/status" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">Track Application Status</router-link></li>
          </ul>
        </div>

        <!-- Self Service & Billing -->
        <div>
          <h4 class="font-heading font-bold dark:text-slate-200 text-slate-800 text-sm tracking-wider uppercase mb-4">Customer Care</h4>
          <ul class="space-y-2.5 text-sm dark:text-slate-400 text-slate-600">
            <li><router-link to="/pay-bills" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">Settle Bill (pay.switchfiber.ph)</router-link></li>
            <li><router-link to="/tech-support" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">192.168.1.1 WiFi Router Guide</router-link></li>
            <li><router-link to="/tech-support" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">Change WiFi Password & SSID</router-link></li>
            <li><router-link to="/careers" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-colors">Become a Freelance Sales Agent</router-link></li>
          </ul>
        </div>

        <!-- Hotlines & Office Hours -->
        <div class="space-y-4">
          <h4 class="font-heading font-bold dark:text-slate-200 text-slate-800 text-sm tracking-wider uppercase">Hotline & Office</h4>
          <div class="space-y-2 text-xs dark:text-slate-400 text-slate-600">
            <div class="flex items-center gap-2">
              <PhoneCall class="w-3.5 h-3.5 text-[#ee2824] dark:text-[#ff6b67]" />
              <a href="tel:09154077565" class="font-bold dark:text-white text-slate-900 hover:text-[#ee2824]">0915 407 7565</a>
            </div>
            <div class="flex items-center gap-2">
              <Clock class="w-3.5 h-3.5 text-blue-500" />
              <span>Mon - Sat: 8:00 AM - 5:00 PM</span>
            </div>
            <div class="flex items-center gap-2">
              <CreditCard class="w-3.5 h-3.5 text-emerald-500" />
              <span>GCash • Maya • Bayad • 7-Eleven</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Bottom -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs dark:text-slate-500 text-slate-500 gap-4">
        <div class="flex items-center gap-6">
          <span>Binangonan, Rizal, Philippines</span>
          <span>•</span>
          <router-link to="/register" @click="registrationStore.resetForm()" class="text-[#ee2824] dark:text-[#ff6b67] hover:underline">Online Registration Portal</router-link>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { Zap, Facebook, Instagram, MessageSquare, PhoneCall, CreditCard, Clock } from 'lucide-vue-next'
import { useRegistrationStore } from '../stores/registration'

const registrationStore = useRegistrationStore()
</script>
