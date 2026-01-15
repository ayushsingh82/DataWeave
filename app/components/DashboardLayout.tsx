'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { Dashboard } from './Dashboard';
import { MinerSimulation } from './MinerSimulation';
import { SearchInterface } from './SearchInterface';
import ProblemSolution from './ProblemSolution';
import Architecture from './Architecture';
import { ProvenanceRecord } from '@/types';

interface DashboardLayoutProps {
  records: ProvenanceRecord[];
  onRecordCreated: () => void;
}

export default function DashboardLayout({ records, onRecordCreated }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard records={records} />;
      case 'problem-solution':
        return <ProblemSolution />;
      case 'simulate':
        return <MinerSimulation onRecordCreated={onRecordCreated} />;
      case 'architecture':
        return <Architecture />;
      case 'search':
        return <SearchInterface records={records} />;
      default:
        return <Dashboard records={records} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-900 transition-colors"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="min-h-screen pt-8 md:pt-0 px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
