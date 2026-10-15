import type { RoutePlan } from '../types';
import { MADRID_HUB } from './hub';

export const INITIAL_ROUTES: RoutePlan[] = [
  {
    id: 'route-centro',
    name: 'Ruta 1 - Centro Histórico',
    zone: 'Centro',
    color: '#3b82f6', // Azul brillante
    status: 'En ruta',
    assignedVehicleId: 'veh-02', // CargoBike
    totalDeliveries: 16,
    completedDeliveries: 11,
    distanceKm: 14.5,
    estimatedDurationMin: 180,
    co2Kg: 0.1,
    costEur: 18.5,
    currentProgressPct: 68,
    currentPosition: [40.4203, -3.7058],
    nextStopName: 'Plaza 2 de Mayo (Malasaña)',
    stops: [
      {
        id: 'stop-c-1',
        name: 'Boutique Atocha',
        address: 'Paseo del Prado 32, 28014',
        coordinates: [40.4110, -3.6930],
        completed: true,
        packageWeightKg: 12,
        estimatedTime: '09:15',
        notes: 'Entregar en recepción'
      },
      {
        id: 'stop-c-2',
        name: 'Librería Central Sol',
        address: 'Calle Mayor 14, 28013',
        coordinates: [40.4160, -3.7060],
        completed: true,
        packageWeightKg: 18,
        estimatedTime: '09:45'
      },
      {
        id: 'stop-c-3',
        name: 'Comercio Gran Vía',
        address: 'Gran Vía 45, 28013',
        coordinates: [40.4203, -3.7058],
        completed: true,
        packageWeightKg: 25,
        estimatedTime: '10:30'
      },
      {
        id: 'stop-c-4',
        name: 'Plaza 2 de Mayo',
        address: 'Calle Dos de Mayo 6, 28004',
        coordinates: [40.4265, -3.7042],
        completed: false,
        packageWeightKg: 8,
        estimatedTime: '11:15'
      },
      {
        id: 'stop-c-5',
        name: 'Cava Baja Gourmet',
        address: 'Calle Cava Baja 19, 28005',
        coordinates: [40.4128, -3.7103],
        completed: false,
        packageWeightKg: 15,
        estimatedTime: '12:00'
      }
    ],
    pathCoordinates: [
      MADRID_HUB.coordinates,
      [40.4020, -3.6880],
      [40.4070, -3.6910],
      [40.4110, -3.6930],
      [40.4135, -3.6990],
      [40.4160, -3.7060],
      [40.4180, -3.7040],
      [40.4203, -3.7058],
      [40.4240, -3.7050],
      [40.4265, -3.7042],
      [40.4210, -3.7090],
      [40.4160, -3.7100],
      [40.4128, -3.7103],
      [40.4050, -3.7000],
      MADRID_HUB.coordinates
    ]
  },
  {
    id: 'route-norte',
    name: 'Ruta 2 - Norte Chamartín',
    zone: 'Norte-Chamartín',
    color: '#10b981', // Verde esmeralda
    status: 'En ruta',
    assignedVehicleId: 'veh-01', // EcoVan
    totalDeliveries: 22,
    completedDeliveries: 14,
    distanceKm: 28.0,
    estimatedDurationMin: 210,
    co2Kg: 0.0,
    costEur: 32.0,
    currentProgressPct: 63,
    currentPosition: [40.4530, -3.6883],
    nextStopName: 'Torre Picasso (AZCA)',
    stops: [
      {
        id: 'stop-n-1',
        name: 'Oficinas Nuevos Ministerios',
        address: 'Paseo de la Castellana 70, 28046',
        coordinates: [40.4468, -3.6920],
        completed: true,
        packageWeightKg: 40,
        estimatedTime: '09:30'
      },
      {
        id: 'stop-n-2',
        name: 'Torre Picasso (AZCA)',
        address: 'Plaza Pablo Ruiz Picasso 1, 28020',
        coordinates: [40.4530, -3.6883],
        completed: false,
        packageWeightKg: 65,
        estimatedTime: '10:45'
      },
      {
        id: 'stop-n-3',
        name: 'Sede Cuzco',
        address: 'Paseo de la Castellana 135, 28046',
        coordinates: [40.4589, -3.6898],
        completed: false,
        packageWeightKg: 35,
        estimatedTime: '11:30'
      },
      {
        id: 'stop-n-4',
        name: 'Torres Kio',
        address: 'Plaza de Castilla 3, 28046',
        coordinates: [40.4660, -3.6890],
        completed: false,
        packageWeightKg: 80,
        estimatedTime: '12:15'
      },
      {
        id: 'stop-n-5',
        name: 'Logística Chamartín',
        address: 'Calle Agustín de Foxá 25, 28036',
        coordinates: [40.4720, -3.6825],
        completed: false,
        packageWeightKg: 120,
        estimatedTime: '13:00'
      }
    ],
    pathCoordinates: [
      MADRID_HUB.coordinates,
      [40.4100, -3.6800],
      [40.4250, -3.6860],
      [40.4350, -3.6890],
      [40.4468, -3.6920],
      [40.4500, -3.6900],
      [40.4530, -3.6883],
      [40.4589, -3.6898],
      [40.4660, -3.6890],
      [40.4720, -3.6825],
      [40.4650, -3.6750],
      [40.4350, -3.6700],
      MADRID_HUB.coordinates
    ]
  },
  {
    id: 'route-este',
    name: 'Ruta 3 - Este Ciudad Lineal',
    zone: 'Este-Ciudad Lineal',
    color: '#8b5cf6', // Violeta
    status: 'En ruta',
    assignedVehicleId: 'veh-04', // Furgón Híbrido Gas ECO
    totalDeliveries: 19,
    completedDeliveries: 8,
    distanceKm: 22.4,
    estimatedDurationMin: 190,
    co2Kg: 2.1,
    costEur: 28.0,
    currentProgressPct: 42,
    currentPosition: [40.4320, -3.6630],
    nextStopName: 'Plaza de Toros Las Ventas',
    stops: [
      {
        id: 'stop-e-1',
        name: 'Clínica Retiro',
        address: 'Calle de Ibiza 42, 28009',
        coordinates: [40.4190, -3.6740],
        completed: true,
        packageWeightKg: 30,
        estimatedTime: '09:20'
      },
      {
        id: 'stop-e-2',
        name: 'Comercio Manuel Becerra',
        address: 'Plaza de Manuel Becerra 8, 28028',
        coordinates: [40.4300, -3.6685],
        completed: true,
        packageWeightKg: 50,
        estimatedTime: '10:10'
      },
      {
        id: 'stop-e-3',
        name: 'Plaza de Toros Las Ventas',
        address: 'Calle de Alcalá 237, 28028',
        coordinates: [40.4320, -3.6630],
        completed: false,
        packageWeightKg: 45,
        estimatedTime: '11:00'
      },
      {
        id: 'stop-e-4',
        name: 'Mercado Quintana',
        address: 'Calle Virgen del Sagrario 12, 28027',
        coordinates: [40.4335, -3.6450],
        completed: false,
        packageWeightKg: 70,
        estimatedTime: '11:45'
      },
      {
        id: 'stop-e-5',
        name: 'Polígono Arturo Soria',
        address: 'Calle de Arturo Soria 115, 28043',
        coordinates: [40.4430, -3.6550],
        completed: false,
        packageWeightKg: 90,
        estimatedTime: '12:30'
      }
    ],
    pathCoordinates: [
      MADRID_HUB.coordinates,
      [40.4050, -3.6720],
      [40.4190, -3.6740],
      [40.4250, -3.6700],
      [40.4300, -3.6685],
      [40.4320, -3.6630],
      [40.4330, -3.6520],
      [40.4335, -3.6450],
      [40.4390, -3.6500],
      [40.4430, -3.6550],
      [40.4200, -3.6600],
      MADRID_HUB.coordinates
    ]
  },
  {
    id: 'route-sur',
    name: 'Ruta 4 - Sur Usera',
    zone: 'Sur-Usera',
    color: '#f59e0b', // Ámbar / Naranja
    status: 'Completada',
    assignedVehicleId: 'veh-07', // Furgoneta B
    totalDeliveries: 15,
    completedDeliveries: 15,
    distanceKm: 18.2,
    estimatedDurationMin: 160,
    co2Kg: 3.5,
    costEur: 26.5,
    currentProgressPct: 100,
    currentPosition: MADRID_HUB.coordinates,
    nextStopName: 'Ruta finalizada (Hub)',
    stops: [
      {
        id: 'stop-s-1',
        name: 'Matadero Espacio Cultural',
        address: 'Paseo de la Chopera 14, 28045',
        coordinates: [40.3920, -3.6970],
        completed: true,
        packageWeightKg: 35,
        estimatedTime: '08:45'
      },
      {
        id: 'stop-s-2',
        name: 'Centro Comercial Madrid Río',
        address: 'Calle de Antonio López 109, 28026',
        coordinates: [40.3900, -3.7080],
        completed: true,
        packageWeightKg: 60,
        estimatedTime: '09:30'
      },
      {
        id: 'stop-s-3',
        name: 'Bazar Central Usera',
        address: 'Calle Marcelo Usera 64, 28026',
        coordinates: [40.3840, -3.7060],
        completed: true,
        packageWeightKg: 40,
        estimatedTime: '10:15'
      },
      {
        id: 'stop-s-4',
        name: 'Comercios Almendrales',
        address: 'Calle de Cristo de la Victoria 30, 28026',
        coordinates: [40.3800, -3.6980],
        completed: true,
        packageWeightKg: 25,
        estimatedTime: '11:00'
      },
      {
        id: 'stop-s-5',
        name: 'Intercambiador Plaza Elíptica',
        address: 'Vía Lusitana 2, 28025',
        coordinates: [40.3850, -3.7180],
        completed: true,
        packageWeightKg: 50,
        estimatedTime: '11:45'
      }
    ],
    pathCoordinates: [
      MADRID_HUB.coordinates,
      [40.3930, -3.6880],
      [40.3920, -3.6970],
      [40.3900, -3.7080],
      [40.3840, -3.7060],
      [40.3800, -3.6980],
      [40.3850, -3.7180],
      [40.3920, -3.7050],
      MADRID_HUB.coordinates
    ]
  },
  {
    id: 'route-oeste',
    name: 'Ruta 5 - Oeste Casa de Campo',
    zone: 'Oeste-Casa de Campo',
    color: '#06b6d4', // Cian
    status: 'Pendiente',
    assignedVehicleId: 'veh-03', // E-Scooter
    totalDeliveries: 12,
    completedDeliveries: 0,
    distanceKm: 16.8,
    estimatedDurationMin: 140,
    co2Kg: 0.0,
    costEur: 16.0,
    currentProgressPct: 0,
    currentPosition: MADRID_HUB.coordinates,
    nextStopName: 'Glorieta de Pirámides',
    stops: [
      {
        id: 'stop-o-1',
        name: 'Farmacia Pirámides',
        address: 'Paseo de las Acacias 50, 28005',
        coordinates: [40.4030, -3.7130],
        completed: false,
        packageWeightKg: 10,
        estimatedTime: '13:30'
      },
      {
        id: 'stop-o-2',
        name: 'Centro Comercial Príncipe Pío',
        address: 'Paseo de la Florida 2, 28008',
        coordinates: [40.4208, -3.7198],
        completed: false,
        packageWeightKg: 20,
        estimatedTime: '14:15'
      },
      {
        id: 'stop-o-3',
        name: 'Plaza de España Edificio España',
        address: 'Gran Vía 84, 28013',
        coordinates: [40.4245, -3.7145],
        completed: false,
        packageWeightKg: 15,
        estimatedTime: '15:00'
      },
      {
        id: 'stop-o-4',
        name: 'Moncloa Campus Universitario',
        address: 'Plaza de Moncloa 1, 28008',
        coordinates: [40.4350, -3.7185],
        completed: false,
        packageWeightKg: 18,
        estimatedTime: '15:45'
      },
      {
        id: 'stop-o-5',
        name: 'Restaurante Lago Casa de Campo',
        address: 'Paseo del Embarcadero s/n, 28011',
        coordinates: [40.4170, -3.7370],
        completed: false,
        packageWeightKg: 12,
        estimatedTime: '16:30'
      }
    ],
    pathCoordinates: [
      MADRID_HUB.coordinates,
      [40.3980, -3.7000],
      [40.4030, -3.7130],
      [40.4120, -3.7180],
      [40.4208, -3.7198],
      [40.4245, -3.7145],
      [40.4350, -3.7185],
      [40.4250, -3.7300],
      [40.4170, -3.7370],
      [40.4050, -3.7200],
      MADRID_HUB.coordinates
    ]
  }
];

