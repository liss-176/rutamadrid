import React from 'react';
import type { DgtBadge } from '../../types';

interface BadgeDGTProps {
  badge: DgtBadge;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const BadgeDGT: React.FC<BadgeDGTProps> = ({
  badge,
  size = 'md',
  showLabel = true
}) => {
  const getBadgeConfig = () => {
    switch (badge) {
      case '0_EMISIONES':
        return {
          code: '0',
          title: '0 Emisiones',
          bgClass: 'bg-blue-600 text-white border-blue-700 shadow-blue-500/20',
          badgeText: '0 Emisiones'
        };
      case 'ECO':
        return {
          code: 'ECO',
          title: 'Distintivo ECO',
          bgClass: 'bg-emerald-600 text-white border-teal-700 shadow-emerald-500/20',
          badgeText: 'ECO'
        };
      case 'C':
        return {
          code: 'C',
          title: 'Distintivo C',
          bgClass: 'bg-green-600 text-white border-green-700 shadow-green-500/20',
          badgeText: 'Distintivo C'
        };
      case 'B':
        return {
          code: 'B',
          title: 'Distintivo B',
          bgClass: 'bg-amber-500 text-slate-900 border-amber-600 shadow-amber-500/20',
          badgeText: 'Distintivo B'
        };
      case 'SIN_DISTINTIVO':
      default:
        return {
          code: '—',
          title: 'Sin Distintivo',
          bgClass: 'bg-slate-400 dark:bg-slate-600 text-white border-slate-500 shadow-slate-500/20',
          badgeText: 'Sin Distintivo'
        };
    }
  };

  const config = getBadgeConfig();

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold shadow-xs border transition-all ${config.bgClass} ${sizeStyles[size]}`}
      title={config.title}
    >
      <span className="flex items-center justify-center font-black tracking-wider uppercase text-[10px]">
        DGT {config.code}
      </span>
      {showLabel && size !== 'sm' && (
        <span className="font-normal border-l border-white/30 pl-1.5">
          {config.badgeText}
        </span>
      )}
    </span>
  );
};
