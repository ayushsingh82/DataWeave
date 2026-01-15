'use client';

import { useState, useEffect } from 'react';
import {
  Server,
  Play,
  Pause,
  RefreshCw,
  Cpu,
  Brain,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { DEFAULT_MINER_CONFIGS, MinerRunLog } from '@/lib/miner';
import { MinerConfig } from '@/types';

interface MinerSimulationProps {
  onRecordCreated: () => void;
}

export function MinerSimulation({ onRecordCreated }: MinerSimulationProps) {
  const [selectedMiner, setSelectedMiner] = useState<MinerConfig>(
    DEFAULT_MINER_CONFIGS[0]
  );
  const [selectedComputation, setSelectedComputation] = useState<string>(
    selectedMiner.computationTypes[0]
  );
  const [inputCount, setInputCount] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<MinerRunLog | null>(null);
  const [completedRuns, setCompletedRuns] = useState<MinerRunLog[]>([]);
  const [expandedRun, setExpandedRun] = useState<string | null>(null);
  const [showMinerDropdown, setShowMinerDropdown] = useState(false);
  const [showComputeDropdown, setShowComputeDropdown] = useState(false);

  useEffect(() => {
    setSelectedComputation(selectedMiner.computationTypes[0]);
  }, [selectedMiner]);

  const handleStartSimulation = async () => {
    setIsRunning(true);
    setCurrentRun({
      runId: 'pending',
      minerId: selectedMiner.minerId,
      startTime: Date.now(),
      endTime: 0,
      inputs: Array.from({ length: inputCount }, () => ({
        id: Math.random().toString(36).substring(7),
        value: Math.random().toString(36).substring(2, 12),
      })),
      outputs: [],
      reasoning: '',
      zkProof: undefined,
      status: 'pending',
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const response = await fetch('/api/provenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'compute',
          minerId: selectedMiner.minerId,
          data: {
            minerId: selectedMiner.minerId,
            modelName: selectedMiner.modelName,
            modelVersion: selectedMiner.modelVersion,
            computationType: selectedComputation,
            inputCount,
            inputs: Array.from({ length: inputCount }, () => ({
              id: Math.random().toString(36).substring(7),
              value: Math.random().toString(36).substring(2, 12),
            })),
          },
          metadata: {
            modelVersion: selectedMiner.modelVersion,
            computationType: selectedComputation,
            inputs: Array.from({ length: inputCount }, () =>
              Math.random().toString(36).substring(2, 12)
            ),
            outputs: ['output-1', 'output-2', 'output-3'],
            reasoning: `Analyzed ${inputCount} inputs using ${selectedComputation}. Key findings: Generated predictions with confidence scores.`,
            tags: [selectedComputation, selectedMiner.modelName],
          },
        }),
      });

      const data = await response.json();

      const runLog: MinerRunLog = {
        runId: data.recordId || `run-${Date.now()}`,
        minerId: selectedMiner.minerId,
        startTime: Date.now() - 2000,
        endTime: Date.now(),
        inputs: Array.from({ length: inputCount }, () => ({
          id: Math.random().toString(36).substring(7),
          value: Math.random().toString(36).substring(2, 12),
        })),
        outputs: [
          {
            prediction: 'result-1',
            confidence: 0.85,
            tokens: 150,
          },
          {
            prediction: 'result-2',
            confidence: 0.92,
            tokens: 200,
          },
        ],
        reasoning: `Processed ${inputCount} inputs through ${selectedMiner.modelName} (${selectedMiner.modelVersion}) using ${selectedComputation}. Average confidence: ${(Math.random() * 0.15 + 0.85).toFixed(2)}`,
        zkProof: {
          proofId: `proof-${Date.now()}`,
          proofData: JSON.stringify({
            a: ['abc123', 'def456'],
            b: [
              ['ghi789', 'jkl012'],
              ['mno345', 'pqr678'],
            ],
            c: ['stu901', 'vwx234'],
          }),
          publicInputs: Array.from({ length: inputCount }, () =>
            Math.random().toString(36).substring(2, 12)
          ),
          verificationResult: true,
          verificationTime: 150,
          circuitHash: `circuit-${Math.random().toString(36).substring(2, 18)}`,
        },
        status: 'completed',
      };

      setCurrentRun(runLog);
      setCompletedRuns((prev) => [runLog, ...prev]);
      onRecordCreated();
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleBatchSimulation = async () => {
    setIsRunning(true);
    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await handleStartSimulation();
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    setIsRunning(false);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 py-8">
      {/* Configuration Panel */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Server className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-black">Miner Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Miner Selection */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Select Miner
            </label>
            <div className="relative">
              <button
                onClick={() => setShowMinerDropdown(!showMinerDropdown)}
                className="input-field w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>{selectedMiner.minerId}</span>
                </div>
                {showMinerDropdown ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showMinerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 border-2 border-black bg-white z-10">
                  {DEFAULT_MINER_CONFIGS.map((miner) => (
                    <button
                      key={miner.minerId}
                      onClick={() => {
                        setSelectedMiner(miner);
                        setShowMinerDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 border-b border-gray-200 last:border-b-0"
                    >
                      <Cpu className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-black">{miner.minerId}</p>
                        <p className="text-xs text-gray-500">
                          {miner.modelName} v{miner.modelVersion}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Computation Type */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Computation Type
            </label>
            <div className="relative">
              <button
                onClick={() => setShowComputeDropdown(!showComputeDropdown)}
                className="input-field w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="capitalize">{selectedComputation}</span>
                </div>
                {showComputeDropdown ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showComputeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 border-2 border-black bg-white z-10">
                  {selectedMiner.computationTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedComputation(type);
                        setShowComputeDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 capitalize border-b border-gray-200 last:border-b-0"
                    >
                      <Brain className="w-4 h-4 text-purple-600" />
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Count */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Input Count
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={inputCount}
              onChange={(e) => setInputCount(parseInt(e.target.value) || 1)}
              className="input-field w-full px-4 py-3"
            />
          </div>

          {/* Model Info */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Model Info
            </label>
            <div className="input-field w-full px-4 py-3">
              <p className="font-medium text-black">{selectedMiner.modelName}</p>
              <p className="text-xs text-gray-500">
                v{selectedMiner.modelVersion}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleStartSimulation}
            disabled={isRunning}
            className="btn-primary px-6 py-3 rounded font-medium flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Simulation
              </>
            )}
          </button>
          <button
            onClick={handleBatchSimulation}
            disabled={isRunning}
            className="btn-secondary px-6 py-3 rounded font-medium flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Batch Run (5x)
          </button>
        </div>
      </div>

      {/* Current Run Status */}
      {currentRun && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-black">Current Run</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border border-black bg-gray-50">
              <p className="text-sm text-gray-600">Run ID</p>
              <p className="font-mono font-medium text-black truncate">
                {currentRun.runId}
              </p>
            </div>
            <div className="p-4 border border-black bg-gray-50">
              <p className="text-sm text-gray-600">Status</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(currentRun.status)}
                <span className="font-medium capitalize">{currentRun.status}</span>
              </div>
            </div>
            <div className="p-4 border border-black bg-gray-50">
              <p className="text-sm text-gray-600">Miner</p>
              <p className="font-medium text-black">{currentRun.minerId}</p>
            </div>
            <div className="p-4 border border-black bg-gray-50">
              <p className="text-sm text-gray-600">Computation</p>
              <p className="font-medium text-black capitalize">
                {selectedComputation}
              </p>
            </div>
          </div>

          {/* Reasoning */}
          {currentRun.reasoning && (
            <div className="mt-4 p-4 border border-black bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-black">Reasoning</span>
              </div>
              <p className="text-sm text-gray-700">{currentRun.reasoning}</p>
            </div>
          )}

          {/* ZK Proof */}
          {currentRun.zkProof && (
            <div className="mt-4 p-4 border border-black bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-black">ZK Proof</span>
                {currentRun.zkProof.verificationResult ? (
                  <span className="px-2 py-0.5 text-xs font-medium border border-black bg-green-100 text-green-700">
                    Verified
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-medium border border-black bg-red-100 text-red-700">
                    Failed
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Proof ID</p>
                  <p className="font-mono text-black truncate">
                    {currentRun.zkProof.proofId}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Verification Time</p>
                  <p className="font-medium text-black">
                    {currentRun.zkProof.verificationTime}ms
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completed Runs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-black">Completed Runs</h2>
          <span className="ml-2 px-2 py-1 text-sm font-medium border border-black bg-gray-100 text-black">
            {completedRuns.length}
          </span>
        </div>

        {completedRuns.length === 0 ? (
          <div className="card p-8 text-center">
            <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No runs completed</p>
            <p className="text-sm text-gray-500 mt-1">
              Start a simulation to see results here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedRuns.map((run) => (
              <div key={run.runId} className="card p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedRun(expandedRun === run.runId ? null : run.runId)
                  }
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(run.status)}
                    <div>
                      <p className="font-medium text-black">{run.minerId}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(run.startTime)} - {formatTime(run.endTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {run.zkProof && (
                      <span className="px-2 py-1 text-xs font-medium border border-black bg-purple-100 text-purple-700">
                        ZK Proof
                      </span>
                    )}
                    {expandedRun === run.runId ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {expandedRun === run.runId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Run ID</p>
                        <p className="font-mono text-black truncate">
                          {run.runId}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-medium text-black">
                          {run.endTime - run.startTime}ms
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Inputs</p>
                        <p className="font-medium text-black">{run.inputs.length}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Outputs</p>
                        <p className="font-medium text-black">
                          {run.outputs.length}
                        </p>
                      </div>
                    </div>
                    {run.reasoning && (
                      <div className="mt-4 p-3 border border-black bg-gray-50">
                        <p className="text-sm text-gray-600 mb-1">Reasoning</p>
                        <p className="text-sm text-black">{run.reasoning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

