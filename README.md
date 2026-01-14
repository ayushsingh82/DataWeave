# DataWeave - Powered by Arweave

## Best Provenance Architecture Award

This project demonstrates **transparent provenance for decentralized AI work** by building an immutable, permanent storage system for AI compute outputs and proofs using Arweave.

## Project Overview

DataWeave focuses on creating a **transparent and immutable proof record system** for decentralized AI work. This solution establishes:
- **Immutable audit trails** for AI compute outputs
- **Permanent storage** of miner/zk proof logs
- **Verifiable attribution** of AI reasoning outputs
- **Foundation for future agent audit trails**

## Key Features

### 1. AI Compute Provenance
- Store AI model outputs, training logs, and inference results permanently
- Link each compute job to its source data, model version, and timestamp
- Create immutable records of AI decision-making processes

### 2. Miner Simulation Integration
- Simulate decentralized AI miner operations
- Log miner runs with full context (inputs, outputs, computation time)
- Store reasoning chains and intermediate states

### 3. Zero-Knowledge Proof Storage
- Store zk-proofs and verification results
- Maintain proof chains for auditability
- Enable verification of AI computation integrity

### 4. Indexing & Query System
- Efficiently index stored provenance records
- Support search by miner ID, timestamp, computation type
- Enable retrieval of complete provenance chains

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DataWeave Pipeline                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │
│   │   AI/Miner  │────▶│   Arweave   │────▶│   Indexing  │              │
│   │   Compute   │     │   Storage   │     │   Service   │              │
│   └─────────────┘     └─────────────┘     └─────────────┘              │
│         │                    │                     │                    │
│         │                    │                     │                    │
│         ▼                    ▼                     ▼                    │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │
│   │ ZK Proofs   │     │  Immutable  │     │  Query API  │              │
│   │ Generator   │     │   Records   │     │  & Search   │              │
│   └─────────────┘     └─────────────┘     └─────────────┘              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

## DataWeave Workflow

### Overview

The DataWeave system follows a six-step process from user interaction to permanent storage and verification.

### Step 1: Miner Simulation

**User Interface Actions:**
- Select miner (reasoner-alpha, proof-generator, etc.)
- Choose computation type (inference, training, reasoning)
- Configure input parameters
- Click "Start Simulation"

**Output:** Configuration ready for processing

---

### Step 2: Compute Execution & ZK Proof Generation

**Processing:**
- Execute AI computation
- Generate reasoning outputs
- Create zero-knowledge proof
- Calculate data hash (SHA-256)
- Collect metadata (model, version, timestamps)

**Output:** Computation results with ZK proof and hash

---

### Step 3: Provenance Record Creation

**Record Structure:**
- Generate unique record ID
- Create metadata object containing:
  - `minerId`: source miner identifier
  - `type`: compute | proof | reasoning
  - `timestamp`: Unix timestamp
  - `inputs`: array of input data
  - `outputs`: array of output data
  - `reasoning`: reasoning chain text
  - `dataHash`: SHA-256 hash of data
  - `previousRecords`: array of linked record IDs
  - `signature`: digital signature

**Output:** Complete provenance record with all metadata

---

### Step 4: Arweave Upload (Permanent Storage)

**Arweave Transaction:**
- Create transaction with record data
- Add transaction tags:
  - `App-Name`: "DataWeave"
  - `Miner-ID`: `<minerId>`
  - `Provenance-Type`: `<type>`
  - `Timestamp`: `<timestamp>`
- Sign transaction with wallet
- Upload to Arweave network
- Receive unique transaction ID (`arweaveId`)
- Data stored **PERMANENTLY** on permaweb

**Output:** Arweave transaction ID for permanent record

---

### Step 5: Indexing & Query System

**Indexing:**
- Index record by `minerId`
- Index record by `type`
- Index record by `timestamp`
- Store in-memory index (or database)

**Query Capabilities:**
- Search by miner ID
- Filter by type (compute/proof/reasoning)
- Time range queries
- Provenance chain traversal
- Full-text search on reasoning/metadata

**Output:** Indexed record available for queries

---

### Step 6: Verification & Attribution

**Verification Steps:**
- Verify data integrity (hash comparison)
- Check Arweave transaction confirmation
- Validate digital signature
- Trace provenance chain (previousRecords linking)
- Verify ZK proof validity

**Attribution:**
- Clear miner ownership
- Timestamp verification
- View on Arweave Explorer: `viewblock.io/arweave/tx/<arweaveId>`

**Output:** Verified and attributed provenance record

---

### Data Flow Summary

```
User Action 
    ↓
Miner Simulation 
    ↓
Compute Execution 
    ↓
Provenance Record 
    ↓
Arweave Upload 
    ↓
Indexing 
    ↓
Verification
```

