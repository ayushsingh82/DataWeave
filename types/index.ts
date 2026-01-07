// Type definitions for the Provenance Challenge system

// ============================================
// Core Provenance Types
// ============================================

export type ProvenanceType = 'compute' | 'proof' | 'reasoning';

export interface ProvenanceRecord {
  id: string;
  type: ProvenanceType;
  minerId: string;
  timestamp: number;
  dataHash: string;
  arweaveId: string;
  metadata: ProvenanceMetadata;
  previousRecords: string[];
  signature: string;
  version: string;
}

export interface ProvenanceMetadata {
  modelVersion?: string;
  computationType: string;
  inputs: string[];
  outputs: string[];
  reasoning?: string;
  tags?: string[];
  customData?: Record<string, any>;
}

// ============================================
// Miner Simulation Types
// ============================================

export interface MinerRunLog {
  runId: string;
  minerId: string;
  startTime: number;
  endTime: number;
  inputs: any[];
  outputs: any[];
  reasoning: string;
  zkProof?: ZKProofData;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

export interface MinerConfig {
  minerId: string;
  modelName: string;
  modelVersion: string;
  computationTypes: string[];
}

// ============================================
// ZK Proof Types
// ============================================

export interface ZKProofData {
  proofId: string;
  proofData: string;
  publicInputs: string[];
  verificationResult: boolean;
  verificationTime: number;
  circuitHash: string;
}

export interface ZKProofRequest {
  computationType: string;
  inputs: any[];
  outputs: any[];
  reasoning: string;
}

// ============================================
// API Types
// ============================================

export interface CreateProvenanceRequest {
  type: ProvenanceType;
  minerId: string;
  data: any;
  metadata: ProvenanceMetadata;
}

export interface CreateProvenanceResponse {
  success: boolean;
  recordId: string;
  arweaveId: string;
  dataHash: string;
  timestamp: number;
}

export interface GetProvenanceResponse {
  success: boolean;
  record: ProvenanceRecord | null;
}

export interface SearchProvenanceRequest {
  minerId?: string;
  type?: ProvenanceType;
  startTime?: number;
  endTime?: number;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchProvenanceResponse {
  success: boolean;
  records: ProvenanceRecord[];
  total: number;
  hasMore: boolean;
}

// ============================================
// Arweave Transaction Types
// ============================================

export interface ArweaveConfig {
  host: string;
  port: number;
  protocol: 'http' | 'https';
  timeout: number;
}

export interface ArweaveTransaction {
  id: string;
  owner: string;
  target: string;
  quantity: string;
  data: string;
  reward: string;
  signature: string;
  tags: ArweaveTag[];
  block?: ArweaveBlock;
}

export interface ArweaveTag {
  name: string;
  value: string;
}

export interface ArweaveBlock {
  id: string;
  timestamp: number;
  height: number;
  previous: string;
}

// ============================================
// UI State Types
// ============================================

export interface DashboardState {
  recentRecords: ProvenanceRecord[];
  stats: {
    totalRecords: number;
    computeRecords: number;
    proofRecords: number;
    reasoningRecords: number;
  };
  isLoading: boolean;
  error: string | null;
}

export interface MinerSimulationState {
  isRunning: boolean;
  currentRun: MinerRunLog | null;
  completedRuns: MinerRunLog[];
}

// ============================================
// Utility Types
// ============================================

export interface SignatureData {
  recordId: string;
  dataHash: string;
  timestamp: number;
  minerId: string;
}

export interface VerificationResult {
  valid: boolean;
  recordId: string;
  arweaveId: string;
  dataHash: string;
  computedHash: string;
  chainValid: boolean;
  signatureValid: boolean;
}

// ============================================
// Configuration Types
// ============================================

export interface AppConfig {
  arweave: ArweaveConfig;
  appName: string;
  appVersion: string;
  walletKey?: string;
  debug: boolean;
}

export const DEFAULT_CONFIG: AppConfig = {
  arweave: {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 10000,
  },
  appName: 'Provenance Challenge',
  appVersion: '1.0.0',
  debug: true,
};

