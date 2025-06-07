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
  authenticate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Minimal client-side SDK interaction
      if (!sdk?.actions?.quickAuth) {
        throw new Error('Farcaster SDK not available');
      }

      await sdk.actions.ready();
      const { token } = await sdk.actions.quickAuth();

      console.log('token', token);
      
      if (!token) {
        throw new Error('No token received');
      }

      // Send to server for verification and session creation
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Authentication failed');
      }

      const userData = await response.json();
      setAuthData(userData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
      setAuthData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const userData = await response.json();
          setAuthData(userData);
        }
      } catch (error) {
        // No existing session, that's fine
        console.log('No existing session');
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ authData, isLoading, error, authenticate }}>
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