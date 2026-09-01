// Serverless Function: Send application confirmation SMS via Semaphore
// (https://semaphore.co — Philippine SMS gateway, all local networks).
// Handles POST /api/send-sms
//
// The message text is composed HERE, never taken from the request body — an
// endpoint that relays caller-supplied text is an open SMS-spam gateway.

const PH_MOBILE = /^(?:\+?63|0)?(9\d{9})$/

// Accepts 09171234567, 639171234567, +639171234567, 9171234567 and
// normalizes to the 09xxxxxxxxx form Semaphore's docs list as accepted.
function normalizePhMobile(raw) {
  const digits = String(raw ?? '').replace(/[\s()-]/g, '')
  const m = PH_MOBILE.exec(digits)
  return m ? `0${m[1]}` : null
}

export async function sendConfirmationSms(data) {
  const number = normalizePhMobile(data?.recipientNumber)
  const applicationId = String(data?.applicationId ?? data?.id ?? data?.referenceCode ?? '').trim().slice(0, 40)

  if (!applicationId) {
    return { success: false, error: 'Missing applicationId.' }
  }
  if (!number) {
    return { success: false, error: 'Invalid Philippine mobile number.' }
  }

  const apiKey = process.env.SEMAPHORE_API_KEY
  if (!apiKey) {
    console.log(`[Semaphore Service] SEMAPHORE_API_KEY not set — skipped SMS to ${number} for ID ${applicationId}`)
    return {
      success: false,
      skipped: true,
      error: 'SMS service is not configured (SEMAPHORE_API_KEY missing).'
    }
  }

  const baseOrigin = (process.env.SITE_URL || 'https://switchfiber.ph').replace(/\/$/, '')
  const trackingUrl = `${baseOrigin}/status?code=${encodeURIComponent(applicationId)}`

  // GSM-7 characters only, and per Semaphore's FAQ a message starting with
  // "TEST" is silently dropped by the networks — this one starts with the
  // brand name. ~220 chars = 2 SMS segments (2 credits).
  const message =
    `Switch Fiber: We received your application. ID: ${applicationId}. ` +
    `Track it at ${trackingUrl} ` +
    `Our team will call or text you to confirm your installation. Agents collect NO application or processing fees.`

  const params = new URLSearchParams({
    apikey: apiKey,
    number,
    message
  })
  // Optional approved brand sender ID (e.g. SWITCHFIBER). Without it,
  // Semaphore's default sender name is used.
  if (process.env.SEMAPHORE_SENDER_NAME) {
    params.set('sendername', process.env.SEMAPHORE_SENDER_NAME)
  }

  const response = await fetch('https://api.semaphore.co/api/v4/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  })

  const bodyText = await response.text()
  let parsed = null
  try {
    parsed = JSON.parse(bodyText)
  } catch (e) {}

  // A successful queue returns an array of message objects with message_id.
  const queued = Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.message_id
  if (!response.ok || !queued) {
    const errorMsg = (parsed && !Array.isArray(parsed) && (parsed.message || JSON.stringify(parsed).slice(0, 200))) ||
      `Semaphore API error (HTTP ${response.status})`
    console.error('[Semaphore Dispatch Error]:', errorMsg)
    return { success: false, error: String(errorMsg) }
  }

  console.log(`[Semaphore Service] SMS queued to ${number} (ID: ${parsed[0].message_id})`)
  return { success: true, id: parsed[0].message_id, recipientNumber: number, applicationId }
}

// Vercel Serverless Function Handler.
// Same-origin only — no CORS grant, same policy as the other api/ functions.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS')
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' })
    return
  }

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {
        body = {}
      }
    }

    const result = await sendConfirmationSms(body)
    res.status(200).json(result)
  } catch (err) {
    console.error('[send-sms error]:', err)
    res.status(500).json({ error: 'SMS dispatch failed.' })
  }
}
