'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div 
      className={`${sizeClasses[size]} ${className} logo-container`}
    >
      <div className="logo-inner">
        <div className="logo-pattern">
          <div className="logo-bar logo-bar-1"></div>
          <div className="logo-bar logo-bar-2"></div>
          <div className="logo-bar logo-bar-3"></div>
        </div>
      </div>
    </div>
  );
}
