'use client'

import { useState, useEffect } from "react";
import VirtualCard from "@/components/VirtualCard";
import { sdk } from '@farcaster/frame-sdk'

// Add the FrameContext type definition
type FrameContext = {
  user: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  location?: any;
  client: {
    clientFid: number;
    added: boolean;
    safeAreaInsets?: any;
    notificationDetails?: any;
  };
};

interface User {
  fid?: number;
  username?: string;
  displayName?: string;
  pfp?: {
    url?: string;
  };
}

interface AuthData {
  sub: string | number;
  user?: User;
}

// Separate PageLayout component for better organization
const PageLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col items-center justify-center p-8 font-oswald bg-[#f3f0fa]">
    <main className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold tracking-widest text-center text-[#5b3cc4] uppercase drop-shadow-sm">
        Farcaster Pro<br />Membership Card
      </h1>
      {children}
    </main>
  </div>
);

// Loading component
const LoadingState = ({ message }: { message: string }) => (
  <PageLayout>
    <div className="text-lg text-gray-600 animate-pulse">{message}</div>
  </PageLayout>
);

export default function Home() {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [context, setContext] = useState<FrameContext | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if SDK is available
        if (!sdk || !sdk.context) {
          throw new Error("Farcaster SDK not available");
        }

        // Await the context promise
        const frameContext = await sdk.context as FrameContext;
        console.log('Frame context:', frameContext); // Debug log
        
        // Check if frameContext exists
        if (!frameContext) {
          throw new Error("Frame context is undefined");
        }

        setContext(frameContext);

        // Safe destructuring with fallback
        const user = frameContext.user || null;

        if (user) {
          setAuthData({
            sub: user.fid || user.username || 'unknown',
            user: user
          });
        } else {
          // Handle case where user is not available
          setError("Unable to load user data - no user in context");
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : "Authentication failed");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Early return for loading state
  if (!context || isLoading) {
    return <LoadingState message="Loading your membership card..." />;
  }

  // Early return for error state
  if (error) {
    return (
      <PageLayout>
        <VirtualCard
          membershipId="error"
          profilePicture="/placeholder-profile.png"
          memberName={'Member'}
          error={true}
        />
      </PageLayout>
    );
  }

  // Early return for no auth data
  if (!authData) {
    return <LoadingState message="Initializing membership card..." />;
  }

  // Get profile picture URL with fallback
  const getProfilePicture = (): string => {
    if (authData.user?.pfp?.url) {
      return authData.user.pfp.url;
    }
    return "/placeholder-profile.png";
  };

  // Get membership ID with proper formatting
  const getMembershipId = (): string => {
    if (typeof authData.sub === 'number') {
      return authData.sub.toString();
    }
    return authData.sub || 'unknown';
  };

  return (
    <PageLayout>
      <VirtualCard
        membershipId={getMembershipId()}
        profilePicture={getProfilePicture()}
        memberName={authData.user?.username}
      />
    </PageLayout>
  );
}