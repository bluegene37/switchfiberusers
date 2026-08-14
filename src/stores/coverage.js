import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCoverageStore = defineStore('coverage', () => {
  const searchQuery = ref('')
  const selectedMunicipality = ref('All')
  const focusedBarangayId = ref(null)

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
    'All': { lat: 14.485, lng: 121.185, zoom: 12 },
    'Binangonan': { lat: 14.475, lng: 121.185, zoom: 13 },
    'Angono': { lat: 14.526, lng: 121.155, zoom: 14 },
    'Taytay': { lat: 14.565, lng: 121.135, zoom: 13 },
    'Teresa': { lat: 14.562, lng: 121.210, zoom: 14 },
    'Cardona': { lat: 14.484, lng: 121.229, zoom: 14 },
    'Morong': { lat: 14.512, lng: 121.240, zoom: 14 },
    'Baras': { lat: 14.520, lng: 121.268, zoom: 14 },
    'Tanay': { lat: 14.498, lng: 121.286, zoom: 14 },
    'Antipolo': { lat: 14.585, lng: 121.176, zoom: 13 }
  }

  const coverageList = ref([
    // Binangonan Barangays (Headquarters & Primary Coverage Zone)
    { id: 1, name: 'Batingan (HQ)', municipality: 'Binangonan', lat: 14.4720, lng: 121.1870, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 2, name: 'Bilibiran', municipality: 'Binangonan', lat: 14.4985, lng: 121.1680, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 3, name: 'Calumpang', municipality: 'Binangonan', lat: 14.4670, lng: 121.1890, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 4, name: 'Darangan', municipality: 'Binangonan', lat: 14.5080, lng: 121.1620, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 5, name: 'Kalinawan', municipality: 'Binangonan', lat: 14.4380, lng: 121.2180, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'High Demand' },
    { id: 6, name: 'Layunan', municipality: 'Binangonan', lat: 14.4610, lng: 121.1930, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 7, name: 'Libis', municipality: 'Binangonan', lat: 14.4570, lng: 121.1910, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 8, name: 'Libid', municipality: 'Binangonan', lat: 14.4625, lng: 121.1945, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 9, name: 'Lunsad', municipality: 'Binangonan', lat: 14.4490, lng: 121.1970, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 10, name: 'Macamot', municipality: 'Binangonan', lat: 14.5120, lng: 121.1710, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 11, name: 'Mahabang Parang', municipality: 'Binangonan', lat: 14.5190, lng: 121.1760, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 12, name: 'Mambog', municipality: 'Binangonan', lat: 14.5180, lng: 121.1860, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 13, name: 'Pag-asa', municipality: 'Binangonan', lat: 14.4650, lng: 121.1880, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 14, name: 'Palangoy', municipality: 'Binangonan', lat: 14.4840, lng: 121.1770, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 15, name: 'Pantok', municipality: 'Binangonan', lat: 14.4910, lng: 121.1730, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 16, name: 'Pila-Pila', municipality: 'Binangonan', lat: 14.4410, lng: 121.2020, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 17, name: 'San Carlos', municipality: 'Binangonan', lat: 14.4790, lng: 121.1820, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 18, name: 'Tagpos', municipality: 'Binangonan', lat: 14.4890, lng: 121.1710, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 19, name: 'Tatala', municipality: 'Binangonan', lat: 14.5020, lng: 121.1690, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 20, name: 'Tayuman', municipality: 'Binangonan', lat: 14.5050, lng: 121.1650, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 21, name: 'Bombongan', municipality: 'Binangonan', lat: 14.4740, lng: 121.1950, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    
    // Angono Barangays
    { id: 22, name: 'Kalayaan', municipality: 'Angono', lat: 14.5290, lng: 121.1520, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 23, name: 'San Isidro', municipality: 'Angono', lat: 14.5210, lng: 121.1570, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 24, name: 'San Pedro', municipality: 'Angono', lat: 14.5240, lng: 121.1510, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 25, name: 'Poblacion Ibaba', municipality: 'Angono', lat: 14.5220, lng: 121.1530, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 26, name: 'Poblacion Itaas', municipality: 'Angono', lat: 14.5250, lng: 121.1550, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 27, name: 'San Vicente', municipality: 'Angono', lat: 14.5310, lng: 121.1590, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 28, name: 'Mahabang Parang', municipality: 'Angono', lat: 14.5380, lng: 121.1680, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 29, name: 'Santo Niño', municipality: 'Angono', lat: 14.5280, lng: 121.1630, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    
    // Taytay Barangays
    { id: 30, name: 'Dolores', municipality: 'Taytay', lat: 14.5650, lng: 121.1350, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 31, name: 'San Juan', municipality: 'Taytay', lat: 14.5710, lng: 121.1290, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 32, name: 'Muzon', municipality: 'Taytay', lat: 14.5420, lng: 121.1440, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 33, name: 'San Isidro', municipality: 'Taytay', lat: 14.5760, lng: 121.1380, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 34, name: 'Santa Ana', municipality: 'Taytay', lat: 14.5580, lng: 121.1320, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    
    // Teresa
    { id: 35, name: 'Poblacion', municipality: 'Teresa', lat: 14.5620, lng: 121.2100, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 36, name: 'Dalig', municipality: 'Teresa', lat: 14.5570, lng: 121.2030, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 37, name: 'San Gabriel', municipality: 'Teresa', lat: 14.5690, lng: 121.2180, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },

    // Cardona
    { id: 38, name: 'Calahan', municipality: 'Cardona', lat: 14.4850, lng: 121.2310, status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 39, name: 'Looc', municipality: 'Cardona', lat: 14.4780, lng: 121.2280, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 40, name: 'Real (Poblacion)', municipality: 'Cardona', lat: 14.4840, lng: 121.2270, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },

    // Morong
    { id: 41, name: 'San Juan', municipality: 'Morong', lat: 14.5130, lng: 121.2390, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 42, name: 'San Pedro', municipality: 'Morong', lat: 14.5100, lng: 121.2420, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },

    // Baras
    { id: 43, name: 'Concepcion', municipality: 'Baras', lat: 14.5210, lng: 121.2690, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 44, name: 'San Jose', municipality: 'Baras', lat: 14.5180, lng: 121.2660, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },

    // Tanay
    { id: 45, name: 'Plaza Aldea', municipality: 'Tanay', lat: 14.4990, lng: 121.2870, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 46, name: 'Katipunan-Bayan', municipality: 'Tanay', lat: 14.4960, lng: 121.2840, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },

    // Antipolo
    { id: 47, name: 'Dela Paz', municipality: 'Antipolo', lat: 14.5860, lng: 121.1780, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 48, name: 'San Roque', municipality: 'Antipolo', lat: 14.5810, lng: 121.1720, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    { id: 49, name: 'Santa Cruz', municipality: 'Antipolo', lat: 14.5920, lng: 121.1850, status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' }
  ])

  const filteredCoverage = computed(() => {
    return coverageList.value.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            item.municipality.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesMunicipality = selectedMunicipality.value === 'All' || item.municipality === selectedMunicipality.value
      return matchesSearch && matchesMunicipality
    })
  })

  function checkAddressServiceability(query) {
    if (!query) return null
    const q = query.toLowerCase()
    const found = coverageList.value.find(item => 
      q.includes(item.name.toLowerCase()) || q.includes(item.municipality.toLowerCase())
    )
    if (found) {
      return {
        serviceable: true,
        item: found,
        message: `Great news! ${found.name}, ${found.municipality} is inside Switch Fiber's high-speed zone (${found.speed}).`
      }
    }
    return {
      serviceable: false,
      message: `We're expanding rapidly in Rizal! Submit your address so our team can prioritize your area.`
    }
  }

  return {
    searchQuery,
    selectedMunicipality,
    focusedBarangayId,
    municipalities,
    municipalityCenters,
    coverageList,
    filteredCoverage,
    checkAddressServiceability
  }
})
