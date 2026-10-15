import React, { useState } from 'react';
import { useDeliveryContext } from '../context/DeliveryContext';
import { KpiCard } from '../components/common/KpiCard';
import { MapView } from '../components/map/MapView';
import { RouteProgress } from '../components/common/RouteProgress';
import { IncidentList } from '../components/incidents/IncidentList';
import {
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Layers
} from 'lucide-react';

export const DeliveriesPage: React.FC = () => {
  const {
    kpis,
    routes,
    vehicles,
    incidents,
    resolveIncident,
    generateSimulatedIncident,
    isSimulationRunning,
    toggleSimulation
  } = useDeliveryContext();

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const vehicleMap = React.useMemo(() => {
    const map = new Map<string, string>();
    vehicles.forEach(v => map.set(v.id, v.name));
    return map;
  }, [vehicles]);

  const pendingDeliveries = kpis.totalDeliveries - kpis.completedDeliveries;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span>Operaciones en Vivo • Madrid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Repartos en Tiempo Real
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Control de tráfico, avance de paradas y gestión de incidencias urbanas
          </p>
        </div>

        {/* Control de simulación en vivo */}
        <button
          onClick={toggleSimulation}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all self-start sm:self-auto ${
            isSimulationRunning
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          {isSimulationRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pausar Simulación</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Reanudar Simulación</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Indicadores obligatorios: entregas totales, realizadas, pendientes e incidencias */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Entregas totales */}
        <KpiCard
          title="Entregas Totales"
          value={kpis.totalDeliveries}
          subtitle="Paquetes programados hoy"
          icon={<Package className="w-6 h-6" />}
          colorVariant="blue"
        />

        {/* Entregas realizadas */}
        <KpiCard
          title="Entregas Realizadas"
          value={kpis.completedDeliveries}
          badge={`${kpis.completedPct}%`}
          subtitle="Completadas con éxito"
          icon={<CheckCircle2 className="w-6 h-6" />}
          colorVariant="emerald"
        />

        {/* Entregas pendientes */}
        <KpiCard
          title="Entregas Pendientes"
          value={pendingDeliveries}
          subtitle="En ruta o por iniciar"
          icon={<Clock className="w-6 h-6" />}
          colorVariant="purple"
        />

        {/* Incidencias */}
        <KpiCard
          title="Incidencias"
          value={kpis.activeIncidents}
          subtitle="Alertas no resueltas"
          icon={<AlertTriangle className="w-6 h-6" />}
          colorVariant="rose"
        />
      </div>

      {/* Mapa con los repartos en curso y vehículos en movimiento */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Mapa Operativo de Reparto</span>
          </h3>
          <span className="text-xs text-slate-500">
            Actualización cada 3 segundos
          </span>
        </div>

        <div className="h-[440px] w-full">
          <MapView
            routes={routes}
            vehicles={vehicles}
            height="100%"
            selectedRouteId={selectedRouteId}
            onSelectRoute={setSelectedRouteId}
            showLegend={true}
          />
        </div>
      </div>

      {/* Progreso de entregas por ruta & Listado de incidencias */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progreso de entregas por ruta */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Progreso por Ruta
            </h3>
            <span className="text-xs text-slate-400">
              {routes.filter(r => r.status === 'En ruta').length} activas
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {routes.map(route => (
              <RouteProgress
                key={route.id}
                route={route}
                vehicleName={route.assignedVehicleId ? vehicleMap.get(route.assignedVehicleId) : undefined}
                onClick={() => setSelectedRouteId(selectedRouteId === route.id ? null : route.id)}
              />
            ))}
          </div>
        </div>

        {/* Listado de incidencias */}
        <div className="lg:col-span-6 space-y-3">
          <IncidentList
            incidents={incidents}
            onResolveIncident={resolveIncident}
            onSimulateIncident={generateSimulatedIncident}
          />
        </div>
      </div>
    </div>
  );
};
