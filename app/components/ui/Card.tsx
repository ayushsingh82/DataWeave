import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl p-6 border-2 border-gray-100
        ${hover ? 'hover:border-emerald-300 hover:shadow-xl' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
