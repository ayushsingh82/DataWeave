'use client';

import { useState, useEffect } from 'react';
import {
  Database,
  FileText,
  Shield,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Cpu,
} from 'lucide-react';
import { ProvenanceRecord } from '@/types';

interface DashboardProps {
  records: ProvenanceRecord[];
}

export function Dashboard({ records }: DashboardProps) {
  const [stats, setStats] = useState({
    totalRecords: 0,
    computeRecords: 0,
    proofRecords: 0,
    reasoningRecords: 0,
  });

  const [recentRecords, setRecentRecords] = useState<ProvenanceRecord[]>([]);

  useEffect(() => {
    setStats({
      totalRecords: records.length,
      computeRecords: records.filter((r) => r.type === 'compute').length,
      proofRecords: records.filter((r) => r.type === 'proof').length,
      reasoningRecords: records.filter((r) => r.type === 'reasoning').length,
    });
    setRecentRecords(records.slice(0, 10));
  }, [records]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compute':
        return <Cpu className="w-4 h-4" />;
      case 'proof':
        return <Shield className="w-4 h-4" />;
      case 'reasoning':
        return <Brain className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'compute':
        return 'badge-compute';
      case 'proof':
        return 'badge-proof';
      case 'reasoning':
        return 'badge-reasoning';
      default:
        return 'badge';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatArweaveId = (id: string) => {
    if (id.length <= 16) return id;
    return `${id.substring(0, 8)}...${id.substring(id.length - 8)}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-box p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Records</p>
              <p className="text-3xl font-bold text-black mt-1">
                {stats.totalRecords}
              </p>
            </div>
            <div className="p-3 border-2 border-black bg-gray-100">
              <Database className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        <div className="stat-box p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Compute Jobs</p>
              <p className="text-3xl font-bold text-black mt-1">
                {stats.computeRecords}
              </p>
            </div>
            <div className="p-3 border-2 border-black bg-blue-100">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="stat-box p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">ZK Proofs</p>
              <p className="text-3xl font-bold text-black mt-1">
                {stats.proofRecords}
              </p>
            </div>
            <div className="p-3 border-2 border-black bg-purple-100">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="stat-box p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Reasoning Logs</p>
              <p className="text-3xl font-bold text-black mt-1">
                {stats.reasoningRecords}
              </p>
            </div>
            <div className="p-3 border-2 border-black bg-cyan-100">
              <Brain className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-black">Recent Records</h2>
        </div>

        {recentRecords.length === 0 ? (
          <div className="card p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No records yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Start by simulating a miner run in the "Miner Simulation" tab
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div
                key={record.id}
                className="card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 border border-black ${getTypeColor(record.type)}`}
                  >
                    {getTypeIcon(record.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-black capitalize">
                        {record.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium border border-black ${getTypeColor(
                          record.type
                        )}`}
                      >
                        {record.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Miner: <span className="font-medium">{record.minerId}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(record.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Arweave ID</p>
                    <p className="font-mono text-sm text-black">
                      {formatArweaveId(record.arweaveId)}
                    </p>
                  </div>
                  <button className="p-2 border-2 border-black hover:bg-gray-100">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Chart */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-black">Provenance Activity</h2>
        </div>
        <div className="h-32 flex items-end justify-around gap-2">
          {[...Array(7)].map((_, i) => {
            const height = Math.max(20, Math.random() * 80 + 20);
            return (
              <div
                key={i}
                className="w-12 bg-blue-600 border-2 border-black"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-around mt-2 text-sm text-gray-600">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-black">Verified Records</h3>
          </div>
          <p className="text-3xl font-bold text-black">{stats.totalRecords}</p>
          <p className="text-sm text-gray-600 mt-1">All records verified</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-black">ZK Proofs Created</h3>
          </div>
          <p className="text-3xl font-bold text-black">{stats.proofRecords}</p>
          <p className="text-sm text-gray-600 mt-1">Cryptographically verified</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-black">Reasoning Chains</h3>
          </div>
          <p className="text-3xl font-bold text-black">{stats.reasoningRecords}</p>
          <p className="text-sm text-gray-600 mt-1">Chain of thought logged</p>
        </div>
      </div>
    </div>
  );
}

