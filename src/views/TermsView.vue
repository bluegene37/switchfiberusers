<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

    <!-- Title Header -->
    <div class="text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ee2824]/10 border border-[#ee2824]/30 text-xs font-bold text-[#ee2824] dark:text-[#ff6b67] uppercase tracking-widest">
        <FileText class="w-3.5 h-3.5" />
        <span>Service Agreement</span>
      </div>
      <h1 class="text-3xl sm:text-5xl font-extrabold font-heading dark:text-white text-slate-900 tracking-tight">
        Terms &amp; Conditions
      </h1>
      <p class="dark:text-slate-300 text-slate-600 text-base leading-relaxed">
        These terms govern your use of this website and your {{ BRAND }} internet subscription. By submitting an application
        or using the service, you agree to them.
      </p>
      <p class="text-xs dark:text-slate-500 text-slate-500">Last updated: {{ LEGAL_LAST_UPDATED }}</p>
    </div>

    <!-- Table of contents -->
    <nav aria-label="Terms and Conditions sections" class="glass-card p-5 rounded-2xl border dark:border-slate-800 border-slate-200">
      <h2 class="text-xs font-bold uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-3">On this page</h2>
      <ol class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm list-decimal list-inside dark:text-slate-300 text-slate-700">
        <li v-for="s in sections" :key="s.id">
          <a :href="`#${s.id}`" class="hover:text-[#ee2824] dark:hover:text-[#ff6b67] hover:underline">{{ s.title }}</a>
        </li>
      </ol>
    </nav>

    <div class="space-y-8 text-sm leading-relaxed dark:text-slate-300 text-slate-700">

      <section :id="sections[0].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">1. Parties and acceptance</h2>
        <p>
          This agreement is between <strong>{{ LEGAL_ENTITY }}</strong>, doing business as {{ BRAND }} (“we”, “us”, the “Company”),
          with head office at {{ HEAD_OFFICE_ADDRESS }}, and the person named on the application (“you”, the “Subscriber”).
          Ticking the agreement box on the online application, signing an application form, or using the service means you accept these terms.
        </p>
      </section>

      <section :id="sections[1].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">2. Eligibility and application</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>You must be at least 18 years old and able to enter into a binding contract.</li>
          <li>You must provide accurate and complete information, one valid primary government ID or two secondary IDs, a clear photo of the installation site, and proof of residence when requested.</li>
          <li>Submitting an application is not a guarantee of service. Every application is subject to line feasibility, document verification and account review. We may decline an application at our discretion, and we will tell you if we do.</li>
          <li><strong>There is no application fee and no processing fee.</strong> No sales agent or field technician is authorized to collect payments from applicants. Report any request for such a fee to our hotline immediately.</li>
        </ul>
      </section>

      <section :id="sections[2].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">3. Installation</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>We will schedule installation after your application is approved and you will be notified of the date. You may request a different date through the application tracker or our hotline.</li>
          <li>An adult with a valid ID must be present at the installation address on the scheduled date.</li>
          <li>Standard installation covers up to 300 meters of fiber drop cable from the nearest fiber distribution point. Excess cable, special trunking, or unusual site conditions may be charged, and we will get your approval before doing any chargeable work.</li>
          <li>A standard installation fee of ₱500 applies unless waived under a current promo. Some areas may require a cash-out fee depending on distance and infrastructure. Any such fee will be disclosed to you before installation.</li>
          <li>You confirm you have the right to allow installation at the address, including any landlord or homeowners' association permission.</li>
        </ul>
      </section>

      <section :id="sections[3].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">4. Plans, speeds and fair use</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>Plan speeds are stated as “up to” maximums measured at the fiber terminal. Actual speed varies with your device, Wi-Fi conditions, in-home wiring, the websites and servers you connect to, and network conditions beyond our control.</li>
          <li>Our residential plans have no data cap. We may however apply reasonable network management to protect the network from abuse, such as commercial bandwidth resale or activity that degrades service for other subscribers.</li>
          <li>We may change plan inclusions, add plans or retire plans. Changes that reduce what you pay for during a lock-in period will not apply to you without your consent.</li>
        </ul>
      </section>

      <section :id="sections[4].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">5. Billing and payment</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>Monthly recurring charges are billed in advance every 1st of the calendar month. Your first bill may be pro-rated from the activation date.</li>
          <li>Bills must be settled on or before the due date shown on your statement, through pay.switchfiber.ph, our authorized payment channels, or over the counter at our head office.</li>
          <li>Accounts unpaid five (5) days after the due date may be charged a late payment fee and may be temporarily disconnected. Reconnection is made after full settlement and may be subject to a reconnection fee.</li>
          <li>Prices are in Philippine pesos and include VAT unless stated otherwise. Government-imposed taxes and fees may change and will be passed on as required by law.</li>
          <li>If you believe a bill is wrong, contact us within thirty (30) days of the statement date so we can review it.</li>
        </ul>
      </section>

      <section :id="sections[5].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">6. Lock-in period and pre-termination</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>Standard residential plans carry a minimum lock-in period of twelve (12) consecutive months from activation.</li>
          <li>Business and SmartBiz bundle plans carry a twenty-four (24) month lock-in period and renew automatically under the same terms unless you formally terminate before renewal.</li>
          <li>Terminating within the lock-in period is subject to a pre-termination fee equal to the remaining months' recurring charges or ₱3,000, whichever applies to your plan, plus the return of Company-owned equipment in good condition.</li>
          <li>After the lock-in period you may terminate with at least thirty (30) days' written notice.</li>
        </ul>
      </section>

      <section :id="sections[6].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">7. Equipment</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>The optical modem, router and related equipment we install remain Company property unless your plan states they are given to you. You must keep them safe, powered as instructed, and not open, modify or move them without our consent.</li>
          <li>Equipment that fails because of a manufacturing defect is replaced free of charge. Damage caused by misuse, power surges, water, pets, tampering or loss is replaced at your cost at standard market price. The modem replacement table on our Router &amp; Wi-Fi guide page describes the current conditions.</li>
          <li>On termination you must return Company-owned equipment within seven (7) days or pay its replacement cost.</li>
        </ul>
      </section>

      <section :id="sections[7].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">8. Service availability and maintenance</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>We work to keep the service available at all times but cannot guarantee uninterrupted or error-free service. Outages can result from power interruptions, weather, fiber cuts, upstream provider issues, or scheduled maintenance.</li>
          <li>We will try to announce planned maintenance in advance through our official channels and keep it as short as possible.</li>
          <li>Report faults to our hotline. Support hours are {{ OFFICE_HOURS }}. Our field team responds to reported faults within our service area as quickly as conditions allow.</li>
        </ul>
      </section>

      <section :id="sections[8].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">9. Acceptable use</h2>
        <p>You must not use the service, and must not allow others to use it, to:</p>
        <ul class="list-disc list-inside space-y-1.5">
          <li>break any Philippine law, including the Cybercrime Prevention Act, intellectual property laws and laws on child protection;</li>
          <li>resell, share or redistribute bandwidth commercially, or run a public hotspot, without a business plan and our written approval;</li>
          <li>send spam, distribute malware, or attempt to access networks, systems or accounts without authorization;</li>
          <li>interfere with our network or the service of other subscribers.</li>
        </ul>
        <p>You are responsible for everyone who uses the connection at your address and for securing your Wi-Fi with a strong password.</p>
      </section>

      <section :id="sections[9].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">10. Suspension and termination</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>We may suspend or terminate the service for non-payment, breach of acceptable use, fraud, misrepresentation in your application, or where required by law or a government order.</li>
          <li>Where practical we will warn you and give you a chance to remedy the issue first. Suspension does not stop recurring charges from accruing unless we say otherwise.</li>
          <li>You may terminate by giving written notice as described in Section 6.</li>
        </ul>
      </section>

      <section :id="sections[10].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">11. Promos and referrals</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>Promotions have their own period, eligibility rules and requirements, published on our Plans page or promo materials. Promo terms apply in addition to these terms.</li>
          <li>Promo benefits are generally limited to one per household or installation address and cannot be exchanged for cash.</li>
          <li>Referral rewards are credited only after the referred subscriber's installation is completed and their first bill is settled.</li>
        </ul>
      </section>

      <section :id="sections[11].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">12. Liability</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>To the extent permitted by law, our liability for any claim connected to the service is limited to the recurring charges you paid for the month in which the problem occurred.</li>
          <li>We are not liable for indirect losses such as lost income, lost data, or losses caused by events beyond our reasonable control.</li>
          <li>Nothing in these terms removes rights you have under the Consumer Act of the Philippines or other laws that cannot be waived.</li>
        </ul>
      </section>

      <section :id="sections[12].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">13. Privacy</h2>
        <p>
          We handle your personal information under the Data Privacy Act of 2012 (RA 10173) as described in our
          <router-link to="/privacy-policy" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">Privacy Policy</router-link>,
          which forms part of these terms.
        </p>
      </section>

      <section :id="sections[13].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">14. Website use</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>Coverage information on this website is indicative. Solid map shapes follow mapped barangay boundaries and dashed shapes are approximate. Final serviceability is confirmed by our survey team.</li>
          <li>Content on this website, including the {{ BRAND }} name and logo, is owned by us or our licensors and may not be copied for commercial use without permission.</li>
          <li>Links to third-party sites and payment portals are provided for convenience. Their own terms apply when you use them.</li>
        </ul>
      </section>

      <section :id="sections[14].id" class="space-y-3 scroll-mt-28">
        <h2 class="text-xl font-bold font-heading dark:text-white text-slate-900">15. General</h2>
        <ul class="list-disc list-inside space-y-1.5">
          <li>We may update these terms. The “Last updated” date shows the current version. Changes that materially affect an active subscription will be communicated to you in advance.</li>
          <li>These terms are governed by the laws of the Republic of the Philippines. Disputes will be brought before the proper courts of Rizal province, without prejudice to the jurisdiction of the National Telecommunications Commission and other regulators.</li>
          <li>If any part of these terms is found unenforceable, the rest continues to apply.</li>
        </ul>
        <div class="glass-card p-5 rounded-2xl border dark:border-slate-800 border-slate-200 space-y-1.5 mt-4">
          <p><strong>{{ LEGAL_ENTITY }}</strong></p>
          <p>{{ HEAD_OFFICE_ADDRESS }}</p>
          <p>Email: <a :href="`mailto:${PRIVACY_CONTACT_EMAIL}`" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">{{ PRIVACY_CONTACT_EMAIL }}</a></p>
          <p>Hotline: <a :href="`tel:${HOTLINE_TEL}`" class="font-bold text-[#ee2824] dark:text-[#ff6b67] hover:underline">{{ HOTLINE_DISPLAY }}</a> ({{ OFFICE_HOURS }})</p>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { FileText } from 'lucide-vue-next'
import {
  BRAND, LEGAL_ENTITY, HEAD_OFFICE_ADDRESS, HOTLINE_DISPLAY, HOTLINE_TEL,
  PRIVACY_CONTACT_EMAIL, OFFICE_HOURS, LEGAL_LAST_UPDATED
} from '../data/legal'

const sections = [
  { id: 'parties', title: 'Parties and acceptance' },
  { id: 'eligibility', title: 'Eligibility and application' },
  { id: 'installation', title: 'Installation' },
  { id: 'plans', title: 'Plans, speeds and fair use' },
  { id: 'billing', title: 'Billing and payment' },
  { id: 'lock-in', title: 'Lock-in period and pre-termination' },
  { id: 'equipment', title: 'Equipment' },
  { id: 'availability', title: 'Service availability and maintenance' },
  { id: 'acceptable-use', title: 'Acceptable use' },
  { id: 'suspension', title: 'Suspension and termination' },
  { id: 'promos', title: 'Promos and referrals' },
  { id: 'liability', title: 'Liability' },
  { id: 'privacy', title: 'Privacy' },
  { id: 'website', title: 'Website use' },
  { id: 'general', title: 'General' }
]
</script>
