'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  Server,
  Search,
  Plus,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Link,
  Shield,
  Cpu,
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { MinerSimulation } from './components/MinerSimulation';
import { SearchInterface } from './components/SearchInterface';
import { Logo } from './components/Logo';
import { ProvenanceRecord } from '@/types';

type TabType = 'dashboard' | 'simulate' | 'search';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [records, setRecords] = useState<ProvenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/provenance/search');
      const data = await response.json();
      if (data.success) {
        setRecords(data.records);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Database },
    { id: 'simulate' as TabType, label: 'Miner Simulation', icon: Server },
    { id: 'search' as TabType, label: 'Search', icon: Search },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <header className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h1 className="text-2xl font-bold text-black">
                  DataWeave
                </h1>
                <p className="text-sm text-gray-600">
                  Decentralized AI Compute Provenance on Arweave
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchRecords}
                className="btn-secondary px-4 py-2 rounded font-medium flex items-center gap-2"
                style={{ boxShadow: '3px 3px 0px 0px rgba(0, 0, 0, 0.2)' }}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="flex items-center gap-2 px-4 py-2 border-2 border-black">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-black">{records.length} Records</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="flex gap-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium flex items-center gap-2 ${
                  isActive
                    ? 'tab-active rounded-t-lg'
                    : 'tab-inactive rounded-t-lg ml-[-2px]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="border-2 border-black rounded-b-lg rounded-tr-lg mt-0 p-6 bg-white min-h-[600px]">
          {activeTab === 'dashboard' && <Dashboard records={records} />}
          {activeTab === 'simulate' && (
            <MinerSimulation onRecordCreated={fetchRecords} />
          )}
          {activeTab === 'search' && <SearchInterface records={records} />}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
              <span className="font-medium text-black">Powered by Arweave</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Immutable Storage</span>
              <span>•</span>
              <span>Verifiable Provenance</span>
              <span>•</span>
              <span>ZK Proofs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

