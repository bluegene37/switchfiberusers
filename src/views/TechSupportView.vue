<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    
    <!-- Title Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <Wrench class="w-3.5 h-3.5" />
        <span>Self-Service Tech Hub</span>
      </div>
      <h1 class="text-4xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900">Router & Wi-Fi Configuration</h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        Follow our simple step-by-step guides to log into your Switch Fiber ONU modem, change your Wi-Fi password, and customize your network name (SSID).
      </p>
    </div>

    <!-- Quick Credentials Banner -->
    <div class="glass-panel p-6 rounded-2xl border border-[#ee2824]/40 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#ee2824]/20 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center shrink-0">
          <Globe class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-bold dark:text-white text-slate-900 text-base">Default Router IP Address</h3>
          <p class="text-xs dark:text-slate-400 text-slate-600 font-mono font-semibold">http://192.168.1.1</p>
        </div>
      </div>
      <div class="dark:bg-slate-900 bg-slate-100 px-4 py-2.5 rounded-xl border dark:border-slate-800 border-slate-300 text-xs dark:text-slate-300 text-slate-800">
        Default Username: <strong class="text-[#ee2824] dark:text-[#ff6b67] font-mono">user</strong><br />
        Default Password: <strong class="text-[#ee2824] dark:text-[#ff6b67] font-mono">user</strong>
      </div>
    </div>

    <!-- 2 Column Guides: Change Password vs Change SSID -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      
      <!-- Guide 1: Change Wi-Fi Password -->
      <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <div class="flex items-center gap-3 border-b dark:border-slate-800 border-slate-200 pb-4">
          <Key class="w-6 h-6 text-[#ee2824] dark:text-[#ff6b67]" />
          <div>
            <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">How to Change Wi-Fi Password</h2>
            <p class="text-xs dark:text-slate-400 text-slate-500">Update WPA Passphrase for 2.4GHz & 5GHz bands</p>
          </div>
        </div>

        <ol class="space-y-4 text-sm dark:text-slate-300 text-slate-700 list-decimal list-inside">
          <li class="leading-relaxed">
            Open your web browser (Google Chrome, Safari, Firefox) and type 
            <code class="dark:bg-slate-900 bg-slate-100 text-[#ee2824] dark:text-[#ff6b67] border dark:border-slate-800 border-slate-300 px-2 py-0.5 rounded font-mono text-xs font-bold">192.168.1.1</code> 
            in the address bar.
          </li>
          <li class="leading-relaxed">
            Log in using default credentials:
            <div class="my-2 p-3 dark:bg-slate-900/90 bg-slate-100 rounded-xl border dark:border-slate-800 border-slate-300 font-mono text-xs dark:text-slate-300 text-slate-800 font-semibold">
              Username: <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold">user</span><br />
              Password: <span class="text-[#ee2824] dark:text-[#ff6b67] font-bold">user</span>
            </div>
          </li>
          <li class="leading-relaxed">
            Navigate to the <strong class="dark:text-white text-slate-900 font-bold">Network Settings</strong> section and click <strong class="dark:text-white text-slate-900 font-bold">Security</strong>.
          </li>
          <li class="leading-relaxed">
            Modify your password under <strong class="dark:text-white text-slate-900 font-bold">WPA Passphrase</strong>:
            <ul class="mt-2 ml-6 space-y-1.5 text-xs dark:text-slate-400 text-slate-600 list-disc">
              <li>Select <strong class="dark:text-slate-200 text-slate-900 font-bold">SSID1</strong> and enter password for 2.4GHz network.</li>
              <li>Select <strong class="dark:text-slate-200 text-slate-900 font-bold">SSID5</strong> and enter password for 5GHz network.</li>
            </ul>
          </li>
          <li class="leading-relaxed">
            Click <strong class="text-emerald-600 dark:text-emerald-400 font-bold">Submit</strong> to save changes and log out.
          </li>
        </ol>
      </div>

      <!-- Guide 2: Change Wi-Fi Network Name (SSID) -->
      <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
        <div class="flex items-center gap-3 border-b dark:border-slate-800 border-slate-200 pb-4">
          <Wifi class="w-6 h-6 text-amber-500" />
          <div>
            <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">How to Change Wi-Fi Name (SSID)</h2>
            <p class="text-xs dark:text-slate-400 text-slate-500">Customize broadcast name for your home router</p>
          </div>
        </div>

        <ol class="space-y-4 text-sm dark:text-slate-300 text-slate-700 list-decimal list-inside">
          <li class="leading-relaxed">
            Open web browser and navigate to 
            <code class="dark:bg-slate-900 bg-slate-100 text-[#ee2824] dark:text-[#ff6b67] border dark:border-slate-800 border-slate-300 px-2 py-0.5 rounded font-mono text-xs font-bold">192.168.1.1</code>.
          </li>
          <li class="leading-relaxed">
            Enter login details: 
            <code class="dark:bg-slate-900 bg-slate-100 text-[#ee2824] dark:text-[#ff6b67] border dark:border-slate-800 border-slate-300 px-2 py-0.5 rounded font-mono text-xs font-bold">user / user</code>.
          </li>
          <li class="leading-relaxed">
            Navigate to <strong class="dark:text-white text-slate-900 font-bold">Network Settings</strong> and select <strong class="dark:text-white text-slate-900 font-bold">SSID Settings</strong>.
          </li>
          <li class="leading-relaxed">
            Customize your Wi-Fi broadcast name:
            <div class="my-2 p-3 dark:bg-slate-900/90 bg-slate-100 rounded-xl border dark:border-slate-800 border-slate-300 font-mono text-xs dark:text-slate-300 text-slate-800 font-semibold">
              Set <strong class="text-amber-600 dark:text-amber-400 font-bold">SSID1</strong> for: SWITCHFIBER-2.4G<br />
              Set <strong class="text-amber-600 dark:text-amber-400 font-bold">SSID5</strong> for: SWITCHFIBER-5G
            </div>
          </li>
          <li class="leading-relaxed">
            Click <strong class="text-emerald-600 dark:text-emerald-400 font-bold">Submit</strong> to save and reconnect your Wi-Fi devices.
          </li>
        </ol>
      </div>

    </div>

    <!-- Dual Band Explanation Tip -->
    <div class="glass-panel p-6 rounded-2xl border dark:border-slate-800 border-slate-200 max-w-4xl mx-auto flex items-start gap-4">
      <Info class="w-6 h-6 text-[#ee2824] dark:text-[#ff6b67] shrink-0 mt-0.5" />
      <div class="space-y-1 text-xs dark:text-slate-300 text-slate-700">
        <h4 class="font-bold dark:text-white text-slate-900 text-sm">Understanding Dual-Band Frequencies (2.4GHz vs 5GHz)</h4>
        <p>
          <strong class="dark:text-white text-slate-900">2.4GHz Network:</strong> Suitable for farther distance coverage throughout your house and penetrates walls easily.<br />
          <strong class="dark:text-white text-slate-900">5GHz Network:</strong> Provides maximum ultra-fast fiber speeds at shorter range, ideal for gaming and 4K streaming near the router.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { Wrench, Globe, Key, Wifi, Info } from 'lucide-vue-next'
</script>
