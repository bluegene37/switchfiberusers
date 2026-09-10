import { proxyRequest, upstreamJson } from './_proxy.js'

/**
 * Sanitizes ServiceOrder records to protect customer privacy and prevent
 * leaking internal credentials, staff emails, or internal coordinates (RA 10173).
 */
export function sanitizeServiceOrderRecord(record) {
  if (!record || typeof record !== 'object') return null
  const {
    assignedEmail,
    assignedBy,
    assignedDate,
    techModifiedDate,
    userEmail,
    modifiedBy,
    splynxId,
    mikrotikId,
    ...safeRecord
  } = record

  return safeRecord
}

export function sanitizeServiceOrdersData(data) {
  if (!data) return []
  if (Array.isArray(data)) {
    return data.map(sanitizeServiceOrderRecord).filter(Boolean)
  }
  return sanitizeServiceOrderRecord(data)
}

/**
 * Validates concern submission payload.
 */
export function validateServiceOrderPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a valid JSON object.' }
  }

  const fullName = String(body.fullName || '').trim()
  const accountNumber = String(body.accountNumber || '').trim()
  const contactNumber = String(body.contactNumber || '').trim()
  const address = String(body.address || '').trim()
  const concern = String(body.concern || '').trim()
  const emailAddress = String(body.emailAddress || '').trim()

  // Support direct email-intake payloads (backend team simplified mode)
  const isEmailOnlyIntake = Boolean(emailAddress && (!fullName || fullName === 'Subscriber') && !accountNumber)
  if (isEmailOnlyIntake) {
    if (/^\d+$/.test(emailAddress)) {
      return { ok: false, error: 'Please provide a valid email address, not only numbers.' }
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAddress)) {
      return { ok: false, error: 'Please provide a valid email address.' }
    }
    return { ok: true }
  }

  if (!fullName && !accountNumber) {
    return { ok: false, error: 'Full name or Account Number is required.' }
  }

  if (!contactNumber) {
    return { ok: false, error: 'Contact number is required.' }
  }

  const cleanPhone = contactNumber.replace(/\D/g, '')
  if (cleanPhone.length < 10 || cleanPhone.length > 13) {
    return { ok: false, error: 'Please provide a valid contact number (11 digits).' }
  }

  if (!address) {
    return { ok: false, error: 'Service/installation address is required.' }
  }

  if (!concern) {
    return { ok: false, error: 'Please describe your concern or complaint.' }
  }

  if (emailAddress) {
    if (/^\d+$/.test(emailAddress)) {
      return { ok: false, error: 'Please provide a valid email address, not only numbers.' }
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAddress)) {
      return { ok: false, error: 'Please provide a valid email address.' }
    }
  }

  return { ok: true }
}

export default async function handler(req, res) {
  const queryIndex = req.url.indexOf('?')
  const queryStr = queryIndex !== -1 ? req.url.substring(queryIndex) : ''
  const pathOnly = queryIndex !== -1 ? req.url.substring(0, queryIndex) : req.url

  // If a specific ID is requested e.g. /api/ServiceOrders/123
  const idMatch = pathOnly.match(/\/api\/ServiceOrders\/(\d+)/i)
  const id = idMatch ? idMatch[1] : (req.query && req.query.id)

  if (req.method === 'POST') {
    let body = req.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch { body = null }
    }

    const validation = validateServiceOrderPayload(body)
    if (!validation.ok) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Bad Request', message: validation.error }))
      return
    }

    const nowIso = new Date().toISOString()
    const enrichedPayload = {
      fullName: body.fullName || 'Subscriber',
      contactNumber: body.contactNumber || '09154077565',
      address: body.address || 'Service Address to be verified with Subscriber',
      concern: body.concern || 'Service Issue & Support Request',
      ...body,
      supportStatus: 'In Progress',
      visitStatus: 'In Progress',
      createdDate: body.createdDate || nowIso,
      modifiedDate: nowIso,
      modifiedBy: 'Online Portal (Direct Email Intake)'
    }

    req.body = enrichedPayload

    return proxyRequest(req, res, '/api/ServiceOrders', {
      transform: (data) => sanitizeServiceOrdersData(data)
    })
  }

  if (req.method === 'PUT') {
    if (!id) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Bad Request', message: 'Service Order ID is required for update.' }))
      return
    }

    let body = req.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch { body = null }
    }

    const nowIso = new Date().toISOString()
    const enrichedPayload = {
      ...body,
      id: Number(id),
      supportStatus: body.supportStatus || 'In Progress',
      modifiedDate: nowIso,
      modifiedBy: 'Online Portal'
    }

    req.body = enrichedPayload

    return proxyRequest(req, res, `/api/ServiceOrders/${id}`, {
      transform: (data) => sanitizeServiceOrdersData(data)
    })
  }

  // GET requests
  const targetPath = id ? `/api/ServiceOrders/${id}` : `/api/ServiceOrders${queryStr}`
  return proxyRequest(req, res, targetPath, {
    transform: (data) => sanitizeServiceOrdersData(data)
  })
}
