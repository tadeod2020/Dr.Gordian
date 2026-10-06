import React from 'react';

interface BorderBeamProps {
  className?: string;
  colorFrom?: string;
  colorTo?: string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className = '',
  colorFrom = '#f59e0b',
  colorTo = '#ef4444',
}) => {
  return (
    <div
      className={`pointer-events-none absolute -inset-0.5 rounded-[inherit] opacity-75 blur-sm animate-pulse transition-opacity ${className}`}
      style={{
        background: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
      }}
    />
  );
};

