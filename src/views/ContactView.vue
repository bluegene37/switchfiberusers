<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
    
    <!-- Hero Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/20">
        <Headphones class="w-4 h-4" />
        <span>Contact Switch Fiber</span>
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        We're Here to <span class="text-[#ee2824] dark:text-[#ff6b67]">Help You</span>
      </h1>
      <p class="text-base sm:text-lg dark:text-slate-300 text-slate-600">
        Reach out to our customer care hotlines, send an inquiry, or visit our offices in Binangonan, Rizal (Head Office & Gaisano Capital Branch).
      </p>
      <div v-if="showServiceOrderForm" class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <a
          href="#concern-form"
          class="btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-2 min-h-11 shadow-md shadow-[#ee2824]/20"
        >
          <LifeBuoy class="w-4 h-4" />
          <span>Report an Issue / Service Ticket</span>
        </a>
        <a
          href="#offices-map"
          class="btn-secondary py-2.5 px-5 text-xs font-bold flex items-center gap-2 min-h-11"
        >
          <MapPin class="w-4 h-4 text-[#ee2824]" />
          <span>View Binangonan Offices</span>
        </a>
      </div>
    </div>

    <!-- Official 4 Contact Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- 1. Customer Support -->
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 relative overflow-hidden group hover:border-[#ee2824]/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/30">
          <Headphones class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold font-heading text-base dark:text-white text-slate-900">Customer Support</h3>
          <p class="text-xs dark:text-slate-300 text-slate-700 font-mono mt-1 leading-relaxed">
            0915-407-7565 (Globe)<br />
            0917 876 2440 (Globe)
          </p>
        </div>
      </div>

      <!-- 2. Billing Concern -->
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 relative overflow-hidden group hover:border-[#ee2824]/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/30">
          <Headphones class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold font-heading text-base dark:text-white text-slate-900">Billing Concern</h3>
          <p class="text-xs dark:text-slate-300 text-slate-700 font-mono mt-1">
            0915-407-7555 (Globe)
          </p>
        </div>
      </div>

      <!-- 3. General Inquiries -->
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 relative overflow-hidden group hover:border-[#ee2824]/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/30">
          <Mail class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold font-heading text-base dark:text-white text-slate-900">General Inquiries</h3>
          <a href="mailto:customercare@switchfiber.ph" class="text-xs text-[#ee2824] dark:text-[#ff6b67] font-semibold underline mt-1 inline-flex items-center min-h-11 max-w-full truncate">
            customercare@switchfiber.ph
          </a>
        </div>
      </div>

      <!-- 4. Sales & Marketing Inquiries -->
      <div class="glass-card p-6 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-3 relative overflow-hidden group hover:border-[#ee2824]/50 transition-all">
        <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center shadow-md shadow-[#ee2824]/30">
          <Mail class="w-5 h-5" />
        </div>
        <div>
          <h3 class="font-bold font-heading text-base dark:text-white text-slate-900">Sales & Marketing</h3>
          <a href="mailto:sales@switchfiber.ph" class="text-xs text-[#ee2824] dark:text-[#ff6b67] font-semibold underline mt-1 inline-flex items-center min-h-11 max-w-full truncate">
            sales@switchfiber.ph
          </a>
        </div>
      </div>

    </div>

    <!-- Customer Concern & Complaint Form Section (Hidden by default; revisit after backend team finishes) -->
    <section v-if="showServiceOrderForm" id="concern-form" class="scroll-mt-24">
      <ServiceConcernForm />
    </section>

    <!-- Visit Us Section & Embedded Google Map -->
    <div id="offices-map" class="space-y-6 scroll-mt-24">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] text-xs font-bold mb-2">
            <MapPin class="w-4 h-4" />
            <span>Binangonan Office Locations</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
            Visit Us in Binangonan
          </h2>
          <p class="text-xs dark:text-slate-400 text-slate-600 mt-1">
            Drop by our offices for walk-in applications, bill payments, and friendly subscriber assistance.
          </p>
        </div>

        <!-- Office Switcher Tabs -->
        <div class="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 self-start sm:self-auto shadow-sm">
          <button
            v-for="(office, idx) in offices"
            :key="office.id"
            type="button"
            @click="selectedOfficeIndex = idx"
            :class="[
              'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 min-h-11',
              selectedOfficeIndex === idx
                ? 'bg-[#ee2824] text-white shadow-md shadow-[#ee2824]/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            <Building2 v-if="office.isBranch" class="w-4 h-4" />
            <MapPin v-else class="w-4 h-4" />
            <span>{{ office.shortName }}</span>
            <span v-if="office.isNew" class="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black tracking-wide uppercase">New</span>
          </button>
        </div>
      </div>

      <!-- Main Map & Detail Card -->
      <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Google Map Container -->
        <div class="lg:col-span-7 rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-300 shadow-lg min-h-[340px] relative bg-slate-100 dark:bg-slate-900">
          <iframe 
            v-if="mapConsented"
            :key="currentOffice.id"
            :title="`${currentOffice.name} Google Map`"
            :src="currentOffice.mapSrc" 
            class="w-full h-80 sm:h-96 border-0" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <!-- Click-to-load placeholder: Google Maps sets its own cookies, so it is
               only embedded once the visitor asks for it. -->
          <div v-else class="sf-map-consent w-full h-80 sm:h-96 flex flex-col items-center justify-center text-center gap-4 p-6">
            <div class="w-14 h-14 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center">
              <MapPin class="w-7 h-7" />
            </div>
            <div class="space-y-1 max-w-sm">
              <p class="font-bold dark:text-white text-slate-900">{{ currentOffice.name }}</p>
              <p class="text-xs dark:text-slate-400 text-slate-600">{{ currentOffice.address }}</p>
            </div>
            <button type="button" @click="mapConsented = true" class="btn-primary text-xs py-2.5 px-5">
              <MapPin class="w-4 h-4" />
              <span>Load Google Map</span>
            </button>
            <p class="text-[11px] dark:text-slate-500 text-slate-500 max-w-xs">
              Loading the map embeds content from Google Maps, which may set cookies. See our
              <router-link to="/privacy-policy" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">Privacy Policy</router-link>.
            </p>
          </div>
          
          <!-- Map Overlay Tag -->
          <div class="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/10 shadow-lg">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{{ currentOffice.name }}</span>
          </div>
        </div>

        <!-- Visit Us Details -->
        <div class="lg:col-span-5 space-y-4">
          <div class="flex items-center gap-2">
            <span :class="[
              'px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide',
              currentOffice.isNew
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] border border-[#ee2824]/20'
            ]">
              {{ currentOffice.badge }}
            </span>
            <span v-if="currentOffice.isNew" class="text-xs font-bold text-amber-500 flex items-center gap-1">
              <Sparkles class="w-3.5 h-3.5" />
              <span>Now Open!</span>
            </span>
          </div>

          <h3 class="text-2xl font-extrabold font-heading text-[#ee2824] dark:text-[#ff6b67]">
            {{ currentOffice.name }}
          </h3>

          <div class="space-y-1 text-sm dark:text-slate-200 text-slate-800 font-semibold leading-relaxed">
            <p>{{ currentOffice.address }}</p>
            <p v-if="currentOffice.landmark" class="text-xs text-slate-500 dark:text-slate-400 font-normal">
              📍 {{ currentOffice.landmark }}
            </p>
          </div>

          <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {{ currentOffice.highlights }}
          </p>

          <div class="pt-3 text-xs dark:text-slate-300 text-slate-700 space-y-1.5 font-medium border-t dark:border-slate-800 border-slate-200">
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4 text-blue-500 shrink-0" />
              <p><span class="font-bold">Operating Hours:</span> {{ currentOffice.hours }}</p>
            </div>
            <p class="text-slate-500 pl-6 text-[11px]">{{ currentOffice.lunchBreak }}</p>
          </div>

          <!-- Quick Action Links -->
          <div class="pt-2 flex flex-wrap items-center gap-3">
            <a
              :href="currentOffice.directionsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#ee2824]/20 min-h-11"
            >
              <Navigation class="w-3.5 h-3.5" />
              <span>Get Directions</span>
              <ExternalLink class="w-3 h-3 opacity-70" />
            </a>

            <router-link
              to="/register"
              class="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 min-h-11"
            >
              <Sparkles class="w-3.5 h-3.5 text-[#ee2824] dark:text-[#ff6b67]" />
              <span>Apply Online</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Quick Office Comparison Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="(office, idx) in offices"
          :key="`card-${office.id}`"
          @click="selectedOfficeIndex = idx"
          :class="[
            'p-5 rounded-2xl border cursor-pointer transition-all duration-200 text-left',
            selectedOfficeIndex === idx
              ? 'dark:bg-slate-900 bg-red-50/50 border-[#ee2824] shadow-md shadow-[#ee2824]/10 ring-1 ring-[#ee2824]'
              : 'dark:bg-slate-900/50 bg-white border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <Building2 v-if="office.isBranch" class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
              <MapPin v-else class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
              <h4 class="font-bold text-sm dark:text-white text-slate-900">{{ office.name }}</h4>
            </div>
            <span v-if="office.isNew" class="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold border border-amber-500/30">NEW BRANCH</span>
            <span v-else class="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold">MAIN HQ</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">{{ office.address }}</p>
          <div class="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span class="text-slate-500">{{ office.hours }}</span>
            <span class="font-bold text-[#ee2824] dark:text-[#ff6b67] flex items-center gap-1">
              {{ selectedOfficeIndex === idx ? 'Viewing on Map' : 'Click to View Map' }} →
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Subscriber Notice & Policy Infographic Cards Grid -->
    <div class="space-y-6">
      <div class="text-center space-y-2">
        <h2 class="text-2xl font-extrabold font-heading dark:text-white text-slate-900">
          Important Subscriber Guidelines & Policies
        </h2>
        <p class="text-xs dark:text-slate-400 text-slate-600">
          Helpful information regarding billing, account balances, modem care, and official fees.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Card 1: Understand Your Bill Easily -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4">
          <button
            type="button"
            @click="openAdvisory(0)"
            class="block w-full rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-200 relative cursor-zoom-in group/adv"
            :aria-label="`View full size: ${advisories[0].title}`"
          >
            <img
              :src="advisories[0].src"
              :alt="advisories[0].alt"
              class="w-full h-auto group-hover/adv:opacity-90 transition-opacity"
              decoding="async"
              width="1080"
              height="1080"
            />
            <span class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
              <Maximize2 class="w-3 h-3" />
              <span>View Full Size</span>
            </span>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ee2824]/10 text-[#ee2824] flex items-center justify-center font-bold text-lg">1</div>
            <h3 class="font-bold font-heading text-lg dark:text-white text-slate-900">Understand Your Bill Easily</h3>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
            Your Statement of Account (SOA) is delivered directly to your registered email address and mobile number every month. It includes your Account Number, Billing Period, Due Date, and Total Amount Due.
          </p>
          <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border dark:border-slate-800 border-slate-200 text-xs space-y-2">
            <p class="font-semibold dark:text-slate-200 text-slate-800">Available Payment Channels:</p>
            <div class="flex flex-wrap gap-2 text-[11px] font-bold text-[#ee2824] dark:text-[#ff6b67]">
              <span class="px-2 py-1 bg-red-500/10 rounded-md">GCash (QR PH)</span>
              <span class="px-2 py-1 bg-red-500/10 rounded-md">Maya</span>
              <span class="px-2 py-1 bg-red-500/10 rounded-md">Debit / Credit Card</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Ways to Know Your Account Balance -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4">
          <button
            type="button"
            @click="openAdvisory(1)"
            class="block w-full rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-200 relative cursor-zoom-in group/adv"
            :aria-label="`View full size: ${advisories[1].title}`"
          >
            <img
              :src="advisories[1].src"
              :alt="advisories[1].alt"
              class="w-full h-auto group-hover/adv:opacity-90 transition-opacity"
              decoding="async"
              width="1080"
              height="1080"
            />
            <span class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
              <Maximize2 class="w-3 h-3" />
              <span>View Full Size</span>
            </span>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ee2824]/10 text-[#ee2824] flex items-center justify-center font-bold text-lg">2</div>
            <h3 class="font-bold font-heading text-lg dark:text-white text-slate-900">Ways to Know Your Account Balance</h3>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
            Easily check your current balance online anytime via our portal or receive your SOA on the 23rd day of every month:
          </p>
          <ul class="space-y-2 text-xs font-semibold dark:text-slate-300 text-slate-700">
            <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500" /> Visit <a href="https://pay.switchfiber.ph" target="_blank" rel="noopener noreferrer" class="text-[#ee2824] underline">pay.switchfiber.ph</a> and enter your Account Number</li>
            <li class="flex items-center gap-2"><CheckCircle2 class="w-4 h-4 text-emerald-500" /> Check SMS notifications sent to your registered mobile number</li>
          </ul>
        </div>

        <!-- Card 3: Switch Reminder - DO NOT RESET YOUR MODEM -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border border-[#ee2824]/30 bg-red-500/5 space-y-4">
          <button
            type="button"
            @click="openAdvisory(2)"
            class="block w-full rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-200 relative cursor-zoom-in group/adv"
            :aria-label="`View full size: ${advisories[2].title}`"
          >
            <img
              :src="advisories[2].src"
              :alt="advisories[2].alt"
              class="w-full h-auto group-hover/adv:opacity-90 transition-opacity"
              decoding="async"
              width="1080"
              height="1080"
            />
            <span class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
              <Maximize2 class="w-3 h-3" />
              <span>View Full Size</span>
            </span>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center font-bold">
              <AlertTriangle class="w-5 h-5" />
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase text-[#ee2824] tracking-wider block">Important Switch Reminder</span>
              <h3 class="font-extrabold font-heading text-lg text-[#ee2824] dark:text-[#ff6b67]">DO NOT RESET YOUR MODEM</h3>
            </div>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
            Resetting the modem will erase your modem's configuration and internet settings, incurring a re-configuration fee of <strong>₱150</strong>.
          </p>
          <div class="p-3 bg-[#ee2824]/10 rounded-xl text-xs font-semibold text-[#ee2824] dark:text-[#ff6b67]">
            For any connection issues, please contact Customer Service immediately: <strong>0915-407-7565</strong>
          </div>
        </div>

        <!-- Card 4: NO PROCESSING FEE / NO APPLICATION FEE -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border border-[#ee2824]/30 bg-red-500/5 space-y-4">
          <button
            type="button"
            @click="openAdvisory(3)"
            class="block w-full rounded-2xl overflow-hidden border dark:border-slate-800 border-slate-200 relative cursor-zoom-in group/adv"
            :aria-label="`View full size: ${advisories[3].title}`"
          >
            <img
              :src="advisories[3].src"
              :alt="advisories[3].alt"
              class="w-full h-auto group-hover/adv:opacity-90 transition-opacity"
              decoding="async"
              width="1080"
              height="1080"
            />
            <span class="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-slate-950/70 text-white text-[10px] font-semibold flex items-center gap-1 pointer-events-none">
              <Maximize2 class="w-3 h-3" />
              <span>View Full Size</span>
            </span>
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-[#ee2824] text-white flex items-center justify-center font-bold">
              <ShieldAlert class="w-5 h-5" />
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase text-[#ee2824] tracking-wider block">Official Fee Policy</span>
              <h3 class="font-extrabold font-heading text-lg text-[#ee2824] dark:text-[#ff6b67]">NO PROCESSING FEE / NO APPLICATION FEE</h3>
            </div>
          </div>
          <p class="text-xs dark:text-slate-300 text-slate-700 leading-relaxed">
            Our Technicians and Sales Agents are <strong>NOT AUTHORIZED</strong> to impose or collect any extra fees from subscribers.
          </p>
          <div class="p-3 bg-[#ee2824]/10 rounded-xl text-xs font-semibold text-[#ee2824] dark:text-[#ff6b67]">
            If you encounter unauthorized fee requests, please report immediately to hotlines: <strong>0915 407 7565 / 0917 876 2440</strong>
          </div>
        </div>

      </div>
    </div>

    <!-- Direct Official Inquiries & Assistance Banner -->
    <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 text-center space-y-4 max-w-4xl mx-auto">
      <div class="w-12 h-12 rounded-2xl bg-[#ee2824]/10 text-[#ee2824] dark:text-[#ff6b67] flex items-center justify-center mx-auto">
        <Mail class="w-6 h-6" />
      </div>
      <h2 class="text-2xl font-bold font-heading dark:text-white text-slate-900">
        Need Immediate Assistance or Inquiry?
      </h2>
      <p class="text-sm dark:text-slate-300 text-slate-600 max-w-2xl mx-auto leading-relaxed">
        For reliable customer support, billing verification, and plan applications, reach out to our verified official channels directly:
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <a 
          href="mailto:customercare@switchfiber.ph" 
          class="btn-primary py-3 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#ee2824]/20 min-h-11"
        >
          <Mail class="w-4 h-4" />
          <span>customercare@switchfiber.ph</span>
        </a>
        <a 
          href="tel:09154077565" 
          class="btn-secondary py-3 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 min-h-11 hover:text-[#ee2824] dark:hover:text-[#ff6b67]"
        >
          <PhoneCall class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Hotline: 0915 407 7565</span>
        </a>
        <a 
          href="https://m.me/switchfiber.ph" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-secondary py-3 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 min-h-11 hover:text-[#ee2824] dark:hover:text-[#ff6b67]"
        >
          <MessageSquare class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
          <span>Facebook Messenger</span>
        </a>
      </div>
    </div>

    <!-- Advisory Image Lightbox -->
    <Teleport to="body">
      <div
        v-if="activeAdvisory !== null"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        @click="closeAdvisory"
      >
        <div class="relative max-w-3xl w-full max-h-[92vh] p-2 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden" @click.stop>
          <button
            @click="closeAdvisory"
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-[#ee2824] transition-colors"
            aria-label="Close image viewer"
          >
            <X class="w-5 h-5" />
          </button>
          <img
            :src="advisories[activeAdvisory].src"
            :alt="advisories[activeAdvisory].alt"
            class="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain mx-auto"
          />
          <div class="p-3 text-center text-xs text-slate-300 font-semibold">
            {{ advisories[activeAdvisory].title }}
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Headphones, Mail, MapPin, AlertTriangle, ShieldAlert, 
  CheckCircle2, Maximize2, X, Building2, Clock, 
  Navigation, ExternalLink, Sparkles, PhoneCall, MessageSquare,
  LifeBuoy
} from 'lucide-vue-next'
import ServiceConcernForm from '../components/ServiceConcernForm.vue'

const route = useRoute()
// Service & Ticketing reporting area for subscribers; active by default, can be toggled via ?serviceOrder=false
const showServiceOrderForm = computed(() => route?.query?.serviceOrder !== 'false')

// Binangonan Office Locations
const offices = [
  {
    id: 'gaisano',
    name: 'Gaisano Capital Binangonan',
    shortName: 'Gaisano Capital Branch',
    badge: 'New Branch Office',
    isNew: true,
    isBranch: true,
    address: 'Gaisano Capital Binangonan, Manila East Road, Brgy. Calumpang, Binangonan, Rizal, 1940',
    landmark: 'Located along Manila East Road — Inside Gaisano Capital Mall (Ground Floor)',
    hours: 'Monday – Saturday: 10:00 AM – 7:00 PM',
    lunchBreak: 'Open through lunch hours for your convenience',
    highlights: '✨ Fast walk-in applications, plan consultations, and friendly customer assistance!',
    mapSrc: 'https://maps.google.com/maps?q=Gaisano+Capital+Binangonan,+Manila+East+Road,+Calumpang,+Binangonan,+Rizal&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Gaisano+Capital+Binangonan+Manila+East+Road+Calumpang+Binangonan+Rizal'
  },
  {
    id: 'headoffice',
    name: 'Head Office (Sta. Ursula)',
    shortName: 'Head Office (Batingan)',
    badge: 'Main Headquarters',
    isNew: false,
    isBranch: false,
    address: '315 Sampaloc St., Sta. Ursula Subd., Brgy. Batingan, Binangonan, Rizal, Philippines, 1940',
    landmark: 'Near Sta. Ursula Subdivision Main Entrance',
    hours: 'Monday – Saturday: 8:00 AM – 5:00 PM',
    lunchBreak: 'Lunch Break: 12:00 PM – 1:00 PM',
    highlights: '✨ Walk-in applications, over-the-counter cash payments, and technical service support!',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15454.498114421118!2d121.1856755!3d14.4533041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c11f7c320299%3A0x6b13e9a7e6bdf20a!2sSta.%20Ursula%20Subd%2C%20Binangonan%2C%20Rizal!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=315+Sampaloc+St+Sta+Ursula+Subd+Batingan+Binangonan+Rizal'
  }
]

const selectedOfficeIndex = ref(0)
const currentOffice = computed(() => offices[selectedOfficeIndex.value])
const mapConsented = ref(false)

// Official advisory graphics from switchfiber.ph, served locally from
// public/advisories/ (WebP, optimized from the originals).
const advisories = [
  {
    src: '/advisories/billing-guide.webp',
    title: 'Understand Your Bill Easily',
    alt: 'Official Switch Fiber billing guide showing a sample Statement of Account with the Billing Information, Due Date, Total Amount Due and accepted payment methods highlighted'
  },
  {
    src: '/advisories/account-balance.webp',
    title: 'Ways to Know Your Account Balance',
    alt: 'Official Switch Fiber guide listing three ways to check your account balance: billing reminder emails, the monthly Statement of Account sent every 23rd, and SMS reminders'
  },
  {
    src: '/advisories/modem-warning.webp',
    title: 'Switch Reminder: Do Not Reset Your Modem',
    alt: 'Official Switch Fiber reminder warning not to press the modem reset button because reconfiguration costs 150 pesos; contact Customer Service 09154077565 for connection issues'
  },
  {
    src: '/advisories/no-fee-advisory.webp',
    title: 'No Processing Fee / No Application Fee',
    alt: 'Official Switch Fiber advisory: technicians and sales agents are not authorized to collect any fees; report violations to hotlines Smart +63 919 386 9998 or Globe +63 915 407 7565'
  }
]

const activeAdvisory = ref(null)

function openAdvisory(index) {
  activeAdvisory.value = index
}

function closeAdvisory() {
  activeAdvisory.value = null
}

function onKeydown(e) {
  if (e.key === 'Escape') closeAdvisory()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
