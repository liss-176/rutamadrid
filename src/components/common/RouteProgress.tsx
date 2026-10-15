import React from 'react';
import type { RoutePlan, RouteStatus } from '../../types';
import { CheckCircle2, Clock, Navigation } from 'lucide-react';

interface RouteProgressProps {
  route: RoutePlan;
  vehicleName?: string;
  onClick?: () => void;
}

export const RouteProgress: React.FC<RouteProgressProps> = ({
  route,
  vehicleName,
  onClick
}) => {
  const getStatusBadge = (status: RouteStatus) => {
    switch (status) {
      case 'Completada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Completada
          </span>
        );
      case 'En ruta':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            En ruta
          </span>
        );
      case 'Pendiente':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Pendiente
          </span>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: route.color }}
          />
          <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
            {route.name}
          </h4>
        </div>
        <div>{getStatusBadge(route.status)}</div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
        <span>
          Entregas: <strong className="text-slate-800 dark:text-slate-200">{route.completedDeliveries}</strong> / {route.totalDeliveries}
        </span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {route.currentProgressPct}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(route.currentProgressPct, 100)}%`,
            backgroundColor: route.color
          }}
        />
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[220px]">
          <Navigation className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Próxima: <strong className="text-slate-700 dark:text-slate-300 font-medium">{route.nextStopName || 'Hub Central'}</strong></span>
        </div>
        {vehicleName && (
          <span className="shrink-0 text-slate-600 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
            {vehicleName}
          </span>
        )}
      </div>
    </div>
  );
};
