// Switch Fiber confirmation SMS dispatch.
// Calls our own serverless endpoint (api/send-sms.js), which talks to
// Semaphore server-side — the API key never reaches the browser, and the
// message text is composed server-side.

export async function sendApplicationSms({ recipientNumber, referenceCode }) {
  if (!recipientNumber || !referenceCode) {
    return { success: false, error: 'Missing recipient number or reference code' }
  }

  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientNumber, referenceCode })
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
