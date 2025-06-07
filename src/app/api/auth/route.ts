import { NextResponse } from 'next/server';
import { createClient } from '@farcaster/quick-auth';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Create the client for JWT verification
    const client = createClient();
    
    // Get the domain - prefer environment variable, fallback to host header
    let domain = process.env.NEXT_PUBLIC_DOMAIN || process.env.VERCEL_URL;
    
    if (!domain) {
      const host = request.headers.get('host');
      if (host) {
        // Remove port if present (for local development)
        domain = host.split(':')[0];
        
        // For localhost, you might need to use the full host including port
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
          domain = host;
        }
      }
    }
    
    if (!domain) {
      console.error('No domain found for JWT verification');
      return NextResponse.json(
        { error: 'Domain configuration error' },
        { status: 500 }
      );
    }

    console.log(`Verifying JWT with domain: ${domain}`);
    
    // Verify the JWT token
    const payload = await client.verifyJwt({ token, domain });
    
    console.log('JWT verification successful:', { sub: payload.sub, address: payload.address });
    
    // Return only the necessary data
    return NextResponse.json({
      sub: payload.sub,
      address: payload.address,
      // Add any other fields you need from the payload
    });
  } catch (error) {
    console.error('Authentication failed:', error);
    
    // Provide more specific error messages for debugging
    let errorMessage = 'Authentication failed';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Common JWT verification errors
      if (error.message.includes('Invalid token')) {
        errorMessage = 'Invalid authentication token';
      } else if (error.message.includes('Token expired')) {
        errorMessage = 'Authentication token expired';
      } else if (error.message.includes('Invalid domain')) {
        errorMessage = 'Domain mismatch in authentication';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}

// Optional: Add a GET endpoint to check authentication status
export async function GET() {
  return NextResponse.json({ message: 'Auth endpoint is working' });
}