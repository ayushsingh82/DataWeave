'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  FileText,
  Shield,
  Brain,
  Cpu,
  Calendar,
  User,
  Tag,
  ChevronRight,
  X,
} from 'lucide-react';
import { ProvenanceRecord, ProvenanceType } from '@/types';

interface SearchInterfaceProps {
  records: ProvenanceRecord[];
}

export function SearchInterface({ records }: SearchInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ProvenanceType | 'all'>('all');
  const [selectedMiner, setSelectedMiner] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'miner'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const miners = [...new Set(records.map((r) => r.minerId))];

  const filteredRecords = records
    .filter((record) => {
      const matchesSearch =
        searchTerm === '' ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.minerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.arweaveId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.metadata.reasoning?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'all' || record.type === selectedType;
      const matchesMiner =
        selectedMiner === 'all' || record.minerId === selectedMiner;

      return matchesSearch && matchesType && matchesMiner;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'miner':
          comparison = a.minerId.localeCompare(b.minerId);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

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
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'proof':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'reasoning':
        return 'bg-cyan-100 text-cyan-700 border-cyan-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatArweaveId = (id: string) => {
    if (id.length <= 20) return id;
    return `${id.substring(0, 10)}...${id.substring(id.length - 10)}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedMiner('all');
    setSortBy('date');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedType !== 'all' ||
    selectedMiner !== 'all';

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-black">Search Provenance</h2>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary px-4 py-2 rounded font-medium flex items-center gap-2 ${
            hasActiveFilters ? 'bg-blue-50' : ''
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-blue-600 text-white rounded">
              {[
                searchTerm !== '' ? 1 : 0,
                selectedType !== 'all' ? 1 : 0,
                selectedMiner !== 'all' ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by record ID, miner, Arweave ID, or reasoning..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field w-full pl-12 pr-4 py-4 text-lg"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as ProvenanceType | 'all')
                }
                className="input-field w-full px-4 py-2"
              >
                <option value="all">All Types</option>
                <option value="compute">Compute</option>
                <option value="proof">Proof</option>
                <option value="reasoning">Reasoning</option>
              </select>
            </div>

            {/* Miner Filter */}
            <div>
              <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Miner
              </label>
              <select
                value={selectedMiner}
                onChange={(e) => setSelectedMiner(e.target.value)}
                className="input-field w-full px-4 py-2"
              >
                <option value="all">All Miners</option>
                {miners.map((miner) => (
                  <option key={miner} value={miner}>
                    {miner}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'date' | 'type' | 'miner')
                }
                className="input-field w-full px-4 py-2"
              >
                <option value="date">Date</option>
                <option value="type">Type</option>
                <option value="miner">Miner</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as 'asc' | 'desc')
                }
                className="input-field w-full px-4 py-2"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-black">{filteredRecords.length}</span> of{' '}
          <span className="font-medium text-black">{records.length}</span> records
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Results List */}
      {filteredRecords.length === 0 ? (
        <div className="card p-8 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No records found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div key={record.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
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
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {record.minerId}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {formatTimestamp(record.timestamp)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <Tag className="w-3 h-3" />
                      {record.metadata.computationType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Record ID</p>
                    <p className="font-mono text-sm text-black truncate max-w-[150px]">
                      {record.id}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Arweave ID</p>
                    <p className="font-mono text-sm text-black truncate max-w-[150px]">
                      {formatArweaveId(record.arweaveId)}
                    </p>
                  </div>
                  <button className="p-2 border-2 border-black hover:bg-gray-100">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Reasoning Preview */}
              {record.metadata.reasoning && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Reasoning:</p>
                  <p className="text-sm text-black bg-gray-50 p-3 border border-black">
                    {record.metadata.reasoning.length > 200
                      ? `${record.metadata.reasoning.substring(0, 200)}...`
                      : record.metadata.reasoning}
                  </p>
                </div>
              )}

              {/* Metadata Tags */}
              {record.metadata.tags && record.metadata.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {record.metadata.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium border border-black bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-black">{records.length}</p>
          <p className="text-sm text-gray-600">Total Records</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-black">{miners.length}</p>
          <p className="text-sm text-gray-600">Active Miners</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-black">
            {new Set(records.map((r) => r.metadata.computationType)).size}
          </p>
          <p className="text-sm text-gray-600">Computation Types</p>
        </div>
      </div>
    </div>
  );
}

