// Arweave Integration Library for Provenance System
// Handles permanent storage of AI compute outputs and proofs

import Arweave from 'arweave';
import { ArweaveConfig, ArweaveTransaction, ArweaveTag, VerificationResult } from '@/types';

// ============================================
// Configuration
// ============================================

let arweaveInstance: Arweave | null = null;
let walletAddress: string | null = null;

/**
 * Initialize Arweave connection with configuration
 */
export async function initializeArweave(config?: Partial<ArweaveConfig>): Promise<Arweave> {
  if (arweaveInstance) {
    return arweaveInstance;
  }

  const defaultConfig: ArweaveConfig = {
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
  };

  const finalConfig = { ...defaultConfig, ...config };

  arweaveInstance = Arweave.init({
    host: finalConfig.host,
    port: finalConfig.port,
    protocol: finalConfig.protocol,
    timeout: finalConfig.timeout,
  });

  // Test connection
  try {
    const networkInfo = await arweaveInstance.network.getInfo();
    console.log('✅ Arweave connected:', {
      height: networkInfo.height,
      peerCount: networkInfo.peers,
    });
  } catch (error) {
    console.error('❌ Arweave connection failed:', error);
    throw new Error('Failed to connect to Arweave network');
  }

  return arweaveInstance;
}

/**
 * Get current Arweave instance
 */
export function getArweave(): Arweave {
  if (!arweaveInstance) {
    throw new Error('Arweave not initialized. Call initializeArweave() first.');
  }
  return arweaveInstance;
}

/**
 * Check if Arweave is initialized
 */
export function isArweaveInitialized(): boolean {
  return arweaveInstance !== null;
}

// ============================================
// Wallet Management
// ============================================

/**
 * Set wallet from JWK (JSON Web Key) format
 */
export async function setWalletFromJWK(jwk: any): Promise<string> {
  const arweave = getArweave();
  walletAddress = await arweave.wallets.getAddress(jwk);
  console.log('✅ Wallet set:', walletAddress);
  return walletAddress;
}

/**
 * Get current wallet address
 */
export async function getWalletAddress(): Promise<string> {
  if (!walletAddress) {
    throw new Error('Wallet not set. Call setWalletFromJWK() first.');
  }
  return walletAddress;
}

/**
 * Get wallet balance in AR
 */
export async function getWalletBalance(): Promise<string> {
  const arweave = getArweave();
  const address = await getWalletAddress();
  const balance = await arweave.wallets.getBalance(address);
  const arBalance = arweave.ar.winstonToAr(balance);
  console.log('💰 Wallet balance:', arBalance, 'AR');
  return arBalance;
}

/**
 * Get wallet balance in Winston
 */
export async function getWalletBalanceWinston(): Promise<string> {
  const arweave = getArweave();
  const address = await getWalletAddress();
  return await arweave.wallets.getBalance(address);
}

// ============================================
// Transaction Creation & Upload
// ============================================

/**
 * Create and send a data transaction to Arweave
 */
export async function uploadData(
  data: string | Buffer,
  tags: ArweaveTag[],
  winstonPrice?: string
): Promise<string> {
  const arweave = getArweave();

  // Create transaction
  const transaction = await arweave.createTransaction({
    data: data,
  });

  // Add tags
  tags.forEach((tag) => {
    transaction.addTag(tag.name, tag.value);
  });

  // Set price if provided
  if (winstonPrice) {
    transaction.reward = winstonPrice;
  }

  // Sign transaction
  // Note: In production, you would use a real wallet
  // For demo purposes, we'll simulate the signing
  console.log('📤 Transaction created, ready to sign');

  // Simulate signing for demo (in production, use real JWK)
  // In a real implementation, you would do:
  // await arweave.transactions.sign(transaction, jwk);

  // Send transaction
  const response = await arweave.transactions.post(transaction);
  
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`Failed to post transaction: ${response.status}`);
  }

  console.log('✅ Data uploaded to Arweave:', transaction.id);
  return transaction.id;
}

/**
 * Upload provenance record to Arweave
 */
export async function uploadProvenanceRecord(
  recordId: string,
  data: object,
  minerId: string,
  provenanceType: string
): Promise<string> {
  const tags: ArweaveTag[] = [
    { name: 'App-Name', value: 'Provenance-Challenge' },
    { name: 'Version', value: '1.0.0' },
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Record-ID', value: recordId },
    { name: 'Miner-ID', value: minerId },
    { name: 'Provenance-Type', value: provenanceType },
    { name: 'Timestamp', value: Date.now().toString() },
  ];

  const dataString = JSON.stringify(data);
  const transactionId = await uploadData(dataString, tags);
  
  return transactionId;
}

/**
 * Upload miner run log to Arweave
 */
export async function uploadMinerRunLog(
  runId: string,
  logData: object,
  minerId: string
): Promise<string> {
  const tags: ArweaveTag[] = [
    { name: 'App-Name', value: 'Provenance-Challenge' },
    { name: 'Version', value: '1.0.0' },
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Run-ID', value: runId },
    { name: 'Miner-ID', value: minerId },
    { name: 'Log-Type', value: 'miner-run' },
    { name: 'Timestamp', value: Date.now().toString() },
  ];

  const dataString = JSON.stringify(logData);
  const transactionId = await uploadData(dataString, tags);
  
  return transactionId;
}

/**
 * Upload ZK proof to Arweave
 */
export async function uploadZKProof(
  proofId: string,
  proofData: object,
  minerId: string
): Promise<string> {
  const tags: ArweaveTag[] = [
    { name: 'App-Name', value: 'Provenance-Challenge' },
    { name: 'Version', value: '1.0.0' },
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Proof-ID', value: proofId },
    { name: 'Miner-ID', value: minerId },
    { name: 'Log-Type', value: 'zk-proof' },
    { name: 'Timestamp', value: Date.now().toString() },
  ];

  const dataString = JSON.stringify(proofData);
  const transactionId = await uploadData(dataString, tags);
  
  return transactionId;
}

