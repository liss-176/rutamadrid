import React from 'react';
import { Menu, Truck, Play, Pause, AlertTriangle } from 'lucide-react';
import { useDeliveryContext } from '../../context/DeliveryContext';

interface HeaderProps {
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDrawer }) => {
  const { kpis, isSimulationRunning, toggleSimulation } = useDeliveryContext();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Izquierda: Botón Hamburguesa y Título */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            aria-label="Abrir menú de navegación"
            className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RutaMadrid
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                  MAD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-1 font-medium">
                Logística y Entregas Urbanas
              </p>
            </div>
          </div>
        </div>

        {/* Derecha: Simulación en vivo y alertas */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Alertas rápidas */}
          {kpis.activeIncidents > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{kpis.activeIncidents} <span className="hidden md:inline">incidencias</span></span>
            </div>
          )}

          {/* Botón de control de la simulación */}
          <button
            onClick={toggleSimulation}
            title={isSimulationRunning ? 'Pausar simulación en vivo' : 'Reanudar simulación en vivo'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSimulationRunning
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            }`}
          >
            {isSimulationRunning ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="hidden sm:inline">En vivo</span>
                <Pause className="w-3 h-3 ml-0.5 opacity-60" />
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-slate-500" />
                <span className="hidden sm:inline">Pausado</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
