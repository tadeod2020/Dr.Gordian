import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  className?: string;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  shimmerColor = '#ffffff',
  shimmerSize = '0.1em',
  className = '',
  ...props
}) => {
  return (
    <button
      className={`group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-600/35 active:scale-[0.98] ${className}`}
      {...props}
    >
      {/* Shimmer Light Sweep */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
