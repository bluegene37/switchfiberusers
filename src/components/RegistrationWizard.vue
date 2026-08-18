<template>
  <div class="glass-panel p-6 md:p-10 rounded-3xl max-w-4xl mx-auto border border-[#ee2824]/30 shadow-2xl relative transition-colors duration-300">
    
    <!-- Toast Notification for Copying Code -->
    <div v-if="showCopyToast" class="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
      <CheckCircle2 class="w-5 h-5" />
      <span class="text-xs font-bold">Reference code copied to clipboard!</span>
    </div>

    <!-- Header Title -->
    <div class="text-center space-y-2 mb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Official Switch Fiber Online Registration</span>
      </div>
      <h2 class="text-3xl md:text-4xl font-extrabold font-heading dark:text-white text-slate-900">Client Fiber Application Portal</h2>
      <p class="dark:text-slate-400 text-slate-600 text-sm max-w-xl mx-auto">
        Complete your details in 5 quick steps to apply for high-speed fiber internet in Rizal!
      </p>
    </div>

    <!-- Step Progress Tracker Bar -->
    <div class="mb-10">
      <div class="flex items-center justify-between relative z-10">
        <div 
          v-for="step in 5" 
          :key="step" 
          class="flex flex-col items-center gap-2 cursor-pointer"
          @click="step < currentStep && !submittedCode ? registrationStore.currentStep = step : null"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border"
            :class="[
              currentStep === step && !submittedCode ? 'bg-[#ee2824] text-white border-red-400 shadow-lg shadow-[#ee2824]/50 scale-110' :
              currentStep > step || (step === 5 && submittedCode) ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30' :
              'dark:bg-slate-900 bg-slate-200 dark:text-slate-500 text-slate-400 dark:border-slate-800 border-slate-300'
            ]"
          >
            <Check v-if="currentStep > step || (step === 5 && submittedCode)" class="w-5 h-5 stroke-[3]" />
            <span v-else>{{ step }}</span>
          </div>
          <span 
            class="text-[11px] font-semibold hidden md:block"
            :class="currentStep >= step || (step === 5 && submittedCode) ? 'dark:text-slate-200 text-slate-800 font-bold' : 'dark:text-slate-600 text-slate-400'"
          >
            {{ stepLabels[step - 1] }}
          </span>
        </div>
      </div>
      
      <!-- Connecting Line -->
      <div class="relative -mt-7 mx-5 h-1 dark:bg-slate-800 bg-slate-200 rounded-full -z-0">
        <div 
          class="h-full bg-gradient-to-r from-[#ee2824] to-emerald-400 rounded-full transition-all duration-300"
          :style="{ width: `${submittedCode ? 100 : (currentStep - 1) * 25}%` }"
        ></div>
      </div>
    </div>

    <!-- STEP 1: Personal Information -->
    <div v-if="currentStep === 1 && !submittedCode" class="space-y-6 animate-in fade-in duration-300">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
        <h3 class="text-lg sm:text-xl font-bold font-heading dark:text-white text-slate-900 flex items-start sm:items-center gap-2">
          <User class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67] shrink-0 mt-1 sm:mt-0" />
          <span>Step 1: Applicant Personal Information</span>
        </h3>
        <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1 w-fit shrink-0 whitespace-nowrap">
          <Zap class="w-3.5 h-3.5 shrink-0" />
          <span>Service Feasibility Verified</span>
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- First Name -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">First Name <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <div class="relative">
            <input 
              v-model="formData.firstName" 
              @blur="touchField('firstName')"
              type="text" 
              placeholder="e.g. Juan" 
              class="input-field" 
              :class="getFieldStatusClass('firstName')"
              required
            />
            <CheckCircle2 v-if="isFieldValid('firstName')" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <AlertCircle v-if="isFieldInvalid('firstName')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p v-if="isFieldInvalid('firstName')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            First name is required (min 2 letters).
          </p>
        </div>

        <!-- Middle Name -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Middle Name</label>
          <input 
            v-model="formData.middleName" 
            type="text" 
            placeholder="e.g. Santos (Optional)" 
            class="input-field" 
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Last Name <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <div class="relative">
            <input 
              v-model="formData.lastName" 
              @blur="touchField('lastName')"
              type="text" 
              placeholder="e.g. Dela Cruz" 
              class="input-field" 
              :class="getFieldStatusClass('lastName')"
              required
            />
            <CheckCircle2 v-if="isFieldValid('lastName')" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <AlertCircle v-if="isFieldInvalid('lastName')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p v-if="isFieldInvalid('lastName')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            Last name is required (min 2 letters).
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Email Address -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Active Email Address <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <div class="relative">
            <input 
              v-model="formData.emailAddress" 
              @blur="touchField('emailAddress')"
              type="email" 
              placeholder="e.g. juan@example.com" 
              class="input-field" 
              :class="getFieldStatusClass('emailAddress')"
              required
            />
            <CheckCircle2 v-if="isFieldValid('emailAddress')" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <AlertCircle v-if="isFieldInvalid('emailAddress')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p v-if="isFieldInvalid('emailAddress')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            Please enter a valid email address (e.g. juan@example.com).
          </p>
          <span v-else class="text-[11px] dark:text-slate-500 text-slate-500 mt-1 block">Statement of Account (SOA) will be sent here.</span>
        </div>

        <!-- Mobile Number -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Active Mobile Number (Numeric Only) <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <div class="relative">
            <input 
              v-model="formData.mobileNumber" 
              @input="onMobileInput('mobileNumber')"
              @blur="touchField('mobileNumber')"
              type="tel" 
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="11"
              placeholder="e.g. 09171234567" 
              class="input-field font-mono" 
              :class="getFieldStatusClass('mobileNumber')"
              required
            />
            <CheckCircle2 v-if="isFieldValid('mobileNumber')" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <AlertCircle v-if="isFieldInvalid('mobileNumber')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p v-if="isFieldInvalid('mobileNumber')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            Enter a valid 11-digit numeric mobile number (e.g. 09171234567).
          </p>
          <span v-else class="text-[11px] dark:text-slate-500 text-slate-500 mt-1 block">Numbers only. For installation dispatch SMS updates.</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Secondary Mobile -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Secondary Mobile Number (Numeric Only)</label>
          <div class="relative">
            <input 
              v-model="formData.secondaryMobileNumber" 
              @input="onMobileInput('secondaryMobileNumber')"
              @blur="touchField('secondaryMobileNumber')"
              type="tel" 
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="11"
              placeholder="e.g. 09151234567" 
              class="input-field font-mono" 
              :class="getFieldStatusClass('secondaryMobileNumber')"
            />
            <AlertCircle v-if="isFieldInvalid('secondaryMobileNumber')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p v-if="isFieldInvalid('secondaryMobileNumber')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            Secondary mobile must be a valid 11-digit numeric number.
          </p>
        </div>

        <!-- Referred By — same agent list as the official application form -->
        <div>
          <label for="referred-by" class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">
            Referred By (Sales Agent)
          </label>
          <select id="referred-by" v-model="formData.referredBy" class="input-field">
            <option value="">Choose</option>
            <option v-for="name in referrersList" :key="name" :value="name">{{ name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- STEP 2: Address & Location -->
    <div v-if="currentStep === 2 && !submittedCode" class="space-y-6 animate-in fade-in duration-300">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
        <h3 class="text-lg sm:text-xl font-bold font-heading dark:text-white text-slate-900 flex items-start sm:items-center gap-2">
          <MapPin class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67] shrink-0 mt-1 sm:mt-0" />
          <span>Step 2: Installation Address & Service Area</span>
        </h3>

        <div class="flex items-center gap-2">
          <!-- Interactive Map Picker Button -->
          <button 
            @click="isMapModalOpen = true" 
            type="button" 
            class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <MapPin class="w-3.5 h-3.5" />
            <span>Pin on Interactive Map</span>
          </button>

          <!-- GPS Location Shortcut Button with Live Geocoding -->
          <button 
            @click="useCurrentLocation" 
            type="button" 
            :disabled="isLocating"
            class="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/30 hover:bg-[#ee2824]/20 transition-all flex items-center gap-1.5 disabled:opacity-60"
          >
            <RotateCw v-if="isLocating" class="w-3.5 h-3.5 animate-spin" />
            <Navigation v-else class="w-3.5 h-3.5" />
            <span>{{ isLocating ? 'Acquiring GPS...' : 'Use My Current Location' }}</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Region -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Region <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <select 
            v-model="formData.region" 
            @blur="touchField('region')"
            class="input-field"
            :class="getFieldStatusClass('region')"
          >
            <option v-for="reg in regionsList" :key="reg" :value="reg">{{ reg }}</option>
          </select>
          <p v-if="isFieldInvalid('region')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            Region selection is required.
          </p>
        </div>

        <!-- City -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">City / Town <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <select 
            v-model="formData.city" 
            @blur="touchField('city')"
            class="input-field"
            :class="getFieldStatusClass('city')"
          >
            <option v-for="c in citiesList" :key="c" :value="c">{{ c }}</option>
          </select>
          <p v-if="isFieldInvalid('city')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            City selection is required.
          </p>
        </div>

        <!-- Barangay -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Barangay <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <select 
            v-model="formData.barangay" 
            @blur="touchField('barangay')"
            class="input-field"
            :class="getFieldStatusClass('barangay')"
          >
            <option value="" disabled>Choose Barangay</option>
            <option v-for="b in barangaysList" :key="b" :value="b">{{ b }} (Fiber Active)</option>
          </select>
          <p v-if="isFieldInvalid('barangay')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            Barangay selection is required.
          </p>
        </div>
      </div>

      <!-- Installation Address -->
      <div>
        <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Detailed Installation Address <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
        <div class="relative">
          <textarea 
            v-model="formData.installationAddress" 
            @blur="touchField('installationAddress')"
            rows="2"
            placeholder="e.g. House No. 123, Block 5 Lot 12 Sunshine Village, National Road" 
            class="input-field" 
            :class="getFieldStatusClass('installationAddress')"
            required
          ></textarea>
        </div>
        <p v-if="isFieldInvalid('installationAddress')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
          Detailed installation address is required (e.g. House No., Street Name, Village).
        </p>
      </div>

      <!-- Landmark -->
      <div>
        <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Nearest Text Landmark</label>
        <input 
          v-model="formData.landmark" 
          type="text" 
          placeholder="e.g. Beside Barangay Hall / Near Water Refilling Station" 
          class="input-field" 
        />
      </div>
    </div>

    <!-- STEP 3: Plan Selection -->
    <div v-if="currentStep === 3 && !submittedCode" class="space-y-6 animate-in fade-in duration-300">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b dark:border-slate-800 border-slate-200 pb-3">
        <div>
          <h3 class="text-lg sm:text-xl font-bold font-heading dark:text-white text-slate-900 flex items-center gap-2">
            <Wifi class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67] shrink-0" />
            <span>Step 3: Select Desired Internet Plan</span>
          </h3>
          <p class="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
            Choose a plan below. Live rates and features are synced dynamically.
          </p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <!-- Refresh Live API Plans button -->
          <button
            @click="registrationStore.fetchPlans(true)"
            type="button"
            :disabled="isLoadingPlans"
            class="px-2.5 py-1.5 rounded-xl text-xs font-semibold dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700 hover:text-[#ee2824] dark:hover:text-[#ff6b67] transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Refresh plans from API"
          >
            <RotateCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoadingPlans }" />
            <span class="hidden sm:inline">Refresh</span>
          </button>

          <!-- Compare All Plans Side-by-Side Modal -->
          <button
            @click="isCompareModalOpen = true"
            type="button"
            :disabled="!availablePlans.length"
            class="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/30 hover:bg-[#ee2824]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <SlidersHorizontal class="w-3.5 h-3.5" />
            <span class="sm:hidden">Compare</span>
            <span class="hidden sm:inline">Compare All Side-by-Side</span>
          </button>
        </div>
      </div>

      <!-- Plan Category Filter Pills & Live Status -->
      <div v-if="availablePlans.length > 0" class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
        <div class="inline-flex p-1 rounded-xl dark:bg-slate-900 bg-slate-100 border dark:border-slate-800 border-slate-200 text-xs font-semibold">
          <button
            v-for="tab in planTierTabs"
            :key="tab.id"
            type="button"
            @click="selectedTierFilter = tab.id"
            class="px-3 py-1.5 rounded-lg transition-all"
            :class="selectedTierFilter === tab.id
              ? 'bg-[#ee2824] text-white shadow-sm font-bold'
              : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="text-[11px] flex items-center gap-1.5 dark:text-slate-400 text-slate-500">
          <span v-if="isLoadingPlans" class="inline-flex items-center gap-1 text-amber-500 font-medium">
            <RotateCw class="w-3 h-3 animate-spin" /> Syncing live plans...
          </span>
          <span v-else-if="plansError" class="inline-flex items-center gap-1 text-amber-500 font-medium">
            <AlertCircle class="w-3 h-3" /> Using cached rates
          </span>
          <span v-else class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ availablePlans.length }} Active Plans Available
          </span>
        </div>
      </div>

      <!-- Loading skeletons while the live plan list is being fetched -->
      <div v-if="isLoadingPlans && !availablePlans.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="n in 3" :key="n" class="p-5 rounded-2xl border dark:border-slate-800 border-slate-200 animate-pulse space-y-3">
          <div class="h-4 w-2/3 rounded dark:bg-slate-800 bg-slate-200"></div>
          <div class="h-8 w-1/2 rounded dark:bg-slate-800 bg-slate-200"></div>
          <div class="h-3 w-3/4 rounded dark:bg-slate-800 bg-slate-200"></div>
          <div class="h-3 w-1/2 rounded dark:bg-slate-800 bg-slate-200"></div>
        </div>
      </div>

      <!-- No plans available error state -->
      <div v-else-if="!availablePlans.length" class="p-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-center space-y-3">
        <AlertCircle class="w-8 h-8 text-amber-500 mx-auto" />
        <p class="text-sm font-bold dark:text-white text-slate-900">We couldn't load the plan list</p>
        <p class="text-xs dark:text-slate-300 text-slate-600">
          Please retry, or call
          <a href="tel:09154077565" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">0915 407 7565</a>
          and we'll take your application over the phone.
        </p>
        <button type="button" @click="registrationStore.fetchPlans(true)" class="btn-secondary text-xs mx-auto">
          Retry Sync
        </button>
      </div>

      <template v-else>
        <!-- Stale-pricing notice when API failed and cached plans are shown -->
        <div v-if="plansError" class="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2">
            <AlertCircle class="w-4 h-4 text-amber-500 shrink-0" />
            <span class="dark:text-slate-300 text-slate-700">
              Showing cached pricing — rates will be re-verified upon submission.
            </span>
          </div>
          <button @click="registrationStore.fetchPlans(true)" type="button" class="font-bold text-[#ee2824] dark:text-[#ff6b67] underline shrink-0">
            Retry
          </button>
        </div>

        <!-- Dynamic Plan Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="plan in filteredPlans"
            :key="plan.id"
            type="button"
            @click="registrationStore.selectPlan(plan)"
            :aria-pressed="isPlanSelected(plan)"
            class="p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between text-left w-full group"
            :class="isPlanSelected(plan) 
              ? 'bg-[#ee2824]/10 border-[#ee2824] shadow-xl shadow-[#ee2824]/20 ring-2 ring-[#ee2824]/30' 
              : 'dark:bg-slate-900/80 bg-white dark:border-slate-800 border-slate-200 hover:border-[#ee2824]/50 hover:shadow-md'"
          >
            <!-- Badge -->
            <div v-if="plan.recommended || plan.tag" class="absolute -top-2.5 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md"
              :class="plan.recommended ? 'bg-[#ee2824] text-white' : 'dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300'"
            >
              {{ plan.tag || (plan.recommended ? 'Popular' : 'Fiber') }}
            </div>

            <div>
              <h4 class="font-bold dark:text-white text-slate-900 text-base mb-1 pr-16 group-hover:text-[#ee2824] dark:group-hover:text-[#ff6b67] transition-colors">
                {{ plan.title }}
              </h4>
              <div class="text-2xl sm:text-3xl font-extrabold font-heading text-[#ee2824] dark:text-[#ff6b67]">
                ₱{{ plan.price }}<span class="text-xs font-normal dark:text-slate-400 text-slate-500">/mo</span>
              </div>
              <div class="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold my-2 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <Zap class="w-3 h-3" />
                <span>{{ plan.speed }}</span>
              </div>
              <div class="space-y-1 text-[11px] dark:text-slate-400 text-slate-600 mt-1">
                <div class="flex items-center gap-1.5">
                  <span class="font-medium">• {{ plan.lockIn }}</span>
                  <span>•</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ plan.dataCap }}</span>
                </div>
                <div class="truncate">• {{ plan.router }}</div>
                <div v-if="plan.mesh && plan.mesh !== 'Optional Add-on'" class="text-emerald-600 dark:text-emerald-400 font-medium truncate">• Free {{ plan.mesh }}</div>
              </div>
            </div>

            <div 
              class="mt-4 pt-3 border-t dark:border-slate-800/80 border-slate-200 flex items-center justify-between text-xs font-bold" 
              :class="isPlanSelected(plan) ? 'text-[#ee2824] dark:text-[#ff6b67]' : 'dark:text-slate-400 text-slate-500 group-hover:text-[#ee2824]'"
            >
              <span>{{ isPlanSelected(plan) ? '✓ Active Selection' : 'Select Plan' }}</span>
              <CheckCircle2 v-if="isPlanSelected(plan)" class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
              <ArrowRight v-else class="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </template>

      <!-- Selected Plan Readout & Promo Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Desired Plan Selection</label>
          <div class="relative">
            <input v-model="formData.desiredPlan" type="text" readonly class="input-field font-bold text-[#ee2824] dark:text-[#ff6b67] bg-slate-50 dark:bg-slate-900/60" />
            <CheckCircle2 v-if="formData.desiredPlan" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">
            Applicable Promo
          </label>
          <div class="input-field flex items-center gap-2 cursor-default dark:!bg-slate-900/60 !bg-slate-100 dark:!text-slate-200 !text-slate-700">
            <Gift class="w-4 h-4 text-emerald-500 shrink-0" />
            <span class="font-semibold truncate">{{ formData.applicablePromo || derivedPromo }}</span>
          </div>
          <p class="text-[11px] dark:text-slate-400 text-slate-500 mt-1">
            Included automatically with your selected plan.
          </p>
        </div>
      </div>
    </div>

    <!-- STEP 4: Document & Landmark Photo Uploads -->
    <div v-if="currentStep === 4 && !submittedCode" class="space-y-6 animate-in fade-in duration-300">
      <h3 class="text-lg sm:text-xl font-bold font-heading dark:text-white text-slate-900 flex items-start sm:items-center gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
        <UploadCloud class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67] shrink-0 mt-1 sm:mt-0" />
        <span>Step 4: Required Documents & Photo Uploads</span>
      </h3>

      <p class="text-xs dark:text-slate-400 text-slate-600">
        Upload clear photos or document files (JPG, PNG, WEBP, or PDF format). You can also click the camera icon to snap a photo directly!
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- 1. House Front Picture (FULL WIDTH DROPZONE) -->
        <div class="glass-card p-5 rounded-2xl border space-y-3 md:col-span-2" :class="getFieldStatusClass('houseFrontPicture')">
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">1. House Front Picture <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <DropzoneUploader 
            v-model="formData.houseFrontPicture" 
            v-model:fileName="formData.houseFrontName"
            :error="isFieldInvalid('houseFrontPicture')"
            @change="touchField('houseFrontPicture')"
          />
          <p v-if="isFieldInvalid('houseFrontPicture')" class="text-[11px] text-[#ee2824] font-medium">
            House front picture is required for installation dispatch.
          </p>
        </div>

        <!-- 2. 1st Government Valid ID -->
        <div class="glass-card p-5 rounded-2xl border space-y-3" :class="getFieldStatusClass('governmentValidId')">
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">
            2. Primary Government ID <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span>
          </label>
          <p class="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">
            Any valid government-issued ID. Make sure the photo is clear — not blurry and not cropped.
          </p>
          <DropzoneUploader 
            v-model="formData.governmentValidId" 
            v-model:fileName="formData.governmentValidIdName"
            :error="isFieldInvalid('governmentValidId')"
            @change="touchField('governmentValidId')"
          />
          <p v-if="isFieldInvalid('governmentValidId')" class="text-[11px] text-[#ee2824] font-medium">
            Primary government ID is required.
          </p>
        </div>

        <!-- 3. 2nd Government Valid ID -->
        <div class="glass-card p-5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">
            3. 2nd Government ID (Optional)
          </label>
          <p class="text-[11px] dark:text-slate-400 text-slate-500 leading-relaxed">
            Optional second ID if you have one handy.
          </p>
          <DropzoneUploader 
            v-model="formData.secondGovernmentValidId"
            optional
            v-model:fileName="formData.secondGovernmentValidIdName"
            @change="touchField('secondGovernmentValidId')"
          />
        </div>

        <!-- 4. 1st Nearest Landmark Photo -->
        <div class="glass-card p-5 rounded-2xl border space-y-3" :class="getFieldStatusClass('firstNearestLandmark')">
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">4. First Nearest Landmark Photo <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold ml-0.5">*</span></label>
          <DropzoneUploader 
            v-model="formData.firstNearestLandmark"
            v-model:fileName="formData.firstNearestLandmarkName"
            :error="isFieldInvalid('firstNearestLandmark')"
            @change="touchField('firstNearestLandmark')"
          />
          <p v-if="isFieldInvalid('firstNearestLandmark')" class="text-[11px] text-[#ee2824] font-medium">
            First nearest landmark photo is required for installation dispatch.
          </p>
        </div>

        <!-- 5. 2nd Nearest Landmark Photo -->
        <div class="glass-card p-5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">5. Second Nearest Landmark Photo</label>
          <DropzoneUploader 
            v-model="formData.secondNearestLandmark"
            optional
            v-model:fileName="formData.secondNearestLandmarkName"
            @change="touchField('secondNearestLandmark')"
          />
        </div>

      </div>
    </div>

    <!-- STEP 5: Review, Terms & API Submission -->
    <div v-if="currentStep === 5 || submittedCode" class="space-y-6 animate-in fade-in duration-300">
      <div v-if="!submittedCode">
        <h3 class="text-lg sm:text-xl font-bold font-heading dark:text-white text-slate-900 flex items-start sm:items-center gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
          <FileText class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67] shrink-0 mt-1 sm:mt-0" />
          <span>Step 5: Final Review & Digital Signature</span>
        </h3>

        <!-- Summary Review Box -->
        <div class="p-5 rounded-2xl dark:bg-slate-900/90 bg-slate-100 border dark:border-slate-800 border-slate-200 space-y-4">
          <!-- Applicant & Installation Address Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b dark:border-slate-800 border-slate-300 pb-3">
            <div>
              <span class="dark:text-slate-500 text-slate-500 uppercase block font-semibold mb-0.5">Applicant Full Name:</span>
              <span class="font-bold dark:text-slate-200 text-slate-900 text-sm">{{ formData.firstName }} {{ formData.middleName }} {{ formData.lastName }}</span>
              <span class="block dark:text-slate-400 text-slate-600 mt-0.5">{{ formData.emailAddress }} | {{ formData.mobileNumber }}</span>
            </div>
            <div>
              <span class="dark:text-slate-500 text-slate-500 uppercase block font-semibold mb-0.5">Installation Address:</span>
              <span class="font-bold dark:text-slate-200 text-slate-900 text-sm">{{ formData.barangay }}, {{ formData.city }}, {{ formData.region }}</span>
              <span class="block dark:text-slate-400 text-slate-600 mt-0.5">{{ formData.installationAddress }}</span>
            </div>
          </div>

          <!-- Dynamic Plan Details Box & Primary ID Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-3.5 rounded-xl dark:bg-slate-950/80 bg-white border dark:border-slate-800 border-slate-200 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="dark:text-slate-500 text-slate-500 uppercase font-semibold text-[11px]">Selected Fiber Plan</span>
                <button @click="registrationStore.currentStep = 3" type="button" class="text-[11px] font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">
                  Change Plan
                </button>
              </div>
              <div class="text-base font-extrabold text-[#ee2824] dark:text-[#ff6b67]">
                {{ formData.desiredPlan }}
              </div>
              <div class="flex flex-wrap items-center gap-2 text-[11px] dark:text-slate-400 text-slate-600 pt-0.5">
                <span v-if="selectedPlanDetails?.speed" class="font-semibold text-emerald-600 dark:text-emerald-400">{{ selectedPlanDetails.speed }}</span>
                <span v-if="selectedPlanDetails?.router">• {{ selectedPlanDetails.router }}</span>
                <span v-if="selectedPlanDetails?.lockIn">• {{ selectedPlanDetails.lockIn }}</span>
              </div>
              <div v-if="formData.applicablePromo" class="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Promo: {{ formData.applicablePromo }}
              </div>
            </div>

            <div class="p-3.5 rounded-xl dark:bg-slate-950/80 bg-white border dark:border-slate-800 border-slate-200 space-y-1.5 flex flex-col justify-between">
              <div>
                <span class="dark:text-slate-500 text-slate-500 uppercase font-semibold text-[11px] block mb-1">Government ID</span>
                <span class="text-[11px] dark:text-slate-400 text-slate-500 block truncate">{{ formData.governmentValidIdName || 'Photo Attached' }}</span>
              </div>
              <div v-if="formData.secondGovernmentValidId" class="text-[11px] dark:text-slate-400 text-slate-500 border-t dark:border-slate-800 border-slate-100 pt-1">
                2nd ID: {{ formData.secondGovernmentValidIdName || 'Attached' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Validation Error Alert Banner -->
        <div v-if="submissionError" class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-500 text-xs font-semibold flex items-start gap-3 animate-in shake duration-300">
          <AlertCircle class="w-5 h-5 shrink-0 mt-0.5" />
          <div class="space-y-1">
            <h4 class="font-bold text-sm">Application Cannot Be Submitted Yet</h4>
            <p>{{ submissionError }}</p>
          </div>
        </div>

        <!-- Terms Agreement Checkbox & Read Terms Modal Link -->
        <div 
          class="p-4 rounded-2xl border space-y-3 transition-all"
          :class="[
            touched['termsAndConditionsAgreement'] && !formData.termsAndConditionsAgreement 
              ? 'border-[#ee2824] bg-rose-500/10 ring-2 ring-[#ee2824]/20' 
              : 'dark:border-slate-800 border-slate-200 dark:bg-slate-900/50 bg-slate-50'
          ]"
        >
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label class="flex items-start gap-3 cursor-pointer text-xs dark:text-slate-300 text-slate-700">
              <input 
                type="checkbox" 
                v-model="formData.termsAndConditionsAgreement" 
                @change="touchField('termsAndConditionsAgreement'); submissionError = ''"
                class="w-4 h-4 rounded accent-[#ee2824] mt-0.5 cursor-pointer" 
              />
              <span>I agree to the Terms & Conditions of Switch Fiber and confirm that all information provided is true and correct. <span class="text-[#ee2824] font-bold">*</span></span>
            </label>

            <button 
              @click="isTermsModalOpen = true" 
              type="button" 
              class="text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline shrink-0 sm:ml-4"
            >
              Read Terms & Conditions
            </button>
          </div>
          <p v-if="touched['termsAndConditionsAgreement'] && !formData.termsAndConditionsAgreement" class="text-[11px] text-[#ee2824] font-medium flex items-center gap-1">
            <AlertCircle class="w-3.5 h-3.5" />
            <span>You must agree to the Terms & Conditions to proceed.</span>
          </p>
        </div>
      </div>

      <!-- SUCCESS CONFIRMATION SCREEN -->
      <div v-else class="text-center space-y-6 py-6 animate-in zoom-in-95 duration-300">
        <div class="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
          <CheckCircle2 class="w-12 h-12" />
        </div>

        <div class="space-y-2">
          <span class="badge-neon">Application Submitted Successfully!</span>
          <h3 class="text-3xl font-extrabold font-heading dark:text-white text-slate-900">Welcome to Switch Fiber!</h3>
          <p class="dark:text-slate-300 text-slate-600 text-sm max-w-md mx-auto">
            Your internet application has been transmitted successfully to our dispatch system.
          </p>
        </div>

        <!-- Tracking Code Card -->
        <div class="p-6 rounded-2xl dark:bg-slate-900 bg-white border border-[#ee2824]/40 max-w-md mx-auto space-y-3 shadow-2xl">
          <span class="text-xs dark:text-slate-400 text-slate-500 uppercase tracking-widest block">Application Reference Code</span>
          <div class="flex items-center justify-center gap-2">
            <div class="text-3xl font-extrabold font-mono text-[#ee2824] dark:text-[#ff6b67] tracking-wider">
              {{ submittedCode }}
            </div>
            <button 
              @click="copyCode" 
              type="button"
              class="p-2 rounded-xl bg-[#ee2824]/10 text-[#ee2824] hover:bg-[#ee2824]/20 transition-colors"
              title="Copy Reference Code"
            >
              <Copy class="w-5 h-5" />
            </button>
          </div>
          <p class="text-[11px] dark:text-slate-500 text-slate-500">Save this reference code to check your real-time installation dispatch status.</p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
          <router-link :to="`/status?code=${submittedCode}`" class="btn-primary w-full sm:w-auto">
            <Search class="w-4 h-4" />
            <span>Track Application Status</span>
          </router-link>
          
          <button @click="printReceipt" class="btn-secondary w-full sm:w-auto">
            <Printer class="w-4 h-4" />
            <span>Print Application Summary</span>
          </button>

          <button @click="resetWizard" class="btn-secondary w-full sm:w-auto">
            <RotateCcw class="w-4 h-4" />
            <span>Submit Another Application</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation Footer Controls -->
    <div v-if="!submittedCode" class="mt-8 pt-6 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between">
      <button 
        v-if="currentStep > 1" 
        @click="registrationStore.prevStep()" 
        class="btn-secondary text-xs"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Previous</span>
      </button>
      <div v-else></div>

      <button 
        v-if="currentStep < 5" 
        @click="handleNextStep" 
        class="btn-primary text-xs"
      >
        <span>Next Step</span>
        <ArrowRight class="w-4 h-4" />
      </button>

      <button 
        v-else 
        @click="handleSubmit" 
        class="btn-primary text-xs bg-emerald-600 hover:bg-emerald-500"
        :disabled="isSubmitting"
      >
        <RotateCw v-if="isSubmitting" class="w-4 h-4 animate-spin" />
        <Sparkles v-else class="w-4 h-4" />
        <span>{{ isSubmitting ? 'Submitting Application...' : 'Submit Application' }}</span>
      </button>
    </div>

    <!-- Modals -->
    <TermsModal 
      :isOpen="isTermsModalOpen" 
      @close="isTermsModalOpen = false" 
      @accept="formData.termsAndConditionsAgreement = true"
    />

    <PlanCompareModal 
      :isOpen="isCompareModalOpen" 
      :plans="availablePlans" 
      :selectedPlanId="formData.selectedPlanId"
      @close="isCompareModalOpen = false" 
      @select="registrationStore.selectPlan"
    />

    <MapLocationPicker 
      :isOpen="isMapModalOpen" 
      :barangaysList="barangaysList"
      @close="isMapModalOpen = false" 
      @confirm="handleMapConfirm"
    />

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import confetti from 'canvas-confetti'
import { 
  Sparkles, Check, User, MapPin, Wifi, FileText, 
  UploadCloud, CheckCircle2, AlertCircle, Search, ArrowLeft, ArrowRight, 
  RotateCw, RotateCcw, SlidersHorizontal, Navigation, Copy, Printer, Zap, Gift} from 'lucide-vue-next'
import { useRegistrationStore } from '../stores/registration'
import DropzoneUploader from './DropzoneUploader.vue'
import TermsModal from './TermsModal.vue'
import PlanCompareModal from './PlanCompareModal.vue'
import MapLocationPicker from './MapLocationPicker.vue'

const route = useRoute()
const registrationStore = useRegistrationStore()
const currentStep = computed(() => registrationStore.currentStep)
const formData = computed(() => registrationStore.formData)
const availablePlans = computed(() => registrationStore.availablePlans)
const regionsList = computed(() => registrationStore.regionsList)
const citiesList = computed(() => registrationStore.citiesList)
const barangaysList = computed(() => registrationStore.barangaysList)
const referrersList = computed(() => registrationStore.referrersList)
const derivedPromo = computed(() => registrationStore.derivedPromo)
const isSubmitting = computed(() => registrationStore.isSubmitting)
const isLoadingPlans = computed(() => registrationStore.isLoadingPlans)
const plansError = computed(() => registrationStore.plansError)

// Tier Category Filtering for Plan Selection
const selectedTierFilter = ref('all')
const planTierTabs = [
  { id: 'all', label: 'All Plans' },
  { id: 'budget', label: 'Starter & Budget' },
  { id: 'power', label: 'Ultra & Power' }
]

const filteredPlans = computed(() => {
  if (!availablePlans.value || availablePlans.value.length === 0) return []
  if (selectedTierFilter.value === 'budget') {
    return availablePlans.value.filter(p => p.price <= 850)
  }
  if (selectedTierFilter.value === 'power') {
    return availablePlans.value.filter(p => p.price >= 900)
  }
  return availablePlans.value
})

const selectedPlanDetails = computed(() => {
  return registrationStore.findPlan(formData.value.selectedPlanId) || 
         (formData.value.desiredPlan ? registrationStore.findPlan(formData.value.desiredPlan) : null) ||
         (availablePlans.value && availablePlans.value.length > 0 ? availablePlans.value[0] : null)
})

// The API returns numeric or string IDs while the form stores them as strings
function isPlanSelected(plan) {
  if (!plan) return false
  return String(formData.value.selectedPlanId) === String(plan.id) ||
         (formData.value.desiredPlan && formData.value.desiredPlan.includes(plan.title))
}

// Deep-link support: URL query param selection e.g. /register?plan=2 or /register?plan=connect-799
function syncPlanFromRouteQuery() {
  const queryPlan = route?.query?.plan || route?.query?.planId || route?.query?.id || route?.query?.slug
  if (queryPlan) {
    registrationStore.selectPlan(queryPlan)
  }
}

// Deep-link support for the coverage map / coverage cards, which link here as
// /register?barangay=Batingan%20(HQ)&city=Binangonan. Without this the applicant
// lands on an empty form after telling us exactly where they live.
function canonicalPlace(value) {
  return String(value || '')
    .replace(/\([^)]*\)/g, '')   // drop "(HQ)", "(Binangonan)", "(Phase 2 & 3)"
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function syncLocationFromRouteQuery() {
  const queryCity = route?.query?.city
  const queryBarangay = route?.query?.barangay

  if (queryCity) {
    const city = citiesList.value.find(c => canonicalPlace(c) === canonicalPlace(queryCity))
    if (city) formData.value.city = city
  }

  if (queryBarangay) {
    const target = canonicalPlace(queryBarangay)
    // Exact canonical match first, then a prefix match so "Darangan (Lower
    // Phase 1)" still resolves to "Darangan" in the dropdown.
    const barangay =
      barangaysList.value.find(b => canonicalPlace(b) === target) ||
      barangaysList.value.find(b => canonicalPlace(b).startsWith(target) || target.startsWith(canonicalPlace(b)))
    if (barangay) formData.value.barangay = barangay
  }
}

onMounted(() => {
  syncPlanFromRouteQuery()
  syncLocationFromRouteQuery()
})

watch(() => route?.query, () => {
  syncPlanFromRouteQuery()
  syncLocationFromRouteQuery()
}, { deep: true })

watch(availablePlans, () => {
  syncPlanFromRouteQuery()
})

const isTermsModalOpen = ref(false)
const isCompareModalOpen = ref(false)
const isMapModalOpen = ref(false)
const showCopyToast = ref(false)
const submissionError = ref('')
const wasDelivered = ref(true)

function handleMapConfirm(data) {
  if (data.barangay) {
    registrationStore.formData.barangay = data.barangay
  }
  if (data.address) {
    registrationStore.formData.installationAddress = data.address
  }
  touchField('region')
  touchField('city')
  if (registrationStore.formData.barangay) touchField('barangay')
  touchField('installationAddress')
}

const stepLabels = [
  'Personal Info',
  'Installation Address',
  'Plan Selection',
  'Photo & Document Uploads',
  'Review & Submit'
]

const submittedCode = ref('')

function resetWizard() {
  submittedCode.value = ''
  Object.keys(touched).forEach(key => delete touched[key])
  registrationStore.resetForm()
}

// Track touched fields for instant blur validation
const touched = reactive({})

function touchField(fieldKey) {
  touched[fieldKey] = true
}

function onMobileInput(key) {
  const currentVal = formData.value[key] || ''
  formData.value[key] = currentVal.replace(/\D/g, '').slice(0, 11)
}

const isLocating = ref(false)

function getGpsPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'))
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    }
  })
}

