<template>
  <div class="rounded-3xl border dark:border-slate-800 border-slate-200 overflow-hidden shadow-xl max-w-xl mx-auto bg-white dark:bg-slate-900 transition-all">
    
    <!-- Top Header: Red Squircle Message Icon + Support Desk -->
    <div class="p-6 sm:p-8 pb-4 flex items-center gap-3.5">
      <div class="w-12 h-12 rounded-2xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/20 shrink-0">
        <MessageSquare class="w-6 h-6 fill-white/10 stroke-[2.2]" />
      </div>
      <h2 class="text-2xl sm:text-3xl font-black font-heading dark:text-white text-slate-900 tracking-tight">
        Support Desk
      </h2>
    </div>

    <!-- Success State: Sent Successfully -->
    <div v-if="submittedTicket" class="p-8 sm:p-12 space-y-6 text-center animate-in fade-in duration-300">
      <div class="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
        <CheckCircle2 class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <h3 class="text-2xl sm:text-3xl font-black font-heading dark:text-white text-slate-900">
          Sent Successfully!
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
          Thank you! We have received your request for <strong class="text-[#ee2824] dark:text-[#ff6b67] font-mono font-bold">{{ submittedTicket.emailAddress }}</strong>. Our support team will contact you directly.
        </p>
        <p v-if="remainingSeconds > 0" class="text-xs text-slate-400 dark:text-slate-500 font-medium pt-1">
          Form will automatically reset in <span class="font-mono font-bold text-slate-700 dark:text-slate-200">{{ remainingSeconds }}s</span>
        </p>
      </div>

      <div class="pt-2 flex justify-center">
        <button
          type="button"
          @click="handleManualReset"
          class="btn-primary py-2.5 px-8 text-sm font-bold min-h-11 shadow-md shadow-[#ee2824]/20 flex items-center justify-center gap-2 rounded-xl"
        >
          <RotateCcw class="w-4 h-4" />
          <span>Submit Another Concern</span>
        </button>
      </div>
    </div>

    <!-- Active Submission Form -->
    <form v-else @submit.prevent="handleSubmit" class="p-6 sm:p-8 pt-2 space-y-6" novalidate>

      <!-- Support Request Intro (Text and Badge matching UI mockup) -->
      <div class="space-y-2.5">
        <!-- Badge: Service Order & Customer Support -->
        <div>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/20">
            <ShieldCheck class="w-3.5 h-3.5 text-[#ee2824]" />
            <span>Service Order & Customer Support</span>
          </span>
        </div>

        <!-- Heading: Submit a Support Request -->
        <h3 class="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Submit a Support Request
        </h3>

        <!-- Description from Designer -->
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
          Need assistance with your internet connection or subscription? Provide your email address below, and our support team will contact you directly.
        </p>
      </div>

      <!-- Dedicated Space for Subscriber Email Input matching Designer Mockup -->
      <div class="space-y-2">
        <label for="sf-email" class="sr-only">Subscriber Email Address</label>
        
        <div 
          class="relative rounded-2xl border-2 transition-all duration-200 bg-white dark:bg-slate-800 shadow-sm flex items-center p-1 sm:p-1.5"
          :class="[
            displayEmailError 
              ? 'border-red-500 ring-2 ring-red-500/20' 
              : isValidEmail 
                ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                : 'border-red-100 dark:border-slate-700 hover:border-[#ee2824]/40 focus-within:border-[#ee2824] focus-within:ring-2 focus-within:ring-[#ee2824]/20'
          ]"
        >
          <div class="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
            <Mail class="w-5 h-5 text-slate-400" />
          </div>

          <input
            id="sf-email"
            v-model="formData.emailAddress"
            type="email"
            required
            autocomplete="email"
            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
            placeholder="jdelacruz@gmail.com"
            class="w-full py-2.5 px-2 bg-transparent text-sm sm:text-base dark:text-white text-slate-900 placeholder:text-slate-400 border-0 outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 font-medium"
          />

          <!-- Right Checkmark Icon (matches designer's red/green check circle) -->
          <div class="pr-3 pl-2 shrink-0 flex items-center">
            <div 
              v-if="isValidEmail" 
              class="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-500 animate-in zoom-in-50 duration-200"
            >
              <Check class="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div 
              v-else-if="formData.emailAddress" 
              class="w-6 h-6 rounded-full border-2 border-[#ee2824]/60 flex items-center justify-center text-[#ee2824]"
            >
              <CheckCircle2 class="w-4 h-4 text-[#ee2824]" />
            </div>
          </div>
        </div>

        <!-- Subtext directly below input (from Designer) -->
        <p class="text-xs text-slate-500 dark:text-slate-400 px-1">
          Our support team will contact you directly through this email address.
        </p>

        <!-- Single Error Feedback under input -->
        <div v-if="displayEmailError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-600 dark:text-red-400 flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
          <span>{{ displayEmailError }}</span>
        </div>

      </div>

      <!-- Public-friendly Offline Alert (Shown only when API is down) -->
      <div v-if="isApiDown" class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 animate-in fade-in duration-200">
        <h4 class="text-sm font-bold text-slate-900 dark:text-white">
          Support Desk Temporarily Offline
        </h4>
        <p class="text-xs text-slate-600 dark:text-slate-300">
          Our support request service is currently undergoing scheduled maintenance. Please retry below or call 0915-407-7565.
        </p>
        <div class="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="btn-primary py-2 px-4 text-xs font-bold"
          >
            {{ isSubmitting ? 'Retrying...' : 'Retry Submission' }}
          </button>
          <a href="tel:09154077565" class="btn-secondary py-2 px-4 text-xs font-bold">
            0915-407-7565
          </a>
        </div>
      </div>

      <!-- Server error message banner (shown only for backend/API errors, never duplicate email validation) -->
      <div v-else-if="serverError" class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
        <AlertCircle class="w-4 h-4 shrink-0" />
        <span>{{ serverError }}</span>
      </div>

      <!-- Centered Red Submit CTA Button (Matching Designer Mockup) -->
      <div class="pt-2 flex justify-center">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="btn-primary py-3 px-12 text-sm sm:text-base font-bold min-h-12 shadow-md shadow-[#ee2824]/25 flex items-center justify-center gap-2 rounded-2xl cursor-pointer disabled:opacity-50"
        >
          <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
          <Send v-else class="w-4 h-4" />
          <span>{{ isSubmitting ? 'Submitting...' : 'Submit' }}</span>
        </button>
      </div>

    </form>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  CheckCircle2, RotateCcw, Loader2, AlertCircle, Send,
  Mail, MessageSquare, ShieldCheck, Check
} from 'lucide-vue-next'
import { useServiceOrderStore, SUCCESS_AUTO_RESET_MS } from '../stores/serviceOrder.js'

