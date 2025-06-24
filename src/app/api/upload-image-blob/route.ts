// app/api/upload-image-blob/route.ts
// Alternative using Vercel Blob Storage (recommended for production)

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting image upload process...');
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      console.error('No image file provided in form data');
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    console.log('Received file:', {
      type: file.type,
      size: file.size,
      name: file.name
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return NextResponse.json({ error: 'File too large. Max size is 10MB' }, { status: 400 });
    }

    // Use the filename from the form data or generate one if not provided
    const providedFilename = file.name;
    const extension = providedFilename.split('.').pop() || 'png';
    
    // If the filename looks like it was auto-generated (has timestamp), use it as is
    // Otherwise, use the provided filename
    const filename = providedFilename.includes('farcaster-card-') ? 
      providedFilename : 
      `farcaster-card-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${extension}`;
    
    console.log('Checking if file already exists:', filename);

    // Check if file already exists in Vercel Blob
    try {
      const { head } = await import('@vercel/blob');
      const existingBlob = await head(filename);
      
      if (existingBlob) {
        console.log('File already exists, returning existing URL:', existingBlob.url);
        return NextResponse.json({ 
          url: existingBlob.url,
          filename: filename,
          size: existingBlob.size,
          cached: true
        });
      }
    } catch (headError) {
      // File doesn't exist, continue with upload
      console.log(headError,'File does not exist, proceeding with upload');
    }
    
    console.log('Attempting to upload to Vercel Blob:', filename);

    // Upload to Vercel Blob
    try {
      const blob = await put(filename, file, {
        access: 'public',
        contentType: file.type,
      });
      
      console.log('Successfully uploaded to Vercel Blob:', blob.url);
      
      return NextResponse.json({ 
        url: blob.url,
        filename: filename,
        size: file.size,
        cached: false
      });
    } catch (blobError) {
      console.error('Vercel Blob upload error:', {
        error: blobError,
        message: blobError instanceof Error ? blobError.message : 'Unknown error',
        stack: blobError instanceof Error ? blobError.stack : undefined
      });
      
      return NextResponse.json(
        { error: `Blob upload failed: ${blobError instanceof Error ? blobError.message : 'Unknown error'}` }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('General upload error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}` }, 
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