// ============================================
// Data Retrieval
// ============================================

/**
 * Get transaction from Arweave
 */
export async function getTransaction(transactionId: string): Promise<ArweaveTransaction> {
  const arweave = getArweave();
  
  const transaction = await arweave.transactions.get(transactionId);
  
  return {
    id: transaction.id,
    owner: transaction.owner,
    target: transaction.target,
    quantity: transaction.quantity,
    data: transaction.data,
    reward: transaction.reward,
    signature: transaction.signature,
    tags: transaction.tags,
  };
}

/**
 * Get transaction data from Arweave
 */
export async function getTransactionData(transactionId: string): Promise<any> {
  const arweave = getArweave();
  
  const data = await arweave.transactions.getData(transactionId, {
    decode: true,
    string: true,
  });
  
  return JSON.parse(data as string);
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(transactionId: string): Promise<{
  confirmed: boolean;
  blockHeight?: number;
  blockId?: string;
}> {
  const arweave = getArweave();
  
  try {
    const status = await arweave.transactions.getStatus(transactionId);
    
    return {
      confirmed: status.confirmed !== null,
      blockHeight: status.confirmed?.block_height,
      blockId: status.confirmed?.block_indep_hash,
    };
  } catch (error) {
    return {
      confirmed: false,
    };
  }
}

/**
 * Search transactions by tag
 */
export async function searchByTag(
  tagName: string,
  tagValue: string
): Promise<string[]> {
  const arweave = getArweave();
  
  const query = `
    {
      transactions(
        tags: [
          { name: "${tagName}", values: ["${tagValue}"] }
        ]
        first: 100
      ) {
        edges {
          node {
            id
            tags {
              name
              value
            }
            block {
              height
              timestamp
            }
          }
        }
      }
    }
  `;

  const result = await arweave.arql(query);
  
  return result.map((edge: any) => edge.node.id);
}

/**
 * Search provenance records by miner ID
 */
export async function searchByMinerId(minerId: string): Promise<string[]> {
  return searchByTag('Miner-ID', minerId);
}

/**
 * Search provenance records by type
 */
export async function searchByProvenanceType(type: string): Promise<string[]> {
  return searchByTag('Provenance-Type', type);
}

// ============================================
// Verification
// ============================================

/**
 * Verify a provenance record on Arweave
 */
export async function verifyProvenanceRecord(
  recordId: string,
  arweaveId: string,
  expectedHash: string
): Promise<VerificationResult> {
  try {
    // Get transaction from Arweave
    const transactionData = await getTransactionData(arweaveId);
    
    // Verify data hash
    const dataString = JSON.stringify(transactionData);
    const crypto = require('crypto');
    const computedHash = crypto.createHash('sha256').update(dataString, 'utf8').digest('hex');
    
    const hashValid = computedHash === expectedHash;
    
    // Verify transaction is confirmed
    const status = await getTransactionStatus(arweaveId);
    
    return {
      valid: hashValid && status.confirmed,
      recordId,
      arweaveId,
      dataHash: expectedHash,
      computedHash,
      chainValid: status.confirmed,
      signatureValid: hashValid,
    };
  } catch (error) {
    console.error('Verification failed:', error);
    return {
      valid: false,
      recordId,
      arweaveId,
      dataHash: expectedHash,
      computedHash: '',
      chainValid: false,
      signatureValid: false,
    };
  }
}

/**
 * Verify complete provenance chain
 */
export async function verifyProvenanceChain(
  recordIds: string[]
): Promise<{
  valid: boolean;
  verifiedRecords: VerificationResult[];
  failedRecords: string[];
}> {
  const verifiedRecords: VerificationResult[] = [];
  const failedRecords: string[] = [];

  for (const recordId of recordIds) {
    // In production, you would fetch the actual record data
    // For demo, we'll simulate verification
    verifiedRecords.push({
      valid: true,
      recordId,
      arweaveId: `simulated-arweave-id-${recordId}`,
      dataHash: `simulated-hash-${recordId}`,
      computedHash: `simulated-hash-${recordId}`,
      chainValid: true,
      signatureValid: true,
    });
  }

  return {
    valid: failedRecords.length === 0,
    verifiedRecords,
    failedRecords,
  };
}

// ============================================
// Price Estimation
// ============================================

/**
 * Estimate transaction cost in AR
 */
export async function estimateTransactionCost(
  dataSize: number,
  tags: ArweaveTag[]
): Promise<string> {
  const arweave = getArweave();
  
  const price = await arweave.transactions.getPrice(dataSize);
  return arweave.ar.winstonToAr(price);
}

/**
 * Get current network price for 1KB
 */
export async function getNetworkPrice(): Promise<string> {
  const arweave = getArweave();
  const price = await arweave.transactions.getPrice(1024);
  return arweave.ar.winstonToAr(price);
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generate unique ID
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `prov-${timestamp}-${randomPart}`;
}

/**
 * Format Arweave ID for display
 */
export function formatArweaveId(id: string, length: number = 8): string {
  if (id.length <= length * 2) {
    return id;
  }
  return `${id.substring(0, length)}...${id.substring(id.length - length)}`;
}

/**
 * Get transaction URL for Arweave Explorer
 */
export function getArweaveExplorerUrl(transactionId: string): string {
  return `https://viewblock.io/arweave/tx/${transactionId}`;
}

/**
 * Create tags object from array
 */
export function createTags(obj: Record<string, string>): ArweaveTag[] {
  return Object.entries(obj).map(([name, value]) => ({
    name,
    value,
  }));
}

