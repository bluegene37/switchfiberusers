# Switch Fiber — Architecture & API Integration Guide

This guide outlines the architectural design of the **Switch Fiber** web application and provides a step-by-step developer workflow for adding new REST API endpoints from backend HTTP requests to the Vue UI.

---

## 🏛️ 1. Architecture Overview

The application follows a **Modern Component-Driven Single Page Application (SPA)** pattern:

- **Frontend Framework**: Vue 3 (Composition API `<script setup>`) + Vite
- **State Management**: Pinia (Centralized Store Architecture)
- **Styling & Theme**: Tailwind CSS + Vanilla CSS Tokens (Dark/Light mode system)
- **Routing**: Vue Router 4

```
┌─────────────────────────────────────────────────────────────┐
│                 Presentation Layer (UI)                     │
│  - Views (HomeView, RegisterView, StatusView, etc.)         │
│  - Components (RegistrationWizard, DropzoneUploader, etc.)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ (v-model / actions)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 State & Logic Layer (Pinia)                 │
│  - useRegistrationStore()                                   │
│  - useThemeStore()                                          │
│  - useCoverageStore()                                       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (async fetch)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Data & API Integration                      │
│  - Dev Proxy (vite.config.js -> https://103.249.198.43:8090)│
│  - Prod Proxy (Vercel Serverless api/ -> HTTPS Node Agent)  │
│  - Endpoints (/api/Plans, /api/Applications)               │
│  - LocalStorage Offline Fallback                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 2. Step-by-Step Flow to Add a New API

Follow these 5 steps whenever you need to connect a new backend API endpoint to the user interface:

---

### Step 1: Define Reactive State & API Action in Pinia Store
**File**: `src/stores/registration.js` (or a new store file in `src/stores/`)

Add state variables for loading and errors, then create an `async` function:

```javascript
// src/stores/registration.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRegistrationStore = defineStore('registration', () => {
  const isSubmitting = ref(false)
  const apiError = ref(null)

  // 1. Add API action function
  async function fetchApplicationByCode(referenceCode) {
    isSubmitting.value = true
    apiError.value = null

    try {
      const response = await fetch(`/api/Applications/${referenceCode}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }

      const result = await response.json()
      return result // Return response payload to caller
    } catch (err) {
      console.warn('API Error:', err)
      apiError.value = 'Failed to retrieve application. Please try again.'
      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    apiError,
    fetchApplicationByCode
  }
})
```

---

### Step 2: Map & Format the DTO Payload (for POST / PUT requests)

Ensure payload fields match the exact JSON schema expected by the backend:

```javascript
// Example Payload Construction (POST /api/Applications)
const apiPayload = {
  timestamp: new Date().toISOString(),
  emailAddress: formData.value.emailAddress,
  region: formData.value.region,
  city: formData.value.city,
  barangay: formData.value.barangay,
  referredBy: formData.value.referredBy || '',
  firstName: formData.value.firstName,
  middleName: formData.value.middleName || '',
  lastName: formData.value.lastName,
  mobileNumber: formData.value.mobileNumber,
  secondaryMobileNumber: formData.value.secondaryMobileNumber || '',
  installationAddress: formData.value.installationAddress,
  landmark: formData.value.landmark || '',
  desiredPlan: formData.value.desiredPlan,
  proofOfBilling: '',
  governmentValidId: formData.value.governmentValidId || '',
  secondGovernmentValidId: formData.value.secondGovernmentValidId || '',
  houseFrontPicture: formData.value.houseFrontPicture || '',
  termsAndConditionsAgreement: formData.value.termsAndConditionsAgreement ? 'true' : 'false',
  firstNearestLandmark: formData.value.firstNearestLandmark || '',
  secondNearestLandmark: formData.value.secondNearestLandmark || '',
  applicablePromo: formData.value.applicablePromo || 'Standard Installation',
  documentPicture: '',
  barangay1: '',
  barangay2: '',
  pictureofstatmentbillingfromotherprovider: '',
  referrersAccountNumber: '',
  applyingFor: 'New Fiber Connection',
  status: 'Pending',
  visitBy: '',
  visitWith: '',
  visitWithOther: '',
  remarks: `Online Application ${randomCode}`,
  modifiedBy: '0', // Server default
  modifiedDate: '',
  userEmail: formData.value.emailAddress
}
```

---

### Step 3: Implement Offline LocalStorage Fallback

To prevent data loss when backend services encounter network issues or CORS restrictions:

```javascript
// Save to local cache first
submittedApplications.value.unshift(newApplicationRecord)
localStorage.setItem('switch_applications', JSON.stringify(submittedApplications.value))

// Then send POST request
try {
  await fetch('/api/Applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiPayload)
  })
} catch (err) {
  console.warn('Backend API request failed, fallback saved locally:', err)
}
```

---

### Step 4: Wire Pinia Store Action to Vue Component

**File**: `src/views/ApplicationStatusView.vue` (or target component)

Import the store and invoke the action from button handlers:

```html
<template>
  <div class="space-y-4 max-w-xl mx-auto">
    <label class="block text-xs font-bold uppercase">Application Reference Code</label>
    <input 
      v-model="inputCode" 
      type="text" 
      placeholder="e.g. SF-2026-8942" 
      class="input-field" 
    />

    <button 
      @click="onSearch" 
      :disabled="registrationStore.isSubmitting"
      class="btn-primary w-full"
    >
      <RotateCw v-if="registrationStore.isSubmitting" class="w-4 h-4 animate-spin" />
      <span>{{ registrationStore.isSubmitting ? 'Searching...' : 'Track Reference' }}</span>
    </button>

    <!-- Error Banner -->
    <div v-if="registrationStore.apiError" class="p-3 bg-red-500/10 text-red-500 rounded-xl text-xs">
      {{ registrationStore.apiError }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RotateCw } from 'lucide-vue-next'
import { useRegistrationStore } from '../stores/registration'

const registrationStore = useRegistrationStore()
const inputCode = ref('')
const applicationData = ref(null)

async function onSearch() {
  if (!inputCode.value) return
  applicationData.value = await registrationStore.fetchApplicationByCode(inputCode.value)
}
</script>
```

---

### Step 5: Add User Feedback & UX Enhancements

1. **Button Disabled & Spinner**: Set `:disabled="store.isSubmitting"` and render an animated spinner.
2. **Success Effects**: Trigger `canvas-confetti` or toast messages upon successful completion.
3. **Form Resets**: Call `store.resetForm()` when navigating between pages.

---

## 📋 Integration Checklist

- [ ] Defined state (`ref`) and async function in Pinia store
- [ ] Mapped JSON payload fields matching backend API schema
- [ ] Handled `try / catch / finally` for HTTP errors & loading states
- [ ] Added `localStorage` fallback for offline resilience
- [ ] Imported store in Vue component with `useRegistrationStore()`
- [ ] Added loading spinner & disabled states on UI action buttons
