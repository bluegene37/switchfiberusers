// CALABARZON location hierarchy shared by the registration store, the wizard
// and the map picker. The form field and API payload keep the key `region`
// because that is the backend Application table's column name (misnamed by the
// backend team) — everything user-facing says "Province".
//
// Cities come with a complete offline fallback list per province; the store
// upgrades them with live PSGC codes (psgc.gitlab.io) so barangays can be
// fetched per city. Binangonan keeps its curated fiber-active barangay list.

export const PROVINCES = {
  Rizal: { psgcCode: '045800000', center: [14.5872, 121.177], zoom: 11 },
  Cavite: { psgcCode: '042100000', center: [14.2814, 120.864], zoom: 11 },
  Laguna: { psgcCode: '043400000', center: [14.2306, 121.3222], zoom: 10 },
  Batangas: { psgcCode: '041000000', center: [13.9424, 121.1625], zoom: 10 },
  Quezon: { psgcCode: '045600000', center: [13.9347, 121.6238], zoom: 9 }
}

export const provincesList = Object.keys(PROVINCES)

// Complete municipality/city rosters per province, used before (or without)
// the live PSGC fetch. Names use the common "X City" form.
export const fallbackCitiesByProvince = {
  Rizal: [
    'Angono', 'Antipolo City', 'Baras', 'Binangonan', 'Cainta', 'Cardona',
    'Jalajala', 'Morong', 'Pililla', 'Rodriguez', 'San Mateo', 'Tanay',
    'Taytay', 'Teresa'
  ],
  Cavite: [
    'Alfonso', 'Amadeo', 'Bacoor City', 'Carmona', 'Cavite City',
    'Dasmariñas City', 'General Emilio Aguinaldo', 'General Mariano Alvarez',
    'General Trias City', 'Imus City', 'Indang', 'Kawit', 'Magallanes',
    'Maragondon', 'Mendez', 'Naic', 'Noveleta', 'Rosario', 'Silang',
    'Tagaytay City', 'Tanza', 'Ternate', 'Trece Martires City'
  ],
  Laguna: [
    'Alaminos', 'Bay', 'Biñan City', 'Cabuyao City', 'Calamba City',
    'Calauan', 'Cavinti', 'Famy', 'Kalayaan', 'Liliw', 'Los Baños',
    'Luisiana', 'Lumban', 'Mabitac', 'Magdalena', 'Majayjay', 'Nagcarlan',
    'Paete', 'Pagsanjan', 'Pakil', 'Pangil', 'Pila', 'Rizal',
    'San Pablo City', 'San Pedro City', 'Santa Cruz', 'Santa Maria',
    'Santa Rosa City', 'Siniloan', 'Victoria'
  ],
  Batangas: [
    'Agoncillo', 'Alitagtag', 'Balayan', 'Balete', 'Batangas City', 'Bauan',
    'Calaca City', 'Calatagan', 'Cuenca', 'Ibaan', 'Laurel', 'Lemery',
    'Lian', 'Lipa City', 'Lobo', 'Mabini', 'Malvar', 'Mataasnakahoy',
    'Nasugbu', 'Padre Garcia', 'Rosario', 'San Jose', 'San Juan', 'San Luis',
    'San Nicolas', 'San Pascual', 'Santa Teresita', 'Santo Tomas City',
    'Taal', 'Talisay', 'Tanauan City', 'Taysan', 'Tingloy', 'Tuy'
  ],
  Quezon: [
    'Agdangan', 'Alabat', 'Atimonan', 'Buenavista', 'Burdeos', 'Calauag',
    'Candelaria', 'Catanauan', 'Dolores', 'General Luna', 'General Nakar',
    'Guinayangan', 'Gumaca', 'Infanta', 'Jomalig', 'Lopez', 'Lucban',
    'Lucena City', 'Macalelon', 'Mauban', 'Mulanay', 'Padre Burgos',
    'Pagbilao', 'Panukulan', 'Patnanungan', 'Perez', 'Pitogo', 'Plaridel',
    'Polillo', 'Quezon', 'Real', 'Sampaloc', 'San Andres', 'San Antonio',
    'San Francisco', 'San Narciso', 'Sariaya', 'Tagkawayan', 'Tayabas City',
    'Tiaong', 'Unisan'
  ]
}

// Barangays with confirmed fiber coverage — shown with a "(Fiber Active)"
// badge and available even when the PSGC API is unreachable.
export const coverageBarangaysByCity = {
  Binangonan: [
    'Batingan', 'Bilibiran', 'Calumpang', 'Darangan', 'Layunan', 'Libid',
    'Libis', 'Lunsad', 'Macamot', 'Mahabang Parang (Binangonan)', 'Mambog',
    'Palangoy', 'Pag-asa', 'Pantok', 'Pila-pila', 'Tagpos', 'Tatala',
    'Tayuman'
  ]
}

// PSGC spells cities "City of Antipolo"; the UI and Nominatim use
// "Antipolo City" / "Antipolo". Normalize to the common form.
export function normalizeCityName(name) {
  const m = /^City of (.+)$/i.exec((name || '').trim())
  return m ? `${m[1]} City` : (name || '').trim()
}

// Loose place-name comparison: drops parentheticals ("(HQ)", "(Pob.)"),
// punctuation and casing so "Antipolo City" matches "City of Antipolo" or
// query-string variants.
export function canonicalPlace(value) {
  return String(value || '')
    .replace(/\([^)]*\)/g, '')
    .toLowerCase()
    .replace(/^city of /, '')
    .replace(/city$/, '')
    .replace(/[^a-z0-9]/g, '')
}

export function samePlace(a, b) {
  const ca = canonicalPlace(a)
  const cb = canonicalPlace(b)
  return ca.length > 0 && ca === cb
}
