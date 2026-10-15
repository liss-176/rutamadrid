import type { Incident } from '../types';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc-01',
    timestamp: '10:15',
    routeId: 'route-norte',
    routeName: 'Ruta 2 - Norte Chamartín',
    description: 'Fuerte retención en Paseo de la Castellana por obras de asfaltado.',
    severity: 'alta',
    resolved: false,
    locationName: 'Paseo de la Castellana con Raimundo Fernández Villaverde'
  },
  {
    id: 'inc-02',
    timestamp: '10:42',
    routeId: 'route-centro',
    routeName: 'Ruta 1 - Centro Histórico',
    description: 'Zona de carga y descarga ocupada por vehículos no autorizados en Gran Vía.',
    severity: 'media',
    resolved: false,
    locationName: 'Gran Vía 42'
  },
  {
    id: 'inc-03',
    timestamp: '11:05',
    routeId: 'route-este',
    routeName: 'Ruta 3 - Este Ciudad Lineal',
    description: 'Cliente ausente en entrega prioritaria de Calle Alcalá. Reintentando en 30 min.',
    severity: 'baja',
    resolved: false,
    locationName: 'Calle Alcalá 237'
  }
];

export const INCIDENT_TEMPLATES = [
  {
    description: 'Calle cortada por evento deportivo/cultural temporal.',
    severity: 'media' as const,
    locationName: 'Calle Fuencarral con Gran Vía'
  },
  {
    description: 'Retención densa en M-30 nudo sur por alcance menor.',
    severity: 'alta' as const,
    locationName: 'M-30 bypass sur'
  },
  {
    description: 'Aparcamiento de carga ocupado; repartidor esperando 10 minutos.',
    severity: 'baja' as const,
    locationName: 'Calle Bravo Murillo 90'
  },
  {
    description: 'Avería leve en señalización semafórica; circulación muy lenta.',
    severity: 'media' as const,
    locationName: 'Plaza de Cibeles'
  },
  {
    description: 'Dirección errónea comunicada por el destinatario; reprogramando parada.',
    severity: 'baja' as const,
    locationName: 'Calle O\'Donnell 18'
  },
  {
    description: 'Acceso restringido temporal por carga de material en obras de metro.',
    severity: 'alta' as const,
    locationName: 'Avenida de América'
  }
];