async function useCurrentLocation() {
  isLocating.value = true

  try {
    const position = await getGpsPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
    const lat = position.coords.latitude
    const lng = position.coords.longitude
    const latFixed = lat.toFixed(5)
    const lngFixed = lng.toFixed(5)

    registrationStore.formData.region = 'Region IV-A (CALABARZON)'
    registrationStore.formData.city = 'Binangonan'

    try {
      // Reverse geocode via OpenStreetMap Nominatim API
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
      if (response.ok) {
        const data = await response.json()
        const address = data.address || {}

        // Extract barangay / suburb / village / neighbourhood / quarter
        const detectedSub = (address.suburb || address.quarter || address.village || address.neighbourhood || address.residential || address.hamlet || '').trim()
        const detectedCity = address.city || address.town || address.municipality || 'Binangonan'
        const detectedRoad = address.road || address.pedestrian || address.highway || ''

        // Match detected suburb to barangaysList
        if (detectedSub) {
          const matchedBarangay = registrationStore.barangaysList.find(b => 
            b.toLowerCase() === detectedSub.toLowerCase() ||
            detectedSub.toLowerCase().includes(b.toLowerCase()) || 
            b.toLowerCase().includes(detectedSub.toLowerCase())
          )

          if (matchedBarangay) {
            registrationStore.formData.barangay = matchedBarangay
          }
        }

        // Build installation address string from real GPS data
        const addressParts = []
        if (detectedRoad) addressParts.push(detectedRoad)
        if (registrationStore.formData.barangay) addressParts.push(`Brgy. ${registrationStore.formData.barangay}`)
        else if (detectedSub) addressParts.push(detectedSub)
        if (detectedCity) addressParts.push(detectedCity)
        addressParts.push(`GPS: ${latFixed}, ${lngFixed}`)

        registrationStore.formData.installationAddress = addressParts.join(', ')
        if (data.display_name) {
          registrationStore.formData.landmark = `GPS Location: ${data.display_name.split(',').slice(0, 3).join(',')}`
        }
      } else {
        registrationStore.formData.installationAddress = `Binangonan, Rizal (GPS: ${latFixed}, ${lngFixed})`
      }
    } catch (fetchErr) {
      console.warn('Reverse geocoding fetch warning, using coordinates:', fetchErr)
      registrationStore.formData.installationAddress = `Binangonan, Rizal (GPS: ${latFixed}, ${lngFixed})`
    }
  } catch (geoErr) {
    console.warn('Geolocation failed or permission denied:', geoErr)
    alert('Unable to retrieve GPS location. Please ensure location permissions are enabled in your browser or choose your Barangay manually.')
  } finally {
    isLocating.value = false
    touchField('region')
    touchField('city')
    if (registrationStore.formData.barangay) touchField('barangay')
    touchField('installationAddress')
  }
}