**Complete Flow:** User initiates simulation → AI computation executes → Provenance record created → Uploaded to Arweave → Indexed for queries → Verified and attributed

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Arweave wallet (for permanent storage)

### Installation

```bash
# Navigate to project directory
cd my-app

# Install dependencies
npm install

# Install Arweave SDK
npm install arweave

# Install additional dependencies for UI
npm install lucide-react
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```



## Core Components

### Arweave Integration (`lib/arweave.ts`)
- Initialize Arweave connection
- Create transactions for provenance records
- Upload data to permanent storage
- Retrieve and verify stored records

### Provenance System (`lib/provenance.ts`)
- Create provenance records for AI compute
- Link records in chains for verification
- Index records for efficient querying
- Maintain metadata for attribution

### Miner Simulation (`lib/miner.ts`)
- Simulate AI miner operations
- Generate compute outputs with metadata
- Create reasoning logs
- Prepare data for permanent storage

### ZK Proof Utilities (`lib/zkproof.ts`)
- Generate zero-knowledge proofs
- Store proof metadata
- Verify proof chains
- Maintain proof provenance

## Data Schema

### Provenance Record
```typescript
interface ProvenanceRecord {
  id: string;              // Unique identifier
  type: 'compute' | 'proof' | 'reasoning';
  minerId: string;         // Source miner
  timestamp: number;       // Unix timestamp
  dataHash: string;        // Hash of stored data
  arweaveId: string;       // Arweave transaction ID
  metadata: {
    modelVersion?: string;
    computationType: string;
    inputs: string[];
    outputs: string[];
    reasoning?: string;
  };
  previousRecords: string[]; // Linked provenance chain
  signature: string;         // Digital signature
}
```

### Miner Run Log
```typescript
interface MinerRunLog {
  runId: string;
  minerId: string;
  startTime: number;
  endTime: number;
  inputs: any[];
  outputs: any[];
  reasoning: string;
  zkProof?: {
    proofId: string;
    proofData: string;
    verificationResult: boolean;
  };
}
```

## UI Components

### 1. Provenance Dashboard
- Real-time view of AI compute operations
- Recent provenance records display
- Arweave storage statistics

### 2. Miner Simulation Panel
- Trigger miner operations
- View reasoning outputs
- Generate ZK proofs

### 3. Search & Query Interface
- Search provenance records
- Filter by miner, timestamp, type
- View complete provenance chains

### 4. Record Viewer
- Detailed view of provenance records
- Arweave transaction verification
- Chain of custody display

## Security & Verification

- **Immutable Storage**: All records permanently stored on Arweave
- **Digital Signatures**: Cryptographic signing of provenance records
- **Hash Verification**: Data integrity through SHA-256 hashing
- **Chain Linking**: Records linked in verification chains

## API Endpoints

### POST /api/provenance
Create a new provenance record

```typescript
// Request body
{
  type: 'compute' | 'proof' | 'reasoning',
  minerId: string,
  data: any,
  metadata: ProvenanceMetadata
}

// Response
{
  success: true,
  recordId: string,
  arweaveId: string
}
```

### GET /api/provenance/[id]
Retrieve a provenance record

### GET /api/provenance/search
Search provenance records

```typescript
// Query parameters
{
  minerId?: string,
  type?: string,
  startTime?: number,
  endTime?: number
}
```

## Benefits of Arweave Provenance

1. **Permanence**: Data stored forever with no ongoing costs
2. **Tamper-Proof**: Cryptographic immutability ensures integrity
3. **Decentralization**: No single point of failure
4. **Verifiability**: Anyone can verify the provenance chain
5. **Attribution**: Clear ownership and source tracking

## Use Cases

### AI Model Training
- Log training data sources
- Record model version evolution
- Store training metrics and outputs

### Decentralized AI Inference
- Prove inference was performed
- Store reasoning chains
- Enable result verification

### ZKML Verification
- Store zero-knowledge proofs
- Maintain proof verification records
- Create audit trails for compliance

## Future Enhancements

- [ ] GraphQL API for complex queries
- [ ] Real-time WebSocket updates
- [ ] Multi-wallet support
- [ ] Batch upload optimization
- [ ] Advanced indexing with Arweave GraphQL
- [ ] Integration with decentralized AI marketplaces

## Resources

- [Arweave Documentation](https://docs.arweave.org/)
- [Arweave JS SDK](https://github.com/ArweaveTeam/arweave-js)
- [Next.js Documentation](https://nextjs.org/docs)
- [PermaWeb](https://permaweb.io/)

## Challenge Goals

This project demonstrates:
1. **Immutable AI proof storage** - Permanent records on Arweave
2. **Attribution tracking** - Clear miner/compute ownership
3. **Verifiable provenance** - Complete chains of custody
4. **Foundation for audit trails** - Platform for future agent systems

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

**Built for transparent AI provenance on Arweave**

