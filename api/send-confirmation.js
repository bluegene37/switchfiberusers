// Serverless Function: Send Application Confirmation Email via Resend API
// Handles POST /api/send-confirmation

function generateEmailHtml({
  applicantName,
  referenceCode,
  desiredPlan,
  installationAddress,
  barangay,
  city,
  mobileNumber,
  firstNearestLandmark,
  trackingUrl
}) {
  const currentYear = new Date().getFullYear()
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Switch Fiber Application Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #1e293b; border: 1px solid #334155; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 36px 32px 24px; text-align: center; border-bottom: 2px solid #ee2824;">
              <div style="display: inline-block; padding: 6px 14px; background-color: rgba(238, 40, 36, 0.15); border: 1px solid rgba(238, 40, 36, 0.3); border-radius: 9999px; margin-bottom: 16px;">
                <span style="font-size: 11px; font-weight: 800; color: #ff6b67; text-transform: uppercase; letter-spacing: 2px;">Application Received</span>
              </div>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">SWITCH FIBER</h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">Fast, Reliable & Pure Fiber Internet Connection</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #f8fafc; line-height: 1.5;">
                Hello <strong>${applicantName || 'Valued Applicant'}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; color: #cbd5e1; line-height: 1.6;">
                Thank you for applying with Switch Fiber! Your application has been logged and is now in line for engineering feasibility audit and technician dispatch.
              </p>

              <!-- Reference Code Highlight Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 14px; margin-bottom: 28px; text-align: center;">
                <tr>
                  <td style="padding: 20px;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Your Application Reference Number</span>
                    <span style="display: block; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 22px; font-weight: 800; color: #ee2824; letter-spacing: 1px;">
                      ${referenceCode}
                    </span>
                    <span style="display: block; font-size: 11px; color: #64748b; margin-top: 6px;">Save this reference code to track your status at any time</span>
                  </td>
                </tr>
              </table>

              <!-- Primary CTA Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="${trackingUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ee2824 0%, #ff4b47 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 12px rgba(238, 40, 36, 0.35);">
                      Track Application Status Online &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Summary Table -->
              <h3 style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                Application Summary
              </h3>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; font-size: 13px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; color: #94a3b8; width: 40%;">Subscribed Plan:</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; color: #ffffff; font-weight: 700;">${desiredPlan || 'Switch Fiber Plan'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Contact Number:</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; color: #ffffff;">${mobileNumber || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Installation Address:</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; color: #ffffff;">${installationAddress || ''}, ${barangay || ''}, ${city || ''}</td>
                </tr>
                ${firstNearestLandmark ? `
                <tr>
                  <td style="padding: 12px 16px; color: #94a3b8;">Landmark Note:</td>
                  <td style="padding: 12px 16px; color: #ffffff;">${firstNearestLandmark}</td>
                </tr>` : ''}
              </table>

              <!-- Next Steps List -->
              <h3 style="margin: 0 0 12px; font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
                What Happens Next?
              </h3>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
                <tr>
                  <td style="vertical-align: top; padding: 4px 8px 12px 0; color: #ee2824; font-weight: 800;">1.</td>
                  <td style="padding-bottom: 12px;"><strong>Document & Line Feasibility:</strong> Our engineering team checks fiber port availability near your address.</td>
                </tr>
                <tr>
                  <td style="vertical-align: top; padding: 4px 8px 12px 0; color: #ee2824; font-weight: 800;">2.</td>
                  <td style="padding-bottom: 12px;"><strong>Schedule Confirmation:</strong> A Switch Fiber representative will call or SMS your mobile to confirm your installation slot.</td>
                </tr>
                <tr>
                  <td style="vertical-align: top; padding: 4px 8px 0 0; color: #ee2824; font-weight: 800;">3.</td>
                  <td><strong>On-Site Installation & Activation:</strong> Certified technicians lay optical fiber drop cable and activate your high-speed WiFi router on-site.</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: center; border-top: 1px solid #334155; font-size: 12px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 8px;">
                Need help or have questions? Contact our customer support team:
              </p>
              <p style="margin: 0 0 16px; color: #94a3b8; font-weight: 600;">
                Hotline: (02) 8000-SWITCH | Email: support@switchfiber.ph
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                &copy; ${currentYear} Switch Fiber Philippines. All rights reserved. Republic Act No. 10173 Compliant.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendConfirmationEmail(data) {
  const {
    recipientEmail,
    applicantName,
    referenceCode,
    desiredPlan,
    installationAddress,
    barangay,
    city,
    mobileNumber,
    firstNearestLandmark,
    originUrl
  } = data || {}

  if (!recipientEmail || !referenceCode) {
    return { success: false, error: 'Missing required recipientEmail or referenceCode.' }
  }

  const baseOrigin = originUrl || 'https://switchfiber.ph'
  const trackingUrl = `${baseOrigin}/status?code=${encodeURIComponent(referenceCode)}`
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Switch Fiber <onboarding@resend.dev>'

  if (!apiKey) {
    console.log(`[Resend Service] Simulated email confirmation dispatch to: ${recipientEmail} for reference: ${referenceCode}`)
    return {
      success: true,
      simulated: true,
      recipientEmail,
      referenceCode,
      trackingUrl,
      note: 'To send live production emails, add your RESEND_API_KEY in environment variables.'
    }
  }

  const htmlContent = generateEmailHtml({
    applicantName,
    referenceCode,
    desiredPlan,
    installationAddress,
    barangay,
    city,
    mobileNumber,
    firstNearestLandmark,
    trackingUrl
  })

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [recipientEmail],
      subject: `Switch Fiber Application Received - ${referenceCode}`,
      html: htmlContent
    })
  })

  const resData = await response.json().catch(() => ({}))
  if (!response.ok) {
    const errorMsg = resData?.message || `Resend API Error (HTTP ${response.status})`
    console.error('[Resend Dispatch Error]:', errorMsg, resData)
    throw new Error(errorMsg)
  }

  console.log(`[Resend Service] Live email successfully dispatched to: ${recipientEmail} (ID: ${resData?.id})`)
  return {
    success: true,
    id: resData?.id,
    recipientEmail,
    referenceCode
  }
}

// Vercel Serverless Function Handler
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' })
    return
  }

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch (e) {}
    }

    const result = await sendConfirmationEmail(body)
    res.status(200).json(result)
  } catch (err) {
    console.error('[send-confirmation error]:', err)
    res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
}
