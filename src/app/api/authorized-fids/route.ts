// app/api/authorized-fids/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Path to your CSV file - adjust this path as needed
    const csvPath = path.join(process.cwd(), 'data', 'prousers_first10k.csv');
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: 'Authorized users file not found' },
        { status: 404 }
      );
    }

    // Read the CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV to extract FIDs
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const fidIndex = headers.indexOf('fid');
    
    if (fidIndex === -1) {
      return NextResponse.json(
        { error: 'FID column not found in CSV' },
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
    
    // Return the FIDs array
    return NextResponse.json({
      fids,
      count: fids.length
    });
    
  } catch (error) {
    console.error('Error reading authorized FIDs:', error);
    return NextResponse.json(
      { error: 'Failed to load authorized users' },
      { status: 500 }
    );
  }
}