const store = useServiceOrderStore()
const {
  formData,
  isSubmitting,
  error,
  isApiDown,
  submittedTicket
} = storeToRefs(store)

const remainingSeconds = ref(0)
let countdownInterval = null

function updateCountdown() {
  if (!submittedTicket.value) {
    remainingSeconds.value = 0
    clearInterval(countdownInterval)
    countdownInterval = null
    return
  }
  const expiresAt = submittedTicket.value.expiresAt || (new Date(submittedTicket.value.submittedAt).getTime() + SUCCESS_AUTO_RESET_MS)
  const diffMs = expiresAt - Date.now()
  if (diffMs <= 0) {
    remainingSeconds.value = 0
    clearInterval(countdownInterval)
    countdownInterval = null
    store.resetForm()
  } else {
    remainingSeconds.value = Math.max(1, Math.ceil(diffMs / 1000))
  }
}

function startCountdown() {
  clearInterval(countdownInterval)
  updateCountdown()
  if (remainingSeconds.value > 0) {
    countdownInterval = setInterval(updateCountdown, 500)
  }
}

function handleManualReset() {
  clearInterval(countdownInterval)
  countdownInterval = null
  store.resetForm()
}

watch(submittedTicket, (newVal) => {
  if (newVal) {
    startCountdown()
  } else {
    clearInterval(countdownInterval)
    countdownInterval = null
    remainingSeconds.value = 0
  }
}, { immediate: true })

onMounted(() => {
  store.checkAutoReset()
  if (submittedTicket.value) {
    startCountdown()
  }
})

onUnmounted(() => {
  clearInterval(countdownInterval)
  countdownInterval = null
})

const isValidEmail = computed(() => {
  const email = (formData.value?.emailAddress || '').trim()
  if (!email) return false
  if (/^\d+$/.test(email)) return false
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
})

const emailError = computed(() => {
  const email = (formData.value?.emailAddress || '').trim()
  if (!email) return ''
  if (/^\d+$/.test(email)) {
    return 'This looks like an account or phone number. Please enter a valid email address (e.g. subscriber@gmail.com) so we can reach you.'
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return 'Please enter a valid email address (e.g. subscriber@gmail.com).'
  }
  return ''
})

const serverError = computed(() => {
  if (!error.value) return ''
  if (
    error.value.includes('email address') ||
    error.value.includes('account or phone number')
  ) {
    return ''
  }
  return error.value
})

const displayEmailError = computed(() => {
  if (emailError.value) return emailError.value
  if (
    error.value &&
    (error.value.includes('email address') || error.value.includes('account or phone number'))
  ) {
    return error.value
  }
  return ''
})

watch(() => formData.value?.emailAddress, () => {
  if (error.value) {
    error.value = null
  }
})

async function handleSubmit() {
  await store.submitConcern()
}
</script>

<style scoped>
#sf-email,
#sf-email:focus,
#sf-email:focus-visible {
  outline: none !important;
  outline-offset: 0 !important;
  box-shadow: none !important;
  border: none !important;
}
</style>
