<template>
  <div class="glass-panel p-6 md:p-10 rounded-3xl max-w-4xl mx-auto border border-[#ee2824]/30 shadow-2xl relative transition-colors duration-300">
    
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
      <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900 flex items-center gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
        <User class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67]" />
        <span>Step 1: Applicant Personal Information</span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- First Name -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">First Name *</label>
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
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Last Name *</label>
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
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Active Email Address *</label>
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
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Active Mobile Number (Numeric Only) *</label>
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
            <CheckCircle2 v-if="isFieldValid('secondaryMobileNumber')" class="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <AlertCircle v-if="isFieldInvalid('secondaryMobileNumber')" class="w-4 h-4 text-[#ee2824] absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <p v-if="isFieldInvalid('secondaryMobileNumber')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            Secondary mobile must be a valid 11-digit numeric number.
          </p>
        </div>

        <!-- Referred By -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Referred By (Sales Agent / Friend Name)</label>
          <input 
            v-model="formData.referredBy" 
            type="text" 
            placeholder="e.g. Maria Santos / Agent ID (Optional)" 
            class="input-field" 
          />
        </div>
      </div>
    </div>

    <!-- STEP 2: Address & Location -->
    <div v-if="currentStep === 2 && !submittedCode" class="space-y-6 animate-in fade-in duration-300">
      <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900 flex items-center gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
        <MapPin class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67]" />
        <span>Step 2: Installation Address & Service Area</span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Region -->
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Region *</label>
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
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">City / Town *</label>
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
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Barangay *</label>
          <select 
            v-model="formData.barangay" 
            @blur="touchField('barangay')"
            class="input-field"
            :class="getFieldStatusClass('barangay')"
          >
            <option value="" disabled>Choose Barangay</option>
            <option v-for="b in barangaysList" :key="b" :value="b">{{ b }}</option>
          </select>
          <p v-if="isFieldInvalid('barangay')" class="text-[11px] text-[#ee2824] mt-1 font-medium">
            Barangay selection is required.
          </p>
        </div>
      </div>

      <!-- Installation Address -->
      <div>
        <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Detailed Installation Address *</label>
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
      <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900 flex items-center gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
        <Wifi class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67]" />
        <span>Step 3: Select Desired Internet Plan</span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="plan in availablePlans" 
          :key="plan.id"
          @click="registrationStore.selectPlan(plan)"
          class="p-4 rounded-xl border cursor-pointer transition-all relative flex flex-col justify-between"
          :class="formData.selectedPlanId === plan.id ? 'bg-[#ee2824]/10 border-[#ee2824] shadow-lg shadow-[#ee2824]/20' : 'dark:bg-slate-900/80 bg-white dark:border-slate-800 border-slate-200 hover:border-slate-400'"
        >
          <div v-if="plan.recommended" class="absolute -top-2.5 right-3 bg-[#ee2824] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            Popular
          </div>
          <div>
            <h4 class="font-bold dark:text-white text-slate-900 text-base mb-1">{{ plan.title }}</h4>
            <div class="text-2xl font-extrabold font-heading text-[#ee2824] dark:text-[#ff6b67]">₱{{ plan.price }}<span class="text-xs font-normal dark:text-slate-400 text-slate-500">/mo</span></div>
            <p class="text-xs text-emerald-500 font-semibold my-2">{{ plan.speed }}</p>
            <span class="text-[11px] dark:text-slate-400 text-slate-500 block">{{ plan.lockIn }} • No Data Cap</span>
          </div>
          <div class="mt-4 pt-3 border-t dark:border-slate-800/80 border-slate-200 flex items-center justify-between text-xs font-semibold" :class="formData.selectedPlanId === plan.id ? 'text-[#ee2824] dark:text-[#ff6b67]' : 'dark:text-slate-500 text-slate-400'">
            <span>{{ formData.selectedPlanId === plan.id ? '✓ Selected' : 'Select Plan' }}</span>
            <CheckCircle2 class="w-4 h-4" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Desired Plan Selection</label>
          <input v-model="formData.desiredPlan" type="text" readonly class="input-field font-semibold text-[#ee2824] dark:text-[#ff6b67]" />
        </div>
        <div>
          <label class="block text-xs font-bold dark:text-slate-300 text-slate-700 uppercase mb-2">Applicable Promo</label>
          <input v-model="formData.applicablePromo" type="text" placeholder="e.g. Free Standard Installation" class="input-field" />
        </div>
      </div>
    </div>

    <!-- STEP 4: Document & Landmark Photo Uploads -->
    <div v-if="currentStep === 4 && !submittedCode" class="space-y-6 animate-in fade-in duration-300">
      <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900 flex items-center gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
        <UploadCloud class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67]" />
        <span>Step 4: Required Documents & Photo Uploads</span>
      </h3>

      <p class="text-xs dark:text-slate-400 text-slate-600">
        Upload clear photos or document files (JPG, PNG, or PDF format).
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- 1. House Front Picture (FULL WIDTH DROPZONE) -->
        <div class="glass-card p-5 rounded-2xl border space-y-3 md:col-span-2" :class="getFieldStatusClass('houseFrontPicture')">
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">1. House Front Picture *</label>
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
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">2. Primary Government ID *</label>
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
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">3. 2nd Government ID (Optional)</label>
          <DropzoneUploader 
            v-model="formData.secondGovernmentValidId" 
            v-model:fileName="formData.secondGovernmentValidIdName"
            @change="touchField('secondGovernmentValidId')"
          />
        </div>

        <!-- 4. 1st Nearest Landmark Photo -->
        <div class="glass-card p-5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">4. First Nearest Landmark Photo</label>
          <DropzoneUploader 
            v-model="formData.firstNearestLandmark" 
            v-model:fileName="formData.firstNearestLandmarkName"
            @change="touchField('firstNearestLandmark')"
          />
        </div>

        <!-- 5. 2nd Nearest Landmark Photo -->
        <div class="glass-card p-5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <label class="block text-xs font-bold dark:text-white text-slate-900 uppercase">5. Second Nearest Landmark Photo</label>
          <DropzoneUploader 
            v-model="formData.secondNearestLandmark" 
            v-model:fileName="formData.secondNearestLandmarkName"
            @change="touchField('secondNearestLandmark')"
          />
        </div>

      </div>
    </div>

    <!-- STEP 5: Review, Terms & API Submission -->
    <div v-if="currentStep === 5 || submittedCode" class="space-y-6 animate-in fade-in duration-300">
      <div v-if="!submittedCode">
        <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900 flex items-center gap-2 border-b dark:border-slate-800 border-slate-200 pb-3">
          <FileText class="w-5 h-5 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Step 5: Final Review & Terms Agreement</span>
        </h3>

        <!-- Summary Review Box -->
        <div class="p-5 rounded-2xl dark:bg-slate-900/90 bg-slate-100 border dark:border-slate-800 border-slate-200 space-y-4">
          <div class="grid grid-cols-2 gap-4 text-xs border-b dark:border-slate-800 border-slate-300 pb-3">
            <div>
              <span class="dark:text-slate-500 text-slate-500 uppercase block">Applicant Full Name:</span>
              <span class="font-bold dark:text-slate-200 text-slate-900 text-sm">{{ formData.firstName }} {{ formData.middleName }} {{ formData.lastName }}</span>
              <span class="block dark:text-slate-400 text-slate-600">{{ formData.emailAddress }} | {{ formData.mobileNumber }}</span>
            </div>
            <div>
              <span class="dark:text-slate-500 text-slate-500 uppercase block">Installation Address:</span>
              <span class="font-bold dark:text-slate-200 text-slate-900 text-sm">{{ formData.barangay }}, {{ formData.city }}, {{ formData.region }}</span>
              <span class="block dark:text-slate-400 text-slate-600">{{ formData.installationAddress }}</span>
            </div>
          </div>

          <div class="text-xs">
            <span class="dark:text-slate-500 text-slate-500 uppercase block">Desired Plan:</span>
            <span class="font-extrabold text-[#ee2824] dark:text-[#ff6b67] text-base">{{ formData.desiredPlan }}</span>
          </div>
        </div>

        <!-- Terms Agreement Checkbox -->
        <div class="space-y-3 pt-2">
          <label class="flex items-start gap-3 cursor-pointer text-xs dark:text-slate-300 text-slate-700">
            <input type="checkbox" v-model="formData.termsAndConditionsAgreement" class="w-4 h-4 rounded accent-[#ee2824] mt-0.5" required />
            <span>I agree to the Terms & Conditions of Switch Fiber and confirm that all information provided is true and correct.</span>
          </label>
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
        <div class="p-6 rounded-2xl dark:bg-slate-900 bg-white border border-[#ee2824]/40 max-w-md mx-auto space-y-2 shadow-2xl">
          <span class="text-xs dark:text-slate-400 text-slate-500 uppercase tracking-widest block">Application Reference Code</span>
          <div class="text-3xl font-extrabold font-mono text-[#ee2824] dark:text-[#ff6b67] tracking-wider">
            {{ submittedCode }}
          </div>
          <p class="text-[11px] dark:text-slate-500 text-slate-500">Save this reference code to check your real-time installation dispatch status.</p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <router-link to="/status" class="btn-primary w-full sm:w-auto">
            <Search class="w-4 h-4" />
            <span>Track Application Status</span>
          </router-link>
          <button @click="resetWizard" class="btn-secondary w-full sm:w-auto">
            <RotateCcw class="w-4 h-4" />
            <span>Submit Another Application</span>
          </button>
          <router-link to="/" @click="resetWizard" class="btn-secondary w-full sm:w-auto">
            <span>Back to Homepage</span>
          </router-link>
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
        :disabled="!formData.termsAndConditionsAgreement || isSubmitting"
      >
        <RotateCw v-if="isSubmitting" class="w-4 h-4 animate-spin" />
        <Sparkles v-else class="w-4 h-4" />
        <span>{{ isSubmitting ? 'Submitting...' : 'Submit Application' }}</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onUnmounted } from 'vue'
