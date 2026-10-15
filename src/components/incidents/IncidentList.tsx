import React, { useState } from 'react';
import type { Incident, IncidentSeverity } from '../../types';
import { IncidentBadge } from '../common/IncidentBadge';
import { Clock, MapPin, CheckCircle, PlusCircle } from 'lucide-react';

interface IncidentListProps {
  incidents: Incident[];
  onResolveIncident: (id: string) => void;
  onSimulateIncident: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onResolveIncident,
  onSimulateIncident
}) => {
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'todas'>('todas');
  const [showResolved, setShowResolved] = useState(false);

  const filteredIncidents = incidents.filter(inc => {
    if (!showResolved && inc.resolved) return false;
    if (filterSeverity !== 'todas' && inc.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
      {/* Cabecera del listado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Incidencias en Ruta
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              {incidents.filter(i => !i.resolved).length} activas
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Eventos de tráfico, accesos y entregas en tiempo real
          </p>
        </div>

        {/* Botón para simular nueva incidencia */}
        <button
          onClick={onSimulateIncident}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Simular nueva incidencia</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium">Filtrar:</span>
          {(['todas', 'alta', 'media', 'baja'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={e => setShowResolved(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Ver resueltas</span>
        </label>
      </div>

      {/* Lista de incidencias */}
      <div className="mt-3 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredIncidents.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No hay incidencias para mostrar
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Las rutas operan con fluidez o las incidencias han sido resueltas.
            </p>
          </div>
        ) : (
          filteredIncidents.map(inc => (
            <div
              key={inc.id}
              className={`p-3.5 rounded-xl border transition-all ${
                inc.resolved
                  ? 'border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 opacity-70'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <IncidentBadge severity={inc.severity} />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {inc.routeName}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{inc.timestamp}</span>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-2">
                {inc.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate max-w-[220px] sm:max-w-md">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{inc.locationName}</span>
                </div>

                {!inc.resolved ? (
                  <button
                    onClick={() => onResolveIncident(inc.id)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    Resolver
                  </button>
                ) : (
                  <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resuelta
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
