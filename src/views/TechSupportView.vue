<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
    
    <!-- Title Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <HelpCircle class="w-3.5 h-3.5" />
        <span>Switch Fiber Help & Support Hub</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        Technical Guides & Support Center
      </h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        Find quick answers for router Wi-Fi setup, application document requirements, billing payment channels, and customer care hotlines.
      </p>
    </div>

    <!-- Quick Credentials Banner -->
    <div class="glass-panel p-6 rounded-3xl border border-[#ee2824]/40 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center shrink-0">
          <Globe class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-bold dark:text-white text-slate-900 text-base">Default Router IP Address</h3>
          <p class="text-xs dark:text-slate-400 text-slate-600 font-mono font-semibold">http://192.168.1.1</p>
        </div>
      </div>
      <div class="dark:bg-slate-900 bg-slate-100 px-5 py-3 rounded-2xl border dark:border-slate-800 border-slate-200 text-xs dark:text-slate-300 text-slate-800 text-center sm:text-right">
        Username: <strong class="text-[#ee2824] dark:text-[#ff6b67] font-mono">user</strong><br />
        Password: <strong class="text-[#ee2824] dark:text-[#ff6b67] font-mono">user</strong>
      </div>
    </div>

    <!-- 2 Column Router Setup Guides: Change Password vs Change SSID -->
    <div class="space-y-6">
      <div class="text-center space-y-1">
        <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">Wi-Fi & Router Self-Service Guides</h2>
        <p class="text-xs dark:text-slate-400 text-slate-500">Configure your ONU modem settings directly from any phone or computer browser.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        <!-- Guide 1: Change Wi-Fi Password -->
        <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-6">
          <div class="flex items-center gap-3 border-b dark:border-slate-800 border-slate-200 pb-4">
            <Key class="w-6 h-6 text-[#ee2824] dark:text-[#ff6b67]" />
            <div>
              <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">How to Change Wi-Fi Password</h3>
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
              Navigate to <strong class="dark:text-white text-slate-900 font-bold">Network Settings</strong> &gt; <strong class="dark:text-white text-slate-900 font-bold">Security</strong>.
            </li>
            <li class="leading-relaxed">
              Modify password in <strong class="dark:text-white text-slate-900 font-bold">WPA Passphrase</strong>:
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
              <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">How to Change Wi-Fi Name (SSID)</h3>
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
              Navigate to <strong class="dark:text-white text-slate-900 font-bold">Network Settings</strong> &gt; <strong class="dark:text-white text-slate-900 font-bold">SSID Settings</strong>.
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
      <div class="glass-panel p-6 rounded-3xl border dark:border-slate-800 border-slate-200 max-w-6xl mx-auto flex items-start gap-4">
        <Info class="w-6 h-6 text-[#ee2824] dark:text-[#ff6b67] shrink-0 mt-0.5" />
        <div class="space-y-1 text-xs dark:text-slate-300 text-slate-700">
          <h4 class="font-bold dark:text-white text-slate-900 text-sm">Understanding Dual-Band Frequencies (2.4GHz vs 5GHz)</h4>
          <p>
            <strong class="dark:text-white text-slate-900">2.4GHz Frequency:</strong> Suitable for farther distance coverage and better wall penetration across large houses.<br />
            <strong class="dark:text-white text-slate-900">5GHz Frequency:</strong> Provides lightning-fast turbo fiber speeds with minimal interference, ideal for 4K streaming and online gaming closer to the modem.
          </p>
        </div>
      </div>
    </div>

    <!-- Application Requirements & ID Checklist -->
    <div class="glass-card p-8 sm:p-12 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-8 max-w-6xl mx-auto">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase">
          <FileText class="w-3.5 h-3.5" />
          <span>Application Checklist</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
          Requirements for Internet Application
        </h2>
        <p class="text-xs sm:text-sm dark:text-slate-400 text-slate-600">
          Prepare these basic requirements when applying online or visiting our branch in Rizal.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 1. Government ID -->
        <div class="p-6 rounded-2xl dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 class="w-5 h-5" />
          </div>
          <h4 class="font-bold font-heading dark:text-white text-slate-900 text-base">1. Valid Government ID</h4>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
            Submit <strong>(1) Primary ID</strong> (Passport, National ID Philsys, Driver's License, PhilHealth, UMID, TIN, SSS, Voter's ID) or <strong>(2) Secondary IDs</strong>.
          </p>
        </div>

        <!-- 2. House Front Picture -->
        <div class="p-6 rounded-2xl dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <CheckCircle2 class="w-5 h-5" />
          </div>
          <h4 class="font-bold font-heading dark:text-white text-slate-900 text-base">2. House Front Picture</h4>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
            A clear photo of your residential or commercial facade/gate so our ocular survey and dispatch crew can pinpoint your address accurately.
          </p>
        </div>

        <!-- 3. Active Contact Info -->
        <div class="p-6 rounded-2xl dark:bg-slate-900 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <CheckCircle2 class="w-5 h-5" />
          </div>
          <h4 class="font-bold font-heading dark:text-white text-slate-900 text-base">3. Active Mobile & Email</h4>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
            Active 11-digit mobile number and email address to receive your Reference Code, dispatch notifications, and monthly SOA.
          </p>
        </div>
      </div>

      <!-- Excluded IDs Notice -->
      <div class="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs dark:text-rose-300 text-rose-800">
        <AlertCircle class="w-5 h-5 text-[#ee2824] shrink-0 mt-0.5" />
        <div>
          <strong class="font-bold">Important Note on ID Restrictions:</strong> We <u>do not</u> accept expired IDs, PWD ID, OFW E-Card, Solo Parent ID, Police Clearance, or Pag-IBIG Loyalty Card Plus for new subscription applications.
        </div>
      </div>
    </div>

    <!-- Modem Warranty & Replacement Policy -->
    <div class="max-w-6xl mx-auto space-y-5">
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-extrabold font-heading dark:text-white text-slate-900">
          Modem Warranty &amp; Replacement Policy
        </h2>
        <p class="text-xs dark:text-slate-400 text-slate-600 max-w-2xl mx-auto">
          What is covered free of charge and what is chargeable if your Switch Fiber modem needs replacing.
        </p>
      </div>

      <div class="glass-card rounded-3xl border dark:border-slate-800 border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs sm:text-sm">
            <caption class="sr-only">Modem replacement conditions and their corresponding terms</caption>
            <thead>
              <tr class="border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-slate-50">
                <th scope="col" class="py-3 px-4 font-bold dark:text-white text-slate-900 w-1/2">Condition</th>
                <th scope="col" class="py-3 px-4 font-bold dark:text-white text-slate-900">Terms</th>
              </tr>
            </thead>
            <tbody class="divide-y dark:divide-slate-800/70 divide-slate-200 dark:text-slate-300 text-slate-600 align-top">
              <tr v-for="row in warrantyPolicy" :key="row.condition">
                <th scope="row" class="py-3 px-4 text-left font-semibold dark:text-slate-200 text-slate-800">
                  {{ row.condition }}
                  <ul v-if="row.examples" class="mt-2 space-y-1 font-normal list-[lower-alpha] list-inside dark:text-slate-400 text-slate-500">
                    <li v-for="ex in row.examples" :key="ex">{{ ex }}</li>
                  </ul>
                </th>
                <td class="py-3 px-4">
                  <p v-for="(line, i) in row.terms" :key="i" :class="i > 0 ? 'mt-2' : ''">{{ line }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="text-[11px] dark:text-slate-500 text-slate-500 text-center">
        Replacement requests must be submitted through our customer support at
        <a href="tel:09154077565" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">0915 407 7565</a>.
      </p>
    </div>

    <!-- Official Customer Care & Walk-in Office Details -->
    <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-[#ee2824]/30 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] text-xs font-bold uppercase">
          <PhoneCall class="w-3.5 h-3.5" />
          <span>Customer Care Hotlines</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
          Need Live Technical Assistance?
        </h2>
        <p class="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
          Our customer care and technical support teams in Rizal are ready to assist you via phone or at our head office.
        </p>

        <div class="space-y-2 pt-2 text-xs dark:text-slate-300 text-slate-700">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Customer Support:</span>
            <span class="font-mono">0915 407 7565 / 0917 876 2440</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Billing Hotline:</span>
            <span class="font-mono">0915 407 7555</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Business Hours:</span>
            <span>Mon–Sat 8:00 AM – 5:00 PM (12 NN–1 PM Lunch Break)</span>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-2xl dark:bg-slate-900 bg-white border dark:border-slate-800 border-slate-200 space-y-3 shadow-lg">
        <span class="text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-wider block">Head Office (Binangonan)</span>
        <h4 class="font-bold dark:text-white text-slate-900 text-base">Switch Internet Services Co.</h4>
        <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed font-mono">
          315 Sampaloc St., Sta. Ursula Subd., Brgy. Batingan, Binangonan, Rizal, Philippines, 1940
        </p>
        <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
          ✓ Walk-in applications and over-the-counter payments accepted!
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { HelpCircle, Globe, Key, Wifi, Info, FileText, CheckCircle2, AlertCircle, PhoneCall } from 'lucide-vue-next'

// Transcribed from the official Switch Fiber modem warranty policy table.
const warrantyPolicy = [
  {
    condition: 'Manufacturing defect from the modem',
    terms: ['Free replacement']
  },
  {
    condition: 'Damage due to misuse, liquid, fire, etc.',
    terms: ['Paid replacement by the client at standard market cost']
  },
  {
    condition: 'Fortuitous Events (Force Majeure) are defined as acts, events, or occurrences beyond the reasonable control of the Company, including but not limited to:',
    examples: [
      'Natural disasters (earthquakes, floods, hurricanes, etc.)',
      'Fire, explosions, or severe weather conditions',
      'War, acts of terrorism, civil unrest, or military actions',
      'Epidemics, pandemics, or government-imposed quarantines',
      'Power failures, cyberattacks, or infrastructure disruptions',
      'Strikes, labor disputes, or disruptions in transportation or supply chains'
    ],
    terms: [
      'Paid replacement by the client at standard market cost',
      'Any warranty on equipment may be voided in cases of damage caused by force majeure events.',
      'Switch will not be responsible for losses, including data loss, arising from hardware failure due to force majeure.'
    ]
  },
  {
    condition: 'Out-of-warranty issue',
    terms: ['Paid replacement by the client at standard market cost']
  },
  {
    condition: 'Theft or loss',
    terms: [
      'Customer must report to Switch Fiber',
      'Full device cost payable for replacement.',
      'Replacement requests must be submitted through our customer support.'
    ]
  },
  {
    condition: 'Damaged by external factors (weather, pests, power surge)',
    terms: ['Paid replacement by the client at standard market cost']
  },
  {
    condition: 'User negligence (e.g., cutting wires, improper storage)',
    terms: ['Paid replacement by the client at standard market cost']
  }
]
</script>
