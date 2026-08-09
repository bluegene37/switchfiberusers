<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
    
    <!-- Header Hero -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Briefcase class="w-3.5 h-3.5" />
        <span>Join Switch Fiber Sales Partner Network</span>
      </div>
      <h1 class="text-3xl md:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        Become an Independent <span class="text-gradient-red">Sales Agent</span>
      </h1>
      <p class="dark:text-slate-400 text-slate-600 text-base max-w-2xl mx-auto">
        Earn generous commission per installed subscriber in Rizal! Work with your own schedule and help connect your community.
      </p>
    </div>

    <!-- Agent Perks -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 text-center space-y-2">
        <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
          <DollarSign class="w-6 h-6" />
        </div>
        <h3 class="font-bold font-heading dark:text-white text-slate-900">High Commissions</h3>
        <p class="text-xs dark:text-slate-400 text-slate-600">Earn per successful fiber installation with fast weekly payouts.</p>
      </div>

      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 text-center space-y-2">
        <div class="w-12 h-12 rounded-xl bg-[#ee2824]/10 border border-[#ee2824]/30 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center mx-auto">
          <Clock class="w-6 h-6" />
        </div>
        <h3 class="font-bold font-heading dark:text-white text-slate-900">Flexible Work</h3>
        <p class="text-xs dark:text-slate-400 text-slate-600">Work full-time or part-time in your own barangay or neighborhood.</p>
      </div>

      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 text-center space-y-2">
        <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto">
          <Award class="w-6 h-6" />
        </div>
        <h3 class="font-bold font-heading dark:text-white text-slate-900">Sales Kit & Training</h3>
        <p class="text-xs dark:text-slate-400 text-slate-600">Get free marketing flyers, digital banners, and sales guidance.</p>
      </div>
    </div>

    <!-- Agent Application Form -->
    <div class="glass-panel p-6 md:p-10 rounded-3xl border border-[#ee2824]/30 space-y-6">
      
      <div v-if="!submitted">
        <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900 mb-2">Sales Agent Online Registration</h2>
        <p class="text-xs dark:text-slate-400 text-slate-600 mb-6">Fill out your details to receive your official Switch Fiber Agent Portal login.</p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Full Name -->
            <div>
              <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Full Legal Name <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
              <div class="relative">
                <input 
                  v-model="form.fullName" 
                  @blur="touch('fullName')"
                  type="text" 
                  placeholder="e.g. Maria Santos" 
                  class="input-field" 
                  :class="getStatusClass('fullName')"
                  required 
                />
                <CheckCircle2 v-if="isValid('fullName')" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <AlertCircle v-if="isInvalid('fullName')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p v-if="isInvalid('fullName')" class="text-[11px] text-[#ee2824] mt-1 font-medium">Please enter your full legal name.</p>
            </div>

            <!-- Email Address -->
            <div>
              <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Email Address <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
              <div class="relative">
                <input 
                  v-model="form.email" 
                  @blur="touch('email')"
                  type="email" 
                  placeholder="e.g. maria@example.com" 
                  class="input-field" 
                  :class="getStatusClass('email')"
                  required 
                />
                <CheckCircle2 v-if="isValid('email')" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <AlertCircle v-if="isInvalid('email')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p v-if="isInvalid('email')" class="text-[11px] text-[#ee2824] mt-1 font-medium">Please enter a valid email address.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Mobile Number -->
            <div>
              <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Mobile Phone Number (Numeric Only) <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
              <div class="relative">
                <input 
                  v-model="form.mobile" 
                  @input="onMobileInput"
                  @blur="touch('mobile')"
                  type="tel" 
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="11"
                  placeholder="e.g. 09171234567" 
                  class="input-field font-mono" 
                  :class="getStatusClass('mobile')"
                  required 
                />
                <CheckCircle2 v-if="isValid('mobile')" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                <AlertCircle v-if="isInvalid('mobile')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              <p v-if="isInvalid('mobile')" class="text-[11px] text-[#ee2824] mt-1 font-medium">Enter a valid 11-digit numeric mobile number.</p>
            </div>

            <!-- Target Service Municipality -->
            <div>
              <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Primary Target Area (Rizal) <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
              <select 
                v-model="form.municipality" 
                @blur="touch('municipality')"
                class="input-field"
                :class="getStatusClass('municipality')"
                required
              >
                <option value="Binangonan">Binangonan</option>
                <option value="Angono">Angono</option>
                <option value="Taytay">Taytay</option>
                <option value="Teresa">Teresa</option>
                <option value="Cardona">Cardona</option>
                <option value="Morong">Morong</option>
                <option value="Baras">Baras</option>
                <option value="Tanay">Tanay</option>
                <option value="Antipolo">Antipolo City</option>
              </select>
            </div>
          </div>

          <!-- Sales Experience / Pitch -->
          <div>
            <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Brief Sales Background</label>
            <textarea 
              v-model="form.experience" 
              rows="3" 
              placeholder="e.g. Experienced real estate/telecom agent in Binangonan with 200+ clients..." 
              class="input-field"
            ></textarea>
          </div>

          <div class="pt-4">
            <button type="submit" class="btn-primary w-full py-3.5">
              <Sparkles class="w-4 h-4" />
              <span>Submit Sales Agent Application</span>
            </button>
          </div>

        </form>
      </div>

      <div v-else class="text-center py-8 space-y-4">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Application Submitted!</h3>
        <p class="text-sm dark:text-slate-300 text-slate-600 max-w-md mx-auto">
          Thank you {{ form.fullName }}! Our Sales Agent Onboarding Team will review your application and contact you via <strong class="text-[#ee2824] dark:text-[#ff6b67]">{{ form.mobile }}</strong>.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Briefcase, DollarSign, Clock, Award, Sparkles, CheckCircle2, AlertCircle } from 'lucide-vue-next'

const submitted = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  mobile: '',
  municipality: 'Binangonan',
  experience: ''
})

const touched = reactive({})

function touch(key) {
  touched[key] = true
}

function onMobileInput() {
  form.mobile = (form.mobile || '').replace(/\D/g, '').slice(0, 11)
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phMobileRegex = /^09\d{9}$/

function isValid(key) {
  if (!touched[key]) return false
  const val = (form[key] || '').trim()
  if (key === 'fullName') return val.length >= 2
  if (key === 'email') return emailRegex.test(val)
  if (key === 'mobile') return phMobileRegex.test(val) || (val.length === 11 && /^\d+$/.test(val))
  if (key === 'municipality') return val.length > 0
  return true
}

function isInvalid(key) {
  if (!touched[key]) return false
  return !isValid(key)
}

function getStatusClass(key) {
  if (!touched[key]) return ''
  return isValid(key) 
    ? '!border-emerald-500 focus:!ring-emerald-500/20' 
    : '!border-[#ee2824] !shadow-sm !shadow-[#ee2824]/20'
}

function handleSubmit() {
  touch('fullName')
  touch('email')
  touch('mobile')
  touch('municipality')

  if (!isValid('fullName') || !isValid('email') || !isValid('mobile') || !isValid('municipality')) {
    return
  }

  submitted.value = true
}
</script>
