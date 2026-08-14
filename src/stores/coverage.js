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
    {
      id: 1,
      name: 'Batingan (HQ)',
      municipality: 'Binangonan',
      lat: 14.4720,
      lng: 121.1870,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '250+ Connected Homes',
      activeNodes: '12 NAP Terminals',
      coveredAreas: ['Sta. Ursula Subd.', 'Sampaloc St.', 'Guitnang Bayan', 'Poblacion Proper', 'Manila East Rd Corridor'],
      subNodes: [
        { name: 'Sta. Ursula Subd. Phase 1 & 2', lat: 14.4725, lng: 121.1865, status: 'Active Subscriber Hub' },
        { name: 'Sampaloc St. Customer Drop', lat: 14.4715, lng: 121.1875, status: 'Active Subscriber Hub' },
        { name: 'Poblacion Market Vicinity', lat: 14.4730, lng: 121.1880, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 2,
      name: 'Bilibiran',
      municipality: 'Binangonan',
      lat: 14.4985,
      lng: 121.1680,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '180+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: ['San Vicente Subd.', 'Villa Bilibiran', 'Sitio Bilibiran Proper', 'Manila East Highway'],
      subNodes: [
        { name: 'San Vicente Subd. Drop', lat: 14.4990, lng: 121.1675, status: 'Active Subscriber Hub' },
        { name: 'Villa Bilibiran Main Node', lat: 14.4980, lng: 121.1685, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 3,
      name: 'Calumpang',
      municipality: 'Binangonan',
      lat: 14.4670,
      lng: 121.1890,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '140+ Connected Homes',
      activeNodes: '8 NAP Terminals',
      coveredAreas: ['Calumpang National High vicinity', 'Sitio Tabing Ilog', 'Libis Calumpang', 'M.H. Del Pilar St.'],
      subNodes: [
        { name: 'Calumpang High School Cluster', lat: 14.4675, lng: 121.1885, status: 'Active Subscriber Hub' },
        { name: 'Tabing Ilog Residential Node', lat: 14.4665, lng: 121.1895, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 4,
      name: 'Darangan',
      municipality: 'Binangonan',
      lat: 14.5080,
      lng: 121.1620,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '210+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Mabuhay Homes 2000', 'Sitio Wawa', 'Darangan Main Rd', 'Macamot Boundary'],
      subNodes: [
        { name: 'Mabuhay Homes 2000 Phase 1-3', lat: 14.5085, lng: 121.1615, status: 'Active Subscriber Hub' },
        { name: 'Sitio Wawa Coastal Drop', lat: 14.5075, lng: 121.1625, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 5,
      name: 'Kalinawan',
      municipality: 'Binangonan',
      lat: 14.4380,
      lng: 121.2180,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'High Demand',
      connectedHomes: '95+ Connected Homes',
      activeNodes: '5 NAP Terminals',
      coveredAreas: ['Kalinawan Proper', 'Lakeside Residential Village', 'Pila-Pila Access Rd'],
      subNodes: [
        { name: 'Kalinawan Proper Node', lat: 14.4385, lng: 121.2175, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 6,
      name: 'Layunan',
      municipality: 'Binangonan',
      lat: 14.4610,
      lng: 121.1930,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '110+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Layunan Coastal Strip', 'Poblacion South', 'A. Bonifacio St.'],
      subNodes: [
        { name: 'Layunan Main Drop', lat: 14.4615, lng: 121.1925, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 7,
      name: 'Libis',
      municipality: 'Binangonan',
      lat: 14.4570,
      lng: 121.1910,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '130+ Connected Homes',
      activeNodes: '7 NAP Terminals',
      coveredAreas: ['Libis Proper', 'Binangonan Port Road', 'Rizal Ave Ext'],
      subNodes: [
        { name: 'Libis Port Corridor Node', lat: 14.4575, lng: 121.1905, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 8,
      name: 'Libid',
      municipality: 'Binangonan',
      lat: 14.4625,
      lng: 121.1945,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '105+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Libid St.', 'Town Plaza Vicinity', 'F. Gomez St.'],
      subNodes: [
        { name: 'Libid Commercial/Residential Node', lat: 14.4630, lng: 121.1940, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 9,
      name: 'Lunsad',
      municipality: 'Binangonan',
      lat: 14.4490,
      lng: 121.1970,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '125+ Connected Homes',
      activeNodes: '7 NAP Terminals',
      coveredAreas: ['Lunsad Elementary area', 'Sitio Ilaya', 'Sitio Ibaba'],
      subNodes: [
        { name: 'Lunsad Central Drop', lat: 14.4495, lng: 121.1965, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 10,
      name: 'Macamot',
      municipality: 'Binangonan',
      lat: 14.5120,
      lng: 121.1710,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '145+ Connected Homes',
      activeNodes: '8 NAP Terminals',
      coveredAreas: ['Macamot Subd.', 'National Road corridor', 'Darangan Boundary'],
      subNodes: [
        { name: 'Macamot Subd. Cluster', lat: 14.5125, lng: 121.1705, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 11,
      name: 'Mahabang Parang',
      municipality: 'Binangonan',
      lat: 14.5190,
      lng: 121.1760,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '160+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: ['Mountain Breeze Subd.', 'Sitio Mahabang Parang', 'Mambog Link Rd'],
      subNodes: [
        { name: 'Mountain Breeze Cluster', lat: 14.5195, lng: 121.1755, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 12,
      name: 'Mambog',
      municipality: 'Binangonan',
      lat: 14.5180,
      lng: 121.1860,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '135+ Connected Homes',
      activeNodes: '7 NAP Terminals',
      coveredAreas: ['Mambog Proper', 'Valley View Subd.', 'Sitio Gulod'],
      subNodes: [
        { name: 'Valley View Mambog Drop', lat: 14.5185, lng: 121.1855, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 13,
      name: 'Pag-asa',
      municipality: 'Binangonan',
      lat: 14.4650,
      lng: 121.1880,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '175+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Pag-asa Village', 'Commercial Center', 'San Carlos Border'],
      subNodes: [
        { name: 'Pag-asa Village Phase 1 & 2', lat: 14.4655, lng: 121.1875, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 14,
      name: 'Palangoy',
      municipality: 'Binangonan',
      lat: 14.4840,
      lng: 121.1770,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '150+ Connected Homes',
      activeNodes: '8 NAP Terminals',
      coveredAreas: ['Palangoy Junction', 'Sitio Balimbing', 'National Highway corridor'],
      subNodes: [
        { name: 'Palangoy Junction Drop', lat: 14.4845, lng: 121.1765, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 15,
      name: 'Pantok',
      municipality: 'Binangonan',
      lat: 14.4910,
      lng: 121.1730,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '190+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Pantok Main Road', 'Sitio Kay-Tikling', 'Pantok Heights', 'East Road'],
      subNodes: [
        { name: 'Pantok Heights Cluster', lat: 14.4915, lng: 121.1725, status: 'Active Subscriber Hub' },
        { name: 'Kay-Tikling Junction Node', lat: 14.4905, lng: 121.1735, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 16,
      name: 'Pila-Pila',
      municipality: 'Binangonan',
      lat: 14.4410,
      lng: 121.2020,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '115+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Pila-Pila Coastal Area', 'Sitio Kabilang Ilog', 'Kalinawan Road'],
      subNodes: [
        { name: 'Pila-Pila Community Drop', lat: 14.4415, lng: 121.2015, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 17,
      name: 'San Carlos',
      municipality: 'Binangonan',
      lat: 14.4790,
      lng: 121.1820,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '230+ Connected Homes',
      activeNodes: '12 NAP Terminals',
      coveredAreas: ['San Carlos Heights', 'Villa San Carlos', 'Grand Monaco Casa Royale', 'Palangoy Border'],
      subNodes: [
        { name: 'San Carlos Heights Main Node', lat: 14.4795, lng: 121.1815, status: 'Active Subscriber Hub' },
        { name: 'Villa San Carlos Subscriber Drop', lat: 14.4785, lng: 121.1825, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 18,
      name: 'Tagpos',
      municipality: 'Binangonan',
      lat: 14.4890,
      lng: 121.1710,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '205+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Villa Tagpos', 'Tagpos National Highway', 'Sitio Sto. Niño', 'Tatala Link'],
      subNodes: [
        { name: 'Villa Tagpos Subscriber Hub', lat: 14.4895, lng: 121.1705, status: 'Active Subscriber Hub' },
        { name: 'Sitio Sto. Niño Cluster', lat: 14.4885, lng: 121.1715, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 19,
      name: 'Tatala',
      municipality: 'Binangonan',
      lat: 14.5020,
      lng: 121.1690,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '240+ Connected Homes',
      activeNodes: '12 NAP Terminals',
      coveredAreas: ['Tatala Elementary vicinity', 'Mountain View Subd.', 'Grand Monaco Courtyard', 'Sitio Tatala Proper'],
      subNodes: [
        { name: 'Mountain View Subd. Hub', lat: 14.5025, lng: 121.1685, status: 'Active Subscriber Hub' },
        { name: 'Grand Monaco Tatala Cluster', lat: 14.5015, lng: 121.1695, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 20,
      name: 'Tayuman',
      municipality: 'Binangonan',
      lat: 14.5050,
      lng: 121.1650,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '215+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Tayuman Commercial Strip', 'East Road Residential', 'Sitio Tayuman Ibaba', 'Darangan Boundary'],
      subNodes: [
        { name: 'Tayuman Main East Road Drop', lat: 14.5055, lng: 121.1645, status: 'Active Subscriber Hub' },
        { name: 'Sitio Tayuman Ibaba Cluster', lat: 14.5045, lng: 121.1655, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 21,
      name: 'Bombongan',
      municipality: 'Binangonan',
      lat: 14.4740,
      lng: 121.1950,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '120+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Bombongan Proper', 'Lakeside Homes', 'Sitio Tabing Baybay'],
      subNodes: [
        { name: 'Bombongan Central Drop', lat: 14.4745, lng: 121.1945, status: 'Active Subscriber Hub' }
      ]
    },
    
    // Angono Barangays
    {
      id: 22,
      name: 'Kalayaan',
      municipality: 'Angono',
      lat: 14.5290,
      lng: 121.1520,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '195+ Connected Homes',
      activeNodes: '10 NAP Terminals',
      coveredAreas: ['Kalayaan Park', 'Doña Aurora Subd.', 'Col. Guido St.', 'Angono Hwy'],
      subNodes: [
        { name: 'Doña Aurora Subd. Hub', lat: 14.5295, lng: 121.1515, status: 'Active Subscriber Hub' },
        { name: 'Col. Guido Street Drop', lat: 14.5285, lng: 121.1525, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 23,
      name: 'San Isidro',
      municipality: 'Angono',
      lat: 14.5210,
      lng: 121.1570,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '170+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: ['San Isidro Proper', 'Medialdea St.', 'Manila East Highway', 'M.L. Quezon Ave'],
      subNodes: [
        { name: 'San Isidro Central Node', lat: 14.5215, lng: 121.1565, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 24,
      name: 'San Pedro',
      municipality: 'Angono',
      lat: 14.5240,
      lng: 121.1510,
      status: 'Available Now',
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
      lat: 14.5220,
      lng: 121.1530,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '140+ Connected Homes',
      activeNodes: '7 NAP Terminals',
      coveredAreas: ['Poblacion Ibaba Proper', 'Town Hall Area', 'Municipal Plaza'],
      subNodes: [
        { name: 'Poblacion Ibaba Drop', lat: 14.5225, lng: 121.1525, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 26,
      name: 'Poblacion Itaas',
      municipality: 'Angono',
      lat: 14.5250,
      lng: 121.1550,
      status: 'Available Now',
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
      lat: 14.5310,
      lng: 121.1590,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '60+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Vicente Heights', 'Sitio Mahabang Parang link'],
      subNodes: [
        { name: 'San Vicente Expansion Node', lat: 14.5315, lng: 121.1585, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 28,
      name: 'Mahabang Parang',
      municipality: 'Angono',
      lat: 14.5380,
      lng: 121.1680,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '45+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Overlook Valley', 'Sitio Mahabang Parang Angono'],
      subNodes: [
        { name: 'Overlook Valley Feeder', lat: 14.5385, lng: 121.1675, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 29,
      name: 'Santo Niño',
      municipality: 'Angono',
      lat: 14.5280,
      lng: 121.1630,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '50+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Santo Niño Village', 'Sitio Labahan'],
      subNodes: [
        { name: 'Santo Niño Node', lat: 14.5285, lng: 121.1625, status: 'Expansion Feeder Node' }
      ]
    },
    
    // Taytay Barangays
    {
      id: 30,
      name: 'Dolores',
      municipality: 'Taytay',
      lat: 14.5650,
      lng: 121.1350,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '220+ Connected Homes',
      activeNodes: '11 NAP Terminals',
      coveredAreas: ['Club Manila East vicinity', 'Dolores Proper', 'Tikling Highway'],
      subNodes: [
        { name: 'Tikling / CME Drop', lat: 14.5655, lng: 121.1345, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 31,
      name: 'San Juan',
      municipality: 'Taytay',
      lat: 14.5710,
      lng: 121.1290,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '185+ Connected Homes',
      activeNodes: '9 NAP Terminals',
      coveredAreas: ['San Juan Commercial', 'Tiangge Area', 'Manila East Rd'],
      subNodes: [
        { name: 'San Juan Market Node', lat: 14.5715, lng: 121.1285, status: 'Active Subscriber Hub' }
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
      lat: 14.5760,
      lng: 121.1380,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '65+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Isidro Village', 'Antipolo Link'],
      subNodes: [
        { name: 'San Isidro Taytay Feeder', lat: 14.5765, lng: 121.1375, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 34,
      name: 'Santa Ana',
      municipality: 'Taytay',
      lat: 14.5580,
      lng: 121.1320,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '70+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Santa Ana Village', 'Lupang Arenda access'],
      subNodes: [
        { name: 'Santa Ana Drop', lat: 14.5585, lng: 121.1315, status: 'Expansion Feeder Node' }
      ]
    },
    
    // Teresa
    {
      id: 35,
      name: 'Poblacion',
      municipality: 'Teresa',
      lat: 14.5620,
      lng: 121.2100,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
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
      lat: 14.5570,
      lng: 121.2030,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '40+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Dalig Proper', 'Sitio Quarry'],
      subNodes: [
        { name: 'Dalig Teresa Drop', lat: 14.5575, lng: 121.2025, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 37,
      name: 'San Gabriel',
      municipality: 'Teresa',
      lat: 14.5690,
      lng: 121.2180,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '45+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['San Gabriel Village', 'Morong Boundary'],
      subNodes: [
        { name: 'San Gabriel Node', lat: 14.5695, lng: 121.2175, status: 'Expansion Feeder Node' }
      ]
    },

    // Cardona
    {
      id: 38,
      name: 'Calahan',
      municipality: 'Cardona',
      lat: 14.4850,
      lng: 121.2310,
      status: 'Available Now',
      speed: 'Up to 500 Mbps',
      slots: 'Ready for Dispatch',
      connectedHomes: '120+ Connected Homes',
      activeNodes: '6 NAP Terminals',
      coveredAreas: ['Calahan Proper', 'Cardona Highway Strip', 'Binangonan Boundary'],
      subNodes: [
        { name: 'Calahan Highway Drop', lat: 14.4855, lng: 121.2305, status: 'Active Subscriber Hub' }
      ]
    },
    {
      id: 39,
      name: 'Looc',
      municipality: 'Cardona',
      lat: 14.4780,
      lng: 121.2280,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '50+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Looc Coastal Strip', 'Sitio Baybay'],
      subNodes: [
        { name: 'Looc Coastal Drop', lat: 14.4785, lng: 121.2275, status: 'Expansion Feeder Node' }
      ]
    },
    {
      id: 40,
      name: 'Real (Poblacion)',
      municipality: 'Cardona',
      lat: 14.4840,
      lng: 121.2270,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '55+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Cardona Municipal Hall', 'Real Town Proper'],
      subNodes: [
        { name: 'Cardona Town Proper Drop', lat: 14.4845, lng: 121.2265, status: 'Expansion Feeder Node' }
      ]
    },

    // Morong
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
      lat: 14.5100,
      lng: 121.2420,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '50+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['San Pedro Residential', 'Lakeside bypass'],
      subNodes: [
        { name: 'San Pedro Morong Drop', lat: 14.5105, lng: 121.2415, status: 'Expansion Feeder Node' }
      ]
    },

    // Baras
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
      lat: 14.5180,
      lng: 121.2660,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '45+ Connected Homes',
      activeNodes: '2 NAP Terminals',
      coveredAreas: ['Baras Town Plaza', 'San Jose St.'],
      subNodes: [
        { name: 'San Jose Baras Node', lat: 14.5185, lng: 121.2655, status: 'Expansion Feeder Node' }
      ]
    },

    // Tanay
    {
      id: 45,
      name: 'Plaza Aldea',
      municipality: 'Tanay',
      lat: 14.4990,
      lng: 121.2870,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '65+ Connected Homes',
      activeNodes: '3 NAP Terminals',
      coveredAreas: ['Plaza Aldea Proper', 'Tanay Commercial Hub'],
      subNodes: [
        { name: 'Plaza Aldea Tanay Drop', lat: 14.4995, lng: 121.2865, status: 'Expansion Feeder Node' }
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

    // Antipolo
    {
      id: 47,
      name: 'Dela Paz',
      municipality: 'Antipolo',
      lat: 14.5860,
      lng: 121.1780,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '80+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Dela Paz Proper', 'Sumulong Highway corridor', 'Antipolo Cathedral vicinity'],
      subNodes: [
        { name: 'Dela Paz Cathedral Node', lat: 14.5865, lng: 121.1775, status: 'Expansion Feeder Node' }
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
      lat: 14.5920,
      lng: 121.1850,
      status: 'Expansion Active',
      speed: 'Up to 300 Mbps',
      slots: 'Inquire for Port',
      connectedHomes: '70+ Connected Homes',
      activeNodes: '4 NAP Terminals',
      coveredAreas: ['Santa Cruz Proper', 'C-6 Access link', 'Residential Subdivisions'],
      subNodes: [
        { name: 'Santa Cruz Antipolo Node', lat: 14.5925, lng: 121.1845, status: 'Expansion Feeder Node' }
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
        message: `Great news! ${found.name}, ${found.municipality} is inside Switch Fiber's active zone (${found.speed}) with ${found.connectedHomes}. Covered subdivisions include ${found.coveredAreas.slice(0, 2).join(', ')}.`
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
