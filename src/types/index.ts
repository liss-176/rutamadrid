// Tipos para RutaMadrid

export type DgtBadge = '0_EMISIONES' | 'ECO' | 'C' | 'B' | 'SIN_DISTINTIVO';

export type VehicleType = 'Furgoneta' | 'Camión ligero' | 'Moto' | 'Bicicleta de carga';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  capacityKg: number;
  dgtBadge: DgtBadge;
  licensePlate: string;
  // Mapa de fechas ISO (YYYY-MM-DD) a booleano de disponibilidad
  availability: Record<string, boolean>;
  co2FactorGPerKm: number; // Factor de emisión en g/km
  costPerKm: number; // Coste en €/km
}

export type RouteStatus = 'Pendiente' | 'En ruta' | 'Completada';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface DeliveryStop {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  completed: boolean;
  packageWeightKg: number;
  estimatedTime?: string;
  notes?: string;
}

export interface RoutePlan {
  id: string;
  name: string;
  zone: string;
  color: string;
  status: RouteStatus;
  assignedVehicleId?: string;
  totalDeliveries: number;
  completedDeliveries: number;
  distanceKm: number;
  estimatedDurationMin: number;
  co2Kg: number;
  costEur: number;
  pathCoordinates: [number, number][]; // Polilínea completa de la ruta
  stops: DeliveryStop[];
  // Simulación en tiempo real
  currentProgressPct: number; // 0 a 100
  currentPosition?: [number, number]; // Posición simulada del vehículo
  nextStopName?: string;
}

export type IncidentSeverity = 'baja' | 'media' | 'alta';

export interface Incident {
  id: string;
  timestamp: string;
  routeId: string;
  routeName: string;
  description: string;
  severity: IncidentSeverity;
  resolved: boolean;
  locationName: string;
}
