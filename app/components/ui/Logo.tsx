interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export default function Logo({ 
  size = 'md', 
  showText = true, 
  className = '',
  textClassName = ''
}: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-12 h-12', text: 'text-2xl' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`relative ${currentSize.icon}`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer ring with gradient */}
          <circle 
            cx="32" 
            cy="32" 
            r="30" 
            fill="url(#logoGradient)" 
            className="drop-shadow-lg"
          />
          
          {/* Inner circle for depth */}
          <circle 
            cx="32" 
            cy="32" 
            r="26" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5" 
            opacity="0.3"
          />
          
          {/* Central hub */}
          <circle 
            cx="32" 
            cy="32" 
            r="5" 
            fill="white" 
            opacity="1"
            filter="url(#glow)"
          />
          
          {/* Data nodes - representing provenance records */}
          <circle cx="32" cy="12" r="3.5" fill="white" opacity="0.95" />
          <circle cx="48" cy="20" r="3.5" fill="white" opacity="0.95" />
          <circle cx="52" cy="32" r="3.5" fill="white" opacity="0.95" />
          <circle cx="48" cy="44" r="3.5" fill="white" opacity="0.95" />
          <circle cx="32" cy="52" r="3.5" fill="white" opacity="0.95" />
          <circle cx="16" cy="44" r="3.5" fill="white" opacity="0.95" />
          <circle cx="12" cy="32" r="3.5" fill="white" opacity="0.95" />
          <circle cx="16" cy="20" r="3.5" fill="white" opacity="0.95" />
          
          {/* Connection lines - showing data flow */}
          <line x1="32" y1="32" x2="32" y2="12" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="32" y1="32" x2="48" y2="20" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="32" y1="32" x2="52" y2="32" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="32" y1="32" x2="48" y2="44" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="32" y1="32" x2="32" y2="52" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="32" y1="32" x2="16" y2="44" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="32" y1="32" x2="12" y2="32" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <line x1="32" y1="32" x2="16" y2="20" stroke="white" strokeWidth="1.5" opacity="0.7" />
        </svg>
      </div>
      {showText && (
        <span className={`font-bold text-emerald-600 ${currentSize.text} ${textClassName}`}>
          DataWeave
        </span>
      )}
    </div>
  );
}
