import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Truck,
  PackageCheck,
  CalendarClock,
  X,
  MapPin
} from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  // Cerrar al pulsar Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Evitar scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems: NavItem[] = [
    {
      name: 'Inicio',
      to: '/',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Mapa Madrid',
      to: '/mapa',
      icon: <Map className="w-5 h-5" />
    },
    {
      name: 'Configuración vehículos',
      to: '/vehiculos',
      icon: <Truck className="w-5 h-5" />
    },
    {
      name: 'Repartos',
      to: '/repartos',
      icon: <PackageCheck className="w-5 h-5" />
    },
    {
      name: 'Programar rutas',
      to: '/programar',
      icon: <CalendarClock className="w-5 h-5" />
    }
  ];

  return (
    <>
      {/* Fondo oscurecido con transición suave */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menú lateral desplegable (Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navegación principal"
      >
        {/* Cabecera del Drawer */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                RutaMadrid
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Gestión de Reparto Urbano
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de enlaces de navegación */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>
                      <span className="text-xs font-normal opacity-60 mr-2">{index + 1}.</span>
                      {item.name}
                    </span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Pie del Drawer con datos de Madrid */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Zona Madrid Centro</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
              Hub Central en Méndez Álvaro / Abroñigal. Cobertura en ZBE y M-30.
            </p>
          </div>
          <div className="mt-3 text-[11px] text-center text-slate-400">
            RutaMadrid v1.0 • React + Vite + Leaflet
          </div>
        </div>
      </aside>
    </>
  );
};
