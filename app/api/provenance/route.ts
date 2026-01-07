import { NextRequest, NextResponse } from 'next/server';
import { createProvenanceRecord, getRecords, getRecentRecords } from '@/lib/provenance';
import { CreateProvenanceRequest, ProvenanceType } from '@/types';

// ============================================
// GET - Search/Query Provenance Records
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const filters = {
      minerId: searchParams.get('minerId') || undefined,
      type: searchParams.get('type') as ProvenanceType | undefined,
      startTime: searchParams.get('startTime') 
        ? parseInt(searchParams.get('startTime')!) 
        : undefined,
      endTime: searchParams.get('endTime') 
        ? parseInt(searchParams.get('endTime')!) 
        : undefined,
      limit: searchParams.get('limit') 
        ? parseInt(searchParams.get('limit')!) 
        : 50,
      offset: searchParams.get('offset') 
        ? parseInt(searchParams.get('offset')!) 
        : 0,
    };
    
    // Get records
    const result = getRecords(filters);
    
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error searching provenance records:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search provenance records',
        records: [],
        total: 0,
        hasMore: false,
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create New Provenance Record
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: CreateProvenanceRequest = await request.json();
    
    // Validate request body
    if (!body.type || !body.minerId || !body.data || !body.metadata) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, minerId, data, metadata',
        },
        { status: 400 }
      );
    }
    
    // Validate type
    if (!['compute', 'proof', 'reasoning'].includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid type. Must be: compute, proof, or reasoning',
        },
        { status: 400 }
      );
    }
    
    // Validate metadata
    if (!body.metadata.computationType || !body.metadata.inputs || !body.metadata.outputs) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required metadata fields: computationType, inputs, outputs',
        },
        { status: 400 }
      );
    }
    
    // Create provenance record
    const result = await createProvenanceRecord(body);
    
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to create provenance record',
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      recordId: result.recordId,
      arweaveId: result.arweaveId,
      dataHash: result.dataHash,
      timestamp: result.timestamp,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating provenance record:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