import confetti from 'canvas-confetti'
import { 
  Sparkles, Check, User, MapPin, Wifi, FileCheck, FileText, 
  Camera, UploadCloud, CheckCircle2, AlertCircle, Search, ArrowLeft, ArrowRight, RotateCw, RotateCcw 
} from 'lucide-vue-next'
import { useRegistrationStore } from '../stores/registration'
import DropzoneUploader from './DropzoneUploader.vue'

const registrationStore = useRegistrationStore()
const currentStep = computed(() => registrationStore.currentStep)
const formData = computed(() => registrationStore.formData)
const availablePlans = computed(() => registrationStore.availablePlans)
const regionsList = computed(() => registrationStore.regionsList)
const citiesList = computed(() => registrationStore.citiesList)
const barangaysList = computed(() => registrationStore.barangaysList)
const isSubmitting = computed(() => registrationStore.isSubmitting)

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

// Validation Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phMobileRegex = /^09\d{9}$/

function validateValue(key) {
  const val = (formData.value[key] || '').toString().trim()
  
  if (key === 'firstName' || key === 'lastName') return val.length >= 2
  if (key === 'emailAddress') return emailRegex.test(val)
  if (key === 'mobileNumber') return phMobileRegex.test(val) || (val.length === 11 && /^\d+$/.test(val))
  if (key === 'secondaryMobileNumber') return val.length === 0 || (val.length === 11 && /^\d+$/.test(val))
  if (key === 'region' || key === 'city' || key === 'barangay') return val.length > 0
  if (key === 'installationAddress') return val.length >= 3
  if (key === 'houseFrontPicture' || key === 'governmentValidId') return val.length > 0
  
  return val.length > 0
}

function isFieldValid(key) {
  if (!touched[key]) return false
  return validateValue(key)
}

function isFieldInvalid(key) {
  if (!touched[key]) return false
  return !validateValue(key)
}

function getFieldStatusClass(key) {
  if (!touched[key]) return ''
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

    if (!validateValue('houseFrontPicture') || !validateValue('governmentValidId')) {
      return
    }
  }

  registrationStore.nextStep()
}

function triggerFileUpload(fieldKey, nameKey) {
  const sampleFileName = fieldKey + '_' + Math.floor(1000 + Math.random() * 9000) + '.jpg'
  formData.value[nameKey] = sampleFileName
  formData.value[fieldKey] = `data:image/jpeg;base64,SIMULATED_BASE64_DATA_${sampleFileName}`
  touchField(fieldKey)
}

async function handleSubmit() {
  const code = await registrationStore.submitApplication()
  submittedCode.value = code

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  })
}
</script>
