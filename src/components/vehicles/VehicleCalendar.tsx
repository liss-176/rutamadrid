import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface VehicleCalendarProps {
  vehicleId: string;
  vehicleName: string;
  availability: Record<string, boolean>;
  onToggleAvailability: (vehicleId: string, dateStr: string) => void;
}

export const VehicleCalendar: React.FC<VehicleCalendarProps> = ({
  vehicleId,
  vehicleName,
  availability,
  onToggleAvailability
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  // Nombres de meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Días de la semana en español (empezando en Lunes)
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Fecha de hoy
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Calcular número de días del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Primer día de la semana del mes (ajustado para que Lunes sea 0 y Domingo 6)
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  // Contador de días disponibles en el mes
  let availableDaysCount = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (availability[dStr] !== false) availableDaysCount++;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Cabecera del calendario */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white">
            Calendario de Disponibilidad
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {vehicleName} • <span className="font-semibold text-blue-600 dark:text-blue-400">{availableDaysCount} de {daysInMonth} días activo</span>
          </p>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mr-2">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={goToPrevMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map(d => (
          <div key={d} className="text-xs font-bold text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Celdas del calendario */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Espacios vacíos antes del día 1 */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 sm:h-12" />
        ))}

        {/* Días del mes */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
          const isToday = dateStr === todayIso;
          const isAvailable = availability[dateStr] !== false;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onToggleAvailability(vehicleId, dateStr)}
              className={`h-10 sm:h-12 rounded-xl flex flex-col items-center justify-center p-1 text-xs font-semibold transition-all relative group ${
                isAvailable
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500'
              } ${isToday ? 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-slate-900 font-black' : ''}`}
              title={`${dayNumber} de ${monthNames[month]}: ${isAvailable ? 'Disponible (clic para desactivar)' : 'No disponible (clic para activar)'}`}
            >
              <span>{dayNumber}</span>
              <span className="text-[10px] mt-0.5">
                {isAvailable ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3 opacity-40" />}
              </span>

              {isToday && (
                <span className="absolute -top-1.5 -right-1 px-1 bg-amber-400 text-slate-950 text-[8px] font-black rounded-sm shadow-xs uppercase tracking-tighter">
                  Hoy
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 flex items-center justify-center text-[9px] text-white font-bold">✓</span>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] text-slate-500">✕</span>
            <span>No disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded ring-2 ring-amber-400 bg-amber-100"></span>
            <span>Día de hoy</span>
          </div>
        </div>
        <p className="text-[11px] italic">
          Haz clic en cualquier día para cambiar el turno.
        </p>
      </div>
    </div>
  );
};
