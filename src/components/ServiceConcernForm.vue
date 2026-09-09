<template>
  <div class="glass-card rounded-3xl border dark:border-slate-800 border-slate-200 overflow-hidden shadow-xl">
    <!-- Header banner -->
    <div class="p-6 sm:p-8 bg-gradient-to-r from-red-600/15 via-red-500/10 to-transparent border-b dark:border-slate-800 border-slate-200">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/20 mb-2">
            <LifeBuoy class="w-3.5 h-3.5" />
            <span>Support & Technical Care</span>
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
            Submit a Concern or Complaint
          </h2>
          <p class="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mt-1 max-w-2xl">
            Experiencing connection issues, billing questions, or equipment trouble? Submit your ticket directly to our technical dispatch queue.
          </p>
        </div>

        <div class="shrink-0 flex items-center gap-2 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border dark:border-slate-800 border-slate-200 text-xs font-semibold">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="dark:text-slate-200 text-slate-700">Dispatch Queue: <strong class="text-emerald-600 dark:text-emerald-400">Active</strong></span>
        </div>
      </div>
    </div>

    <!-- Success / Ticket Receipt State -->
    <div v-if="submittedTicket" class="p-6 sm:p-10 space-y-6 text-center animate-in fade-in duration-300">
      <div class="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
        <CheckCircle2 class="w-9 h-9" />
      </div>

      <div class="space-y-2 max-w-md mx-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <Clock class="w-3.5 h-3.5 animate-spin" />
          <span>Ticket Status: {{ submittedTicket.status }}</span>
        </span>
        <h3 class="text-2xl font-black font-heading dark:text-white text-slate-900">
          Concern Submitted Successfully!
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Your service order has been logged into our support system and queued for immediate review.
        </p>
      </div>

      <!-- Ticket Receipt Card -->
      <div class="max-w-xl mx-auto rounded-2xl border dark:border-slate-800 border-slate-200 bg-slate-50 dark:bg-slate-900/90 p-5 sm:p-6 text-left space-y-4 shadow-sm">
        <div class="flex items-center justify-between pb-3 border-b dark:border-slate-800 border-slate-200">
          <div>
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reference Number</span>
            <p class="text-xl font-black font-mono text-[#ee2824] dark:text-[#ff6b67]">#{{ submittedTicket.referenceNo }}</p>
          </div>
          <div class="text-right">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Queue Stage</span>
            <p class="text-xs font-bold text-amber-600 dark:text-amber-400">In Progress</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-slate-400">Subscriber Name:</span>
            <p class="font-bold dark:text-white text-slate-900">{{ submittedTicket.fullName }}</p>
          </div>
          <div>
            <span class="text-slate-400">Account Number:</span>
            <p class="font-bold font-mono dark:text-white text-slate-900">{{ submittedTicket.accountNumber || 'Not Specified' }}</p>
          </div>
          <div>
            <span class="text-slate-400">Contact Number:</span>
            <p class="font-bold font-mono dark:text-white text-slate-900">{{ submittedTicket.contactNumber }}</p>
          </div>
          <div>
            <span class="text-slate-400">Email Address:</span>
            <p class="font-bold dark:text-white text-slate-900 truncate">{{ submittedTicket.emailAddress || 'None provided' }}</p>
          </div>
          <div class="sm:col-span-2">
            <span class="text-slate-400">Service Address:</span>
            <p class="font-semibold dark:text-slate-200 text-slate-800">{{ submittedTicket.address }}</p>
          </div>
          <div class="sm:col-span-2 pt-2 border-t dark:border-slate-800/80 border-slate-200">
            <span class="text-slate-400">Concern Category:</span>
            <p class="font-bold text-[#ee2824] dark:text-[#ff6b67]">{{ submittedTicket.concern }}</p>
            <p class="mt-1 text-slate-600 dark:text-slate-300 italic bg-white/50 dark:bg-slate-950/50 p-2.5 rounded-xl text-[11px] leading-relaxed">
              "{{ submittedTicket.concernDetails }}"
            </p>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          @click="store.resetForm()"
          class="btn-primary py-3 px-6 text-xs font-bold min-h-11 shadow-md shadow-[#ee2824]/20 flex items-center gap-2"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Submit Another Concern</span>
        </button>

        <a
          href="tel:09154077565"
          class="btn-secondary py-3 px-6 text-xs font-bold min-h-11 flex items-center gap-2"
        >
          <PhoneCall class="w-4 h-4 text-[#ee2824]" />
          <span>Call Dispatch Hotline (0915-407-7565)</span>
        </a>
      </div>
    </div>

    <!-- Active Submission Form -->
    <form v-else @submit.prevent="handleSubmit" class="p-6 sm:p-8 space-y-6" novalidate>
      
      <!-- Account Number Lookup Banner (Optional helper for subscribers) -->
      <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border dark:border-slate-800 border-slate-200 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label for="sf-account-lookup" class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Search class="w-3.5 h-3.5 text-[#ee2824]" />
              <span>Already a Switch Fiber Subscriber? (Auto-Fill)</span>
            </label>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Enter your Account Number from your bill or SMS to auto-populate your registered information.
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div class="relative flex-1">
            <input
              id="sf-account-lookup"
              v-model="formData.accountNumber"
              type="text"
              inputmode="numeric"
              placeholder="e.g. 202311373"
              autocomplete="off"
              @keydown.enter.prevent="handleLookup"
              class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
            />
          </div>
          <button
            type="button"
            @click="handleLookup"
            :disabled="isLookingUp || !formData.accountNumber.trim()"
            class="btn-secondary py-2.5 px-4 text-xs font-bold min-h-11 flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Loader2 v-if="isLookingUp" class="w-4 h-4 animate-spin text-[#ee2824]" />
            <Search v-else class="w-4 h-4 text-[#ee2824]" />
            <span>{{ isLookingUp ? 'Searching...' : 'Find Account' }}</span>
          </button>
        </div>

        <!-- Lookup Status Feedback -->
        <div
          v-if="lookupMessage"
          :class="[
            'p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200',
            lookupStatus === 'success'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
          ]"
          role="status"
        >
          <CheckCircle2 v-if="lookupStatus === 'success'" class="w-4 h-4 shrink-0" />
          <AlertCircle v-else class="w-4 h-4 shrink-0" />
          <span>{{ lookupMessage }}</span>
        </div>
      </div>

      <!-- Subscriber Contact & Identity Grid -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <User class="w-4 h-4 text-[#ee2824]" />
          <span>Subscriber & Contact Details</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <!-- Full Name -->
          <div>
            <label for="sf-fullname" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              id="sf-fullname"
              v-model="formData.fullName"
              type="text"
              required
              autocomplete="name"
              placeholder="e.g. Juan Dela Cruz"
              class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
            />
          </div>

          <!-- Contact Number -->
          <div>
            <label for="sf-contact" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Mobile / Phone Number <span class="text-red-500">*</span>
            </label>
            <input
              id="sf-contact"
              v-model="formData.contactNumber"
              type="tel"
              required
              inputmode="tel"
              autocomplete="tel"
              placeholder="0915 123 4567"
              class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
            />
            <p v-if="phoneError" class="text-[11px] text-red-500 mt-1">
              Must be 11 digits starting with 09.
            </p>
          </div>

          <!-- Email Address -->
          <div>
            <label for="sf-email" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="sf-email"
              v-model="formData.emailAddress"
              type="email"
              autocomplete="email"
              placeholder="name@example.com"
              class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
            />
          </div>

          <!-- Priority Level -->
          <div>
            <label for="sf-priority" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Priority Level
            </label>
            <select
              id="sf-priority"
              v-model="formData.priorityLevel"
              class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
            >
              <option value="Normal">Normal — Standard Queue</option>
              <option value="High">High — Total Outage / Urgent</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Installation Address Grid -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <MapPin class="w-4 h-4 text-[#ee2824]" />
          <span>Service Address</span>
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <!-- Street Address & Landmark -->
          <div class="sm:col-span-3">
            <label for="sf-address" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Street, House / Lot No., & Nearest Landmark <span class="text-red-500">*</span>
            </label>
            <input
              id="sf-address"
              v-model="formData.address"
              type="text"
              required
              autocomplete="street-address"
              placeholder="e.g. 123 Sampaloc St., Sta. Ursula Subd., near gate"
              class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
            />
          </div>

          <!-- Barangay -->
          <div>
            <label for="sf-barangay" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Barangay
            </label>
            <input
              id="sf-barangay"
              v-model="formData.barangay"
              type="text"
              list="sf-barangay-list"
              placeholder="e.g. Batingan"
              class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
            />
            <datalist id="sf-barangay-list">
              <option v-for="b in binangonanBarangays" :key="b" :value="b" />
            </datalist>
          </div>

          <!-- City / Municipality -->
          <div>
            <label for="sf-city" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Municipality / City
            </label>
            <input
              id="sf-city"
              v-model="formData.city"
              type="text"
              placeholder="Binangonan"
              class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
            />
          </div>

          <!-- Province (Read-only badge for context) -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Province
            </label>
            <div class="px-4 py-2.5 rounded-xl border dark:border-slate-800 border-slate-200 bg-slate-100 dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 min-h-11 flex items-center">
              Rizal
            </div>
          </div>

        </div>
      </div>

      <!-- Concern Category & Details -->
      <div class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <AlertTriangle class="w-4 h-4 text-[#ee2824]" />
          <span>Concern & Complaint Description</span>
        </h3>

        <!-- Concern Category Selector -->
        <div>
          <label for="sf-category" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Category of Concern <span class="text-red-500">*</span>
          </label>
          <select
            id="sf-category"
            v-model="formData.concernCategory"
            required
            class="w-full px-4 py-2.5 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] min-h-11"
          >
            <option v-for="cat in CONCERN_CATEGORIES" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- Concern Details Textarea -->
        <div>
          <label for="sf-details" class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Details & Description <span class="text-red-500">*</span>
          </label>
          <textarea
            id="sf-details"
            v-model="formData.concernDetails"
            rows="4"
            required
            placeholder="Please describe what you are experiencing (e.g. modem shows red LOS light, disconnection since 2 PM, payment not yet reflected, etc.)"
            class="w-full px-4 py-3 rounded-xl border dark:border-slate-700 border-slate-300 bg-white dark:bg-slate-800 text-xs sm:text-sm dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ee2824] leading-relaxed"
          ></textarea>
        </div>
      </div>

      <!-- Error Message Banner -->
      <div
        v-if="error"
        class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
        role="alert"
      >
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>{{ error }}</span>
      </div>

      <!-- Submit CTA Button -->
      <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t dark:border-slate-800 border-slate-200">
        <div class="text-[11px] text-slate-500 dark:text-slate-400">
          Status will be assigned to <strong class="text-amber-600 dark:text-amber-400">In Progress</strong> upon submission.
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full sm:w-auto btn-primary py-3.5 px-8 text-xs sm:text-sm font-bold min-h-11 shadow-lg shadow-[#ee2824]/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
          <Send v-else class="w-4 h-4" />
          <span>{{ isSubmitting ? 'Submitting Service Ticket...' : 'Submit Concern Ticket' }}</span>
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  LifeBuoy, CheckCircle2, Clock, RotateCcw, PhoneCall,
  Search, Loader2, AlertCircle, User, MapPin, AlertTriangle, Send
} from 'lucide-vue-next'
import { useServiceOrderStore, CONCERN_CATEGORIES, PHILIPPINE_MOBILE_REGEX } from '../stores/serviceOrder.js'
import { coverageBarangaysByCity } from '../data/calabarzonLocations.js'

const store = useServiceOrderStore()
const {
  formData,
  isSubmitting,
  isLookingUp,
  lookupMessage,
  lookupStatus,
  error,
  submittedTicket
} = storeToRefs(store)

const binangonanBarangays = coverageBarangaysByCity?.Binangonan || [
  'Batingan', 'Bilibiran', 'Calumpang', 'Darangan', 'Layunan', 'Libid',
  'Libis', 'Lunsad', 'Macamot', 'Mahabang Parang', 'Mambog',
  'Palangoy', 'Pag-asa', 'Pantok', 'Pila-pila', 'Tagpos', 'Tatala', 'Tayuman'
]

const phoneError = computed(() => {
  const p = (formData.value?.contactNumber || '').replace(/\s+/g, '').trim()
  return p.length > 0 && !PHILIPPINE_MOBILE_REGEX.test(p)
})

async function handleLookup() {
  await store.lookupAccount()
}

async function handleSubmit() {
  await store.submitConcern()
}
</script>