// Validation Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phMobileRegex = /^09\d{9}$/

function validateValue(key) {
  const val = (formData.value[key] || '').toString().trim()
  const nameVal = (formData.value[key + 'Name'] || '').toString().trim()
  
  if (key === 'firstName' || key === 'lastName') return val.length >= 2
  if (key === 'emailAddress') return emailRegex.test(val)
  if (key === 'mobileNumber') return phMobileRegex.test(val) || (val.length === 11 && /^\d+$/.test(val))
  if (key === 'secondaryMobileNumber') return val.length === 0 || (val.length === 11 && /^\d+$/.test(val))
  if (key === 'region' || key === 'city' || key === 'barangay') return val.length > 0
  if (key === 'installationAddress') return val.length >= 3
  if (key === 'houseFrontPicture' || key === 'governmentValidId' || key === 'firstNearestLandmark') {
    return val.length > 0 || nameVal.length > 0
  }
  
  return val.length > 0
}

function isFieldValid(key) {
  if (!touched[key]) return false
  const val = (formData.value[key] || '').toString().trim()
  if (key === 'secondaryMobileNumber' && val.length === 0) return false
  return validateValue(key)
}

function isFieldInvalid(key) {
  if (!touched[key]) return false
  return !validateValue(key)
}

function getFieldStatusClass(key) {
  if (!touched[key]) return ''
  const val = (formData.value[key] || '').toString().trim()
  if (key === 'secondaryMobileNumber' && val.length === 0) return ''
  return validateValue(key) 
    ? '!border-emerald-500 focus:!ring-emerald-500/20' 
    : '!border-[#ee2824] !shadow-sm !shadow-[#ee2824]/20'
}

