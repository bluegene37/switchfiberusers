// Shared job order helpers for the tracker and reschedule functions.
// (Underscore-prefixed: not deployed as a public function.)

/**
 * Sanitizes job order records to prevent leaking installer signature images,
 * technician credentials, and internal attachment links.
 */
export function sanitizeJobOrderRecord(record) {
  if (!record || typeof record !== 'object') return null
  const {
    clientSignature,
    portLabelImage,
    routerReadingImage,
    setupImage,
    signedContractImage,
    speedtestImage,
    boxReadingImage,
    contractLink,
    houseFront,
    assignedEmail,
    ...safeRecord
  } = record

  return safeRecord
}
