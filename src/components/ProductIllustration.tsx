import React from 'react';
import { Product } from '@/data/mockData';

interface ProductIllustrationProps {
  type: Product['svgType'];
  accentColor: string;
  className?: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({
  type,
  accentColor,
  className = 'w-full h-48',
}) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-900/90 border border-slate-800/80 group ${className}`}>
      {/* Ambient background glow */}
      <div
        className={`absolute -inset-6 bg-gradient-to-br ${accentColor} opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-35`}
      />
      {/* Subtle blueprint grid */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* Device Vector */}
      <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
        {type === 'laptop' && (
          <svg width="160" height="110" viewBox="0 0 160 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="26" y="12" width="108" height="70" rx="6" className="fill-slate-950 stroke-slate-300" strokeWidth="2.5" />
            <rect x="31" y="17" width="98" height="60" rx="3" fill="url(#laptopScreen)" />
            <path d="M72 14H88" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 83H148L154 91C154 93.2091 152.209 95 150 95H10C7.79086 95 6 93.2091 6 91L12 83Z" className="fill-slate-800 stroke-slate-300" strokeWidth="2" />
            <rect x="64" y="83" width="32" height="3" rx="1.5" fill="#94A3B8" />
            <defs>
              <linearGradient id="laptopScreen" x1="31" y1="17" x2="129" y2="77" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5" />
                <stop offset="0.5" stopColor="#7C3AED" />
                <stop offset="1" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {type === 'phone' && (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="34" y="10" width="52" height="100" rx="11" className="fill-slate-950 stroke-slate-200" strokeWidth="2.5" />
            <rect x="38" y="14" width="44" height="92" rx="8" fill="url(#phoneScreen)" />
            <rect x="52" y="17" width="16" height="4" rx="2" fill="#0F172A" />
            <circle cx="60" cy="44" r="14" className="fill-slate-900/80 stroke-amber-300/70" strokeWidth="1.5" />
            <circle cx="60" cy="44" r="6" className="fill-amber-400/40 stroke-amber-200" strokeWidth="1.5" />
            <defs>
              <linearGradient id="phoneScreen" x1="38" y1="14" x2="82" y2="106" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.5" stopColor="#EA580C" />
                <stop offset="1" stopColor="#1E293B" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {type === 'headphones' && (
          <svg width="130" height="120" viewBox="0 0 130 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 64V54C28 33.5655 44.5655 17 65 17C85.4345 17 102 33.5655 102 54V64" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
            <rect x="20" y="56" width="18" height="36" rx="9" className="fill-emerald-500/80 stroke-slate-200" strokeWidth="2.5" />
            <rect x="92" y="56" width="18" height="36" rx="9" className="fill-emerald-500/80 stroke-slate-200" strokeWidth="2.5" />
            <line x1="29" y1="63" x2="29" y2="85" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
            <line x1="101" y1="63" x2="101" y2="85" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {type === 'camera' && (
          <svg width="140" height="110" viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48 24L55 15H85L92 24H114C118.418 24 122 27.5817 122 32V84C122 88.4183 118.418 92 114 92H26C21.5817 92 18 88.4183 18 84V32C18 27.5817 21.5817 24 26 24H48Z" className="fill-slate-900 stroke-slate-200" strokeWidth="2.5" />
            <circle cx="70" cy="58" r="23" className="fill-slate-950 stroke-rose-400" strokeWidth="3" />
            <circle cx="70" cy="58" r="14" className="fill-rose-500/30 stroke-rose-200" strokeWidth="1.5" />
            <circle cx="106" cy="36" r="4" fill="#F43F5E" />
            <rect x="26" y="32" width="12" height="48" rx="3" fill="#334155" />
          </svg>
        )}

        {type === 'watch' && (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M46 12H74L78 32H42L46 12Z" fill="#475569" />
            <path d="M42 88H78L74 108H46L42 88Z" fill="#475569" />
            <circle cx="60" cy="60" r="30" className="fill-slate-950 stroke-violet-400" strokeWidth="3.5" />
            <circle cx="60" cy="60" r="23" className="stroke-slate-700" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M60 45V60L71 67" stroke="#C4B5FD" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="60" cy="60" r="3" fill="#A78BFA" />
          </svg>
        )}

        {type === 'keyboard' && (
          <svg width="160" height="100" viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="14" y="24" width="132" height="54" rx="8" className="fill-slate-900 stroke-sky-400" strokeWidth="2.5" />
            <rect x="22" y="33" width="12" height="10" rx="2" fill="#38BDF8" />
            <rect x="38" y="33" width="12" height="10" rx="2" fill="#334155" />
            <rect x="54" y="33" width="12" height="10" rx="2" fill="#334155" />
            <rect x="70" y="33" width="12" height="10" rx="2" fill="#334155" />
            <rect x="86" y="33" width="12" height="10" rx="2" fill="#334155" />
            <rect x="102" y="33" width="12" height="10" rx="2" fill="#334155" />
            <circle cx="130" cy="38" r="6" className="fill-sky-400 stroke-slate-100" strokeWidth="1.5" />
            <rect x="22" y="47" width="18" height="10" rx="2" fill="#475569" />
            <rect x="44" y="47" width="12" height="10" rx="2" fill="#334155" />
            <rect x="60" y="47" width="12" height="10" rx="2" fill="#334155" />
            <rect x="76" y="47" width="12" height="10" rx="2" fill="#334155" />
            <rect x="92" y="47" width="12" height="10" rx="2" fill="#334155" />
            <rect x="108" y="47" width="28" height="10" rx="2" fill="#0284C7" />
            <rect x="42" y="61" width="76" height="9" rx="2" fill="#E2E8F0" />
          </svg>
        )}

        {type === 'drone' && (
          <svg width="150" height="110" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="32" y1="30" x2="118" y2="80" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
            <line x1="118" y1="30" x2="32" y2="80" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
            <rect x="57" y="40" width="36" height="30" rx="10" className="fill-slate-900 stroke-cyan-400" strokeWidth="2.5" />
            <circle cx="75" cy="55" r="7" className="fill-cyan-400/40 stroke-cyan-200" strokeWidth="2" />
            <circle cx="32" cy="30" r="14" className="stroke-cyan-400/70" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="118" cy="30" r="14" className="stroke-cyan-400/70" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="32" cy="80" r="14" className="stroke-cyan-400/70" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="118" cy="80" r="14" className="stroke-cyan-400/70" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        )}

        {type === 'tablet' && (
          <svg width="150" height="110" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="16" width="102" height="76" rx="8" className="fill-slate-950 stroke-fuchsia-300" strokeWidth="2.5" />
            <rect x="30" y="22" width="90" height="64" rx="4" fill="url(#tabletGrad)" />
            <line x1="52" y1="78" x2="128" y2="20" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
            <line x1="52" y1="78" x2="47" y2="82" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
            <defs>
              <linearGradient id="tabletGrad" x1="30" y1="22" x2="120" y2="86" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C026D3" />
                <stop offset="1" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {type === 'earbuds' && (
          <svg width="130" height="110" viewBox="0 0 130 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="34" width="70" height="54" rx="22" className="fill-slate-900 stroke-teal-300" strokeWidth="2.5" />
            <line x1="32" y1="58" x2="98" y2="58" stroke="#475569" strokeWidth="2" />
            <circle cx="65" cy="72" r="4" fill="#2DD4BF" />
            <circle cx="49" cy="24" r="11" className="fill-teal-500/80 stroke-slate-100" strokeWidth="2" />
            <circle cx="81" cy="24" r="11" className="fill-teal-500/80 stroke-slate-100" strokeWidth="2" />
          </svg>
        )}

        {(type === 'monitor' || type === 'speaker' || type === 'console') && (
          <svg width="150" height="110" viewBox="0 0 150 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="34" width="114" height="42" rx="8" className="fill-slate-900 stroke-indigo-400" strokeWidth="2.5" />
            <circle cx="36" cy="55" r="7" className="fill-indigo-500/40 stroke-indigo-300" strokeWidth="2" />
            <rect x="54" y="49" width="14" height="12" rx="2" fill="#38BDF8" />
            <rect x="74" y="49" width="14" height="12" rx="2" fill="#38BDF8" />
            <rect x="94" y="49" width="14" height="12" rx="2" fill="#6366F1" />
            <circle cx="118" cy="55" r="4" fill="#4ADE80" />
          </svg>
        )}
      </div>
    </div>
  );
};

