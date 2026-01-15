'use client';

import Logo from './ui/Logo';
import Icon from './ui/Icon';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: 'database' as const 
    },
    { 
      id: 'problem-solution', 
      name: 'Problem & Solution', 
      icon: 'question' as const 
    },
    { 
      id: 'simulate', 
      name: 'Agent Simulation', 
      icon: 'server' as const 
    },
    { 
      id: 'architecture', 
      name: 'Architecture', 
      icon: 'lock' as const 
    },
    { 
      id: 'search', 
      name: 'Search', 
      icon: 'search' as const 
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-black text-white border-r border-gray-900 z-40 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-900 flex items-center justify-between">
            <button
              onClick={() => {
                onSectionChange('dashboard');
                onClose();
              }}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Logo size="sm" textClassName="text-white" />
            </button>
            <button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-gray-900 rounded-lg"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onSectionChange(item.id);
                      onClose(); // Close sidebar on mobile after selection
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                      }
                    `}
                  >
                    <Icon 
                      name={item.icon} 
                      size="md" 
                      className={isActive ? 'text-white' : 'text-gray-400'} 
                    />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer in Sidebar */}
        <div className="p-4 border-t border-gray-900">
          <p className="text-xs text-gray-500 text-center">
            © 2026 DataWeave
          </p>
        </div>
      </div>
    </aside>
    </>
  );
}
