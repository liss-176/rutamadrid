import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import type { RoutePlan } from '../../types';
import { MADRID_CENTER, MADRID_HUB } from '../../data/hub';
import { createHubIcon, createVehicleIcon } from '../../utils/mapIcons';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface RouteMapMiniProps {
  routes: RoutePlan[];
}

const MapResizer: React.FC = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map]);
  return null;
};

export const RouteMapMini: React.FC<RouteMapMiniProps> = ({ routes }) => {
  const activeRoutes = routes.filter(r => r.status === 'En ruta' || r.status === 'Pendiente');

  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
      <MapContainer
        center={MADRID_CENTER}
        zoom={11}
        scrollWheelZoom={false}
        zoomControl={false}
        className="w-full h-full"
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hub Central */}
        <Marker position={MADRID_HUB.coordinates} icon={createHubIcon()} />

        {/* Polilíneas de rutas activas */}
        {activeRoutes.map(route => {
          const currentPos = route.currentPosition || route.pathCoordinates[0];
          return (
            <React.Fragment key={route.id}>
              <Polyline
                positions={route.pathCoordinates}
                pathOptions={{
                  color: route.color,
                  weight: 3.5,
                  opacity: 0.8
                }}
              />
              {currentPos && (
                <Marker
                  position={currentPos}
                  icon={createVehicleIcon(route.color, 'Furgoneta', route.status === 'En ruta')}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Overlay superior con enlace directo al mapa ampliado */}
      <div className="absolute top-3 right-3 z-20">
        <Link
          to="/mapa"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-xs font-bold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-800 shadow-md hover:bg-white transition-colors"
        >
          <span>Pantalla completa</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Etiqueta flotante inferior */}
      <div className="absolute bottom-3 left-3 z-20 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm">
        {activeRoutes.length} rutas en circulación
      </div>
    </div>
  );
};
