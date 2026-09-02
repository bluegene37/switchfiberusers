import { proxyRequest } from '../_proxy.js'
import { sanitizeApplicationData } from '../Applications.js'

// Single application lookup for the public status tracker.
//
// The tracking key is the record's public `applicationid` — 21 digits built
// from the submission timestamp, e.g. 202609012251532731662. Upstream resolves
// only that form; a bare sequential row id (/api/Applications/15472) now
// returns 404, which closes the enumeration hole that let anyone walk 1..N and
// read every applicant's name, email, mobile numbers and installation address
// (Data Privacy Act, RA 10173).
//
// NOTE: applications filed before the switch were confirmed with the row id,
// so those applicants can no longer track — support has to look their
// Application ID up for them.
//
// sanitizeApplicationData below still strips document URLs and staff emails.
export default async function handler(req, res) {
  const { id } = req.query || {}
  const cleanId = id ? encodeURIComponent(id) : ''
  const targetPath = cleanId ? `/api/Applications/${cleanId}` : req.url

  return proxyRequest(req, res, targetPath, {
    transform: req.method === 'GET' ? sanitizeApplicationData : null
  })
}
