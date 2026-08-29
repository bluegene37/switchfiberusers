import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '320+ Connected Homes',
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
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '190+ Connected Homes',
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
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '210+ Connected Homes',
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
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '175+ Connected Homes',
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
      lat: 14.4605,
      lng: 121.1946,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '200+ Connected Homes',
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
      lat: 14.4766,
      lng: 121.1898,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '260+ Connected Homes',
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
      lat: 14.4490,
      lng: 121.2025,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '180+ Connected Homes',
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
      lat: 14.4868,
      lng: 121.1966,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '230+ Connected Homes',
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
      lat: 14.4828,
      lng: 121.2055,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '270+ Connected Homes',
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
      lat: 14.4816,
      lng: 121.2124,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '210+ Connected Homes',
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
      lat: 14.4695,
      lng: 121.2106,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '195+ Connected Homes',
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
      lat: 14.4920,
      lng: 121.1820,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '280+ Connected Homes',
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
      lat: 14.49029,
      lng: 121.18421,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '240+ Connected Homes',
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
      lat: 14.4938,
      lng: 121.1773,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '150+ Connected Homes',
      activeNodes: '8 NAP Terminals',
      coveredAreas: ['Palangoy Junction', 'Sitio Balimbing', 'National Highway corridor']
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
      coveredAreas: ['Pantok Main Road', 'Sitio Kay-Tikling', 'Pantok Heights', 'East Road']
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
      coveredAreas: ['San Carlos Heights', 'Villa San Carlos', 'Grand Monaco Casa Royale', 'Palangoy Border']
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
      coveredAreas: ['Villa Tagpos', 'Tagpos National Highway', 'Sitio Sto. Niño', 'Tatala Link']
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
      coveredAreas: ['Tayuman Commercial Strip', 'East Road Residential', 'Sitio Tayuman Ibaba', 'Darangan Boundary']
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
      coveredAreas: ['Bombongan Proper', 'Lakeside Homes', 'Sitio Tabing Baybay']
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
      coveredAreas: ['Bilibiran Proper', 'Manila East Road corridor']
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
      coveredAreas: ['Pag-asa Village', 'Commercial Center', 'San Carlos Border']
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
      coveredAreas: ['Kalinawan Proper', 'Lakeside Residential Village', 'Pila-Pila Access Rd']
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
      coveredAreas: ['Kalayaan Park', 'Doña Aurora Subd.', 'Col. Guido St.', 'Angono Hwy']
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
      coveredAreas: ['San Isidro Proper', 'Medialdea St.', 'Manila East Highway', 'M.L. Quezon Ave']
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
      coveredAreas: ['San Pedro Village', 'Angono Art Capital Center', 'Blanco Family Museum vicinity']
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
      coveredAreas: ['Poblacion Ibaba Proper', 'Town Hall Area', 'Municipal Plaza']
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
      coveredAreas: ['Poblacion Itaas', 'Church Vicinity', 'General Luna St.']
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
      coveredAreas: ['San Vicente Heights', 'Sitio Mahabang Parang link']
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
      coveredAreas: ['Overlook Valley', 'Sitio Mahabang Parang Angono']
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
      speed: 'Up to 500 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '220+ Connected Homes',
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
      speed: 'Up to 500 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '185+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '75+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '65+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '70+ Connected Homes',
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
      speed: 'Up to 500 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '110+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '40+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '45+ Connected Homes',
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
      lat: 14.49436,
      lng: 121.23483,
      status: 'Expansion Active',
      speed: 'Up to 500 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '120+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Calahan Proper', 'Cardona Highway Strip', 'Binangonan Boundary']
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
      coveredAreas: ['Looc Coastal Strip', 'Sitio Baybay']
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
      coveredAreas: ['Cardona Municipal Hall', 'Real Town Proper']
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
      coveredAreas: ['Morong Church vicinity', 'San Juan Proper', 'Tomas Claudio Colleges link']
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '40+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '45+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '65+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '55+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '80+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '75+ Connected Homes',
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
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '70+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Santa Cruz Proper', 'C-6 Access link', 'Residential Subdivisions']
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
      city: (row.city || '').trim(),
      lat,
      lng
    }
  }

  async function fetchNapLocations() {
    if (napStatus.value === 'loading' || napStatus.value === 'ready') return
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

  const filteredNapPoints = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return napLocations.value.filter(point => {
      const matchesMunicipality =
        selectedMunicipality.value === 'All' ||
        point.city.toLowerCase() === selectedMunicipality.value.toLowerCase()
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
    showNapPoints,
    napLocations,
    napStatus,
    fetchNapLocations,
    filteredNapPoints,
    municipalities,
    municipalityCenters,
    coverageList,
    filteredCoverage,
    checkAddressServiceability
  }
})
