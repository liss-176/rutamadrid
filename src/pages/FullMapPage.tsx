import React, { useState } from 'react';
import { useDeliveryContext } from '../context/DeliveryContext';
import { MapView } from '../components/map/MapView';
import { Play, Pause, Navigation, ShieldCheck, MapPin } from 'lucide-react';

export const FullMapPage: React.FC = () => {
  const { routes, vehicles, isSimulationRunning, toggleSimulation } = useDeliveryContext();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const activeVehiclesCount = routes.filter(r => r.status === 'En ruta').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-300 flex-1 flex flex-col">
      {/* Barra de cabecera del mapa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Monitorización en Vivo • Madrid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Mapa de Rutas y Vehículos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Seguimiento GPS en tiempo real de la flota de reparto urbano
          </p>
        </div>

        {/* Indicadores rápidos y control */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs">
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>{activeVehiclesCount} vehículos en movimiento</span>
          </div>

          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all ${
              isSimulationRunning
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isSimulationRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar Simulación</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Reanudar Simulación</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contenedor del mapa a gran formato */}
      <div className="w-full">
        <MapView
          routes={routes}
          vehicles={vehicles}
          height="680px"
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
          showLegend={true}
        />
      </div>

      {/* Barra de información inferior */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
          <span><strong>Hub Central:</strong> Abroñigal (Calle del Ferrocarril)</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0 animate-ping"></span>
          <span><strong>Vehículos:</strong> Posición interpolada en tiempo real</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Zona de Bajas Emisiones (ZBE):</strong> Cobertura Centro y M-30</span>
        </div>
      </div>
    </div>
  );
};
