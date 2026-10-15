import React from 'react';
import { useDeliveryContext } from '../context/DeliveryContext';
import { KpiCard } from '../components/common/KpiCard';
import { RouteProgress } from '../components/common/RouteProgress';
import { RouteMapMini } from '../components/map/RouteMapMini';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle2,
  Truck,
  Navigation,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { kpis, routes, vehicles } = useDeliveryContext();

  const vehicleMap = React.useMemo(() => {
    const map = new Map<string, string>();
    vehicles.forEach(v => map.set(v.id, v.name));
    return map;
  }, [vehicles]);

  // Datos para el gráfico Recharts de entregas por ruta
  const chartData = routes.map(r => ({
    name: r.zone,
    entregadas: r.completedDeliveries,
    pendientes: r.totalDeliveries - r.completedDeliveries,
    color: r.color
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Encabezado con fecha y bienvenida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Planificación Diaria • Madrid Capital</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Panel de Control
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
            {kpis.todayDateFormatted}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/programar"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Programar Ruta</span>
          </Link>
        </div>
      </div>

      {/* Grid de KPIs principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Entregas totales planificadas */}
        <KpiCard
          title="Entregas Planificadas"
          value={kpis.totalDeliveries}
          subtitle="En todas las zonas activas"
          icon={<Package className="w-6 h-6" />}
          colorVariant="blue"
        />

        {/* Entregas completadas */}
        <KpiCard
          title="Entregas Completadas"
          value={kpis.completedDeliveries}
          badge={`${kpis.completedPct}%`}
          subtitle={`${kpis.totalDeliveries - kpis.completedDeliveries} pendientes`}
          icon={<CheckCircle2 className="w-6 h-6" />}
          colorVariant="emerald"
        />

        {/* Vehículos disponibles hoy */}
        <KpiCard
          title="Vehículos Disponibles"
          value={`${kpis.availableVehiclesToday} de ${kpis.totalVehicles}`}
          subtitle="Operativos para hoy"
          icon={<Truck className="w-6 h-6" />}
          colorVariant="purple"
        />

        {/* Vehículos en ruta */}
        <KpiCard
          title="Vehículos en Ruta"
          value={kpis.vehiclesInRoute}
          subtitle={`${routes.filter(r => r.status === 'Pendiente').length} rutas en espera`}
          icon={<Navigation className="w-6 h-6" />}
          colorVariant="amber"
        />
      </div>

      {/* Alerta de incidencias del día si existen */}
      {kpis.activeIncidents > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-3 text-rose-900 dark:text-rose-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">
                {kpis.activeIncidents} {kpis.activeIncidents === 1 ? 'Incidencia activa' : 'Incidencias activas'} en reparto
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Afectando el tránsito y los plazos en zonas como Castellana o Gran Vía.
              </p>
            </div>
          </div>
          <Link
            to="/repartos"
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 transition-colors shadow-xs"
          >
            <span>Ver listado</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Contenido en dos columnas: Rutas del día y Mini Mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Resumen del estado de cada ruta del día */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Estado de las Rutas de Hoy
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {routes.length} rutas planificadas
            </span>
          </div>

          <div className="space-y-3">
            {routes.map(route => (
              <RouteProgress
                key={route.id}
                route={route}
                vehicleName={route.assignedVehicleId ? vehicleMap.get(route.assignedVehicleId) : undefined}
              />
            ))}
          </div>

          {/* Gráfico Recharts de volumen de entregas */}
          <div className="mt-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              Distribución de Entregas por Zona
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Comparativa de entregadas y pendientes
            </p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="entregadas" name="Entregadas" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pendientes" name="Pendientes" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Mini Mapa con rutas activas */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Flota en Madrid
            </h3>
            <Link
              to="/mapa"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Abrir mapa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RouteMapMini routes={routes} />

          {/* Resumen rápido de la flota activa */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Resumen Operativo
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Distancia acumulada hoy:</span>
                <strong className="text-slate-900 dark:text-white">
                  {Math.round(routes.reduce((acc, r) => acc + r.distanceKm, 0))} km
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Emisión estimada flota hoy:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {Math.round(routes.reduce((acc, r) => acc + r.co2Kg, 0) * 10) / 10} kg CO₂
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Coste operativo previsto:</span>
                <strong className="text-slate-900 dark:text-white">
                  {Math.round(routes.reduce((acc, r) => acc + r.costEur, 0))} €
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
