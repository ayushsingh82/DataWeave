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
          </defs>
          
          {/* Taller rounded rectangle background */}
          <rect 
            x="8" 
            y="4" 
            width="48" 
            height="56" 
            rx="8" 
            fill="url(#logoGradient)" 
            className="drop-shadow-lg"
          />
          
          {/* Simple weave pattern - three horizontal lines */}
          <line 
            x1="18" 
            y1="18" 
            x2="46" 
            y2="18" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <line 
            x1="18" 
            y1="32" 
            x2="46" 
            y2="32" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          <line 
            x1="18" 
            y1="46" 
            x2="46" 
            y2="46" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
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
