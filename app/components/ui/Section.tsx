import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'green';
}

export default function Section({
  id,
  children,
  className = '',
  background = 'white'
}: SectionProps) {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    green: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  };
  
  return (
    <section
      id={id}
      className={`py-20 px-4 sm:px-6 lg:px-8 ${backgrounds[background]} ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
}
