import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { barangayBoundaries } from '../data/barangayBoundaries.js'
import { samePlace } from '../data/calabarzonLocations.js'

export const useCoverageStore = defineStore('coverage', () => {
  const searchQuery = ref('')
  const selectedMunicipality = ref('All')
  const focusedBarangayId = ref(null)
  const showNapPoints = ref(true)

  // Live LCP/NAP terminal locations from the fiber backend. These replace the
  // previously hardcoded per-barangay "customer pin" coordinates.
  const napLocations = ref([])
  const napStatus = ref('idle') // idle | loading | ready | error

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
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '47+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGE.png',
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
      ]
    },
    {
      id: 2,
      name: 'Layunan',
      municipality: 'Binangonan',
      lat: 14.4684,
      lng: 121.1933,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '38+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/1.png',
      coveredAreas: [
        'M.H. Del Pilar St.',
        'Osmeña St.',
        'Regidor St.',
        'Valencia St.',
        'Baltazar St.',
        'J. Luna St.',
        'J.P. Rizal Ave.'
      ]
    },
    {
      id: 3,
      name: 'Libis',
      municipality: 'Binangonan',
      lat: 14.4652,
      lng: 121.1906,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '33+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/2.png',
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
      ]
    },
    {
      id: 4,
      name: 'Libid',
      municipality: 'Binangonan',
      lat: 14.4619,
      lng: 121.1925,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '39+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/3.png',
      coveredAreas: [
        'M.H. Del Pilar St.',
        'R. Zulueta St.',
        'Liwasan St.',
        'Zamora St.',
        'P. Burgos St.',
        'L. Jaena St.',
        'JM Basa St.'
      ]
    },
    {
      id: 5,
      name: 'Lunsad',
      municipality: 'Binangonan',
      lat: 14.4581,
      lng: 121.1977,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '65+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/4.png',
      coveredAreas: [
        'Quezon Ext.',
        'R. Zulueta St.',
        'P. Burgos St.',
        'Fineza St.',
        'Juan Sumulong Rd.',
        'J. Antiporda St.',
        'E. Unida St.',
        'Sitio Gupiing'
      ]
    },
    {
      id: 6,
      name: 'Calumpang',
      municipality: 'Binangonan',
      lat: 14.4738,
      lng: 121.1891,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '63+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES.png',
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
      ]
    },
    {
      id: 7,
      name: 'Pila Pila',
      municipality: 'Binangonan',
      lat: 14.4481,
      lng: 121.2054,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '42+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES-3.png',
      coveredAreas: [
        'P. Burgos St.',
        'Sitio Manggahan',
        'Paralejas St.',
        'Sitio Pulo',
        'Antiporda St.',
        'Sitio Tangke',
        'Sitio Hulo',
        'Sitio Kabilang Tabi'
      ]
    },
    {
      id: 8,
      name: 'Macamot',
      municipality: 'Binangonan',
      lat: 14.4840,
      lng: 121.1968,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '48+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES-2.png',
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
      ]
    },
    {
      id: 9,
      name: 'Tatala',
      municipality: 'Binangonan',
      lat: 14.4813,
      lng: 121.2136,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '46+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES-9.png',
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
      ]
    },
    {
      id: 10,
      name: 'Mambog',
      municipality: 'Binangonan',
      lat: 14.4687,
      lng: 121.2091,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '40+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES-10.png',
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
      ]
    },
    {
      id: 11,
      name: 'Mahabang Parang',
      municipality: 'Binangonan',
      lat: 14.4916,
      lng: 121.1882,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '72+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES-11.png',
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
      ]
    },
    {
      id: 12,
      name: 'Darangan (Phase 2 & 3)',
      municipality: 'Binangonan',
      lat: 14.4963,
      lng: 121.1918,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '62+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES-12.png',
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
      ]
    },
    {
      id: 13,
      name: 'Darangan (Lower Phase 1)',
      municipality: 'Binangonan',
      lat: 14.4963,
      lng: 121.1918,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '38+ coverage points mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES-9-1.png',
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
      ]
    },

    // Additional Binangonan Mainland Communities
    {
      id: 14,
      name: 'Palangoy',
      municipality: 'Binangonan',
      lat: 14.4877,
      lng: 121.2085,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '8 NAP Terminals',
      coveredAreas: ['Palangoy Junction', 'Sitio Balimbing', 'National Highway corridor']
    },
    {
      id: 15,
      name: 'Pantok',
      municipality: 'Binangonan',
      lat: 14.5037,
      lng: 121.1876,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Pantok Main Road', 'Sitio Kay-Tikling', 'Pantok Heights', 'East Road']
    },
    {
      id: 16,
      name: 'San Carlos',
      municipality: 'Binangonan',
      lat: 14.51453,
      lng: 121.16677,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '12 NAP Terminals',
      coveredAreas: ['San Carlos Heights', 'Villa San Carlos', 'Grand Monaco Casa Royale', 'Palangoy Border']
    },
    {
      id: 17,
      name: 'Tagpos',
      municipality: 'Binangonan',
      lat: 14.5076,
      lng: 121.1683,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Villa Tagpos', 'Tagpos National Highway', 'Sitio Sto. Niño', 'Tatala Link']
    },
    {
      id: 18,
      name: 'Tayuman',
      municipality: 'Binangonan',
      lat: 14.5239,
      lng: 121.1590,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Tayuman Commercial Strip', 'East Road Residential', 'Sitio Tayuman Ibaba', 'Darangan Boundary']
    },
    {
      id: 19,
      name: 'Bombongan',
      municipality: 'Binangonan',
      lat: 14.4820,
      lng: 121.1930,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Bombongan Proper', 'Lakeside Homes', 'Sitio Tabing Baybay']
    },
    {
      // Listed on the official Switch Fiber area-coverage material but missing
      // from this list. Coordinates calibrated against the physical LCP/NAP cluster centroid.
      id: 50,
      name: 'Bilibiran',
      municipality: 'Binangonan',
      lat: 14.5175,
      lng: 121.1626,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Connected Subscribers',
      activeNodes: 'Fiber Terminal Active',
      coveredAreas: ['Bilibiran Proper', 'Manila East Road corridor']
    },
    {
      id: 20,
      name: 'Pag-asa',
      municipality: 'Binangonan',
      lat: 14.52124,
      lng: 121.1589,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Pag-asa Village', 'Commercial Center', 'San Carlos Border']
    },
    {
      id: 21,
      name: 'Kalinawan',
      municipality: 'Binangonan',
      lat: 14.4965,
      lng: 121.1793,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'High Demand',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '5 NAP Terminals',
      coveredAreas: ['Kalinawan Proper', 'Lakeside Residential Village', 'Pila-Pila Access Rd']
    },
    {
      id: 53,
      name: 'Habagatan',
      municipality: 'Binangonan',
      lat: 14.4981,
      lng: 121.1766,
      status: 'Available Now',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '56 live NAP terminals mapped',
      officialMapImage: 'https://switchfiber.ph/wp-content/uploads/AREA-COVERAGES-11.png',
      coveredAreas: ['Manila East Road', 'San Roque St.', 'San Vicente St.', 'Tojos St.', 'Sto. Niño', 'Lirio']
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
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Kalayaan Park', 'Doña Aurora Subd.', 'Col. Guido St.', 'Angono Hwy']
    },
    {
      id: 23,
      name: 'San Isidro',
      municipality: 'Angono',
      lat: 14.53285,
      lng: 121.15205,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '9 NAP Terminals',
      coveredAreas: ['San Isidro Proper', 'Medialdea St.', 'Manila East Highway', 'M.L. Quezon Ave']
    },
    {
      id: 24,
      name: 'San Pedro',
      municipality: 'Angono',
      lat: 14.5240,
      lng: 121.1510,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '8 NAP Terminals',
      coveredAreas: ['San Pedro Village', 'Angono Art Capital Center', 'Blanco Family Museum vicinity']
    },
    {
      id: 25,
      name: 'Poblacion Ibaba',
      municipality: 'Angono',
      lat: 14.52231,
      lng: 121.14801,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '7 NAP Terminals',
      coveredAreas: ['Poblacion Ibaba Proper', 'Town Hall Area', 'Municipal Plaza']
    },
    {
      id: 26,
      name: 'Poblacion Itaas',
      municipality: 'Angono',
      lat: 14.5250,
      lng: 121.1550,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '7 NAP Terminals',
      coveredAreas: ['Poblacion Itaas', 'Church Vicinity', 'General Luna St.']
    },
    {
      id: 27,
      name: 'San Vicente',
      municipality: 'Angono',
      lat: 14.52351,
      lng: 121.14658,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Vicente Heights', 'Sitio Mahabang Parang link']
    },
    {
      id: 28,
      name: 'Mahabang Parang',
      municipality: 'Angono',
      lat: 14.54813,
      lng: 121.19008,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Overlook Valley', 'Sitio Mahabang Parang Angono']
    },
    {
      id: 29,
      name: 'Santo Niño',
      municipality: 'Angono',
      lat: 14.52585,
      lng: 121.15078,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Santo Niño Village', 'Sitio Labahan']
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
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Club Manila East vicinity', 'Dolores Proper', 'Tikling Highway']
    },
    {
      id: 31,
      name: 'San Juan',
      municipality: 'Taytay',
      lat: 14.55856,
      lng: 121.13603,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '9 NAP Terminals',
      coveredAreas: ['San Juan Commercial', 'Tiangge Area', 'Manila East Rd']
    },
    {
      id: 32,
      name: 'Muzon',
      municipality: 'Taytay',
      lat: 14.5420,
      lng: 121.1440,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Muzon Junction', 'Sitio Silangan', 'Angono Boundary']
    },
    {
      id: 33,
      name: 'San Isidro',
      municipality: 'Taytay',
      lat: 14.57665,
      lng: 121.13318,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Isidro Village', 'Antipolo Link']
    },
    {
      id: 34,
      name: 'Santa Ana',
      municipality: 'Taytay',
      lat: 14.56542,
      lng: 121.1268,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Santa Ana Village', 'Lupang Arenda access']
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
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Teresa Town Center', 'Municipal Hall Area', 'National Rd']
    },
    {
      id: 36,
      name: 'Dalig',
      municipality: 'Teresa',
      lat: 14.56797,
      lng: 121.23101,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Dalig Proper', 'Sitio Quarry']
    },
    {
      id: 37,
      name: 'San Gabriel',
      municipality: 'Teresa',
      lat: 14.55633,
      lng: 121.21136,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['San Gabriel Village', 'Morong Boundary']
    },

    // ==========================================
    // CARDONA EXPANSION
    // ==========================================
    {
      id: 38,
      name: 'Calahan',
      municipality: 'Cardona',
      lat: 14.4865,
      lng: 121.2296,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Calahan Proper', 'Cardona Highway Strip', 'Binangonan Boundary']
    },
    {
      id: 39,
      name: 'Looc',
      municipality: 'Cardona',
      lat: 14.4796,
      lng: 121.2252,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Looc Coastal Strip', 'Sitio Baybay']
    },
    {
      id: 40,
      name: 'Real (Poblacion)',
      municipality: 'Cardona',
      lat: 14.4784,
      lng: 121.2323,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Cardona Municipal Hall', 'Real Town Proper']
    },
    {
      id: 54,
      name: 'San Roque',
      municipality: 'Cardona',
      lat: 14.4897,
      lng: 121.2357,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 live NAP terminals mapped',
      coveredAreas: ['Alejandro St.', 'Perry St.', 'Sta. Ana St.']
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
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Morong Church vicinity', 'San Juan Proper', 'Tomas Claudio Colleges link']
    },
    {
      id: 42,
      name: 'San Pedro',
      municipality: 'Morong',
      lat: 14.5081,
      lng: 121.2369,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Pedro Residential', 'Lakeside bypass']
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
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Concepcion Main', 'National Road Baras']
    },
    {
      id: 44,
      name: 'San Jose',
      municipality: 'Baras',
      lat: 14.61944,
      lng: 121.28194,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Baras Town Plaza', 'San Jose St.']
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
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Plaza Aldea Proper', 'Tanay Commercial Hub']
    },
    {
      id: 46,
      name: 'Katipunan-Bayan',
      municipality: 'Tanay',
      lat: 14.4960,
      lng: 121.2840,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Tanay Public Market', 'Katipunan Bayan']
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
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Dela Paz Proper', 'Sumulong Highway corridor', 'Antipolo Cathedral vicinity']
    },
    {
      id: 48,
      name: 'San Roque',
      municipality: 'Antipolo',
      lat: 14.5810,
      lng: 121.1720,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['San Roque Village', 'Marcos Highway link', 'Teresa Boundary']
    },
    {
      id: 49,
      name: 'Santa Cruz',
      municipality: 'Antipolo',
      lat: 14.61606,
      lng: 121.16979,
      status: 'Expansion Active',
      speed: 'Up to 220 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: 'Fiber Coverage Active',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Santa Cruz Proper', 'C-6 Access link', 'Residential Subdivisions']
    }
  ])

  const onlyNapCovered = ref(true)

  // Ray-casting point-in-polygon algorithm to test if [lng, lat] falls within GeoJSON polygon
  function pointInPolygon(point, vs) {
    const x = point[0]
    const y = point[1]
    let inside = false
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0]
      const yi = vs[i][1]
      const xj = vs[j][0]
      const yj = vs[j][1]
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }
    return inside
  }

  function getDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Known backend numeric barangay identifiers for legacy Binangonan and Cardona database rows
  const KNOWN_BARANGAY_CODES = {
    '2': { municipality: 'Binangonan', name: 'Batingan (HQ)' },
    '3': { municipality: 'Binangonan', name: 'Habagatan' },
    '7': { municipality: 'Binangonan', name: 'Calumpang' },
    '8': { municipality: 'Binangonan', name: 'Darangan' },
    '19': { municipality: 'Binangonan', name: 'Layunan' },
    '20': { municipality: 'Binangonan', name: 'Libid' },
    '21': { municipality: 'Binangonan', name: 'Libis' },
    '22': { municipality: 'Binangonan', name: 'Lunsad' },
    '23': { municipality: 'Binangonan', name: 'Lunsad' },
    '24': { municipality: 'Binangonan', name: 'Macamot' },
    '25': { municipality: 'Binangonan', name: 'Mambog' },
    '27': { municipality: 'Binangonan', name: 'Tatala' },
    '28': { municipality: 'Binangonan', name: 'Tayuman' },
    '29': { municipality: 'Binangonan', name: 'Kalinawan' },
    '30': { municipality: 'Binangonan', name: 'Pantok' },
    '31': { municipality: 'Binangonan', name: 'Pila Pila' },
    '38': { municipality: 'Binangonan', name: 'Tagpos' },
    '39': { municipality: 'Binangonan', name: 'Palangoy' },
    '40': { municipality: 'Binangonan', name: 'Bilibiran' },
    '43': { municipality: 'Binangonan', name: 'Mambog' },
    '48': { municipality: 'Cardona', name: 'Calahan' },
    '62': { municipality: 'Binangonan', name: 'Mahabang Parang (Binangonan)' },
    '63': { municipality: 'Cardona', name: 'Looc' },
    '66': { municipality: 'Cardona', name: 'San Roque' },
    '67': { municipality: 'Cardona', name: 'Real (Poblacion)' },
    '68': { municipality: 'Cardona', name: 'Calahan' },
    '74': { municipality: 'Cardona', name: 'Calahan' }
  }

  /**
   * Resolves any NAP point (existing or newly added) to its corresponding
   * Municipality and Barangay using a multi-tiered spatial and textual matching strategy.
   */
  function resolveNapBarangay(point) {
    if (!point) return null
    const bRaw = (point.barangay || '').trim()
    const cityRaw = (point.city || '').trim()

    // 1. Check known numeric code dictionary
    if (bRaw && KNOWN_BARANGAY_CODES[bRaw]) {
      const known = KNOWN_BARANGAY_CODES[bRaw]
      return {
        municipality: known.municipality,
        name: known.name
      }
    }

    // 2. If bRaw is text (not purely numeric digits), check if it matches an item in coverageList
    if (bRaw && !/^\d+$/.test(bRaw)) {
      const matchedItem = coverageList.value.find(item =>
        (!cityRaw || cityRaw === 'All' || samePlace(item.municipality, cityRaw)) &&
        samePlace(item.name, bRaw)
      )
      if (matchedItem) {
        return { municipality: matchedItem.municipality, name: matchedItem.name }
      }
      if (cityRaw && cityRaw !== 'All') {
        return { municipality: cityRaw, name: bRaw }
      }
    }

    // 3. GeoJSON polygon containment
    for (const [key, boundary] of Object.entries(barangayBoundaries)) {
      if (boundary && boundary.coordinates && boundary.coordinates[0]) {
        if (pointInPolygon([point.lng, point.lat], boundary.coordinates[0])) {
          const [mun, brgy] = key.split('::')
          return { municipality: mun, name: brgy }
        }
      }
    }

    // 4. Spatial proximity within 1.0km of known barangay centers in the same municipality
    const candidateItems = cityRaw && cityRaw !== 'All'
      ? coverageList.value.filter(item => samePlace(item.municipality, cityRaw))
      : coverageList.value

    let closestItem = null
    let minDistance = Infinity
    for (const item of candidateItems) {
      const d = getDistanceKm(point.lat, point.lng, item.lat, item.lng)
      if (d < minDistance && d <= 1.0) {
        minDistance = d
        closestItem = item
      }
    }
    if (closestItem) {
      return { municipality: closestItem.municipality, name: closestItem.name }
    }

    // 5. Dynamic fallback: if point has city and textual barangay
    if (bRaw) {
      return { municipality: cityRaw || 'Rizal', name: bRaw }
    }

    // 6. Last resort: if city is known, group by street or LCP
    if (cityRaw && cityRaw !== 'All') {
      return {
        municipality: cityRaw,
        name: point.street ? point.street : (point.lcp || `Zone ${point.id}`)
      }
    }

    return null
  }

  /**
   * Returns the count of live LCP/NAP terminals mapped within a barangay.
   */
  function getNapCountForBarangay(item, napsList = napLocations.value) {
    if (!item || !Array.isArray(napsList) || napsList.length === 0) return 0
    if (typeof item.liveNapCount === 'number' && napsList === napLocations.value) {
      return item.liveNapCount
    }

    let count = 0
    for (const point of napsList) {
      const res = resolveNapBarangay(point)
      if (res && samePlace(res.municipality, item.municipality) && samePlace(res.name, item.name)) {
        count++
      }
    }
    return count
  }

  /**
   * Validates whether a barangay has active LCP/NAP terminals mapped to it.
   */
  function isBarangayInNapData(item, napsList = napLocations.value) {
    if (!item) return false
    if (!Array.isArray(napsList) || napsList.length === 0) {
      // Offline / initial fallback before NAP data loads: only show verified active zones
      return item.status === 'Available Now' || samePlace(item.municipality, 'Cardona')
    }
    if (typeof item.liveNapCount === 'number' && napsList === napLocations.value) {
      return item.liveNapCount > 0
    }
    return getNapCountForBarangay(item, napsList) > 0
  }

  /**
   * Reactive dynamic coverage catalog.
   * Promotes base barangays with newly added live NAPs to active status,
   * updates coordinates to real physical terminal centroids, and auto-synthesizes
   * new barangay items whenever newly provisioned terminals appear in the dataset.
   */
  const dynamicCoverageList = computed(() => {
    const naps = napLocations.value
    if (!Array.isArray(naps) || naps.length === 0) {
      return coverageList.value
    }

    // Group NAPs by "Municipality::Barangay"
    const napGroups = new Map()
    for (const point of naps) {
      const res = resolveNapBarangay(point)
      if (!res) continue
      const key = `${res.municipality}::${res.name}`
      if (!napGroups.has(key)) {
        napGroups.set(key, {
          municipality: res.municipality,
          name: res.name,
          points: []
        })
      }
      napGroups.get(key).points.push(point)
    }

    const result = []
    const matchedKeys = new Set()

    // 1. Process base items from curated coverageList
    for (const item of coverageList.value) {
      // Find all matching groups using samePlace
      const matchedGroups = []
      for (const [key, group] of napGroups.entries()) {
        if (samePlace(group.municipality, item.municipality) && samePlace(group.name, item.name)) {
          matchedGroups.push(group)
          matchedKeys.add(key)
        }
      }

      if (matchedGroups.length > 0) {
        const pts = matchedGroups.flatMap(g => g.points)
        const napStreets = Array.from(new Set(pts.map(p => p.street).filter(Boolean)))
        const allCovered = Array.from(new Set([...(item.coveredAreas || []), ...napStreets]))

        // Center pin at the true centroid of physical LCP/NAP terminals so it is guaranteed to be inside the boundary
        const avgLat = Number((pts.reduce((sum, p) => sum + p.lat, 0) / pts.length).toFixed(5))
        const avgLng = Number((pts.reduce((sum, p) => sum + p.lng, 0) / pts.length).toFixed(5))

        result.push({
          ...item,
          lat: avgLat,
          lng: avgLng,
          status: 'Available Now',
          slots: 'Ready for Dispatch',
          connectedHomes: 'Fiber Coverage Active',
          activeNodes: `${pts.length} live NAP terminal${pts.length === 1 ? '' : 's'} mapped`,
          liveNapCount: pts.length,
          coveredAreas: allCovered.slice(0, 15)
        })
      } else {
        result.push({
          ...item,
          liveNapCount: 0
        })
      }
    }

    // 2. Synthesize new barangays for any newly added NAP groups not in base list
    let dynamicIdCounter = 1000
    for (const [key, group] of napGroups.entries()) {
      if (matchedKeys.has(key)) continue
      const pts = group.points
      const avgLat = pts.reduce((sum, p) => sum + p.lat, 0) / pts.length
      const avgLng = pts.reduce((sum, p) => sum + p.lng, 0) / pts.length
      const napStreets = Array.from(new Set(pts.map(p => p.street).filter(Boolean)))

      result.push({
        id: dynamicIdCounter++,
        name: group.name,
        municipality: group.municipality,
        lat: Number(avgLat.toFixed(6)),
        lng: Number(avgLng.toFixed(6)),
        status: 'Available Now',
        speed: 'Up to 220 Mbps',
        slots: 'Ready for Dispatch',
        connectedHomes: 'Fiber Coverage Active',
        activeNodes: `${pts.length} live NAP terminal${pts.length === 1 ? '' : 's'} mapped`,
        liveNapCount: pts.length,
        coveredAreas: napStreets.slice(0, 15),
        isDynamic: true
      })
    }

    return result
  })

  // Dynamically include any newly discovered municipalities with live NAP terminals
  const allMunicipalities = computed(() => {
    const list = [
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
    const set = new Set(list)
    for (const item of dynamicCoverageList.value) {
      if (item.municipality && item.municipality !== 'All' && isBarangayInNapData(item)) {
        set.add(item.municipality)
      }
    }
    return Array.from(set)
  })

  const filteredCoverage = computed(() => {
    return dynamicCoverageList.value.filter(item => {
      if (onlyNapCovered.value && !isBarangayInNapData(item)) {
        return false
      }
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            item.municipality.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            (item.coveredAreas && item.coveredAreas.some(area => area.toLowerCase().includes(searchQuery.value.toLowerCase())))
      const matchesMunicipality = selectedMunicipality.value === 'All' || samePlace(item.municipality, selectedMunicipality.value)
      return matchesSearch && matchesMunicipality
    })
  })

  // Guaranteed to only ever include barangays that have physical LCP NAP data
  const mapCoverageItems = computed(() => {
    return filteredCoverage.value.filter(item => isBarangayInNapData(item))
  })

  // The backend serves coordinates as a "lat, lng" string; some rows are blank
  // or "0, 0" placeholders. Parse defensively and keep only points that fall
  // inside the Rizal service area, whichever proxy path the data arrived by.
  function parseNapRow(row) {
    if (!row) return null
    const [lat, lng] = String(row.coordinates || '').split(',').map(part => parseFloat(part))
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
    if (lat < 13.8 || lat > 15.2 || lng < 120.6 || lng > 121.9) return null
    return {
      id: row.id,
      name: (row.lcpnap || '').trim() || `NAP ${row.id}`,
      lcp: (row.lcp || '').trim(),
      nap: (row.nap || '').trim(),
      portTotal: row.portTotal ?? null,
      street: (row.street || '').trim(),
      barangay: (row.barangay || '').trim(),
      city: (row.city || '').trim(),
      lat,
      lng
    }
  }

  async function fetchNapLocations(force = false) {
    if (!force && (napStatus.value === 'loading' || napStatus.value === 'ready')) return
    napStatus.value = 'loading'
    // Same-origin in production (Vercel function); VITE_API_BASE_URL supports
    // pointing a local build elsewhere, mirroring the registration store.
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
    try {
      const response = await fetch(`${apiBase}/api/LCPNapLocations`, {
        headers: { 'Accept': 'application/json' }
      })
      if (!response.ok) throw new Error(`LCPNapLocations request failed (${response.status})`)
      const rows = await response.json()
      napLocations.value = (Array.isArray(rows) ? rows : []).map(parseNapRow).filter(Boolean)
      napStatus.value = 'ready'
    } catch (error) {
      console.error('Unable to load live NAP locations:', error)
      napStatus.value = 'error'
    }
  }

  function refreshNapLocations() {
    return fetchNapLocations(true)
  }

  const filteredNapPoints = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return napLocations.value.filter(point => {
      const matchesMunicipality =
        selectedMunicipality.value === 'All' ||
        samePlace(point.city, selectedMunicipality.value)
      if (!matchesMunicipality) return false
      if (!q) return true
      return point.name.toLowerCase().includes(q) ||
             point.street.toLowerCase().includes(q) ||
             point.city.toLowerCase().includes(q)
    })
  })

  function checkAddressServiceability(query) {
    if (!query) return null
    const q = query.toLowerCase()
    const found = dynamicCoverageList.value.find(item => 
      isBarangayInNapData(item) && (
        q.includes(item.name.toLowerCase()) || 
        q.includes(item.municipality.toLowerCase()) ||
        (item.coveredAreas && item.coveredAreas.some(area => q.includes(area.toLowerCase())))
      )
    )
    if (found) {
      return {
        serviceable: true,
        item: found,
        message: `Great news! ${found.name}, ${found.municipality} is inside Switch Fiber's active zone (${found.speed}). Covered subdivisions and streets include ${found.coveredAreas.slice(0, 3).join(', ')}.`
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
    showNapPoints,
    napLocations,
    napStatus,
    fetchNapLocations,
    refreshNapLocations,
    filteredNapPoints,
    municipalities: allMunicipalities,
    municipalityCenters,
    coverageList: dynamicCoverageList,
    filteredCoverage,
    mapCoverageItems,
    onlyNapCovered,
    isBarangayInNapData,
    getNapCountForBarangay,
    resolveNapBarangay,
    checkAddressServiceability
  }
})
