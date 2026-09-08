// Single source of truth for the legal identity shown on the Privacy Policy,
// Terms & Conditions, the registration consent box, the terms modal and the
// footer. Change these here and every page follows.
//
// TODO before launch: confirm LEGAL_ENTITY against the SEC/DTI registration
// and appoint/confirm the Data Protection Officer contact.
export const BRAND = 'Switch Fiber'
export const LEGAL_ENTITY = 'Switch Internet Services Co.'
export const HEAD_OFFICE_ADDRESS = '315 Sampaloc St., Sta. Ursula Subd., Brgy. Batingan, Binangonan, Rizal 1940, Philippines'
export const HOTLINE_DISPLAY = '0915 407 7565'
export const HOTLINE_TEL = '09154077565'
export const PRIVACY_CONTACT_EMAIL = 'customercare@switchfiber.ph'
// switchfiber.ph FAQ "How to apply as a Freelance Sales Agent" says to email
// requirements here with the job title as the subject.
export const CAREERS_EMAIL = 'switchfiberinternet@gmail.com'
export const OFFICE_HOURS = 'Monday to Saturday, 8:00 AM to 5:00 PM'
export const LEGAL_LAST_UPDATED = 'September 8, 2026'
export const COPYRIGHT_YEAR = new Date().getFullYear()

// How long records are kept. Stated in plain language on the Privacy Policy.
// TODO before launch: confirm these periods with management.
export const RETENTION = {
  activeSubscriber: 'for as long as your subscription is active, plus five (5) years after it ends for billing, tax and dispute-resolution purposes',
  unsuccessfulApplication: 'up to twelve (12) months from the date of submission, after which it is securely deleted',
  careersApplication: 'up to twelve (12) months from the date of submission',
  serverLogs: 'up to ninety (90) days'
}
