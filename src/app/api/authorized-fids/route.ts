// app/api/authorized-fids/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// In-memory cache
let cachedFids: number[] | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET() {
  try {
    console.log('API route called: /api/authorized-fids');
    
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedFids && (now - lastCacheTime) < CACHE_DURATION) {
      console.log('Returning cached FIDs');
      return new NextResponse(JSON.stringify({ fids: cachedFids }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // 5 minutes browser caching
        },
      });
    }
    
    // Try multiple possible paths for the CSV file
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'prousers_first10k.csv'),
      path.join(process.cwd(), 'data', 'prousers_first10k.csv'),
      path.join(process.cwd(), 'prousers_first10k.csv'),
    ];
    
    let csvPath: string | null = null;
    
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        csvPath = testPath;
        break;
      }
    }
    
    if (!csvPath) {
      return NextResponse.json(
        { error: 'Authorized users file not found' },
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const fidIndex = headers.indexOf('fid');
    
    if (fidIndex === -1) {
      return NextResponse.json(
        { error: 'FID column not found in CSV' },
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }
    
    const fids: number[] = [];
    
    // Parse FIDs from CSV
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const columns = line.split(',');
        const fid = parseInt(columns[fidIndex]);
        if (!isNaN(fid)) {
          fids.push(fid);
        }
      }
    }

    // Update cache
    cachedFids = fids;
    lastCacheTime = now;

    return new NextResponse(JSON.stringify({ fids }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minutes browser caching
      },
    });

  } catch (error) {
    console.error('Error in /api/authorized-fids:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}