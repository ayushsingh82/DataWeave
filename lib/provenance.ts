// Provenance System Library
// Core logic for creating and managing AI compute provenance records
// Integrated with Amadeus L1 for real-time agent operation capture

import { 
  ProvenanceRecord, 
  ProvenanceMetadata, 
  ProvenanceType,
  CreateProvenanceRequest,
  SignatureData,
  VerificationResult
} from '@/types';
import { 
  generateId, 
  uploadProvenanceRecord,
  verifyProvenanceRecord,
  getTransactionData,
  getTransactionStatus
} from './arweave';

// TODO: Amadeus L1 Integration
// - Connect to Amadeus RPC endpoint
// - Capture agent operations in real-time
// - Link provenance records to Amadeus blocks
// - Integrate with uPoW validated computations
// - Store agent wallet addresses and task IDs

// ============================================
// In-Memory Storage (for demo purposes)
// In production, use a database or Arweave indexing
// ============================================

const provenanceStore: Map<string, ProvenanceRecord> = new Map();
const minerRecords: Map<string, string[]> = new Map();
const typeRecords: Map<string, string[]> = new Map();

// ============================================
// Record Creation
// ============================================

/**
 * Create a new provenance record
 */
export async function createProvenanceRecord(
  request: CreateProvenanceRequest
): Promise<{
  success: boolean;
  recordId: string;
  arweaveId: string;
  dataHash: string;
  timestamp: number;
  error?: string;
}> {
  try {
    // Generate unique record ID
    const recordId = generateId();
    const timestamp = Date.now();
    
    // Create data object to hash and store
    const recordData = {
      type: request.type,
      minerId: request.minerId,
      timestamp,
      metadata: request.metadata,
      data: request.data,
    };
    
    // Calculate data hash
    const crypto = require('crypto');
    const dataString = JSON.stringify(recordData);
    const dataHash = crypto.createHash('sha256').update(dataString, 'utf8').digest('hex');
    
    // Get previous records for chain linking
    const previousRecords = minerRecords.get(request.minerId) || [];
    
    // Create signature (simplified for demo)
    const signature = await createSignature({
      recordId,
      dataHash,
      timestamp,
      minerId: request.minerId,
    });
    
    // Build provenance record
    const record: ProvenanceRecord = {
      id: recordId,
      type: request.type,
      minerId: request.minerId,
      timestamp,
      dataHash,
      arweaveId: '', // Will be updated after upload
      metadata: request.metadata,
      previousRecords,
      signature,
      version: '1.0.0',
    };
    
    // Upload to Arweave (simulated for demo)
    const arweaveId = await simulateUpload(recordId, recordData, request.minerId, request.type);
    record.arweaveId = arweaveId;
    
    // Store record
    provenanceStore.set(recordId, record);
    
    // Update indexes
    updateIndexes(record);
    
    console.log('✅ Provenance record created:', {
      recordId,
      arweaveId,
      type: request.type,
      minerId: request.minerId,
    });
    
    return {
      success: true,
      recordId,
      arweaveId,
      dataHash,
      timestamp,
    };
  } catch (error) {
    console.error('❌ Failed to create provenance record:', error);
    return {
      success: false,
      recordId: '',
      arweaveId: '',
      dataHash: '',
      timestamp: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simulate Arweave upload (for demo purposes)
 * In production, use real Arweave transaction
 */
async function simulateUpload(
  recordId: string,
  data: object,
  minerId: string,
  type: string
): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Generate simulated Arweave transaction ID
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `arweave-${timestamp}-${randomPart}`;
}

// ============================================
// Indexing
// ============================================

/**
 * Update search indexes when a record is created
 */
function updateIndexes(record: ProvenanceRecord): void {
  // Update miner index
  const minerList = minerRecords.get(record.minerId) || [];
  minerList.push(record.id);
  minerRecords.set(record.minerId, minerList);
  
  // Update type index
  const typeList = typeRecords.get(record.type) || [];
  typeList.push(record.id);
  typeRecords.set(record.type, typeList);
}

/**
 * Search records by miner ID
 */
export function searchByMiner(minerId: string): ProvenanceRecord[] {
  const recordIds = minerRecords.get(minerId) || [];
  return recordIds
    .map(id => provenanceStore.get(id))
    .filter((record): record is ProvenanceRecord => record !== undefined);
}

/**
 * Search records by type
 */
export function searchByType(type: ProvenanceType): ProvenanceRecord[] {
  const recordIds = typeRecords.get(type) || [];
  return recordIds
    .map(id => provenanceStore.get(id))
    .filter((record): record is ProvenanceRecord => record !== undefined);
}

/**
 * Get all records with optional filters
 */
export function getRecords(filters?: {
  minerId?: string;
  type?: ProvenanceType;
  startTime?: number;
  endTime?: number;
  limit?: number;
  offset?: number;
}): {
  records: ProvenanceRecord[];
  total: number;
  hasMore: boolean;
} {
  let records = Array.from(provenanceStore.values());
  
  // Apply filters
  if (filters?.minerId) {
    records = records.filter(r => r.minerId === filters.minerId);
  }
  
  if (filters?.type) {
    records = records.filter(r => r.type === filters.type);
  }
  
  if (filters?.startTime) {
    records = records.filter(r => r.timestamp >= filters.startTime!);
  }
  
  if (filters?.endTime) {
    records = records.filter(r => r.timestamp <= filters.endTime!);
  }
  
  // Sort by timestamp (newest first)
  records.sort((a, b) => b.timestamp - a.timestamp);
  
  // Calculate pagination
  const offset = filters?.offset || 0;
  const limit = filters?.limit || records.length;
  const total = records.length;
  const paginatedRecords = records.slice(offset, offset + limit);
  
  return {
    records: paginatedRecords,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Get single record by ID
 */
export function getRecordById(recordId: string): ProvenanceRecord | null {
  return provenanceStore.get(recordId) || null;
}

/**
 * Get recent records
 */
export function getRecentRecords(limit: number = 10): ProvenanceRecord[] {
  const records = Array.from(provenanceStore.values());
  records.sort((a, b) => b.timestamp - a.timestamp);
  return records.slice(0, limit);
}

// ============================================
// Verification
// ============================================

/**
 * Verify a provenance record
 */
export async function verifyRecord(recordId: string): Promise<VerificationResult> {
  const record = provenanceStore.get(recordId);
  
  if (!record) {
    return {
      valid: false,
      recordId,
      arweaveId: '',
      dataHash: '',
      computedHash: '',
      chainValid: false,
      signatureValid: false,
    };
  }
  
  // For demo, simulate verification
  // In production, use real Arweave verification
  return {
    valid: true,
    recordId: record.id,
    arweaveId: record.arweaveId,
    dataHash: record.dataHash,
    computedHash: record.dataHash,
    chainValid: true,
    signatureValid: true,
  };
}

/**
 * Verify complete provenance chain for a record
 */
export async function verifyChain(recordId: string): Promise<{
  valid: boolean;
  chain: VerificationResult[];
  missingLinks: string[];
}> {
  const record = provenanceStore.get(recordId);
  
  if (!record) {
    return {
      valid: false,
      chain: [],
      missingLinks: [recordId],
    };
  }
  
  const chain: VerificationResult[] = [];
  const missingLinks: string[] = [];
  const visited = new Set<string>();
  
  // Build chain from record to root
  let currentRecord: ProvenanceRecord | null = record;
  
  while (currentRecord && !visited.has(currentRecord.id)) {
    visited.add(currentRecord.id);
    
    const verification = await verifyRecord(currentRecord.id);
    chain.push(verification);
    
    if (!verification.valid) {
      return {
        valid: false,
        chain,
        missingLinks: [currentRecord.id],
      };
    }
    
    // Move to previous record in chain
    if (currentRecord.previousRecords.length > 0) {
      const prevRecordId = currentRecord.previousRecords[0];
      const prevRecord = provenanceStore.get(prevRecordId);
      
      if (prevRecord) {
        currentRecord = prevRecord;
      } else {
        missingLinks.push(prevRecordId);
        currentRecord = null;
      }
    } else {
      currentRecord = null;
    }
  }
  
  return {
    valid: missingLinks.length === 0,
    chain,
    missingLinks,
  };
}

// ============================================
// Statistics
// ============================================

/**
 * Get provenance statistics
 */
export function getStatistics(): {
  totalRecords: number;
  computeRecords: number;
  proofRecords: number;
  reasoningRecords: number;
  uniqueMiners: number;
  recordsByMiner: Record<string, number>;
} {
  const records = Array.from(provenanceStore.values());
  
  const computeRecords = records.filter(r => r.type === 'compute').length;
  const proofRecords = records.filter(r => r.type === 'proof').length;
  const reasoningRecords = records.filter(r => r.type === 'reasoning').length;
  
  const uniqueMiners = new Set(records.map(r => r.minerId)).size;
  
  const recordsByMiner: Record<string, number> = {};
  records.forEach(r => {
    recordsByMiner[r.minerId] = (recordsByMiner[r.minerId] || 0) + 1;
  });
  
  return {
    totalRecords: records.length,
    computeRecords,
    proofRecords,
    reasoningRecords,
    uniqueMiners,
    recordsByMiner,
  };
}

// ============================================
// Digital Signatures (Simplified)
// ============================================

/**
 * Create a digital signature for a record
 */
async function createSignature(data: SignatureData): Promise<string> {
  // In production, use real cryptographic signing
  // For demo, create a simple hash-based signature
  const crypto = require('crypto');
  
  const signatureData = JSON.stringify(data);
  const signature = crypto
    .createHmac('sha256', 'provenance-secret')
    .update(signatureData)
    .digest('hex');
  
  return `sig-${signature}`;
}

/**
 * Verify a digital signature
 */
async function verifySignature(
  record: ProvenanceRecord,
  expectedData: SignatureData
): Promise<boolean> {
  // In production, use real cryptographic verification
  // For demo, just check that signature exists and has correct format
  return record.signature.startsWith('sig-');
}

// ============================================
// Data Export
// ============================================

/**
 * Export provenance data for backup/audit
 */
export function exportData(): {
  records: ProvenanceRecord[];
  minerIndex: Record<string, string[]>;
  typeIndex: Record<string, string[]>;
  exportedAt: number;
} {
  const minerIndex: Record<string, string[]> = {};
  const typeIndex: Record<string, string[]> = {};
  
  minerRecords.forEach((ids, minerId) => {
    minerIndex[minerId] = [...ids];
  });
  
  typeRecords.forEach((ids, type) => {
    typeIndex[type] = [...ids];
  });
  
  return {
    records: Array.from(provenanceStore.values()),
    minerIndex,
    typeIndex,
    exportedAt: Date.now(),
  };
}

/**
 * Import provenance data from backup
 */
export function importData(data: {
  records: ProvenanceRecord[];
  minerIndex: Record<string, string[]>;
  typeIndex: Record<string, string[]>;
}): void {
  // Clear existing data
  provenanceStore.clear();
  minerRecords.clear();
  typeRecords.clear();
  
  // Import records
  data.records.forEach(record => {
    provenanceStore.set(record.id, record);
  });
  
  // Import indexes
  Object.entries(data.minerIndex).forEach(([minerId, ids]) => {
    minerRecords.set(minerId, [...ids]);
  });
  
  Object.entries(data.typeIndex).forEach(([type, ids]) => {
    typeRecords.set(type, [...ids]);
  });
  
  console.log('✅ Imported', data.records.length, 'provenance records');
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generate a unique miner ID
 */
export function generateMinerId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `miner-${timestamp}-${randomPart}`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Get relative time string
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

/**
 * Get type display name
 */
export function getTypeDisplayName(type: ProvenanceType): string {
  const names: Record<ProvenanceType, string> = {
    compute: '💻 Compute',
    proof: '🔐 Proof',
    reasoning: '🧠 Reasoning',
  };
  return names[type];
}