function handleNextStep() {
  if (currentStep.value === 1) {
    touchField('firstName')
    touchField('lastName')
    touchField('emailAddress')
    touchField('mobileNumber')

    if (!validateValue('firstName') || !validateValue('lastName') || !validateValue('emailAddress') || !validateValue('mobileNumber')) {
      return
    }
  }

  if (currentStep.value === 2) {
    touchField('region')
    touchField('city')
    touchField('barangay')
    touchField('installationAddress')

    if (!validateValue('region') || !validateValue('city') || !validateValue('barangay') || !validateValue('installationAddress')) {
      return
    }
  }

  if (currentStep.value === 4) {
    touchField('houseFrontPicture')
    touchField('governmentValidId')
    touchField('firstNearestLandmark')

    if (!validateValue('houseFrontPicture') || !validateValue('governmentValidId') || !validateValue('firstNearestLandmark')) {
      return
    }
  }

  registrationStore.nextStep()
}

function copyCode() {
  if (!submittedCode.value) return
  navigator.clipboard.writeText(submittedCode.value)
  showCopyToast.value = true
  setTimeout(() => {
    showCopyToast.value = false
  }, 3000)
}

function printReceipt() {
  window.print()
}

async function handleSubmit() {
  touchField('termsAndConditionsAgreement')

  // Check terms agreement
  if (!formData.value.termsAndConditionsAgreement) {
    submissionError.value = 'Please check the box to agree to the Terms & Conditions.'
    return
  }

  submissionError.value = ''

  try {
    const result = await registrationStore.submitApplication()
    submittedCode.value = result.referenceCode
    wasDelivered.value = result.delivered

    // Only celebrate when the server actually confirmed receipt
    if (result.delivered) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })
    } else {
      submissionError.value =
        "We saved your details but our server hasn't confirmed receipt yet. " +
        'Please call 0915 407 7565 with your reference code so we can finish your application.'
    }
  } catch (err) {
    console.error('Submission failed:', err)
    submissionError.value = 'Failed to submit application. Please check your network connection.'
  }
}
</script>
