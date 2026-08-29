<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
    
    <!-- Hero Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/20">
        <Headphones class="w-4 h-4" />
        <span>Contact Switch Fiber</span>
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        We're Here to <span class="text-[#ee2824] dark:text-[#ff6b67]">Help You</span>
      </h1>
      <p class="text-base sm:text-lg dark:text-slate-300 text-slate-600">
        Reach out to our customer care hotlines, send an inquiry, or visit our office in Binangonan, Rizal.
      </p>
    </div>

    <!-- Official 4 Contact Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- 1. Customer Support -->
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 relative overflow-hidden group hover:border-[#ee2824]/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/30">
          <Headphones class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold font-heading text-base dark:text-white text-slate-900">Customer Support</h3>
          <p class="text-xs dark:text-slate-300 text-slate-700 font-mono mt-1 leading-relaxed">
            0915-407-7565 (Globe)<br />
            0917 876 2440 (Globe)
          </p>
        </div>
      </div>

      <!-- 2. Billing Concern -->
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 relative overflow-hidden group hover:border-[#ee2824]/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/30">
          <Headphones class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold font-heading text-base dark:text-white text-slate-900">Billing Concern</h3>
          <p class="text-xs dark:text-slate-300 text-slate-700 font-mono mt-1">
            0915-407-7555 (Globe)
          </p>
        </div>
      </div>

      <!-- 3. General Inquiries -->
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 relative overflow-hidden group hover:border-[#ee2824]/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/30">
          <Mail class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold font-heading text-base dark:text-white text-slate-900">General Inquiries</h3>
          <a href="mailto:customercare@switchfiber.ph" class="text-xs text-[#ee2824] dark:text-[#ff6b67] font-semibold underline mt-1 block truncate">
            customercare@switchfiber.ph
          </a>
        </div>
      </div>

      <!-- 4. Sales & Marketing Inquiries -->
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 relative overflow-hidden group hover:border-[#ee2824]/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/30">
          <Mail class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold font-heading text-base dark:text-white text-slate-900">Sales & Marketing</h3>
          <a href="mailto:sales@switchfiber.ph" class="text-xs text-[#ee2824] dark:text-[#ff6b67] font-semibold underline mt-1 block truncate">
            sales@switchfiber.ph
          </a>
        </div>
      </div>

    </div>

    <!-- Visit Us Section & Embedded Google Map -->
    <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      <!-- Google Map Container -->
      <div class="lg:col-span-7 rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-300 shadow-lg min-h-[320px] relative bg-slate-100 dark:bg-slate-900">
        <iframe 
          title="Switch Fiber Office Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15454.498114421118!2d121.1856755!3d14.4533041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c11f7c320299%3A0x6b13e9a7e6bdf20a!2sSta.%20Ursula%20Subd%2C%20Binangonan%2C%20Rizal!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph" 
          class="w-full h-80 border-0" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <!-- Visit Us Details -->
      <div class="lg:col-span-5 space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] text-xs font-bold">
          <MapPin class="w-4 h-4" />
          <span>Physical Location</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading text-[#ee2824] dark:text-[#ff6b67]">
          Visit Us
        </h2>
        <p class="text-sm dark:text-slate-200 text-slate-800 font-semibold leading-relaxed">
          315 Sampaloc St., Sta. Ursula Subd., Brgy. Batingan, Binangonan, Rizal, Philippines, 1940
        </p>
        <p class="text-xs dark:text-slate-400 text-slate-600 italic">
          ✨ We accept walk-in applications and payments!
        </p>
        <div class="pt-2 text-xs dark:text-slate-300 text-slate-700 space-y-1 font-medium border-t dark:border-slate-800 border-slate-200">
          <p><span class="font-bold">Operating Hours:</span> Monday – Saturday: 8:00 AM – 5:00 PM</p>
          <p><span class="font-bold">Lunch Break:</span> 12:00 PM – 1:00 PM</p>
        </div>
      </div>

    </div>

    <!-- Subscriber Notice & Policy Infographic Cards Grid -->
    <div class="space-y-6">
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-extrabold font-heading dark:text-white text-slate-900">
          Important Subscriber Guidelines & Policies
        </h2>
        <p class="text-xs dark:text-slate-400 text-slate-600">
          Helpful information regarding billing, account balances, modem care, and official fees.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Card 1: Understand Your Bill Easily -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4">
          <button
            type="button"
            @click="openAdvisory(0)"
            class="block w-full rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-200 relative cursor-zoom-in group/adv"
            :aria-label="`View full size: ${advisories[0].title}`"
          >
            <img
              :src="advisories[0].src"
              :alt="advisories[0].alt"
              class="w-full h-auto group-hover/adv:opacity-90 transition-opacity"
              decoding="async"
              width="1080"
              height="1080"
            />
            <span class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
              <Maximize2 class="w-3 h-3" />
              <span>View Full Size</span>
            </span>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ee2824]/10 text-[#ee2824] flex items-center justify-center font-bold text-lg">1</div>
            <h3 class="font-bold font-heading text-lg dark:text-white text-slate-900">Understand Your Bill Easily</h3>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
            Your Statement of Account (SOA) is delivered directly to your registered email address and mobile number every month. It includes your Account Number, Billing Period, Due Date, and Total Amount Due.
          </p>
          <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border dark:border-slate-800 border-slate-200 text-xs space-y-2">
            <p class="font-semibold dark:text-slate-200 text-slate-800">Available Payment Channels:</p>
            <div class="flex flex-wrap gap-2 text-[11px] font-bold text-[#ee2824] dark:text-[#ff6b67]">
              <span class="px-2 py-1 bg-red-500/10 rounded-md">GCash (QR PH)</span>
              <span class="px-2 py-1 bg-red-500/10 rounded-md">Maya</span>
              <span class="px-2 py-1 bg-red-500/10 rounded-md">Debit / Credit Card</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Ways to Know Your Account Balance -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4">
          <button
            type="button"
            @click="openAdvisory(1)"
            class="block w-full rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-200 relative cursor-zoom-in group/adv"
            :aria-label="`View full size: ${advisories[1].title}`"
          >
            <img
              :src="advisories[1].src"
              :alt="advisories[1].alt"
              class="w-full h-auto group-hover/adv:opacity-90 transition-opacity"
              decoding="async"
              width="1080"
              height="1080"
            />
            <span class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
              <Maximize2 class="w-3 h-3" />
              <span>View Full Size</span>
            </span>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ee2824]/10 text-[#ee2824] flex items-center justify-center font-bold text-lg">2</div>
            <h3 class="font-bold font-heading text-lg dark:text-white text-slate-900">Ways to Know Your Account Balance</h3>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
            Easily check your current balance online anytime via our portal or receive your SOA on the 23rd day of every month:
          </p>
          <ul class="space-y-2 text-xs font-semibold dark:text-slate-300 text-slate-700">
            <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500" /> Visit <a href="https://pay.switchfiber.ph" target="_blank" rel="noopener noreferrer" class="text-[#ee2824] underline">pay.switchfiber.ph</a> and enter your Account Number</li>
            <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500" /> Check SMS notifications sent to your registered mobile number</li>
          </ul>
        </div>

        <!-- Card 3: Switch Reminder - DO NOT RESET YOUR MODEM -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border border-[#ee2824]/30 bg-red-500/5 space-y-4">
          <button
            type="button"
            @click="openAdvisory(2)"
            class="block w-full rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-200 relative cursor-zoom-in group/adv"
            :aria-label="`View full size: ${advisories[2].title}`"
          >
            <img
              :src="advisories[2].src"
              :alt="advisories[2].alt"
              class="w-full h-auto group-hover/adv:opacity-90 transition-opacity"
              decoding="async"
              width="1080"
              height="1080"
            />
            <span class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
              <Maximize2 class="w-3 h-3" />
              <span>View Full Size</span>
            </span>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center font-bold">
              <AlertTriangle class="w-5 h-5" />
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase text-[#ee2824] tracking-wider block">Important Switch Reminder</span>
              <h3 class="font-extrabold font-heading text-lg text-[#ee2824] dark:text-[#ff6b67]">DO NOT RESET YOUR MODEM</h3>
            </div>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
            Resetting the modem will erase your modem's configuration and internet settings, incurring a re-configuration fee of <strong>₱150</strong>.
          </p>
          <div class="p-3 bg-[#ee2824]/10 rounded-xl text-xs font-semibold text-[#ee2824] dark:text-[#ff6b67]">
            For any connection issues, please contact Customer Service immediately: <strong>0915-407-7565</strong>
          </div>
        </div>

        <!-- Card 4: NO PROCESSING FEE / NO APPLICATION FEE -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border border-[#ee2824]/30 bg-red-500/5 space-y-4">
          <button
            type="button"
            @click="openAdvisory(3)"
            class="block w-full rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-200 relative cursor-zoom-in group/adv"
            :aria-label="`View full size: ${advisories[3].title}`"
          >
            <img
              :src="advisories[3].src"
              :alt="advisories[3].alt"
              class="w-full h-auto group-hover/adv:opacity-90 transition-opacity"
              decoding="async"
              width="1080"
              height="1080"
            />
            <span class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
              <Maximize2 class="w-3 h-3" />
              <span>View Full Size</span>
            </span>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center font-bold">
              <ShieldAlert class="w-5 h-5" />
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase text-[#ee2824] tracking-wider block">Official Fee Policy</span>
              <h3 class="font-extrabold font-heading text-lg text-[#ee2824] dark:text-[#ff6b67]">NO PROCESSING FEE / NO APPLICATION FEE</h3>
            </div>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
            Our Technicians and Sales Agents are <strong>NOT AUTHORIZED</strong> to impose or collect any extra fees from subscribers.
          </p>
          <div class="p-3 bg-[#ee2824]/10 rounded-xl text-xs font-semibold text-[#ee2824] dark:text-[#ff6b67]">
            If you encounter unauthorized fee requests, please report immediately to hotlines: <strong>0915 407 7565 / 0917 876 2440</strong>
          </div>
        </div>

      </div>
    </div>

    <!-- Direct Inquiry Form Section -->
    <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
      <div>
        <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Send Us a Direct Message</h2>
        <p class="text-xs dark:text-slate-400 text-slate-600 mt-1">
          Fill out the form below and our customer care team will get back to you right away.
        </p>
      </div>

      <form @submit.prevent="sendMessage" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label for="contact-name" class="block text-xs font-bold uppercase dark:text-slate-300 text-slate-700 mb-1">Full Name <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
            <input id="contact-name" v-model="form.name" type="text" placeholder="John Doe" class="input-field" required />
          </div>
          <div>
            <label for="contact-mobile" class="block text-xs font-bold uppercase dark:text-slate-300 text-slate-700 mb-1">Mobile Number <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
            <input id="contact-mobile" v-model="form.mobile" type="text" placeholder="09171234567" class="input-field" required />
          </div>
          <div>
            <label for="contact-email" class="block text-xs font-bold uppercase dark:text-slate-300 text-slate-700 mb-1">Email Address <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
            <input id="contact-email" v-model="form.email" type="email" placeholder="name@example.com" class="input-field" required />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="contact-type" class="block text-xs font-bold uppercase dark:text-slate-300 text-slate-700 mb-1">Inquiry Type</label>
            <select id="contact-type" v-model="form.type" class="input-field">
              <option value="customer_support">Customer Support Inquiry</option>
              <option value="billing">Billing Concern</option>
              <option value="general">General Inquiry</option>
              <option value="sales">Sales & Marketing</option>
            </select>
          </div>
          <div>
            <label for="contact-location" class="block text-xs font-bold uppercase dark:text-slate-300 text-slate-700 mb-1">Barangay (Location in Rizal)</label>
            <input id="contact-location" v-model="form.location" type="text" placeholder="e.g. Batingan, Binangonan" class="input-field" />
          </div>
        </div>

        <div>
          <label for="contact-message" class="block text-xs font-bold uppercase dark:text-slate-300 text-slate-700 mb-1">Your Message <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <textarea id="contact-message" v-model="form.message" rows="4" placeholder="How can we assist you today?" class="input-field" required></textarea>
        </div>

        <button type="submit" class="btn-primary w-full flex items-center justify-center gap-2">
          <Send class="w-4 h-4" />
          <span>Send Inquiry via Email</span>
        </button>
      </form>

      <div v-if="submitted" class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-xs font-semibold flex items-center gap-2">
        <CheckCircle2 class="w-5 h-5 shrink-0" />
        <span>
          Your email app should now be open with your message ready to send — press <strong>Send</strong> there to deliver it.
          If nothing opened, email us directly at
          <a href="mailto:customercare@switchfiber.ph" class="underline font-bold">customercare@switchfiber.ph</a>.
        </span>
      </div>
    </div>

    <!-- Advisory Image Lightbox -->
    <Teleport to="body">
      <div
        v-if="activeAdvisory !== null"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        @click="closeAdvisory"
      >
        <div class="relative max-w-3xl w-full max-h-[92vh] p-2 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden" @click.stop>
          <button
            @click="closeAdvisory"
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-[#ee2824] transition-colors"
            aria-label="Close image viewer"
          >
            <X class="w-5 h-5" />
          </button>
          <img
            :src="advisories[activeAdvisory].src"
            :alt="advisories[activeAdvisory].alt"
            class="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain mx-auto"
          />
          <div class="p-3 text-center text-xs text-slate-300 font-semibold">
            {{ advisories[activeAdvisory].title }}
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Headphones, Mail, MapPin, AlertTriangle, ShieldAlert, CheckCircle2, Send, Maximize2, X } from 'lucide-vue-next'

// Official advisory graphics from switchfiber.ph, served locally from
// public/advisories/ (WebP, optimized from the originals).
const advisories = [
  {
    src: '/advisories/billing-guide.webp',
    title: 'Understand Your Bill Easily',
    alt: 'Official Switch Fiber billing guide showing a sample Statement of Account with the Billing Information, Due Date, Total Amount Due and accepted payment methods highlighted'
  },
  {
    src: '/advisories/account-balance.webp',
    title: 'Ways to Know Your Account Balance',
    alt: 'Official Switch Fiber guide listing three ways to check your account balance: billing reminder emails, the monthly Statement of Account sent every 23rd, and SMS reminders'
  },
  {
    src: '/advisories/modem-warning.webp',
    title: 'Switch Reminder: Do Not Reset Your Modem',
    alt: 'Official Switch Fiber reminder warning not to press the modem reset button because reconfiguration costs 150 pesos; contact Customer Service 09154077565 for connection issues'
  },
  {
    src: '/advisories/no-fee-advisory.webp',
    title: 'No Processing Fee / No Application Fee',
    alt: 'Official Switch Fiber advisory: technicians and sales agents are not authorized to collect any fees; report violations to hotlines Smart +63 919 386 9998 or Globe +63 915 407 7565'
  }
]

const activeAdvisory = ref(null)

function openAdvisory(index) {
  activeAdvisory.value = index
}

function closeAdvisory() {
  activeAdvisory.value = null
}

function onKeydown(e) {
  if (e.key === 'Escape') closeAdvisory()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const form = ref({
  name: '',
  mobile: '',
  email: '',
  type: 'customer_support',
  location: '',
  message: ''
})

const submitted = ref(false)

// There is no inquiry backend, so the form composes an email in the visitor's
// own mail app instead of pretending the message was delivered.
function sendMessage() {
  const typeLabels = {
    customer_support: 'Customer Support Inquiry',
    billing: 'Billing Concern',
    general: 'General Inquiry',
    sales: 'Sales & Marketing Inquiry'
  }
  const to = form.value.type === 'sales' ? 'sales@switchfiber.ph' : 'customercare@switchfiber.ph'
  const subject = `[Website Inquiry] ${typeLabels[form.value.type] || 'Inquiry'} — ${form.value.name}`
  const body =
    `Name: ${form.value.name}\n` +
    `Mobile: ${form.value.mobile}\n` +
    `Email: ${form.value.email}\n` +
    (form.value.location ? `Location: ${form.value.location}\n` : '') +
    `\n${form.value.message}`
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  submitted.value = true
}
</script>
