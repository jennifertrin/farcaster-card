// app/api/upload-image-blob/route.ts
// Alternative using Vercel Blob Storage (recommended for production)

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Max size is 10MB' }, { status: 400 });
    }

    // Create filename with timestamp to avoid collisions
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'png';
    const filename = `farcaster-card-${timestamp}-${randomId}.${extension}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });
    
    console.log('Image uploaded to Vercel Blob:', blob.url);
    
    return NextResponse.json({ 
      url: blob.url,
      filename: filename,
      size: file.size
    });
    
  } catch (error) {
    console.error('Blob upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image to blob storage' }, 
      { status: 500 }
    );
  }
}

// Optional: Delete endpoint to clean up old images
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }
    
    // Extract the blob pathname from the full URL
    const { del } = await import('@vercel/blob');
    await del(url);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Blob deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' }, 
      { status: 500 }
    );
  }
}