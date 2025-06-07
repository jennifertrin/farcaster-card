'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sdk } from '@farcaster/frame-sdk';

interface AuthData {
  sub: number;
  address: string;
}

interface AuthContextType {
  authData: AuthData | null;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize SDK and handle auth when the provider mounts
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Check if SDK is available
        if (!sdk || !sdk.actions) {
          throw new Error('Farcaster SDK not available');
        }

        // Initialize the SDK
        await sdk.actions.ready();
        
        // Check if quickAuth is available before calling
        if (!sdk.actions.quickAuth || typeof sdk.actions.quickAuth !== 'function') {
          throw new Error('quickAuth method not available on SDK');
        }
        
        // Get the auth result from Farcaster SDK with proper error handling
        let authResult;
        try {
          authResult = await sdk.actions.quickAuth();
        } catch (sdkError) {
          console.error('SDK quickAuth error:', sdkError);
          throw new Error(`SDK authentication failed: ${sdkError instanceof Error ? sdkError.message : 'Unknown SDK error'}`);
        }
        
        // Check if we got any result at all
        if (!authResult) {
          throw new Error('No response from authentication service');
        }
        
        // Handle different possible response structures
        let token: string;
        if (authResult && typeof authResult === 'object') {
          // Log the actual structure to help debug
          console.log('Auth result structure:', authResult);
          
          // Check if token is directly on the result
          if ('token' in authResult && authResult.token) {
            token = authResult.token as string;
          }
          // // Check if token is nested in a result property
          // else if ('result' in authResult && authResult.result && typeof authResult.result === 'object' && 'token' in authResult.result) {
          //   token = (authResult.result as any).token;
          // }
          // // Check other common patterns
          // else if ('data' in authResult && authResult.data && typeof authResult.data === 'object' && 'token' in authResult.data) {
          //   token = (authResult.data as any).token;
          // }
          // Check if the entire result is the token
          else if (typeof authResult === 'string') {
            token = authResult;
          }
          else {
            console.log('Unexpected auth result structure:', JSON.stringify(authResult, null, 2));
            throw new Error('Token not found in authentication response');
          }
        } else if (typeof authResult === 'string') {
          // Sometimes the result might be the token directly
          token = authResult;
        } else {
          throw new Error('Invalid authentication response format');
        }

        if (!token) {
          throw new Error('No authentication token received');
        }
        
        // Send token to our backend API for verification
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          let errorMessage = 'Authentication failed';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            // If response.json() fails, use the default error message
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        // Get the verified data from our backend with error handling
        let responseData;
        try {
          responseData = await response.json();
        } catch {
          throw new Error('Invalid response format from authentication API');
        }

        // Validate the response data structure
        if (!responseData || typeof responseData !== 'object') {
          throw new Error('Invalid authentication data received');
        }

        // Ensure required fields are present
        if (typeof responseData.sub !== 'number' || typeof responseData.address !== 'string') {
          throw new Error('Invalid authentication data format');
        }

        setAuthData(responseData as AuthData);
        setError(null);
      } catch (error) {
        console.error('Authentication failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        setError(errorMessage);
        setAuthData(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSDK();
  }, []);

  return (
    <AuthContext.Provider value={{ authData, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}