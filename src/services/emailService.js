// Switch Fiber confirmation email dispatch.
// NOTE: Confirmation emails are now handled directly by the backend upon application creation.
// Client-side dispatch is disabled in src/stores/registration.js.

export async function sendApplicationEmail({
  recipientEmail,
  applicantName,
  referenceCode,
  desiredPlan,
  installationAddress,
  barangay,
  city,
  mobileNumber,
  firstNearestLandmark
}) {
  if (!recipientEmail || !referenceCode) {
    return { success: false, error: 'Missing recipient email or reference code' }
  }

  try {
    const response = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail,
        applicantName,
        referenceCode,
        desiredPlan,
        installationAddress,
        barangay,
        city,
        mobileNumber,
        firstNearestLandmark
      })
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      return { success: false, error: result?.error || `HTTP ${response.status}` }
    }
    return result
  } catch (err) {
    return { success: false, error: err.message || String(err) }
  }
}
