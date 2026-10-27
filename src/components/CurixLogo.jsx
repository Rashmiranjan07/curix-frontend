import React from 'react';

export default function CurixLogo({ size = "md" }) {
  const isSm = size === "sm";

  return (
    <div className="flex items-center gap-3 cursor-pointer select-none group">
      {/* Refined Medical Emblem */}
      <div className={`${isSm ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl bg-clinical-50 border border-clinical-200/80 flex items-center justify-center transition-all duration-200 group-hover:border-clinical-600/40`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 text-clinical-700 transition-transform duration-200 group-hover:scale-105"
        >
          {/* Symmetrical Clinical Cross */}
          <rect x="10" y="3" width="4" height="18" rx="2" fill="currentColor" />
          <rect x="3" y="10" width="18" height="4" rx="2" fill="currentColor" />
          {/* Subtle Heart Pulse Notch */}
          <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Brand Identity */}
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-clinical-700 transition-colors">
            Curix
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-clinical-600"></span>
        </div>
        <p className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase -mt-0.5">
          Healthcare
        </p>
      </div>
    </div>
  );
}