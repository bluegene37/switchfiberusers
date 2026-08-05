import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCoverageStore = defineStore('coverage', () => {
  const searchQuery = ref('')
  const selectedMunicipality = ref('All')

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

  const coverageList = ref([
    // Binangonan Barangays
    { id: 1, name: 'Bilibiran', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 2, name: 'Calumpang', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 3, name: 'Darangan', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 4, name: 'Kalinawan', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'High Demand' },
    { id: 5, name: 'Layunan', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 6, name: 'Libis', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 7, name: 'Lunsad', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 8, name: 'Mahabang Parang', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 9, name: 'Macamot', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 10, name: 'Mambog', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 11, name: 'Pag-asa', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 12, name: 'Palangoy', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 13, name: 'Pila-Pila', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 14, name: 'San Carlos', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 15, name: 'Tagpos', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 16, name: 'Tatala', municipality: 'Binangonan', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    
    // Angono Barangays
    { id: 17, name: 'Kalayaan', municipality: 'Angono', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 18, name: 'San Isidro', municipality: 'Angono', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 19, name: 'San Pedro', municipality: 'Angono', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 20, name: 'San Vicente', municipality: 'Angono', status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    
    // Taytay Barangays
    { id: 21, name: 'Dolores', municipality: 'Taytay', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 22, name: 'San Juan', municipality: 'Taytay', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 23, name: 'Muzon', municipality: 'Taytay', status: 'Expansion Active', speed: 'Up to 300 Mbps', slots: 'Inquire for Port' },
    
    // Teresa & Cardona
    { id: 24, name: 'Poblacion', municipality: 'Teresa', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' },
    { id: 25, name: 'Calahan', municipality: 'Cardona', status: 'Available Now', speed: 'Up to 500 Mbps', slots: 'Ready for Dispatch' }
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
    municipalities,
    coverageList,
    filteredCoverage,
    checkAddressServiceability
  }
})
