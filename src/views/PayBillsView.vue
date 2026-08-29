<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    
    <!-- Title Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <CreditCard class="w-3.5 h-3.5" />
        <span>Official Payment Portal</span>
      </div>
      <h1 class="text-4xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900">How to Settle Your Bill</h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        Safely pay your Switch Fiber bill anytime online through our official payment gateway at 
        <a href="https://pay.switchfiber.ph" target="_blank" rel="noopener noreferrer" class="text-[#ee2824] dark:text-[#ff6b67] font-bold hover:underline">pay.switchfiber.ph</a>.
      </p>
    </div>

    <!-- Official Portal Direct Link Box -->
    <div class="glass-panel p-8 md:p-10 rounded-3xl border border-[#ee2824]/40 text-center space-y-4 max-w-3xl mx-auto dark:bg-gradient-to-b dark:from-[#ee2824]/10 dark:to-slate-950 bg-gradient-to-b from-rose-50 to-white shadow-xl">
      <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Direct Payment Portal Link</h2>
      <p class="dark:text-slate-300 text-slate-600 text-sm">
        We accept GCash (via QR Ph), Maya, WeChat Pay, Visa, Mastercard, and JCB credit/debit cards.
      </p>
      <div class="pt-2">
        <a href="https://pay.switchfiber.ph" target="_blank" rel="noopener noreferrer" class="btn-primary py-4 px-8 text-base">
          <ExternalLink class="w-5 h-5" />
          <span>Go to pay.switchfiber.ph</span>
        </a>
      </div>
    </div>

    <!-- Step-by-Step Settlement Guide -->
    <div class="space-y-8 max-w-5xl mx-auto">
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Step-by-Step Payment Instructions</h2>
        <p class="text-xs dark:text-slate-400 text-slate-500">Follow these 7 simple steps to settle your monthly account.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-8 h-8 rounded-full bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] font-bold flex items-center justify-center text-sm">1</div>
          <h3 class="font-bold dark:text-white text-slate-900 text-base">Open Web Browser</h3>
          <p class="text-xs dark:text-slate-400 text-slate-600">Visit our official online payment portal link on any browser: <strong class="dark:text-slate-200 text-slate-900">https://pay.switchfiber.ph/</strong></p>
        </div>

        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-8 h-8 rounded-full bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] font-bold flex items-center justify-center text-sm">2</div>
          <h3 class="font-bold dark:text-white text-slate-900 text-base">Enter Account & Contact</h3>
          <p class="text-xs dark:text-slate-400 text-slate-600">Type in your Account Number and Contact Number as indicated on your Statement of Account (SOA).</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-8 h-8 rounded-full bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] font-bold flex items-center justify-center text-sm">3</div>
          <h3 class="font-bold dark:text-white text-slate-900 text-base">Verify Account Details</h3>
          <p class="text-xs dark:text-slate-400 text-slate-600">Double check that your account name and outstanding bill amount match your record.</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-8 h-8 rounded-full bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] font-bold flex items-center justify-center text-sm">4</div>
          <h3 class="font-bold dark:text-white text-slate-900 text-base">Enter Payment Amount</h3>
          <p class="text-xs dark:text-slate-400 text-slate-600">Input the exact monthly amount you wish to settle for your fiber subscription.</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-8 h-8 rounded-full bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] font-bold flex items-center justify-center text-sm">5</div>
          <h3 class="font-bold dark:text-white text-slate-900 text-base">Select Mode of Payment</h3>
          <p class="text-xs dark:text-slate-400 text-slate-600">Choose GCash (QR Ph), Maya, or Credit/Debit Card. For GCash, tap "Upload QR" in your GCash app and scan the generated code.</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-8 h-8 rounded-full bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] font-bold flex items-center justify-center text-sm">6 & 7</div>
          <h3 class="font-bold dark:text-white text-slate-900 text-base">Confirm & Complete</h3>
          <p class="text-xs dark:text-slate-400 text-slate-600">Verify the transaction, click "Proceed", and tap "Back to Homepage". Keep a copy of your electronic receipt!</p>
        </div>

      </div>
    </div>

    <!-- Billing Assistance Hotline Box -->
    <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 max-w-xl mx-auto text-center space-y-2">
      <PhoneCall class="w-6 h-6 text-[#ee2824] dark:text-[#ff6b67] mx-auto" />
      <h3 class="font-bold dark:text-white text-slate-900 text-lg">Need Billing Assistance?</h3>
      <p class="text-xs dark:text-slate-400 text-slate-600">Our dedicated billing support hotline is ready to help you with official receipts and payment posting.</p>
      <div class="pt-2">
        <a href="tel:09154077555" class="inline-flex items-center min-h-11 text-lg font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">Globe: 0915 407 7555</a>
      </div>
    </div>

  </div>
</template>

<script setup>
import { CreditCard, ExternalLink, PhoneCall } from 'lucide-vue-next'
</script>
