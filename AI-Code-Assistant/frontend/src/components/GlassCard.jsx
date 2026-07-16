import React from 'react';

export default function GlassCard({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:border-cyan-500/40 hover:bg-slate-900/50 hover:shadow-glow-cyan' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
