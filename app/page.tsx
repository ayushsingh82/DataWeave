'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { ProvenanceRecord } from '@/types';

export default function Home() {
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

  return (
    <DashboardLayout 
      records={records} 
      onRecordCreated={fetchRecords}
    />
  );
}

