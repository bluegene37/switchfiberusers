<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
    
    <!-- Hero Header -->
    <div class="text-center space-y-4 max-w-3xl mx-auto">
      <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        <HeartHandshake class="w-4 h-4 text-[#ee2824] dark:text-[#ff6b67]" />
        <span>About Switch Fiber</span>
      </span>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight leading-tight">
        Connecting Homes & Businesses Across <span class="text-[#ee2824] dark:text-[#ff6b67]">Rizal</span>
      </h1>
      <p class="text-base sm:text-lg dark:text-slate-300 text-slate-600 leading-relaxed">
        Switch Fiber is an (ISP) Internet Service Provider that was launched in November 2023. Since then, the company — Switch Internet Services Co. has grown and expanded its area coverages over the years.
      </p>
    </div>

    <!-- Our Mission & Our Vision Section -->
    <div class="space-y-8">
      <div class="text-center space-y-2">
        <h2 class="text-2xl sm:text-4xl font-extrabold font-heading dark:text-white text-slate-900">
          Our Mission & Vision
        </h2>
        <p class="text-xs sm:text-sm dark:text-slate-400 text-slate-600">
          Guiding our commitment to empower households and businesses in Rizal.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Our Mission Card -->
        <div class="glass-card p-8 sm:p-10 rounded-3xl border dark:border-slate-800 border-slate-200 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-sky-500/40 transition-all duration-300">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold tracking-wide uppercase">
                <Target class="w-3.5 h-3.5" />
                <span>Our Mission</span>
              </span>
              <div class="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Target class="w-5 h-5" />
              </div>
            </div>
            <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900">
              Leading & Trusted Provider
            </h3>
            <p class="text-sm sm:text-base dark:text-slate-300 text-slate-600 leading-relaxed">
              We aspire to be the leading and trusted internet service provider in Rizal. We aim to dominate the market by offering quality internet connection to residential and businesses all over the region while enhancing lives, bridging digital divides, and fostering long-term value for Filipino households.
            </p>
          </div>
          <div class="pt-4 border-t dark:border-slate-800/80 border-slate-100 flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
            <span>Quality • Reliability • Value</span>
          </div>
        </div>

        <!-- Our Vision Card -->
        <div class="glass-card p-8 sm:p-10 rounded-3xl border dark:border-slate-800 border-slate-200 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold tracking-wide uppercase">
                <Compass class="w-3.5 h-3.5" />
                <span>Our Vision</span>
              </span>
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Compass class="w-5 h-5" />
              </div>
            </div>
            <h3 class="text-2xl font-bold font-heading dark:text-white text-slate-900">
              Transforming Communities
            </h3>
            <p class="text-sm sm:text-base dark:text-slate-300 text-slate-600 leading-relaxed">
              We envisioned to be the leading and trusted internet service provider in delivering seamless and affordable connection, providing employment opportunities in Rizal. The company intends to transform the way communities and businesses connect, thrive by providing reliable, high-speed internet that empowers every user.
            </p>
          </div>
          <div class="pt-4 border-t dark:border-slate-800/80 border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Empowerment • Community • Growth</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Official Company Story & Overview -->
    <div class="glass-card p-8 sm:p-12 rounded-3xl border dark:border-slate-800 border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div class="space-y-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold font-heading dark:text-white text-slate-900">
          Our Journey & Expansion
        </h2>
        <p class="text-sm sm:text-base dark:text-slate-300 text-slate-600 leading-relaxed">
          The company began its operations and is currently providing services in Binangonan, Rizal. Switch Fiber is also set to launch to the neighboring municipalities, starting from Angono by year 2025.
        </p>
        <p class="text-sm sm:text-base dark:text-slate-300 text-slate-600 leading-relaxed">
          They introduced its FTTH (fiber-to-the-home) subscription plans in the market to address the increasing demand for a reliable, affordable, and trusted internet service in the area especially to isolated locations.
        </p>
        <div class="flex flex-wrap gap-4 pt-2">
          <router-link to="/register" class="btn-primary flex items-center gap-2">
            <span>Apply Online Now</span>
            <ArrowRight class="w-4 h-4" />
          </router-link>
          <router-link to="/plans" class="btn-secondary">
            <span>View Fiber Plans</span>
          </router-link>
        </div>
      </div>

      <!-- Right Card: Brand Commitment & Employment -->
      <div class="space-y-6">
        <div class="glass-panel p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="Switch Fiber" class="w-12 h-12 object-contain" />
            <div>
              <h4 class="font-heading font-extrabold text-xl dark:text-white text-slate-900">SWITCH<span class="text-[#ee2824] dark:text-[#ff6b67]">FIBER</span></h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Switch Internet Services Co.</p>
            </div>
          </div>
          <p class="text-xs sm:text-sm dark:text-slate-300 text-slate-700 leading-relaxed">
            The company stays true to its commitment to offer proactive customer support, unlimited and affordable internet service to its customers.
          </p>
          <hr class="dark:border-slate-800 border-slate-200" />
          <div class="space-y-2">
            <h5 class="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Empowering Rizal Communities</h5>
            <p class="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
              Switch Fiber is also committed to provide employment opportunities to the residents of Rizal, offering engagement activities, decent salary, career growth, recognitions and promotions to its employees.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Core Pillars Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4 hover:border-sky-500/40 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center">
          <Zap class="w-6 h-6" />
        </div>
        <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">FTTH Fiber Technology</h3>
        <p class="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
          Fiber-to-the-Home plans built to deliver fast, reliable, and trusted connectivity even to isolated locations.
        </p>
      </div>

      <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4 hover:border-emerald-500/40 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">Proactive Support</h3>
        <p class="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
          Proactive customer care hotlines and dedicated local tech teams resolving network inquiries quickly.
        </p>
      </div>

      <div class="glass-card p-8 rounded-3xl border dark:border-slate-800 border-slate-200 space-y-4 hover:border-amber-500/40 transition-all duration-300">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
          <Users class="w-6 h-6" />
        </div>
        <h3 class="text-xl font-bold font-heading dark:text-white text-slate-900">Local Opportunities</h3>
        <p class="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
          Empowering local talents with career growth, competitive salaries, recognitions, and promotions in Rizal.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { HeartHandshake, Target, Compass, Zap, ShieldCheck, Users, ArrowRight } from 'lucide-vue-next'
</script>
