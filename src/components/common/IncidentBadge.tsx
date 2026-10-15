import React from 'react';
import type { IncidentSeverity } from '../../types';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface IncidentBadgeProps {
  severity: IncidentSeverity;
  showIcon?: boolean;
}

export const IncidentBadge: React.FC<IncidentBadgeProps> = ({
  severity,
  showIcon = true
}) => {
  const config = {
    alta: {
      label: 'Gravedad Alta',
      bgClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
    },
    media: {
      label: 'Gravedad Media',
      bgClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
    },
    baja: {
      label: 'Gravedad Baja',
      bgClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      icon: <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
    }
  }[severity];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.bgClass}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
