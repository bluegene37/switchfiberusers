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
        <div class="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-500 flex items-center justify-center mx-auto">
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

    <!-- Qualifications & Document Requirements Matrix -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
      <div class="space-y-3">
        <h4 class="font-bold font-heading dark:text-white text-slate-900 text-sm flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-500" />
          <span>Agent Qualifications:</span>
        </h4>
        <ul class="space-y-1.5 list-disc list-inside">
          <li>Willing to do active field work & direct community marketing.</li>
          <li>Prior sales / telecom marketing experience is a big advantage.</li>
          <li>Willing to work flexibly during weekends and community events.</li>
          <li>Strong interpersonal and communication skills.</li>
          <li>Willing to be assigned in Binangonan, Angono, Taytay, or across Rizal.</li>
        </ul>
      </div>

      <div class="space-y-3">
        <h4 class="font-bold font-heading dark:text-white text-slate-900 text-sm flex items-center gap-2">
          <FileText class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Onboarding Document Checklist:</span>
        </h4>
        <ul class="space-y-1.5 list-disc list-inside">
          <li><strong>Updated Resume or Bio-Data</strong></li>
          <li><strong>Valid Government Issued ID</strong> (1 Primary or 2 Secondary)</li>
          <li><strong>Certificate of Residency</strong> or Lease Agreement</li>
          <li><strong>NBI Clearance</strong></li>
        </ul>
        <p class="text-[11px] dark:text-slate-400 text-slate-500 pt-1">
          You can also email your documents directly to <a :href="`mailto:${CAREERS_EMAIL}`" class="text-[#ee2824] dark:text-[#ff6b67] font-bold underline">{{ CAREERS_EMAIL }}</a> (subject: the job title) or submit them in person at our Binangonan Head Office.
        </p>
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
              <label for="careers-name" class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Full Legal Name <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
              <div class="relative">
                <input
                id="careers-name" 
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
              <label for="careers-email" class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Email Address <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
              <div class="relative">
                <input
                id="careers-email" 
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
              <label for="careers-mobile" class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Mobile Phone Number (Numeric Only) <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
              <div class="relative">
                <input
                id="careers-mobile" 
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
              <label for="careers-area" class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Primary Target Area (Rizal) <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
              <select
                id="careers-area" 
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
            <label for="careers-background" class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-1">Brief Sales Background</label>
            <textarea
                id="careers-background" 
              v-model="form.experience" 
              rows="3" 
              placeholder="e.g. Experienced real estate/telecom agent in Binangonan with 200+ clients..." 
              class="input-field"
            ></textarea>
          </div>

          <!-- Privacy consent -->
          <div
            class="sf-careers-consent p-4 rounded-2xl border space-y-2 transition-all"
            :class="touched.consent && !form.consent ? 'border-[#ee2824] bg-rose-500/10' : 'dark:border-slate-800 border-slate-200 dark:bg-slate-900/50 bg-slate-50'"
          >
            <label class="flex items-start gap-3 cursor-pointer text-xs dark:text-slate-300 text-slate-700">
              <input
                type="checkbox"
                v-model="form.consent"
                @change="touch('consent')"
                class="w-4 h-4 rounded accent-[#ee2824] mt-0.5 cursor-pointer"
              />
              <span>
                I consent to Switch Fiber collecting and using the details above to evaluate my sales agent application and to contact me about it, as described in the
                <router-link to="/privacy-policy" target="_blank" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">Privacy Policy</router-link>.
                <span class="text-[#ee2824] font-bold">*</span>
              </span>
            </label>
            <p v-if="touched.consent && !form.consent" class="text-[11px] text-[#ee2824] font-medium flex items-center gap-1">
              <AlertCircle class="w-3.5 h-3.5" />
              <span>Please tick the box so we can process your application.</span>
            </p>
          </div>

          <div class="pt-2 space-y-2">
            <button type="submit" class="btn-primary w-full py-3.5">
              <Sparkles class="w-4 h-4" />
              <span>Submit Sales Agent Application</span>
            </button>
            <p class="text-[11px] text-center dark:text-slate-500 text-slate-500">
              Submitting opens a pre-filled email to <strong>{{ CAREERS_EMAIL }}</strong> in your mail app. Send it to complete your application.
            </p>
          </div>

        </form>
      </div>

      <div v-else class="text-center py-8 space-y-4">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 class="w-10 h-10" />
        </div>
        <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900">One more step: send the email</h3>
        <p class="text-sm dark:text-slate-300 text-slate-600 max-w-md mx-auto">
          Thank you {{ form.fullName }}! Your mail app should have opened with your application pre-filled. Press <strong>Send</strong> and our Sales Agent Onboarding Team will contact you via <strong class="text-[#ee2824] dark:text-[#ff6b67]">{{ form.mobile }}</strong>.
        </p>
        <p class="text-xs dark:text-slate-400 text-slate-500 max-w-md mx-auto">
          Nothing opened? Email your details to
          <a :href="mailtoHref" class="font-bold text-[#ee2824] dark:text-[#ff6b67] underline">{{ CAREERS_EMAIL }}</a>
          or call <a href="tel:09154077565" class="font-bold text-[#ee2824] dark:text-[#ff6b67] underline">0915 407 7565</a>.
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Briefcase, DollarSign, Clock, Award, Sparkles, CheckCircle2, AlertCircle, FileText } from 'lucide-vue-next'
import { CAREERS_EMAIL } from '../data/legal'

const submitted = ref(false)

const form = reactive({
  fullName: '',
  email: '',
  mobile: '',
  municipality: 'Binangonan',
  experience: '',
  consent: false
})

// The form has no backend of its own: it hands the applicant a pre-filled
// email to the sales inbox, so nothing is silently dropped.
function buildCareersMailto(data, to = CAREERS_EMAIL) {
  const subject = `Sales Agent Application - ${(data.fullName || '').trim()}`
  const body = [
    'Sales Agent Application (switchfiber.ph/careers)',
    '',
    `Full name: ${(data.fullName || '').trim()}`,
    `Email: ${(data.email || '').trim()}`,
    `Mobile: ${(data.mobile || '').trim()}`,
    `Municipality: ${(data.municipality || '').trim()}`,
    '',
    'Sales background:',
    (data.experience || '').trim() || '(none provided)',
    '',
    'I consent to Switch Fiber processing these details for my application per the Privacy Policy.'
  ].join('\n')
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const mailtoHref = computed(() => buildCareersMailto(form))

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
  touch('consent')

  if (!isValid('fullName') || !isValid('email') || !isValid('mobile') || !isValid('municipality') || !form.consent) {
    return
  }

  window.location.href = mailtoHref.value
  submitted.value = true
}
</script>
