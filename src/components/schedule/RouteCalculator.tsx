import React, { useState, useEffect } from 'react';
import type { Vehicle, RoutePlan } from '../../types';
import { BadgeDGT } from '../common/BadgeDGT';
import { MADRID_CENTER, MADRID_HUB } from '../../data/hub';
import { createHubIcon } from '../../utils/mapIcons';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  AlertTriangle,
  CheckCircle,
  Leaf,
  Euro,
  Calendar,
  Sparkles
} from 'lucide-react';

const RoutePreviewMapController: React.FC<{ coordinates: [number, number][] }> = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [coordinates, map]);
  return null;
};

interface RouteTemplate {
  templateId: string;
  name: string;
  zone: string;
  deliveries: number;
  distanceKm: number;
  minCapacityKg: number;
  requiredVehicles: number;
  coordinates: [number, number][];
  description: string;
}

interface RouteCalculatorProps {
  template: RouteTemplate;
  targetDate: string;
  availableVehicles: Vehicle[];
  onScheduleRoute: (route: RoutePlan) => void;
}

export const RouteCalculator: React.FC<RouteCalculatorProps> = ({
  template,
  targetDate,
  availableVehicles,
  onScheduleRoute
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    availableVehicles[0]?.id || ''
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Vehículo seleccionado actualmente para la estimación
  const selectedVehicle = availableVehicles.find(v => v.id === selectedVehicleId) || availableVehicles[0];

  const hasEnoughVehicles = availableVehicles.length >= template.requiredVehicles;

  // Cálculos dinámicos de CO2 y Coste según el vehículo asignado
  const calculatedCO2Kg = React.useMemo(() => {
    if (!selectedVehicle) return 0;
    // g/km * km / 1000 = kg CO2
    const totalGrams = selectedVehicle.co2FactorGPerKm * template.distanceKm;
    return Math.round((totalGrams / 1000) * 10) / 10;
  }, [selectedVehicle, template.distanceKm]);

  const calculatedCostEur = React.useMemo(() => {
    if (!selectedVehicle) return 0;
    // Coste fijo base de operación (12€) + coste por km
    const fixedCost = 12.0;
    const variableCost = selectedVehicle.costPerKm * template.distanceKm;
    return Math.round((fixedCost + variableCost) * 100) / 100;
  }, [selectedVehicle, template.distanceKm]);

  const handleConfirm = () => {
    if (!selectedVehicle) return;

    // Generar paradas sintéticas basadas en la polilínea
    const generatedStops = template.coordinates.slice(1, -1).map((coord, idx) => ({
      id: `stop-prog-${Date.now()}-${idx}`,
      name: `Parada ${idx + 1} - ${template.zone}`,
      address: `Vía Urbana ${idx + 1}, Madrid`,
      coordinates: coord,
      completed: false,
      packageWeightKg: Math.round(15 + Math.random() * 30),
      estimatedTime: `${10 + idx}:00`
    }));

    const newPlannedRoute: RoutePlan = {
      id: `route-${Date.now().toString(36)}`,
      name: template.name,
      zone: template.zone,
      color: '#0284c7', // Color asignado
      status: 'Pendiente',
      assignedVehicleId: selectedVehicle.id,
      totalDeliveries: template.deliveries,
      completedDeliveries: 0,
      distanceKm: template.distanceKm,
      estimatedDurationMin: Math.round(template.distanceKm * 6),
      co2Kg: calculatedCO2Kg,
      costEur: calculatedCostEur,
      pathCoordinates: template.coordinates,
      stops: generatedStops,
      currentProgressPct: 0,
      currentPosition: MADRID_HUB.coordinates,
      nextStopName: generatedStops[0]?.name || 'Hub Central'
    };

    onScheduleRoute(newPlannedRoute);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
      {/* Título de la ruta seleccionada */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Zona: {template.zone}
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            {template.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {template.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span>Fecha: {targetDate}</span>
        </div>
      </div>

      {/* Alerta si no hay suficientes vehículos */}
      {!hasEnoughVehicles && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold">Capacidad de flota insuficiente para esta fecha</p>
            <p className="mt-0.5 opacity-90">
              Esta ruta requiere al menos <strong>{template.requiredVehicles} vehículo(s)</strong> pero actualmente hay <strong>{availableVehicles.length}</strong> disponibles para el {targetDate}. Puedes modificar la disponibilidad en la pestaña <em>Configuración vehículos</em>.
            </p>
          </div>
        </div>
      )}

      {/* Selector de vehículo disponible */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Asignar Vehículo Disponible de la Flota ({availableVehicles.length} disponibles)
        </label>
        {availableVehicles.length === 0 ? (
          <p className="text-xs text-rose-600 font-semibold">
            No hay ningún vehículo disponible para el día seleccionado.
          </p>
        ) : (
          <select
            value={selectedVehicleId}
            onChange={e => setSelectedVehicleId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {availableVehicles.map(veh => (
              <option key={veh.id} value={veh.id}>
                {veh.name} ({veh.type} - {veh.capacityKg} kg) - Distintivo {veh.dgtBadge.replace('_', ' ')}
              </option>
            ))}
          </select>
        )}

        {selectedVehicle && (
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-xs text-slate-500">Distintivo ambiental:</span>
            <BadgeDGT badge={selectedVehicle.dgtBadge} size="sm" />
          </div>
        )}
      </div>

      {/* Tarjetas de Métricas Calculadas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Entregas */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Entregas
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {template.deliveries}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">paquetes</span>
        </div>

        {/* Vehículos necesarios */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Vehículos
          </span>
          <span className="text-lg font-black text-blue-600 dark:text-blue-400">
            {template.requiredVehicles}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">necesarios</span>
        </div>

        {/* Kilómetros */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
            Distancia
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {template.distanceKm}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">km de ruta</span>
        </div>

        {/* Emisión CO2 */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
          <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 block flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            CO₂ Emitido
          </span>
          <span className="text-lg font-black text-emerald-800 dark:text-emerald-300">
            {calculatedCO2Kg} <span className="text-xs font-bold">kg</span>
          </span>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block mt-0.5">
            {calculatedCO2Kg === 0 ? '¡Cero Emisiones!' : 'Huella estimada'}
          </span>
        </div>

        {/* Coste estimado */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <Euro className="w-3 h-3" />
            Coste Estimado
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-white">
            {calculatedCostEur} €
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">fijo + km</span>
        </div>
      </div>

      {/* Mapa con trazado de la ruta */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
          Trazado de la ruta sobre el mapa de Madrid
        </label>
        <div className="h-56 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <MapContainer
            center={template.coordinates[Math.floor(template.coordinates.length / 2)] || MADRID_CENTER}
            zoom={12}
            scrollWheelZoom={false}
            zoomControl={false}
            className="w-full h-full"
          >
            <RoutePreviewMapController coordinates={template.coordinates} />
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={MADRID_HUB.coordinates} icon={createHubIcon()} />
            <Polyline
              positions={template.coordinates}
              pathOptions={{
                color: '#0284c7',
                weight: 4.5,
                opacity: 0.85
              }}
            />
          </MapContainer>
        </div>
      </div>

      {/* Botón de Confirmación */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Al programar la ruta, se incorporará a la operativa del día.
        </p>

        <button
          onClick={handleConfirm}
          disabled={!hasEnoughVehicles || availableVehicles.length === 0}
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          <span>Programar esta ruta</span>
        </button>
      </div>

      {/* Modal de confirmación exitosa */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                ¡Ruta Programada con Éxito!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                La ruta <strong>{template.name}</strong> ha sido añadida a la planificación con el vehículo <strong>{selectedVehicle?.name}</strong>.
              </p>
            </div>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-2.5 rounded-xl font-bold bg-blue-600 text-white text-sm shadow-md hover:bg-blue-700 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
