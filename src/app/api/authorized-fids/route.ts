// app/api/authorized-fids/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log('API route called: /api/authorized-fids');
    
    // Try multiple possible paths for the CSV file
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'prousers_first10k.csv'),  // Check public folder first
      path.join(process.cwd(), 'data', 'prousers_first10k.csv'),
      path.join(process.cwd(), 'prousers_first10k.csv'),
    ];
    
    let csvPath: string | null = null;
    
    for (const testPath of possiblePaths) {
      console.log('Checking path:', testPath);
      if (fs.existsSync(testPath)) {
        csvPath = testPath;
        console.log('Found CSV at:', csvPath);
        break;
      }
    }
    
    if (!csvPath) {
      console.log('CSV file not found in any of the expected locations');
      return NextResponse.json(
        { 
          error: 'Authorized users file not found',
          searchedPaths: possiblePaths,
          cwd: process.cwd()
        },
        { status: 404 }
      );
    }

    // Read the CSV file
    console.log('Reading CSV file...');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    console.log('CSV content length:', csvContent.length);
    
    // Parse CSV to extract FIDs
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('CSV headers:', headers);
    
    const fidIndex = headers.indexOf('fid');
    
    if (fidIndex === -1) {
      console.log('FID column not found. Available headers:', headers);
      return NextResponse.json(
        { 
          error: 'FID column not found in CSV',
          availableHeaders: headers
        },
        { status: 500 }
      );
    }
    
    const fids: number[] = [];
    
    // Process each line (skip header)
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
    
    console.log(`Successfully parsed ${fids.length} FIDs`);
    
    // Return the FIDs array
    return NextResponse.json({
      fids,
      count: fids.length,
      success: true
    });
    
  } catch (error) {
    console.error('Error reading authorized FIDs:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load authorized users',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}