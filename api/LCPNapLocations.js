import { proxyRequest } from './_proxy.js'

// Rough bounding box around the Rizal service area. Upstream contains rows
// with blank or "0, 0" coordinates that would otherwise plot off the coast
// of Africa.
const LAT_MIN = 13.8
const LAT_MAX = 15.2
const LNG_MIN = 120.6
const LNG_MAX = 121.9

function hasUsableCoordinates(coordinates) {
  const [lat, lng] = String(coordinates || '').split(',').map(part => parseFloat(part))
  return (
    Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= LAT_MIN && lat <= LAT_MAX &&
    lng >= LNG_MIN && lng <= LNG_MAX
  )
}

// Keep only the fields the public coverage map needs, preserving upstream
// names so the browser parses the same shape whether it reaches the backend
// through this function (production) or the Vite dev proxy (raw upstream).
// Dropped on purpose: modifiedBy / userEmail (staff addresses) and the
// image / image2 / readingImage file paths (internal storage layout).
export function sanitizeNapLocations(rows) {
  if (!Array.isArray(rows)) return []
  return rows
    .filter(row => row && hasUsableCoordinates(row.coordinates))
    .map(row => ({
      id: row.id,
      lcpnap: row.lcpnap,
      lcp: row.lcp,
      nap: row.nap,
      portTotal: row.portTotal,
      coordinates: row.coordinates,
      street: row.street,
      barangay: row.barangay,
      city: row.city
    }))
}

export default async function handler(req, res) {
  return proxyRequest(req, res, '/api/LCPNapLocations', { transform: sanitizeNapLocations })
}
