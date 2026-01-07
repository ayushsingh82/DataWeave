import { NextRequest, NextResponse } from 'next/server';
import { getRecordById, verifyChain } from '@/lib/provenance';

// ============================================
// GET - Retrieve Single Provenance Record
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Record ID is required',
          record: null,
        },
        { status: 400 }
      );
    }
    
    // Get record by ID
    const record = getRecordById(id);
    
    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: 'Record not found',
          record: null,
        },
        { status: 404 }
      );
    }
    
    // Get chain verification if requested
    const searchParams = request.nextUrl.searchParams;
    const verifyChainParam = searchParams.get('verifyChain') === 'true';
    
    let chainVerification = null;
    if (verifyChainParam) {
      chainVerification = await verifyChain(id);
    }
    
    return NextResponse.json({
      success: true,
      record,
      chainVerification,
    });
    
  } catch (error) {
    console.error('Error retrieving provenance record:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve provenance record',
        record: null,
      },
      { status: 500 }
    );
  }
}

