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
    
    // Get the domain from the request headers
    const domain = request.headers.get('host') || '';
    
    // Verify the JWT token
    const payload = await client.verifyJwt({ token, domain });
    
    // Return only the necessary data
    return NextResponse.json({
      sub: payload.sub,
      address: payload.address
    });
  } catch (error) {
    console.error('Authentication failed:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 