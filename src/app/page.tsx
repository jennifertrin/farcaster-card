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
  <div className="flex min-h-screen flex-col items-center justify-center p-8 font-oswald bg-[#f3f0fa]">
    <main className="flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold tracking-widest text-center text-[#5b3cc4] uppercase drop-shadow-sm">
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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const context = sdk.context;
    if (context?.user) {
      setUser(context.user);
    } else {
      console.warn('User context not available. Are you running inside Warpcast?');
      setUser({ error: true });
    }
  }, []);

  if (!user) {
    return <LoadingState message="Loading your membership card..." />;
  }

  if (user.error) {
    return (
      <PageLayout>
        <VirtualCard
          membershipId="error"
          profilePicture="/placeholder-profile.png"
          memberName="Member"
          error={true}
        />
      </PageLayout>
    );
  }

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
