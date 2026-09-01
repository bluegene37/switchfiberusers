import { proxyRequest } from '../_proxy.js'
import { sanitizeApplicationData } from '../Applications.js'

// Single application lookup for the public status tracker.
//
// NOTE: the upstream application id is a sequential integer and is the only
// thing required to read a record here, so this route can be enumerated —
// walking 1..N returns every applicant's name, email, both mobile numbers and
// installation address. sanitizeApplicationData below still strips document
// URLs and internal staff emails, but it does not stop enumeration. Closing
// that requires either a second factor the applicant knows, or replacing the
// sequential id with an unguessable tracking code (Data Privacy Act, RA 10173).
export default async function handler(req, res) {
  const { id } = req.query || {}
  const cleanId = id ? encodeURIComponent(id) : ''
  const targetPath = cleanId ? `/api/Applications/${cleanId}` : req.url

  return proxyRequest(req, res, targetPath, {
    transform: req.method === 'GET' ? sanitizeApplicationData : null
  })
}
