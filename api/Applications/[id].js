import https from 'https'
import http from 'http'
import { URL } from 'url'
import { proxyRequest, BACKEND_BASE_URL, httpsAgent } from '../_proxy.js'
import { sanitizeApplicationData } from '../Applications.js'

async function fetchUpstreamJson(path) {
  return new Promise((resolve) => {
    try {
      const targetUrl = new URL(path, BACKEND_BASE_URL)
      const client = targetUrl.protocol === 'https:' ? https : http
      const req = client.get(targetUrl, { agent: httpsAgent, timeout: 5000 }, (res) => {
        let data = ''
        res.on('data', chunk => { data += chunk })
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) })
          } catch {
            resolve({ status: res.statusCode, data: null })
          }
        })
      })
      req.on('error', () => resolve({ status: 500, data: null }))
      req.on('timeout', () => {
        req.destroy()
        resolve({ status: 504, data: null })
      })
    } catch {
      resolve({ status: 500, data: null })
    }
  })
}

// In-memory cache for recent job orders and billing details so lookup is fast
const cachedScheduledJobs = { timestamp: 0, data: [] }
const cachedCompletedJobs = { timestamp: 0, data: [] }
const cachedActivatedJobs = { timestamp: 0, data: [] }
const cachedBillingDetails = { timestamp: 0, data: [] }
const CACHE_TTL_MS = 30000

async function getJobOrders(status) {
  const norm = status.toLowerCase()
  let cache = cachedScheduledJobs
  if (norm === 'completed') cache = cachedCompletedJobs
  else if (norm === 'activated') cache = cachedActivatedJobs

  const now = Date.now()
  if (now - cache.timestamp < CACHE_TTL_MS && cache.data.length > 0) {
    return cache.data
  }
  const res = await fetchUpstreamJson(`/api/JobOrders/status/${status}`)
  if (res.status === 200 && Array.isArray(res.data)) {
    cache.timestamp = now
    cache.data = res.data
    return res.data
  }
  return cache.data || []
}

async function getBillingDetails() {
  const now = Date.now()
  if (now - cachedBillingDetails.timestamp < CACHE_TTL_MS && cachedBillingDetails.data.length > 0) {
    return cachedBillingDetails.data
  }
  const res = await fetchUpstreamJson('/api/BillingDetails')
  if (res.status === 200) {
    const list = Array.isArray(res.data) ? res.data : (res.data?.billingDetails || [])
    if (list.length > 0) {
      cachedBillingDetails.timestamp = now
      cachedBillingDetails.data = list
      return list
    }
  }
  return cachedBillingDetails.data || []
}

async function enrichAndSanitizeApplication(data) {
  const sanitized = sanitizeApplicationData(data)
  if (!sanitized || typeof sanitized !== 'object') return sanitized

  const currentStatus = String(sanitized.status || '').toLowerCase()
  // If already activated, no need to override
  if (currentStatus.includes('active') || currentStatus.includes('activat')) {
    return sanitized
  }

  const appId = String(sanitized.applicationid || sanitized.applicationId || sanitized.id || '').trim()
  if (!appId) return sanitized

  try {
    // 1. Stage 4: Check BillingDetails first (fast, ~900ms)
    const billings = await getBillingDetails()
    const billMatch = billings.find(b =>
      String(b.accountNo || '').trim() === appId ||
      String(b.id || '').trim() === appId
    )
    if (billMatch) {
      sanitized.status = 'Activated'
      sanitized.billingId = billMatch.id
      if (billMatch.dateInstalled) sanitized.dateInstalled = billMatch.dateInstalled
      if (billMatch.routerModemSn) sanitized.routerModemSn = billMatch.routerModemSn
      return sanitized
    }

    // 2. Stage 4: Check JobOrders/status/Activated
    const activated = await getJobOrders('Activated')
    const actMatch = activated.find(j =>
      String(j.accountNo || '').trim() === appId ||
      String(j.applicationIdValue || '').trim() === appId ||
      String(j.id || '').trim() === appId
    )
    if (actMatch) {
      sanitized.status = 'Activated'
      sanitized.jobOrderId = actMatch.id
      if (actMatch.dateInstalled) sanitized.dateInstalled = actMatch.dateInstalled
      if (actMatch.modifiedDate) sanitized.modifiedDate = actMatch.modifiedDate
      return sanitized
    }

    // If already marked completed or scheduled in application record, don't downgrade
    if (currentStatus.includes('completed') || currentStatus.includes('schedule')) {
      return sanitized
    }

    // 3. Stage 3: Check Completed JobOrders
    const completed = await getJobOrders('Completed')
    const compMatch = completed.find(j =>
      String(j.accountNo || '').trim() === appId ||
      String(j.applicationIdValue || '').trim() === appId ||
      String(j.id || '').trim() === appId
    )
    if (compMatch) {
      sanitized.status = 'Completed'
      sanitized.jobOrderId = compMatch.id
      if (compMatch.modifiedDate) sanitized.modifiedDate = compMatch.modifiedDate
      if (compMatch.remarks && !compMatch.remarks.startsWith('Online Application')) {
        sanitized.remarks = compMatch.remarks
      }
      return sanitized
    }

    // 4. Stage 2: Check Scheduled JobOrders
    const scheduled = await getJobOrders('Scheduled')
    const schedMatch = scheduled.find(j =>
      String(j.accountNo || '').trim() === appId ||
      String(j.applicationIdValue || '').trim() === appId ||
      String(j.id || '').trim() === appId
    )
    if (schedMatch) {
      sanitized.status = 'Scheduled'
      sanitized.jobOrderId = schedMatch.id
      if (schedMatch.modifiedDate) sanitized.modifiedDate = schedMatch.modifiedDate
      if (schedMatch.remarks && !schedMatch.remarks.startsWith('Online Application')) {
        sanitized.remarks = schedMatch.remarks
      }
      return sanitized
    }
  } catch (err) {
    console.warn('[Enrichment] Failed to query JobOrders/BillingDetails:', err?.message || err)
  }

  return sanitized
}

export default async function handler(req, res) {
  const { id } = req.query || {}
  const cleanId = id ? encodeURIComponent(id) : ''
  const targetPath = cleanId ? `/api/Applications/${cleanId}` : req.url

  return proxyRequest(req, res, targetPath, {
    transform: req.method === 'GET' ? enrichAndSanitizeApplication : null
  })
}

