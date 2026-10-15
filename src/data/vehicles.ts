import type { Vehicle } from '../types';

// Función para generar disponibilidad por defecto para el mes actual
const generateDefaultAvailability = (isAvailableToday: boolean = true): Record<string, boolean> => {
  const map: Record<string, boolean> = {};
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Generar para los 31 días del mes actual
  for (let day = 1; day <= 31; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Domingos no disponibles por defecto, el resto normalmente sí
    const dateObj = new Date(year, month, day);
    const isSunday = dateObj.getDay() === 0;
    
    if (day === today.getDate()) {
      map[dateStr] = isAvailableToday;
    } else {
      map[dateStr] = !isSunday && Math.random() > 0.15; // 85% disponible en días laborales
    }
  }
  return map;
};

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    name: 'EcoVan Eléctrica 01',
    type: 'Furgoneta',
    capacityKg: 1200,
    dgtBadge: '0_EMISIONES',
    licensePlate: '1240-MTR',
    availability: generateDefaultAvailability(true),
    co2FactorGPerKm: 0,
    costPerKm: 0.18
  },
  {
    id: 'veh-02',
    name: 'CargoBike Madrid Centro',
    type: 'Bicicleta de carga',
    capacityKg: 180,
    dgtBadge: '0_EMISIONES',
    licensePlate: 'BC-004-MAD',
    availability: generateDefaultAvailability(true),
    co2FactorGPerKm: 0,
    costPerKm: 0.05
  },
  {
    id: 'veh-03',
    name: 'E-Scooter Reparto Rápido',
    type: 'Moto',
    capacityKg: 80,
    dgtBadge: '0_EMISIONES',
    licensePlate: '5521-LXZ',
    availability: generateDefaultAvailability(true),
    co2FactorGPerKm: 0,
    costPerKm: 0.09
  },
  {
    id: 'veh-04',
    name: 'Furgón Híbrido Gas ECO',
    type: 'Furgoneta',
    capacityKg: 1400,
    dgtBadge: 'ECO',
    licensePlate: '9845-KPP',
    availability: generateDefaultAvailability(true),
    co2FactorGPerKm: 95,
    costPerKm: 0.28
  },
  {
    id: 'veh-05',
    name: 'Camión Ligero Chamartín',
    type: 'Camión ligero',
    capacityKg: 3500,
    dgtBadge: 'ECO',
    licensePlate: '4410-LGH',
    availability: generateDefaultAvailability(true),
    co2FactorGPerKm: 145,
    costPerKm: 0.45
  },
  {
    id: 'veh-06',
    name: 'Furgoneta Euro 6 Verde',
    type: 'Furgoneta',
    capacityKg: 1100,
    dgtBadge: 'C',
    licensePlate: '7823-JBB',
    availability: generateDefaultAvailability(true),
    co2FactorGPerKm: 155,
    costPerKm: 0.35
  },
  {
    id: 'veh-07',
    name: 'Furgoneta Reparto Sur',
    type: 'Furgoneta',
    capacityKg: 1000,
    dgtBadge: 'B',
    licensePlate: '3219-GKK',
    availability: generateDefaultAvailability(true),
    co2FactorGPerKm: 195,
    costPerKm: 0.42
  },
  {
    id: 'veh-08',
    name: 'Furgón Clásico Reserva',
    type: 'Furgoneta',
    capacityKg: 950,
    dgtBadge: 'SIN_DISTINTIVO',
    licensePlate: 'M-7742-ZA',
    // 8º vehículo en taller / no disponible hoy para mostrar "7 de 8" disponibles hoy
    availability: generateDefaultAvailability(false),
    co2FactorGPerKm: 240,
    costPerKm: 0.52
  }
];
