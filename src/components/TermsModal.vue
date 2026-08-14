<template>
  <!-- Teleported to body: ancestors using backdrop-filter (.glass-panel) become
       the containing block for position:fixed, which would anchor this overlay
       inside the panel instead of the viewport. -->
  <Teleport to="body">
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
    <div class="glass-panel w-full max-w-3xl max-h-[85vh] rounded-3xl border border-[#ee2824]/40 shadow-2xl flex flex-col dark:bg-slate-900 bg-white overflow-hidden">
      
      <!-- Header -->
      <div class="px-6 py-5 border-b dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center">
            <FileText class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">Switch Fiber Service Agreement</h3>
            <p class="text-xs dark:text-slate-400 text-slate-500">Terms & Conditions, Privacy Policy & Acceptable Use</p>
          </div>
        </div>
        <button 
          @click="close" 
          class="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Scrollable Body Content -->
      <div class="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed dark:text-slate-300 text-slate-600">
        <section class="space-y-2">
          <h4 class="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
            1. Scope of Service & Installation
          </h4>
          <p>
            Switch Fiber ("Company") provides high-speed fiber optic internet access to subscribed applicants ("Subscriber") subject to network coverage feasibility. Standard installation covers up to 300 meters of fiber drop cable from the nearest Fiber Distribution Box (FDB). Any excess cable or specialized trunking will be billed accordingly upon subscriber approval.
          </p>
        </section>

        <section class="space-y-2">
          <h4 class="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <CreditCard class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
            2. Billing Cycle & Payment Terms
          </h4>
          <p>
            Monthly Recurring Charges (MRC) are billed in advance every 1st of the calendar month. Subscribers must settle their accounts on or before the designated Due Date via official payment portals (pay.switchfiber.ph or authorized GCash/Maya partners). Failure to settle within 5 days after the due date may incur a late payment fee or temporary service disconnection.
          </p>
        </section>

        <section class="space-y-2">
          <h4 class="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <Lock class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
            3. Lock-in Period & Pre-termination
          </h4>
          <p>
            All standard Switch Fiber consumer internet plans carry a minimum lock-in period of twelve (12) consecutive months from the date of activation. Pre-termination of service within the active lock-in period shall be subject to a pre-termination penalty equivalent to the remaining months' MRC or ₱3,000, whichever is applicable.
          </p>
        </section>

        <section class="space-y-2">
          <h4 class="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <CheckCircle2 class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
            4. Data Privacy & Use of Information
          </h4>
          <p>
            In compliance with the Data Privacy Act of 2012 (RA 10173), Switch Fiber strictly collects personal information (Name, Address, Mobile, Email, Government IDs, House Front Photo) solely for application verification, credit evaluation, technical installation dispatch, and official billing statements. We do not sell or share subscriber data with unauthorized third parties.
          </p>
        </section>

        <section class="space-y-2">
          <h4 class="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <Radio class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
            5. Acceptable Use Policy (AUP)
          </h4>
          <p>
            Subscribers shall not use Switch Fiber services for illegal activities, unauthorized commercial bandwidth resale, distribution of malicious software, or activities that compromise network security. Switch Fiber reserves the right to suspend accounts violating the AUP.
          </p>
        </section>
      </div>

      <!-- Footer Buttons -->
      <div class="px-6 py-4 border-t dark:border-slate-800 border-slate-200 flex items-center justify-between shrink-0 dark:bg-slate-950 bg-slate-50">
        <span class="text-[11px] dark:text-slate-400 text-slate-500 font-medium">Switch Fiber Telecommunications Inc. © 2026</span>
        <button 
          @click="accept" 
          class="btn-primary py-2.5 px-6 text-xs"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span>I Understand & Agree</span>
        </button>
      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { FileText, ShieldCheck, CreditCard, Lock, CheckCircle2, Radio, X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'accept'])

function close() {
  emit('close')
}

function accept() {
  emit('accept')
  emit('close')
}
</script>
