import React, { useState } from 'react';
import { useDeliveryContext } from '../context/DeliveryContext';
import { AVAILABLE_ROUTE_TEMPLATES } from '../data/routes';
import { RouteCalculator } from '../components/schedule/RouteCalculator';
import { Calendar, Route as RouteIcon, MapPin } from 'lucide-react';
import { getTodayIsoString } from '../utils/dateUtils';

export const PlanRoutePage: React.FC = () => {
  const { vehicles, scheduleNewRoute } = useDeliveryContext();
  const [targetDate, setTargetDate] = useState<string>(() => getTodayIsoString());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    AVAILABLE_ROUTE_TEMPLATES[0].templateId
  );

  // Vehículos disponibles en la fecha seleccionada
  const availableVehiclesForDate = React.useMemo(() => {
    return vehicles.filter(v => v.availability[targetDate] !== false);
  }, [vehicles, targetDate]);

  const selectedTemplate = AVAILABLE_ROUTE_TEMPLATES.find(
    t => t.templateId === selectedTemplateId
  ) || AVAILABLE_ROUTE_TEMPLATES[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <RouteIcon className="w-3.5 h-3.5" />
            <span>Planificador de Operaciones • Madrid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Programar Nuevas Rutas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dimensiona vehículos, evalúa emisiones de CO₂ y costes por itinerario urbano
          </p>
        </div>

        {/* Selector de fecha de programación */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="text-xs">
            <label className="block text-[10px] uppercase font-bold text-slate-400">
              Fecha de Ejecución
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="bg-transparent font-bold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Grid en 2 columnas: Lista de Plantillas de Rutas y Calculadora de Itinerario */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Rutas Posibles */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Rutas Disponibles ({AVAILABLE_ROUTE_TEMPLATES.length})
            </h3>
            <span className="text-xs text-slate-400">
              Selecciona una zona
            </span>
          </div>

          <div className="space-y-3">
            {AVAILABLE_ROUTE_TEMPLATES.map(template => {
              const isSelected = selectedTemplate.templateId === template.templateId;

              return (
                <div
                  key={template.templateId}
                  onClick={() => setSelectedTemplateId(template.templateId)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {template.zone}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-0.5">
                        {template.name}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                      {template.deliveries} entregas
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {template.distanceKm} km
                    </span>
                    <span>
                      Vehículos necesarios: <strong className="text-slate-800 dark:text-slate-200">{template.requiredVehicles}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Calculadora y Resumen de la Ruta */}
        <div className="lg:col-span-7">
          <RouteCalculator
            template={selectedTemplate}
            targetDate={targetDate}
            availableVehicles={availableVehiclesForDate}
            onScheduleRoute={scheduleNewRoute}
          />
        </div>
      </div>
    </div>
  );
};
