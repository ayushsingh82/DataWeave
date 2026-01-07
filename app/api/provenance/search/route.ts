import { NextRequest, NextResponse } from 'next/server';
import { searchByMiner, searchByType, getRecords, getStatistics } from '@/lib/provenance';
import { ProvenanceType } from '@/types';

// ============================================
// GET - Advanced Search for Provenance Records
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get search parameters
    const minerId = searchParams.get('minerId') || undefined;
    const type = searchParams.get('type') as ProvenanceType | undefined;
    const startTime = searchParams.get('startTime') 
      ? parseInt(searchParams.get('startTime')!) 
      : undefined;
    const endTime = searchParams.get('endTime') 
      ? parseInt(searchParams.get('endTime')!) 
      : undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'timestamp';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Get records based on filters
    const result = getRecords({
      minerId,
      type,
      startTime,
      endTime,
      limit,
      offset,
    });
    
    // Sort records if needed
    if (sortBy !== 'timestamp' || sortOrder !== 'desc') {
      const sortedRecords = result.records.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'minerId':
            comparison = a.minerId.localeCompare(b.minerId);
            break;
          case 'type':
            comparison = a.type.localeCompare(b.type);
            break;
          case 'timestamp':
          default:
            comparison = a.timestamp - b.timestamp;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
      
      result.records = sortedRecords;
    }
    
    return NextResponse.json({
      success: true,
      ...result,
      filters: {
        minerId,
        type,
        startTime,
        endTime,
      },
      sorting: {
        sortBy,
        sortOrder,
      },
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
// POST - Advanced Search with Body
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      minerId,
      type,
      startTime,
      endTime,
      tags,
      limit = 50,
      offset = 0,
      sortBy = 'timestamp',
      sortOrder = 'desc',
    } = body;
    
    // Get records based on filters
    const result = getRecords({
      minerId,
      type,
      startTime,
      endTime,
      limit,
      offset,
    });
    
    // Filter by tags if provided
    let filteredRecords = result.records;
    if (tags && tags.length > 0) {
      filteredRecords = filteredRecords.filter(record => 
        record.metadata.tags?.some(tag => tags.includes(tag))
      );
    }
    
    // Sort records if needed
    if (sortBy !== 'timestamp' || sortOrder !== 'desc') {
      filteredRecords = filteredRecords.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'minerId':
            comparison = a.minerId.localeCompare(b.minerId);
            break;
          case 'type':
            comparison = a.type.localeCompare(b.type);
            break;
          case 'timestamp':
          default:
            comparison = a.timestamp - b.timestamp;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    return NextResponse.json({
      success: true,
      records: filteredRecords,
      total: filteredRecords.length,
      hasMore: offset + filteredRecords.length < result.total,
      filters: {
        minerId,
        type,
        startTime,
        endTime,
        tags,
      },
      sorting: {
        sortBy,
        sortOrder,
      },
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

