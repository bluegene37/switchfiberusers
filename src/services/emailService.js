// Switch Fiber confirmation email dispatch.
// Calls our own serverless endpoint (api/send-confirmation.js), which talks to
// Resend server-side — the API key never reaches the browser.

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
