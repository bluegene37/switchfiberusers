import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCoverageStore = defineStore('coverage', () => {
  const searchQuery = ref('')
  const selectedMunicipality = ref('All')
  const focusedBarangayId = ref(null)
  const showCustomerNodes = ref(true)

  const municipalities = [
    'All',
    'Binangonan',
    'Angono',
    'Taytay',
    'Teresa',
    'Cardona',
    'Morong',
    'Baras',
    'Tanay',
    'Antipolo'
  ]

  const municipalityCenters = {
    'All': { lat: 14.4850, lng: 121.1950, zoom: 12 },
    'Binangonan': { lat: 14.4750, lng: 121.1950, zoom: 13 },
    'Angono': { lat: 14.5260, lng: 121.1550, zoom: 14 },
    'Taytay': { lat: 14.5650, lng: 121.1350, zoom: 13 },
    'Teresa': { lat: 14.5620, lng: 121.2100, zoom: 14 },
    'Cardona': { lat: 14.4840, lng: 121.2290, zoom: 14 },
    'Morong': { lat: 14.5120, lng: 121.2400, zoom: 14 },
    'Baras': { lat: 14.5200, lng: 121.2680, zoom: 14 },
    'Tanay': { lat: 14.4980, lng: 121.2860, zoom: 14 },
    'Antipolo': { lat: 14.5850, lng: 121.1760, zoom: 13 }
  }

  const coverageList = ref([
    // ==========================================
    // OFFICIAL BINANGONAN ACTIVE COVERAGE ZONES
    // Verified against Switch Fiber 13 slide images: https://switchfiber.ph/area-coverage/
    // ==========================================
    {
      id: 1,
      name: 'Batingan (HQ)',
      municipality: 'Binangonan',
      lat: 14.4726,
      lng: 121.1998,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '320+ Connected Homes',
      activeNodes: '14 NAP Terminals',
      coveredAreas: [
        'Sta. Ursula Subd.',
        'Mirasolle Subd.',
        'J.P. Rizal Ave.',
        'Camias St.',
        'Antazo St.',
        'Cortez St.',
        'Mechilina St.',
        'Añonuevo St.',
        'Bilog St.',
        'Aragoza St.',
        'Ceñidoza St.',
        'Sitio Bicol'
      ],
      subNodes: [
        { name: 'Sta. Ursula Subd. Phase 1 & 2 Hub', lat: 14.4735, lng: 121.1985, status: 'Active Subscriber Hub' },
        { name: 'J.P. Rizal Ave. Corridor Drop', lat: 14.4715, lng: 121.1970, status: 'Active Subscriber Hub' },
        { name: 'Mirasolle Subd. Cluster', lat: 14.4740, lng: 121.2010, status: 'Active Subscriber Hub' },
        { name: 'Ceñidoza St. Residential Node', lat: 14.4774, lng: 121.2144, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 2,
      name: 'Layunan',
      municipality: 'Binangonan',
      lat: 14.4684,
      lng: 121.1933,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '190+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: [
        'M.H. Del Pilar St.',
        'Osmeña St.',
        'Regidor St.',
        'Valencia St.',
        'Baltazar St.',
        'J. Luna St.',
        'J.P. Rizal Ave.'
      ],
      subNodes: [
        { name: 'Layunan Covered Court Node', lat: 14.4680, lng: 121.1935, status: 'Active Subscriber Hub' },
        { name: 'Valencia St. Residential Drop', lat: 14.4672, lng: 121.1918, status: 'Active Subscriber Hub' },
        { name: 'Baltazar & Regidor St. Cluster', lat: 14.4668, lng: 121.1920, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 3,
      name: 'Libis',
      municipality: 'Binangonan',
      lat: 14.4652,
      lng: 121.1906,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '210+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: [
        'Paterno St.',
        'Osmeña St.',
        'P. Gomez St.',
        'ML Quezon St.',
        'Mayon St.',
        'Banahaw St.',
        'National Road',
        'MH Del Pilar St.',
        'JP Rizal Avenue'
      ],
      subNodes: [
        { name: 'Libis Elementary School Vicinity', lat: 14.4653, lng: 121.1886, status: 'Active Subscriber Hub' },
        { name: 'Paterno St. & P. Gomez Hub', lat: 14.4658, lng: 121.1917, status: 'Active Subscriber Hub' },
        { name: 'Mayon & Banahaw St. Drop', lat: 14.4645, lng: 121.1895, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 4,
      name: 'Libid',
      municipality: 'Binangonan',
      lat: 14.4619,
      lng: 121.1925,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '175+ Connected Homes',
      activeNodes: '8 NAP Terminals',
      coveredAreas: [
        'M.H. Del Pilar St.',
        'R. Zulueta St.',
        'Liwasan St.',
        'Zamora St.',
        'P. Burgos St.',
        'L. Jaena St.',
        'JM Basa St.'
      ],
      subNodes: [
        { name: 'Binangonan Public Market Vicinity', lat: 14.4632, lng: 121.1932, status: 'Active Subscriber Hub' },
        { name: 'R. Zulueta & Zamora St. Node', lat: 14.4626, lng: 121.1947, status: 'Active Subscriber Hub' },
        { name: 'L. Jaena St. Drop', lat: 14.4640, lng: 121.1942, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 5,
      name: 'Lunsad',
      municipality: 'Binangonan',
      lat: 14.4605,
      lng: 121.1946,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '200+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: [
        'Quezon Ext.',
        'R. Zulueta St.',
        'P. Burgos St.',
        'Fineza St.',
        'Juan Sumulong Rd.',
        'J. Antiporda St.',
        'E. Unida St.',
        'Sitio Gupiing'
      ],
      subNodes: [
        { name: 'Fineza & J. Antiporda Drop', lat: 14.4605, lng: 121.1944, status: 'Active Subscriber Hub' },
        { name: 'Juan Sumulong Road Cluster', lat: 14.4594, lng: 121.1976, status: 'Active Subscriber Hub' },
        { name: 'E. Unida & Sitio Gupiing Node', lat: 14.4599, lng: 121.1956, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 6,
      name: 'Calumpang',
      municipality: 'Binangonan',
      lat: 14.4766,
      lng: 121.1898,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '260+ Connected Homes',
      activeNodes: '12 NAP Terminals',
      coveredAreas: [
        'National Road',
        'Ynares St.',
        'Sysna St.',
        'Lozana St.',
        'Alcantara St.',
        'Cableway',
        'Saperia St.',
        'Picadizo St.',
        'Hinayon St.',
        'Katipunan St.',
        'Manila East Road'
      ],
      subNodes: [
        { name: 'Cableway & Resort Corridor', lat: 14.4766, lng: 121.1898, status: 'Active Subscriber Hub' },
        { name: 'Manila East Rd / Municipal Hall Corridor', lat: 14.4786, lng: 121.1881, status: 'Active Subscriber Hub' },
        { name: 'Sysna & Saperia St. Hub', lat: 14.4705, lng: 121.1907, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 7,
      name: 'Pila Pila',
      municipality: 'Binangonan',
      lat: 14.4490,
      lng: 121.2025,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '180+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: [
        'P. Burgos St.',
        'Sitio Manggahan',
        'Paralejas St.',
        'Sitio Pulo',
        'Antiporda St.',
        'Sitio Tangke',
        'Sitio Hulo',
        'Sitio Kabilang Tabi'
      ],
      subNodes: [
        { name: 'Pila-Pila Barangay Center Drop', lat: 14.4490, lng: 121.2022, status: 'Active Subscriber Hub' },
        { name: 'Paralejas St. & Sitio Pulo Cluster', lat: 14.4498, lng: 121.2045, status: 'Active Subscriber Hub' },
        { name: 'Sitio Tangke & Hulo Node', lat: 14.4475, lng: 121.2035, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 8,
      name: 'Macamot',
      municipality: 'Binangonan',
      lat: 14.4868,
      lng: 121.1966,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '230+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: [
        'Manila East Road',
        'Jocson St.',
        'Lirio St.',
        'Arago St.',
        'L. Cerrero Street',
        'Apostadero St.',
        'Grana St.',
        'Villadiego St.',
        'Ynares St.',
        'Matcacayan St.',
        'Sitio Pulong Parang',
        'F. Cequeña St.',
        'Sitio Halang'
      ],
      subNodes: [
        { name: 'Macamot Elementary School Corridor', lat: 14.4863, lng: 121.1972, status: 'Active Subscriber Hub' },
        { name: 'Jocson & Apostadero St. Node', lat: 14.4827, lng: 121.1975, status: 'Active Subscriber Hub' },
        { name: 'Manila East Road Macamot Junction', lat: 14.4795, lng: 121.1946, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 9,
      name: 'Tatala',
      municipality: 'Binangonan',
      lat: 14.4828,
      lng: 121.2055,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '270+ Connected Homes',
      activeNodes: '13 NAP Terminals',
      coveredAreas: [
        'Mountainville Subd.',
        'C. Bolado Ave.',
        'Cattleya 1',
        'F. Aragones St.',
        'Apostadero St.',
        'S. Ulang St.',
        'Monte Chiara',
        'Ojascastro St.',
        'Revera St.',
        'M. Picones St.',
        'Acetonas St.',
        'Ilang Ilang St.',
        'Habagat',
        'A. Bolado St.'
      ],
      subNodes: [
        { name: 'C. Bolado Ave. & Mountainville Hub', lat: 14.4789, lng: 121.2038, status: 'Active Subscriber Hub' },
        { name: 'S. Ulang & Monte Chiara Cluster', lat: 14.4893, lng: 121.2063, status: 'Active Subscriber Hub' },
        { name: 'F. Aragones St. Drop', lat: 14.4756, lng: 121.2064, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 10,
      name: 'Mambog',
      municipality: 'Binangonan',
      lat: 14.4816,
      lng: 121.2124,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '210+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: [
        'Crystal East Valley',
        'Manila East Road',
        'Cattleya 1 St.',
        'Sampaguita St.',
        'Sitio Paraiso',
        'T Ceñidoza St.',
        'Wagas street',
        'Rosal St.',
        'Tabtab St.',
        'Cattleya 2 St.',
        'Certisa St.'
      ],
      subNodes: [
        { name: 'Crystal East Valley Main Drop', lat: 14.4845, lng: 121.2152, status: 'Active Subscriber Hub' },
        { name: 'Sampaguita & Cattleya St. Node', lat: 14.4818, lng: 121.2128, status: 'Active Subscriber Hub' },
        { name: 'Manila East Road Mambog Feeder', lat: 14.4765, lng: 121.2116, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 11,
      name: 'Mahabang Parang',
      municipality: 'Binangonan',
      lat: 14.4695,
      lng: 121.2106,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '195+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: [
        'Manila East Rd.',
        'M Oja St.',
        'Revera St.',
        'Ynares St.',
        'Moriones Compound',
        'Pitallo St.',
        'Solero St.',
        'De Mesa St.',
        'B Mesa St.',
        'R Sison St.',
        'Dugar Road',
        'Sitio Bagbagin',
        'Paralejas St.',
        'Sitio Mambalon',
        'Waling Waling St.'
      ],
      subNodes: [
        { name: 'R. Sison & M. Oja St. Node', lat: 14.4687, lng: 121.2054, status: 'Active Subscriber Hub' },
        { name: 'Mahabang Parang Manila East Road Corridor', lat: 14.4710, lng: 121.2090, status: 'Active Subscriber Hub' },
        { name: 'High 5 & Solero St. Cluster', lat: 14.4690, lng: 121.2120, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 12,
      name: 'Darangan (Phase 2 & 3)',
      municipality: 'Binangonan',
      lat: 14.4920,
      lng: 121.1820,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '280+ Connected Homes',
      activeNodes: '13 NAP Terminals',
      coveredAreas: [
        'Cervo St.',
        'Oliveros St.',
        'Manila East Rd.',
        'Paralejas',
        'Bagumbayan St.',
        'Hernandez St.',
        'Fuentes Compound',
        'Fermville II',
        'Kasinay St.',
        'Kalawaan St.',
        'Lote St.',
        'Sampaloc St.',
        'Rotary Ville',
        'Bagong Buwan',
        'Gervacio St.'
      ],
      subNodes: [
        { name: 'Kalawaan St. & Cervo Node', lat: 14.4915, lng: 121.1834, status: 'Active Subscriber Hub' },
        { name: 'Rotary Ville & Fermville II Drop', lat: 14.4930, lng: 121.1850, status: 'Active Subscriber Hub' },
        { name: 'Manila East Road Darangan Corridor', lat: 14.4905, lng: 121.1815, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 13,
      name: 'Darangan (Lower Phase 1)',
      municipality: 'Binangonan',
      lat: 14.49029,
      lng: 121.18421,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '240+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: [
        'Elbote St.',
        'Kasinay St.',
        'Kalawaan St.',
        'Hernandez St.',
        'Bagumbayan St.',
        'SDK',
        'Upper left kasinay',
        'Upper Kasinay St.',
        'Lirrio St. Upper Kasinay',
        'Mabuhay Homes'
      ],
      subNodes: [
        { name: 'Mabuhay Homes Phase 1 Drop', lat: 14.49979, lng: 121.20121, status: 'Active Subscriber Hub' },
        { name: 'Kasinay St. Residential Node', lat: 14.48999, lng: 121.19371, status: 'Active Subscriber Hub' },
        { name: 'Elbote & SDK Cluster', lat: 14.49129, lng: 121.18521, status: 'Active Subscriber Hub' }
      ]
    },

    // Additional Binangonan Mainland Communities
    {
      id: 14,
      name: 'Palangoy',
      municipality: 'Binangonan',
      lat: 14.4938,
      lng: 121.1773,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '150+ Connected Homes',
      activeNodes: '8 NAP Terminals',
      coveredAreas: ['Palangoy Junction', 'Sitio Balimbing', 'National Highway corridor'],
      subNodes: [
        { name: 'Palangoy Junction Drop', lat: 14.4942, lng: 121.1770, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 15,
      name: 'Pantok',
      municipality: 'Binangonan',
      lat: 14.4952,
      lng: 121.1814,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '190+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Pantok Main Road', 'Sitio Kay-Tikling', 'Pantok Heights', 'East Road'],
      subNodes: [
        { name: 'Pantok Heights Cluster', lat: 14.4955, lng: 121.1810, status: 'Active Subscriber Hub' },
        { name: 'Kay-Tikling Junction Node', lat: 14.4950, lng: 121.1820, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 16,
      name: 'San Carlos',
      municipality: 'Binangonan',
      lat: 14.51453,
      lng: 121.16677,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '230+ Connected Homes',
      activeNodes: '12 NAP Terminals',
      coveredAreas: ['San Carlos Heights', 'Villa San Carlos', 'Grand Monaco Casa Royale', 'Palangoy Border'],
      subNodes: [
        { name: 'San Carlos Heights Main Node', lat: 14.51503, lng: 121.16627, status: 'Active Subscriber Hub' },
        { name: 'Villa San Carlos Subscriber Drop', lat: 14.51403, lng: 121.16727, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 17,
      name: 'Tagpos',
      municipality: 'Binangonan',
      lat: 14.5084,
      lng: 121.1670,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '205+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Villa Tagpos', 'Tagpos National Highway', 'Sitio Sto. Niño', 'Tatala Link'],
      subNodes: [
        { name: 'Villa Tagpos Subscriber Hub', lat: 14.5088, lng: 121.1665, status: 'Active Subscriber Hub' },
        { name: 'Sitio Sto. Niño Cluster', lat: 14.5080, lng: 121.1675, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 18,
      name: 'Tayuman',
      municipality: 'Binangonan',
      lat: 14.5142,
      lng: 121.1622,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '215+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Tayuman Commercial Strip', 'East Road Residential', 'Sitio Tayuman Ibaba', 'Darangan Boundary'],
      subNodes: [
        { name: 'Tayuman Main East Road Drop', lat: 14.5145, lng: 121.1620, status: 'Active Subscriber Hub' },
        { name: 'Sitio Tayuman Ibaba Cluster', lat: 14.5138, lng: 121.1625, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 19,
      name: 'Bombongan',
      municipality: 'Binangonan',
      lat: 14.4820,
      lng: 121.1930,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '120+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Bombongan Proper', 'Lakeside Homes', 'Sitio Tabing Baybay'],
      subNodes: [
        { name: 'Bombongan Central Drop', lat: 14.4825, lng: 121.1925, status: 'Active Subscriber Hub' }
      ]
    },
    {
      // Listed on the official Switch Fiber area-coverage material but missing
      // from this list. Coordinates verified against the OpenStreetMap place node.
      id: 50,
      name: 'Bilibiran',
      municipality: 'Binangonan',
      lat: 14.498,
      lng: 121.17516,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Connected Subscribers',
      activeNodes: 'Fiber Terminal Active',
      coveredAreas: ['Bilibiran Proper', 'Manila East Road corridor'],
      subNodes: []
    },
    {
      id: 20,
      name: 'Pag-asa',
      municipality: 'Binangonan',
      lat: 14.52124,
      lng: 121.1589,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '175+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Pag-asa Village', 'Commercial Center', 'San Carlos Border'],
      subNodes: [
        { name: 'Pag-asa Village Drop', lat: 14.52174, lng: 121.1584, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 21,
      name: 'Kalinawan',
      municipality: 'Binangonan',
      // Corrected: the previous 14.4320/121.2060 sat ~650 m offshore in Laguna
      // de Bay. Verified against the OpenStreetMap place node for Kalinawan.
      lat: 14.42679,
      lng: 121.20878,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'High Demand',
      connectedHomes: '95+ Connected Homes',
      activeNodes: '5 NAP Terminals',
      coveredAreas: ['Kalinawan Proper', 'Lakeside Residential Village', 'Pila-Pila Access Rd'],
      subNodes: [
        { name: 'Kalinawan Proper Node', lat: 14.42719, lng: 121.20828, status: 'Active Subscriber Hub' }
      ]
    },
    
    // ==========================================
    // ANGONO EXPANSION (Launching this Year)
    // ==========================================
    {
      id: 22,
      name: 'Kalayaan',
      municipality: 'Angono',
      lat: 14.52794,
      lng: 121.14787,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '195+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Kalayaan Park', 'Doña Aurora Subd.', 'Col. Guido St.', 'Angono Hwy'],
      subNodes: [
        { name: 'Doña Aurora Subd. Hub', lat: 14.52844, lng: 121.14737, status: 'Active Subscriber Hub' },
        { name: 'Col. Guido Street Drop', lat: 14.52744, lng: 121.14837, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 23,
      name: 'San Isidro',
      municipality: 'Angono',
      lat: 14.53285,
      lng: 121.15205,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '170+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: ['San Isidro Proper', 'Medialdea St.', 'Manila East Highway', 'M.L. Quezon Ave'],
      subNodes: [
        { name: 'San Isidro Central Node', lat: 14.53335, lng: 121.15155, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 24,
      name: 'San Pedro',
      municipality: 'Angono',
      lat: 14.5240,
      lng: 121.1510,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '155+ Connected Homes',
      activeNodes: '8 NAP Terminals',
      coveredAreas: ['San Pedro Village', 'Angono Art Capital Center', 'Blanco Family Museum vicinity'],
      subNodes: [
        { name: 'San Pedro Art District Hub', lat: 14.5245, lng: 121.1505, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 25,
      name: 'Poblacion Ibaba',
      municipality: 'Angono',
      lat: 14.52231,
      lng: 121.14801,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '140+ Connected Homes',
      activeNodes: '7 NAP Terminals',
      coveredAreas: ['Poblacion Ibaba Proper', 'Town Hall Area', 'Municipal Plaza'],
      subNodes: [
        { name: 'Poblacion Ibaba Drop', lat: 14.52281, lng: 121.14751, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 26,
      name: 'Poblacion Itaas',
      municipality: 'Angono',
      lat: 14.5250,
      lng: 121.1550,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '135+ Connected Homes',
      activeNodes: '7 NAP Terminals',
      coveredAreas: ['Poblacion Itaas', 'Church Vicinity', 'General Luna St.'],
      subNodes: [
        { name: 'Poblacion Itaas Node', lat: 14.5255, lng: 121.1545, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 27,
      name: 'San Vicente',
      municipality: 'Angono',
      lat: 14.52351,
      lng: 121.14658,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '60+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Vicente Heights', 'Sitio Mahabang Parang link'],
      subNodes: [
        { name: 'San Vicente Expansion Node', lat: 14.52401, lng: 121.14608, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 28,
      name: 'Mahabang Parang',
      municipality: 'Angono',
      lat: 14.54813,
      lng: 121.19008,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '45+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Overlook Valley', 'Sitio Mahabang Parang Angono'],
      subNodes: [
        { name: 'Overlook Valley Feeder', lat: 14.54863, lng: 121.18958, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 29,
      name: 'Santo Niño',
      municipality: 'Angono',
      lat: 14.52585,
      lng: 121.15078,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '50+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Santo Niño Village', 'Sitio Labahan'],
      subNodes: [
        { name: 'Santo Niño Node', lat: 14.52635, lng: 121.15028, status: 'Expansion Feeder Node' }
      ]
    },
    
    // ==========================================
    // TAYTAY EXPANSION
    // ==========================================
    {
      id: 30,
      name: 'Dolores',
      municipality: 'Taytay',
      lat: 14.56934,
      lng: 121.13541,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '220+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Club Manila East vicinity', 'Dolores Proper', 'Tikling Highway'],
      subNodes: [
        { name: 'Tikling / CME Drop', lat: 14.56984, lng: 121.13491, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 31,
      name: 'San Juan',
      municipality: 'Taytay',
      lat: 14.55856,
      lng: 121.13603,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '185+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: ['San Juan Commercial', 'Tiangge Area', 'Manila East Rd'],
      subNodes: [
        { name: 'San Juan Market Node', lat: 14.55906, lng: 121.13553, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 32,
      name: 'Muzon',
      municipality: 'Taytay',
      lat: 14.5420,
      lng: 121.1440,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '75+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Muzon Junction', 'Sitio Silangan', 'Angono Boundary'],
      subNodes: [
        { name: 'Muzon Junction Node', lat: 14.5425, lng: 121.1435, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 33,
      name: 'San Isidro',
      municipality: 'Taytay',
      lat: 14.57665,
      lng: 121.13318,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '65+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Isidro Village', 'Antipolo Link'],
      subNodes: [
        { name: 'San Isidro Taytay Feeder', lat: 14.57715, lng: 121.13268, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 34,
      name: 'Santa Ana',
      municipality: 'Taytay',
      lat: 14.56542,
      lng: 121.1268,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '70+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Santa Ana Village', 'Lupang Arenda access'],
      subNodes: [
        { name: 'Santa Ana Drop', lat: 14.56592, lng: 121.1263, status: 'Expansion Feeder Node' }
      ]
    },
    
    // ==========================================
    // TERESA EXPANSION
    // ==========================================
    {
      id: 35,
      name: 'Poblacion',
      municipality: 'Teresa',
      lat: 14.5620,
      lng: 121.2100,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '110+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Teresa Town Center', 'Municipal Hall Area', 'National Rd'],
      subNodes: [
        { name: 'Teresa Town Center Node', lat: 14.5625, lng: 121.2095, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 36,
      name: 'Dalig',
      municipality: 'Teresa',
      lat: 14.56797,
      lng: 121.23101,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '40+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Dalig Proper', 'Sitio Quarry'],
      subNodes: [
        { name: 'Dalig Teresa Drop', lat: 14.56847, lng: 121.23051, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 37,
      name: 'San Gabriel',
      municipality: 'Teresa',
      lat: 14.55633,
      lng: 121.21136,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '45+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['San Gabriel Village', 'Morong Boundary'],
      subNodes: [
        { name: 'San Gabriel Node', lat: 14.55683, lng: 121.21086, status: 'Expansion Feeder Node' }
      ]
    },

    // ==========================================
    // CARDONA EXPANSION
    // ==========================================
    {
      id: 38,
      name: 'Calahan',
      municipality: 'Cardona',
      lat: 14.49436,
      lng: 121.23483,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '120+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Calahan Proper', 'Cardona Highway Strip', 'Binangonan Boundary'],
      subNodes: [
        { name: 'Calahan Highway Drop', lat: 14.49486, lng: 121.23433, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 39,
      name: 'Looc',
      municipality: 'Cardona',
      lat: 14.47916,
      lng: 121.22412,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '50+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Looc Coastal Strip', 'Sitio Baybay'],
      subNodes: [
        { name: 'Looc Coastal Drop', lat: 14.47966, lng: 121.22362, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 40,
      name: 'Real (Poblacion)',
      municipality: 'Cardona',
      lat: 14.48511,
      lng: 121.23105,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '55+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Cardona Municipal Hall', 'Real Town Proper'],
      subNodes: [
        { name: 'Cardona Town Proper Drop', lat: 14.48561, lng: 121.23055, status: 'Expansion Feeder Node' }
      ]
    },

    // ==========================================
    // MORONG EXPANSION
    // ==========================================
    {
      id: 41,
      name: 'San Juan',
      municipality: 'Morong',
      lat: 14.5130,
      lng: 121.2390,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '60+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Morong Church vicinity', 'San Juan Proper', 'Tomas Claudio Colleges link'],
      subNodes: [
        { name: 'Morong Heritage Center Node', lat: 14.5135, lng: 121.2385, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 42,
      name: 'San Pedro',
      municipality: 'Morong',
      lat: 14.5081,
      lng: 121.2369,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '50+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Pedro Residential', 'Lakeside bypass'],
      subNodes: [
        { name: 'San Pedro Morong Drop', lat: 14.5086, lng: 121.2364, status: 'Expansion Feeder Node' }
      ]
    },

    // ==========================================
    // BARAS EXPANSION
    // ==========================================
    {
      id: 43,
      name: 'Concepcion',
      municipality: 'Baras',
      lat: 14.5210,
      lng: 121.2690,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '40+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Concepcion Main', 'National Road Baras'],
      subNodes: [
        { name: 'Concepcion Baras Drop', lat: 14.5215, lng: 121.2685, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 44,
      name: 'San Jose',
      municipality: 'Baras',
      lat: 14.61944,
      lng: 121.28194,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '45+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Baras Town Plaza', 'San Jose St.'],
      subNodes: [
        { name: 'San Jose Baras Node', lat: 14.61994, lng: 121.28144, status: 'Expansion Feeder Node' }
      ]
    },

    // ==========================================
    // TANAY EXPANSION
    // ==========================================
    {
      id: 45,
      name: 'Plaza Aldea',
      municipality: 'Tanay',
      lat: 14.509,
      lng: 121.30104,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '65+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Plaza Aldea Proper', 'Tanay Commercial Hub'],
      subNodes: [
        { name: 'Plaza Aldea Tanay Drop', lat: 14.5095, lng: 121.30054, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 46,
      name: 'Katipunan-Bayan',
      municipality: 'Tanay',
      lat: 14.4960,
      lng: 121.2840,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '55+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Tanay Public Market', 'Katipunan Bayan'],
      subNodes: [
        { name: 'Tanay Public Market Node', lat: 14.4965, lng: 121.2835, status: 'Expansion Feeder Node' }
      ]
    },

    // ==========================================
    // ANTIPOLO EXPANSION
    // ==========================================
    {
      id: 47,
      name: 'Dela Paz',
      municipality: 'Antipolo',
      lat: 14.58867,
      lng: 121.17398,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '80+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Dela Paz Proper', 'Sumulong Highway corridor', 'Antipolo Cathedral vicinity'],
      subNodes: [
        { name: 'Dela Paz Cathedral Node', lat: 14.58917, lng: 121.17348, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 48,
      name: 'San Roque',
      municipality: 'Antipolo',
      lat: 14.5810,
      lng: 121.1720,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '75+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['San Roque Village', 'Marcos Highway link', 'Teresa Boundary'],
      subNodes: [
        { name: 'San Roque Antipolo Node', lat: 14.5815, lng: 121.1715, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 49,
      name: 'Santa Cruz',
      municipality: 'Antipolo',
      lat: 14.61606,
      lng: 121.16979,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '70+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Santa Cruz Proper', 'C-6 Access link', 'Residential Subdivisions'],
      subNodes: [
        { name: 'Santa Cruz Antipolo Node', lat: 14.61656, lng: 121.16929, status: 'Expansion Feeder Node' }
      ]
    }
  ])

  const filteredCoverage = computed(() => {
    return coverageList.value.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            item.municipality.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            (item.coveredAreas && item.coveredAreas.some(area => area.toLowerCase().includes(searchQuery.value.toLowerCase())))
      const matchesMunicipality = selectedMunicipality.value === 'All' || item.municipality === selectedMunicipality.value
      return matchesSearch && matchesMunicipality
    })
  })

  function checkAddressServiceability(query) {
    if (!query) return null
    const q = query.toLowerCase()
    const found = coverageList.value.find(item => 
      q.includes(item.name.toLowerCase()) || 
      q.includes(item.municipality.toLowerCase()) ||
      (item.coveredAreas && item.coveredAreas.some(area => q.includes(area.toLowerCase())))
    )
    if (found) {
      return {
        serviceable: true,
        item: found,
        message: `Great news! ${found.name}, ${found.municipality} is inside Switch Fiber's active zone (${found.speed}) with ${found.connectedHomes}. Covered subdivisions and streets include ${found.coveredAreas.slice(0, 3).join(', ')}.`
      }
    }
    return {
      serviceable: false,
      message: `We're expanding rapidly across Rizal! Submit your address so our team can prioritize your neighborhood.`
    }
  }

  return {
    searchQuery,
    selectedMunicipality,
    focusedBarangayId,
    showCustomerNodes,
    municipalities,
    municipalityCenters,
    coverageList,
    filteredCoverage,
    checkAddressServiceability
  }
})
