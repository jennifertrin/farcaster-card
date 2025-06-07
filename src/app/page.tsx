'use client';

import React, { useEffect, useState } from 'react';
import VirtualCard from "@/components/VirtualCard";
import { sdk } from '@farcaster/frame-sdk';

interface User {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  error?: boolean;
}

// Page Layout Component
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center p-8 font-sans bg-purple-50">
    <main className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold tracking-widest text-center text-purple-700 drop-shadow-sm font-league-spartan">
        Farcaster Pro<br />Membership Card
      </h1>
      {children}
    </main>
  </div>
);

// Loading Component
const LoadingState = ({ message }: { message: string }) => (
  <PageLayout>
    <div className="text-lg text-gray-600 animate-pulse">{message}</div>
  </PageLayout>
);

// Error Component
const ErrorState = ({ message }: { message: string }) => (
  <PageLayout>
    <div className="text-lg text-red-600 text-center">
      {message}
    </div>
    <VirtualCard
      membershipId="error"
      profilePicture="/placeholder-profile.png"
      memberName="Member"
      error={true}
    />
  </PageLayout>
);

// Access Denied Component
const AccessDeniedState = ({ fid }: { fid?: number }) => (
  <PageLayout>
    <div className="text-center space-y-4">
      <div className="text-xl text-red-600 font-semibold">
        Access Denied
      </div>
      <div className="text-gray-700 max-w-md">
        Sorry, your FID {fid ? `(${fid})` : ''} is not authorized to view the Pro Membership Card. 
        Only verified Pro members can access this feature.
      </div>
      <div className="text-sm text-gray-500">
        If you believe this is an error, please contact support.
      </div>
    </div>
  </PageLayout>
);

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidatingFid, setIsValidatingFid] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authorizedFids, setAuthorizedFids] = useState<Set<number>>(new Set());

  // Load authorized FIDs from API endpoint
  useEffect(() => {
    const loadAuthorizedFids = async () => {
      try {
        const response = await fetch('/api/authorized-fids');
        if (!response.ok) {
          throw new Error('Failed to fetch authorized FIDs');
        }
        
        const data = await response.json();
        const fids = new Set<number>(data.fids);
        
        setAuthorizedFids(fids);
        console.log(`Loaded ${fids.size} authorized FIDs`);
      } catch (err) {
        console.error('Failed to load authorized FIDs:', err);
        setError('Failed to load membership data. Please try again.');
      }
    };

    loadAuthorizedFids();
  }, []);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Initialize the Farcaster Frame SDK
        await sdk.actions.ready();
        
        // Wait a bit for context to be available
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const context = await sdk.context;
        
        if (context?.user) {
          setUser(context.user);
          
          // Validate FID authorization
          setIsValidatingFid(true);
          const userFid = context.user.fid;
          
          if (userFid && authorizedFids.has(userFid)) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
          
          setIsValidatingFid(false);
        } else {
          console.warn('User context not available. Are you running inside Warpcast?');
          setError('User context not available. Please make sure you are running this inside Warpcast.');
        }
      } catch (err) {
        console.error('Failed to initialize Farcaster SDK:', err);
        setError('Failed to initialize Farcaster SDK. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Only initialize SDK after authorized FIDs are loaded
    if (authorizedFids.size > 0 && typeof window !== 'undefined') {
      initializeSDK();
    } else if (typeof window === 'undefined') {
      // Server-side rendering fallback
      setIsLoading(false);
      setError('This component requires a browser environment.');
    }

    // Cleanup function
    return () => {
      // Add any cleanup if needed
    };
  }, [authorizedFids]);

  // Handle different loading states
  if (isLoading || authorizedFids.size === 0) {
    return <LoadingState message="Loading membership data..." />;
  }

  if (isValidatingFid) {
    return <LoadingState message="Validating your membership..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!user) {
    return <ErrorState message="Unable to load user data. Please try refreshing." />;
  }

  // Check if user is authorized
  if (!isAuthorized) {
    return <AccessDeniedState fid={user.fid} />;
  }

  // Successful render with user data for authorized members
  return (
    <PageLayout>
      <VirtualCard
        membershipId={user.fid?.toString() || 'unknown'}
        profilePicture={user.pfpUrl || "/placeholder-profile.png"}
        memberName={user.username || user.displayName || "Unnamed User"}
      />
    </PageLayout>
  );
}