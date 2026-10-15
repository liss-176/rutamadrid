import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RoutePlan, Vehicle } from '../../types';
import { MADRID_CENTER, MADRID_HUB } from '../../data/hub';
import { createHubIcon, createVehicleIcon, createStopIcon } from '../../utils/mapIcons';
import { Navigation, Clock, Package, Eye, Layers, Compass } from 'lucide-react';

interface MapViewProps {
  routes: RoutePlan[];
  vehicles: Vehicle[];
  height?: string;
  selectedRouteId?: string | null;
  onSelectRoute?: (routeId: string | null) => void;
  showLegend?: boolean;
}

// Controlador interno para centrado, animación suave y corrección de tamaño
const MapController: React.FC<{
  activeFilter: string | null;
  routes: RoutePlan[];
}> = ({ activeFilter, routes }) => {
  const map = useMap();

  // Corregir tamaño y forzar carga de teselas tras montaje
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!activeFilter) {
      map.flyTo(MADRID_CENTER, 12, { duration: 1.2 });
    } else {
      const selected = routes.find(r => r.id === activeFilter);
      if (selected && selected.pathCoordinates.length > 0) {
        const bounds = L.latLngBounds(selected.pathCoordinates);
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.2 });
      }
    }
  }, [activeFilter, routes, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  routes,
  vehicles,
  height = '650px',
  selectedRouteId = null,
  onSelectRoute,
  showLegend = true
}) => {
  const [filterRouteId, setFilterRouteId] = useState<string | null>(selectedRouteId);
  const [isLegendOpen, setIsLegendOpen] = useState(true);

  // Sincronizar filtro externo con interno
  useEffect(() => {
    setFilterRouteId(selectedRouteId);
  }, [selectedRouteId]);

  // Mapeo rápido de vehículos por ID
  const vehicleMap = React.useMemo(() => {
    const map = new Map<string, Vehicle>();
    vehicles.forEach(v => map.set(v.id, v));
    return map;
  }, [vehicles]);

  const activeFilter = selectedRouteId || filterRouteId;

  const displayedRoutes = React.useMemo(() => {
    if (!activeFilter) return routes;
    return routes.filter(r => r.id === activeFilter);
  }, [routes, activeFilter]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md"
      style={{ height: height || '650px', minHeight: '520px' }}
    >
      {/* Contenedor del Mapa Leaflet */}
      <MapContainer
        center={MADRID_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController activeFilter={activeFilter} routes={routes} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador del Hub Central */}
        <Marker position={MADRID_HUB.coordinates} icon={createHubIcon()}>
          <Popup>
            <div className="p-1 min-w-[190px]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
                <span>Almacén Central</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 leading-tight">
                {MADRID_HUB.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {MADRID_HUB.address}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                Punto de carga y salida para Madrid centro y periferia.
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Polilíneas y marcadores de cada ruta */}
        {displayedRoutes.map(route => {
          const assignedVeh = route.assignedVehicleId ? vehicleMap.get(route.assignedVehicleId) : undefined;
          const currentPos = route.currentPosition || route.pathCoordinates[0];

          return (
            <React.Fragment key={route.id}>
              {/* Polilínea de trazado */}
              <Polyline
                positions={route.pathCoordinates}
                pathOptions={{
                  color: route.color,
                  weight: route.status === 'En ruta' ? 5 : 3.5,
                  opacity: route.status === 'En ruta' ? 0.85 : 0.5,
                  dashArray: route.status === 'Pendiente' ? '6, 8' : undefined
                }}
              />

              {/* Paradas de la ruta */}
              {route.stops.map((stop, stopIdx) => (
                <Marker
                  key={stop.id}
                  position={stop.coordinates}
                  icon={createStopIcon(route.color, stopIdx + 1, stop.completed)}
                >
                  <Popup>
                    <div className="p-1 min-w-[210px]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-500">
                          Parada #{stopIdx + 1}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            stop.completed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {stop.completed ? 'Entregada' : 'Pendiente'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {stop.name}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {stop.address}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          {stop.packageWeightKg} kg
                        </span>
                        {stop.estimatedTime && (
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {stop.estimatedTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Marcador del Vehículo en Tiempo Real */}
              {currentPos && (
                <Marker
                  position={currentPos}
                  icon={createVehicleIcon(
                    route.color,
                    assignedVeh?.type || 'Furgoneta',
                    route.status === 'En ruta'
                  )}
                >
                  <Popup>
                    <div className="p-1 min-w-[230px]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: route.color }}
                        />
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {route.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {route.name}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">
                        Vehículo: {assignedVeh ? assignedVeh.name : 'No asignado'} ({assignedVeh?.licensePlate})
                      </p>

                      {/* Progreso */}
                      <div className="mt-2.5">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600 font-medium">Progreso</span>
                          <span className="font-bold text-slate-900">{route.currentProgressPct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${route.currentProgressPct}%`,
                              backgroundColor: route.color
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 text-xs">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>
                            Próxima: <strong>{route.nextStopName || 'Hub'}</strong>
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          Entregas: {route.completedDeliveries} de {route.totalDeliveries} completadas
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Leyenda y Filtros flotantes */}
      {showLegend && (
        <div className="absolute top-4 right-4 z-20 max-w-[280px] sm:max-w-xs bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3.5 shadow-lg border border-slate-200 dark:border-slate-800 transition-all text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Rutas Activas ({displayedRoutes.length})
            </span>
            <button
              onClick={() => setIsLegendOpen(!isLegendOpen)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {isLegendOpen && (
            <div className="mt-2.5 space-y-2 max-h-56 overflow-y-auto pr-1">
              {/* Botón para ver todas / recentrar */}
              <button
                onClick={() => {
                  setFilterRouteId(null);
                  if (onSelectRoute) onSelectRoute(null);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  !filterRouteId && !selectedRouteId
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Mostrar todas las rutas</span>
                <Compass className="w-3.5 h-3.5 opacity-70" />
              </button>

              {routes.map(r => {
                const isSelected = (selectedRouteId || filterRouteId) === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      const newId = isSelected ? null : r.id;
                      setFilterRouteId(newId);
                      if (onSelectRoute) onSelectRoute(newId);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors border ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40'
                        : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: r.color }}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                          {r.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {r.currentProgressPct}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{r.completedDeliveries}/{r.totalDeliveries} paradas</span>
                      <span className="capitalize">{r.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
