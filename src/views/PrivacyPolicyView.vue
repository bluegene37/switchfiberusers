<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

    <!-- Title Header -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>Data Privacy Act of 2012 (RA 10173)</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        Privacy Policy
      </h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        How {{ BRAND }} collects, uses, shares and protects your personal information when you visit this website,
        apply for a fiber connection, track an application, or apply as a sales agent.
      </p>
      <p class="text-xs dark:text-slate-500 text-slate-500">Last updated: {{ LEGAL_LAST_UPDATED }}</p>
    </div>

    <!-- Table of contents -->
    <nav aria-label="Privacy Policy sections" class="glass-card p-5 rounded-2xl border dark:border-slate-800 border-slate-200">
      <h2 class="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-3">On this page</h2>
      <ol class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm list-decimal list-inside dark:text-slate-300 text-slate-700">
        <li v-for="s in sections" :key="s.id">
          <a :href="`#${s.id}`" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] hover:underline">{{ s.title }}</a>
        </li>
      </ol>
    </nav>

    <div class="space-y-8 text-sm leading-relaxed dark:text-slate-300 text-slate-700">

      <section :id="sections[0].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">1. Who we are</h2>
        <p>
          This website (switchfiber.ph) is operated by <strong>{{ LEGAL_ENTITY }}</strong>, doing business as {{ BRAND }},
          an internet service provider with its head office at {{ HEAD_OFFICE_ADDRESS }}.
          Under the Data Privacy Act of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations, we are the
          <em>personal information controller</em> for the data described in this policy.
        </p>
        <p>
          Our Data Protection Officer can be reached at
          <a :href="`mailto:${PRIVACY_CONTACT_EMAIL}`" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">{{ PRIVACY_CONTACT_EMAIL }}</a>
          or through our hotline <a :href="`tel:${HOTLINE_TEL}`" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">{{ HOTLINE_DISPLAY }}</a>
          ({{ OFFICE_HOURS }}).
        </p>
      </section>

      <section :id="sections[1].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">2. What we collect</h2>
        <p>We only collect what we need to check coverage, process your application, install and bill your service, and support you.</p>

        <h3 class="font-bold dark:text-white text-slate-900 pt-2">When you apply for a connection</h3>
        <ul class="list-disc list-inside space-y-1.5">
          <li><strong>Identity and contact details:</strong> full name, mobile number, email address, and the name of any referrer or sales agent.</li>
          <li><strong>Installation address:</strong> region, province, municipality, barangay, street address, landmarks, and map coordinates you pin or that we derive from your address.</li>
          <li><strong>Government-issued ID:</strong> a photo of one primary or two secondary IDs. Under RA 10173 this is <em>sensitive personal information</em>, which is why we ask for your explicit consent before you submit.</li>
          <li><strong>Proof of residence:</strong> a proof of billing, barangay certificate, lease contract or authorization document, if you choose to provide one.</li>
          <li><strong>House front photo:</strong> a photo of your house or gate. If your camera saved location, time or device details inside the photo file (EXIF metadata), we read those to help our technicians confirm the installation site.</li>
          <li><strong>Device location:</strong> only if you tap “Use My Current Location”, your browser asks your permission and shares your GPS coordinates with us to pre-fill the address.</li>
          <li><strong>Plan and promo choices</strong> and the date and time of your submission.</li>
        </ul>

        <h3 class="font-bold dark:text-white text-slate-900 pt-2">When you track or reschedule an installation</h3>
        <ul class="list-disc list-inside space-y-1.5">
          <li>Your Application ID, and any note you write for our dispatch team when you request a new installation date. Please do not include information you do not want our field team to see.</li>
        </ul>

        <h3 class="font-bold dark:text-white text-slate-900 pt-2">When you apply as a sales agent</h3>
        <ul class="list-disc list-inside space-y-1.5">
          <li>Full name, email address, mobile number, municipality and a short sales background. Onboarding documents (resume, ID, clearances) are sent to us by email or in person and are handled under the same rules.</li>
        </ul>

        <h3 class="font-bold dark:text-white text-slate-900 pt-2">Automatically, when you browse</h3>
        <ul class="list-disc list-inside space-y-1.5">
          <li><strong>Local storage on your device:</strong> your light or dark theme choice, an unsent draft of your application so you can resume it, and a copy of applications submitted from this browser so the tracker can find them quickly. This data stays in your browser and is not sent to us until you submit.</li>
          <li><strong>Server logs:</strong> our hosting provider records IP address, browser type, pages requested and timestamps for security and troubleshooting.</li>
        </ul>
        <p>We do not use advertising trackers, analytics pixels or social media tracking scripts on this website.</p>
      </section>

      <section :id="sections[2].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">3. Why we use it and our legal basis</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li><strong>To evaluate and process your application</strong> (line feasibility, document verification, credit evaluation) and to enter into a subscription contract with you. Basis: performance of a contract and steps taken at your request before entering into it.</li>
          <li><strong>To verify your identity and address</strong> using your government ID and proof of residence. Basis: your explicit consent, and our legal obligations as a service provider.</li>
          <li><strong>To schedule, install and activate your connection</strong>, including sharing your address, landmarks, photos and coordinates with our installation team. Basis: performance of a contract.</li>
          <li><strong>To bill you and collect payment</strong>, and to keep records required by tax and telecommunications regulations. Basis: contract and legal obligation.</li>
          <li><strong>To contact you</strong> by call, SMS or email about your application, installation schedule, bills, outages and service changes. Basis: contract and legitimate interest.</li>
          <li><strong>To provide customer and technical support</strong>. Basis: contract and legitimate interest.</li>
          <li><strong>To protect our network and prevent fraud</strong>, including unauthorized fee collection by people posing as our agents. Basis: legitimate interest.</li>
          <li><strong>To consider you for a sales agent engagement</strong>. Basis: steps taken at your request before entering into an agreement.</li>
        </ul>
        <p>We will not send you marketing messages unrelated to your service without asking for your separate consent first.</p>
      </section>

      <section :id="sections[3].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">4. Who we share it with</h2>
        <p>We do not sell your personal information. We share it only with parties who help us deliver the service, under contracts that require them to protect it:</p>
        <ul class="list-disc list-inside space-y-1.5">
          <li><strong>Installation and field teams</strong>, including accredited contractors, who receive your name, contact number, address, landmarks, photos and coordinates to complete the installation.</li>
          <li><strong>Messaging providers</strong> that deliver our confirmation emails and SMS on our behalf.</li>
          <li><strong>Payment portal</strong> at pay.switchfiber.ph and its payment processors, when you choose to pay online. Card and e-wallet details are entered on the processor's secure page and are never stored by us.</li>
          <li><strong>Map and geocoding services:</strong> when you pin your location or use the coverage map, the coordinates or address you enter are sent to OpenStreetMap's Nominatim service to look up the address, and map tiles are loaded from OpenStreetMap. The office map on our Contact page is loaded from Google Maps only after you choose to load it.</li>
          <li><strong>Website hosting and infrastructure providers</strong> that store and serve this website and our records.</li>
          <li><strong>Government agencies, regulators and courts</strong> when required by law, a lawful order, or to protect our rights.</li>
        </ul>
        <p>Some of these providers process data on servers outside the Philippines. Where that happens we ensure they are bound by contractual safeguards consistent with RA 10173.</p>
      </section>

      <section :id="sections[4].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">5. How long we keep it</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li><strong>Subscriber records:</strong> {{ RETENTION.activeSubscriber }}.</li>
          <li><strong>Applications that are declined, withdrawn or not completed:</strong> {{ RETENTION.unsuccessfulApplication }}.</li>
          <li><strong>Sales agent applications:</strong> {{ RETENTION.careersApplication }}.</li>
          <li><strong>Server logs:</strong> {{ RETENTION.serverLogs }}.</li>
        </ul>
        <p>Data stored in your own browser (theme, draft application, tracker cache) stays until you clear it or submit the draft.</p>
      </section>

      <section :id="sections[5].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">6. Cookies and local storage</h2>
        <p>
          This website does not set its own cookies. It uses your browser's <em>local storage</em> for strictly necessary
          purposes only: remembering your theme, saving an unsent application draft, and caching applications submitted
          from this browser. None of this is used for advertising or profiling.
        </p>
        <p>
          Third-party content may set its own cookies when loaded: the Google Maps embed on our Contact page (loaded only
          when you click “Load map”), and fonts served by Google Fonts. You can block or clear these through your browser settings.
        </p>
      </section>

      <section :id="sections[6].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">7. Your rights</h2>
        <p>Under the Data Privacy Act you have the right to:</p>
        <ul class="list-disc list-inside space-y-1.5">
          <li><strong>Be informed</strong> about how your data is collected and processed.</li>
          <li><strong>Access</strong> the personal information we hold about you.</li>
          <li><strong>Correct</strong> inaccurate or outdated information.</li>
          <li><strong>Object</strong> to processing, including for direct marketing.</li>
          <li><strong>Erase or block</strong> data that is no longer necessary, unlawfully obtained, or used for an unauthorized purpose.</li>
          <li><strong>Data portability</strong>, to obtain a copy of your data in a commonly used electronic format.</li>
          <li><strong>Withdraw consent</strong> at any time, without affecting processing done before withdrawal.</li>
          <li><strong>Be indemnified</strong> for damages caused by inaccurate, incomplete or unlawfully obtained data.</li>
          <li><strong>Lodge a complaint</strong> with the National Privacy Commission (privacy.gov.ph).</li>
        </ul>
        <p>
          To exercise any of these rights, email our Data Protection Officer at
          <a :href="`mailto:${PRIVACY_CONTACT_EMAIL}`" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">{{ PRIVACY_CONTACT_EMAIL }}</a>.
          We may ask you to verify your identity first. We respond within the periods required by the National Privacy Commission.
        </p>
      </section>

      <section :id="sections[7].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">8. How we protect it</h2>
        <p>
          Application data is transmitted over encrypted connections (HTTPS) and stored on access-controlled systems. On public
          screens such as the application tracker, personal details are partially masked. Photos are compressed on your device
          before upload to reduce the data we hold. Access to your records is limited to staff and contractors who need it for
          the purposes above. No system is completely secure, so if you believe your data has been compromised, contact us immediately.
        </p>
      </section>

      <section :id="sections[8].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">9. Minors</h2>
        <p>
          Our services and this website are intended for individuals 18 years old and above. We do not knowingly collect
          personal information from minors. If you believe a minor has submitted an application, contact us and we will delete it.
        </p>
      </section>

      <section :id="sections[9].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">10. Changes to this policy</h2>
        <p>
          We may update this policy as our services or the law change. The “Last updated” date at the top shows the current
          version. Material changes will be announced on this website, and where appropriate, sent to the contact details on your account.
        </p>
      </section>

      <section :id="sections[10].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">11. Contact us</h2>
        <div class="glass-card p-5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-1.5">
          <p><strong>{{ LEGAL_ENTITY }}</strong> (Data Protection Officer)</p>
          <p>{{ HEAD_OFFICE_ADDRESS }}</p>
          <p>Email: <a :href="`mailto:${PRIVACY_CONTACT_EMAIL}`" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">{{ PRIVACY_CONTACT_EMAIL }}</a></p>
          <p>Hotline: <a :href="`tel:${HOTLINE_TEL}`" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">{{ HOTLINE_DISPLAY }}</a> ({{ OFFICE_HOURS }})</p>
        </div>
        <p class="text-xs dark:text-slate-500 text-slate-500">
          See also our <router-link to="/terms" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">Terms &amp; Conditions</router-link>.
        </p>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ShieldCheck } from 'lucide-vue-next'
import {
  BRAND, LEGAL_ENTITY, HEAD_OFFICE_ADDRESS, HOTLINE_DISPLAY, HOTLINE_TEL,
  PRIVACY_CONTACT_EMAIL, OFFICE_HOURS, LEGAL_LAST_UPDATED, RETENTION
} from '../data/legal'

const sections = [
  { id: 'who-we-are', title: 'Who we are' },
  { id: 'what-we-collect', title: 'What we collect' },
  { id: 'why-we-use-it', title: 'Why we use it and our legal basis' },
  { id: 'who-we-share-with', title: 'Who we share it with' },
  { id: 'retention', title: 'How long we keep it' },
  { id: 'cookies', title: 'Cookies and local storage' },
  { id: 'your-rights', title: 'Your rights' },
  { id: 'security', title: 'How we protect it' },
  { id: 'minors', title: 'Minors' },
  { id: 'changes', title: 'Changes to this policy' },
  { id: 'contact', title: 'Contact us' }
]
</script>
