import React, { useState } from 'react';
import { useDeliveryContext } from '../context/DeliveryContext';
import type { Vehicle } from '../types';
import { BadgeDGT } from '../components/common/BadgeDGT';
import { VehicleCalendar } from '../components/vehicles/VehicleCalendar';
import { VehicleFormModal } from '../components/vehicles/VehicleFormModal';
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  Weight,
  Leaf,
  Euro
} from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const {
    vehicles,
    selectedVehicleId,
    setSelectedVehicleId,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleAvailability,
    kpis
  } = useDeliveryContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);

  // Vehículo actualmente seleccionado para ver su detalle y calendario
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleOpenAdd = () => {
    setVehicleToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setVehicleToEdit(v);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que deseas eliminar el vehículo "${name}" de la flota?`)) {
      deleteVehicle(id);
    }
  };

  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id' | 'availability'>) => {
    if (vehicleToEdit) {
      updateVehicle(vehicleToEdit.id, vehicleData);
    } else {
      // Crear nuevo con disponibilidad activa por defecto
      const defaultAvail: Record<string, boolean> = {};
      const today = new Date();
      for (let i = 1; i <= 31; i++) {
        const dStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        defaultAvail[dStr] = true;
      }
      addVehicle({
        ...vehicleData,
        availability: defaultAvail
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Gestión de Flota • Madrid</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Configuración de Vehículos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {vehicles.length} vehículos en la flota • <span className="font-semibold text-emerald-600 dark:text-emerald-400">{kpis.availableVehiclesToday} disponibles hoy</span>
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Vehículo</span>
        </button>
      </div>

      {/* Distribución de la pantalla en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Lista de Vehículos */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Flota de Reparto ({vehicles.length})
            </h3>
            <span className="text-xs text-slate-400">
              Selecciona para ver detalle
            </span>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {vehicles.map(v => {
              const isSelected = selectedVehicle?.id === v.id;
              const isAvailableToday = v.availability[kpis.todayIso] !== false;

              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {v.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {v.licensePlate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {v.type} • Capacidad: <strong>{v.capacityKg} kg</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={e => handleOpenEdit(v, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        title="Editar vehículo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => handleDelete(v.id, v.name, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                        title="Eliminar vehículo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <BadgeDGT badge={v.dgtBadge} size="sm" />

                    <div className="flex items-center gap-1 text-[11px]">
                      {isAvailableToday ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Disponible hoy
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5" />
                          No disponible hoy
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Panel de Detalle y Calendario del Vehículo */}
        <div className="lg:col-span-7 space-y-4">
          {selectedVehicle ? (
            <>
              {/* Tarjeta de Especificaciones Técnicas */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Detalle del Vehículo
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {selectedVehicle.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Matrícula: {selectedVehicle.licensePlate} • Categoría: {selectedVehicle.type}
                    </p>
                  </div>

                  <div>
                    <BadgeDGT badge={selectedVehicle.dgtBadge} size="md" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Weight className="w-3.5 h-3.5 text-blue-500" />
                      Capacidad
                    </span>
                    <strong className="text-sm text-slate-900 dark:text-white block">
                      {selectedVehicle.capacityKg} kg
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                      CO₂ Emitido
                    </span>
                    <strong className="text-sm text-slate-900 dark:text-white block">
                      {selectedVehicle.co2FactorGPerKm} g/km
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Euro className="w-3.5 h-3.5 text-amber-500" />
                      Coste / km
                    </span>
                    <strong className="text-sm text-slate-900 dark:text-white block">
                      {selectedVehicle.costPerKm} €/km
                    </strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      Estado Hoy
                    </span>
                    <strong className={`text-sm block ${
                      selectedVehicle.availability[kpis.todayIso] !== false
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {selectedVehicle.availability[kpis.todayIso] !== false ? 'Activo' : 'Inactivo'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Calendario mensual de disponibilidad */}
              <VehicleCalendar
                vehicleId={selectedVehicle.id}
                vehicleName={selectedVehicle.name}
                availability={selectedVehicle.availability}
                onToggleAvailability={toggleVehicleAvailability}
              />
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400">
              <Truck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Selecciona un vehículo para ver su detalle y gestionar su calendario
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para añadir o editar vehículo */}
      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVehicle}
        initialVehicle={vehicleToEdit}
      />
    </div>
  );
};
