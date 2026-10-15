import React, { useState, useEffect } from 'react';
import type { Vehicle, VehicleType, DgtBadge } from '../../types';
import { Modal } from '../common/Modal';
import { BadgeDGT } from '../common/BadgeDGT';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicleData: Omit<Vehicle, 'id' | 'availability'>) => void;
  initialVehicle?: Vehicle | null;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialVehicle
}) => {
  const [name, setName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [type, setType] = useState<VehicleType>('Furgoneta');
  const [capacityKg, setCapacityKg] = useState<number>(1000);
  const [dgtBadge, setDgtBadge] = useState<DgtBadge>('0_EMISIONES');
  const [co2FactorGPerKm, setCo2FactorGPerKm] = useState<number>(0);
  const [costPerKm, setCostPerKm] = useState<number>(0.2);

  useEffect(() => {
    if (initialVehicle) {
      setName(initialVehicle.name);
      setLicensePlate(initialVehicle.licensePlate);
      setType(initialVehicle.type);
      setCapacityKg(initialVehicle.capacityKg);
      setDgtBadge(initialVehicle.dgtBadge);
      setCo2FactorGPerKm(initialVehicle.co2FactorGPerKm);
      setCostPerKm(initialVehicle.costPerKm);
    } else {
      setName('');
      setLicensePlate('');
      setType('Furgoneta');
      setCapacityKg(1000);
      setDgtBadge('0_EMISIONES');
      setCo2FactorGPerKm(0);
      setCostPerKm(0.2);
    }
  }, [initialVehicle, isOpen]);

  // Ajustar sugerencias de CO2 y coste según pegatina y tipo
  const handleBadgeChange = (newBadge: DgtBadge) => {
    setDgtBadge(newBadge);
    if (newBadge === '0_EMISIONES') {
      setCo2FactorGPerKm(0);
    } else if (newBadge === 'ECO') {
      setCo2FactorGPerKm(type === 'Camión ligero' ? 140 : 90);
    } else if (newBadge === 'C') {
      setCo2FactorGPerKm(type === 'Camión ligero' ? 210 : 150);
    } else if (newBadge === 'B') {
      setCo2FactorGPerKm(type === 'Camión ligero' ? 260 : 190);
    } else {
      setCo2FactorGPerKm(type === 'Camión ligero' ? 320 : 240);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name,
      licensePlate: licensePlate || 'MAD-0000',
      type,
      capacityKg: Number(capacityKg) || 100,
      dgtBadge,
      co2FactorGPerKm: Number(co2FactorGPerKm) || 0,
      costPerKm: Number(costPerKm) || 0.1
    });
    onClose();
  };

  const vehicleTypes: VehicleType[] = [
    'Furgoneta',
    'Camión ligero',
    'Moto',
    'Bicicleta de carga'
  ];

  const badges: DgtBadge[] = [
    '0_EMISIONES',
    'ECO',
    'C',
    'B',
    'SIN_DISTINTIVO'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialVehicle ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo a la Flota'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre y Matrícula */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nombre o Alias *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. EcoVan Moncloa 03"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Matrícula / Identificador
            </label>
            <input
              type="text"
              placeholder="Ej. 1234-MTR"
              value={licensePlate}
              onChange={e => setLicensePlate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tipo de vehículo y Capacidad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tipo de Vehículo
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as VehicleType)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {vehicleTypes.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Capacidad de Carga (kg)
            </label>
            <input
              type="number"
              min="10"
              max="10000"
              value={capacityKg}
              onChange={e => setCapacityKg(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Distintivo Ambiental DGT */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Pegatina de Sostenibilidad (Distintivo Ambiental DGT)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {badges.map(b => (
              <button
                type="button"
                key={b}
                onClick={() => handleBadgeChange(b)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  dgtBadge === b
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <BadgeDGT badge={b} size="sm" showLabel={false} />
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {b.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Emisiones y Costes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Emisión CO₂ (g/km)
            </label>
            <input
              type="number"
              step="1"
              value={co2FactorGPerKm}
              onChange={e => setCo2FactorGPerKm(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Coste por km (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={costPerKm}
              onChange={e => setCostPerKm(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all"
          >
            {initialVehicle ? 'Guardar Cambios' : 'Registrar Vehículo'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
