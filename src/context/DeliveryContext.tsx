import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Vehicle, RoutePlan, RouteStatus, Incident } from '../types';
import { INITIAL_VEHICLES } from '../data/vehicles';
import { INITIAL_ROUTES } from '../data/routes';
import { INITIAL_INCIDENTS, INCIDENT_TEMPLATES } from '../data/mockIncidents';
import { getTodayIsoString, formatSpanishDate, formatTimeNow } from '../utils/dateUtils';
import { getInterpolatedPosition } from '../utils/geoUtils';

interface KpiData {
  totalDeliveries: number;
  completedDeliveries: number;
  completedPct: number;
  totalVehicles: number;
  availableVehiclesToday: number;
  vehiclesInRoute: number;
  activeIncidents: number;
  todayDateFormatted: string;
  todayIso: string;
}

interface DeliveryContextType {
  vehicles: Vehicle[];
  routes: RoutePlan[];
  incidents: Incident[];
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  toggleVehicleAvailability: (vehicleId: string, dateStr: string) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
  resolveIncident: (incidentId: string) => void;
  scheduleNewRoute: (route: RoutePlan) => void;
  isSimulationRunning: boolean;
  toggleSimulation: () => void;
  generateSimulatedIncident: () => void;
  kpis: KpiData;
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => INITIAL_VEHICLES);
  const [routes, setRoutes] = useState<RoutePlan[]>(() => INITIAL_ROUTES);
  const [incidents, setIncidents] = useState<Incident[]>(() => INITIAL_INCIDENTS);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(INITIAL_VEHICLES[0]?.id || null);
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);

  const todayIso = useMemo(() => getTodayIsoString(), []);
  const todayDateFormatted = useMemo(() => formatSpanishDate(new Date()), []);

  // Agregar vehículo
  const addVehicle = useCallback((newVeh: Omit<Vehicle, 'id'>) => {
    const id = `veh-${Date.now().toString(36)}`;
    setVehicles(prev => [...prev, { ...newVeh, id }]);
  }, []);

  // Actualizar vehículo
  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev =>
      prev.map(v => (v.id === id ? { ...v, ...updates } : v))
    );
  }, []);

  // Eliminar vehículo
  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    setSelectedVehicleId(prev => (prev === id ? null : prev));
  }, []);

  // Conmutar disponibilidad de vehículo para una fecha específica (YYYY-MM-DD)
  const toggleVehicleAvailability = useCallback((vehicleId: string, dateStr: string) => {
    setVehicles(prev =>
      prev.map(v => {
        if (v.id !== vehicleId) return v;
        const currentVal = v.availability[dateStr] ?? true;
        return {
          ...v,
          availability: {
            ...v.availability,
            [dateStr]: !currentVal
          }
        };
      })
    );
  }, []);

  // Agregar incidencia
  const addIncident = useCallback((inc: Omit<Incident, 'id' | 'timestamp'>) => {
    const newInc: Incident = {
      ...inc,
      id: `inc-${Date.now().toString(36)}`,
      timestamp: formatTimeNow()
    };
    setIncidents(prev => [newInc, ...prev]);
  }, []);

  // Resolver incidencia
  const resolveIncident = useCallback((incidentId: string) => {
    setIncidents(prev =>
      prev.map(i => (i.id === incidentId ? { ...i, resolved: true } : i))
    );
  }, []);

  // Programar nueva ruta
  const scheduleNewRoute = useCallback((newRoute: RoutePlan) => {
    setRoutes(prev => [...prev, newRoute]);
  }, []);

  // Generar incidencia simulada
  const generateSimulatedIncident = useCallback(() => {
    const activeRoutes = routes.filter(r => r.status === 'En ruta');
    const targetRoute = activeRoutes.length > 0
      ? activeRoutes[Math.floor(Math.random() * activeRoutes.length)]
      : routes[0];

    const randomTemplate = INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)];

    addIncident({
      routeId: targetRoute ? targetRoute.id : 'route-general',
      routeName: targetRoute ? targetRoute.name : 'Ruta Madrid General',
      description: randomTemplate.description,
      severity: randomTemplate.severity,
      resolved: false,
      locationName: randomTemplate.locationName
    });
  }, [routes, addIncident]);

  const toggleSimulation = useCallback(() => {
    setIsSimulationRunning(prev => !prev);
  }, []);

  // Simulación en tiempo real: movimiento de vehículos cada 3 segundos
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setRoutes(prevRoutes =>
        prevRoutes.map(route => {
          if (route.status !== 'En ruta') return route;

          // Incremento de progreso entre 1.0% y 2.0%
          const step = 1.2 + Math.random() * 0.8;
          let nextProgress = route.currentProgressPct + step;

          let newStatus: RouteStatus = route.status;
          let completedDeliveries = route.completedDeliveries;

          if (nextProgress >= 100) {
            nextProgress = 100;
            newStatus = 'Completada';
            completedDeliveries = route.totalDeliveries;
          } else {
            // Actualizar entregas completadas en proporción al progreso
            completedDeliveries = Math.min(
              route.totalDeliveries,
              Math.max(
                route.completedDeliveries,
                Math.floor((nextProgress / 100) * route.totalDeliveries)
              )
            );
          }

          // Calcular posición GPS interpolada
          const newPos = getInterpolatedPosition(route.pathCoordinates, nextProgress);

          // Actualizar paradas
          const updatedStops = route.stops.map((stop, index) => {
            const stopPct = ((index + 1) / (route.stops.length + 1)) * 100;
            return {
              ...stop,
              completed: nextProgress >= stopPct
            };
          });

          // Próxima parada
          const nextStop = updatedStops.find(s => !s.completed);
          const nextStopName = newStatus === 'Completada'
            ? 'Ruta finalizada (Hub)'
            : (nextStop ? nextStop.name : 'Retorno a Hub');

          return {
            ...route,
            currentProgressPct: Math.round(nextProgress * 10) / 10,
            currentPosition: newPos,
            status: newStatus,
            completedDeliveries,
            stops: updatedStops,
            nextStopName
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  // Simulación periódica de nuevas incidencias cada 60 segundos
  useEffect(() => {
    if (!isSimulationRunning) return;

    const incidentInterval = setInterval(() => {
      // 50% de probabilidad de generar incidencia si hay menos de 7 no resueltas
      setIncidents(prev => {
        const unres = prev.filter(i => !i.resolved).length;
        if (unres < 7 && Math.random() > 0.4) {
          const activeRoutes = routes.filter(r => r.status === 'En ruta');
          const target = activeRoutes[Math.floor(Math.random() * activeRoutes.length)] || routes[0];
          const tpl = INCIDENT_TEMPLATES[Math.floor(Math.random() * INCIDENT_TEMPLATES.length)];
          const newInc: Incident = {
            id: `inc-${Date.now().toString(36)}`,
            timestamp: formatTimeNow(),
            routeId: target?.id || 'route-general',
            routeName: target?.name || 'Ruta Madrid',
            description: tpl.description,
            severity: tpl.severity,
            resolved: false,
            locationName: tpl.locationName
          };
          return [newInc, ...prev];
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(incidentInterval);
  }, [isSimulationRunning, routes]);

  // KPIs calculados
  const kpis: KpiData = useMemo(() => {
    const totalDeliveries = routes.reduce((acc, r) => acc + r.totalDeliveries, 0);
    const completedDeliveries = routes.reduce((acc, r) => acc + r.completedDeliveries, 0);
    const completedPct = totalDeliveries > 0 ? Math.round((completedDeliveries / totalDeliveries) * 100) : 0;
    const totalVehicles = vehicles.length;
    // Contar vehículos disponibles hoy (availability[todayIso] === true o por defecto true)
    const availableVehiclesToday = vehicles.filter(v => v.availability[todayIso] !== false).length;
    const vehiclesInRoute = routes.filter(r => r.status === 'En ruta').length;
    const activeIncidents = incidents.filter(i => !i.resolved).length;

    return {
      totalDeliveries,
      completedDeliveries,
      completedPct,
      totalVehicles,
      availableVehiclesToday,
      vehiclesInRoute,
      activeIncidents,
      todayDateFormatted,
      todayIso
    };
  }, [routes, vehicles, incidents, todayIso, todayDateFormatted]);

  const value = useMemo(
    () => ({
      vehicles,
      routes,
      incidents,
      selectedVehicleId,
      setSelectedVehicleId,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      toggleVehicleAvailability,
      addIncident,
      resolveIncident,
      scheduleNewRoute,
      isSimulationRunning,
      toggleSimulation,
      generateSimulatedIncident,
      kpis
    }),
    [
      vehicles,
      routes,
      incidents,
      selectedVehicleId,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      toggleVehicleAvailability,
      addIncident,
      resolveIncident,
      scheduleNewRoute,
      isSimulationRunning,
      toggleSimulation,
      generateSimulatedIncident,
      kpis
    ]
  );

  return <DeliveryContext.Provider value={value}>{children}</DeliveryContext.Provider>;
};

export const useDeliveryContext = (): DeliveryContextType => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDeliveryContext debe ser utilizado dentro de un DeliveryProvider');
  }
  return context;
};