// Opciones de rutas predefinidas para la pantalla de programación (mínimo 5)
export const AVAILABLE_ROUTE_TEMPLATES = [
  {
    templateId: 'tpl-centro',
    name: 'Ruta Centro Histórico (Almendra Central)',
    zone: 'Centro',
    deliveries: 16,
    distanceKm: 14.5,
    minCapacityKg: 150,
    requiredVehicles: 1,
    coordinates: INITIAL_ROUTES[0].pathCoordinates,
    description: 'Calles peatonales y zona de bajas emisiones (ZBE Especial). Ideal para Bicicleta de carga o Moto eléctrica.'
  },
  {
    templateId: 'tpl-norte',
    name: 'Ruta Norte Castellana - Chamartín',
    zone: 'Norte-Chamartín',
    deliveries: 22,
    distanceKm: 28.0,
    minCapacityKg: 650,
    requiredVehicles: 2,
    coordinates: INITIAL_ROUTES[1].pathCoordinates,
    description: 'Eje financiero Castellana y centros empresariales en AZCA y Cuatro Torres. Volumen medio-alto.'
  },
  {
    templateId: 'tpl-este',
    name: 'Ruta Este Ventas - Ciudad Lineal',
    zone: 'Este-Ciudad Lineal',
    deliveries: 19,
    distanceKm: 22.4,
    minCapacityKg: 400,
    requiredVehicles: 1,
    coordinates: INITIAL_ROUTES[2].pathCoordinates,
    description: 'Área residencial y comercial de alta densidad a lo largo de calle Alcalá y Arturo Soria.'
  },
  {
    templateId: 'tpl-sur',
    name: 'Ruta Sur Madrid Río - Usera',
    zone: 'Sur-Usera',
    deliveries: 15,
    distanceKm: 18.2,
    minCapacityKg: 350,
    requiredVehicles: 1,
    coordinates: INITIAL_ROUTES[3].pathCoordinates,
    description: 'Comercios de cercanía y distribuidores en el distrito de Usera y ribera sur del Manzanares.'
  },
  {
    templateId: 'tpl-oeste',
    name: 'Ruta Oeste Argüelles - Casa de Campo',
    zone: 'Oeste-Casa de Campo',
    deliveries: 12,
    distanceKm: 16.8,
    minCapacityKg: 200,
    requiredVehicles: 1,
    coordinates: INITIAL_ROUTES[4].pathCoordinates,
    description: 'Distribución en nodos de transporte de Príncipe Pío, Moncloa y accesos a Casa de Campo.'
  }
];
