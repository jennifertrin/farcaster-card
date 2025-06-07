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
      <h1 className="text-3xl font-bold tracking-widest text-center text-purple-700 uppercase drop-shadow-sm">
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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    // Check if we're in a Farcaster context
    if (typeof window !== 'undefined') {
      initializeSDK();
    } else {
      // Server-side rendering fallback
      setIsLoading(false);
      setError('This component requires a browser environment.');
    }

    // Cleanup function
    return () => {
      // Add any cleanup if needed
    };
  }, []);

  // Handle different loading states
  if (isLoading) {
    return <LoadingState message="Loading your membership card..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!user) {
    return <ErrorState message="Unable to load user data. Please try refreshing." />;
  }

  // Successful render with user data
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