'use client'

import { useAuth } from "@/context/AuthContext";
import VirtualCard from "@/components/VirtualCard";

export default function Home() {
  const { authData, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 font-oswald">
        <div className="text-lg animate-pulse">Loading your membership card...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 font-oswald">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold tracking-wide uppercase">Farcaster Pro Membership Card</h1>
        <VirtualCard
          membershipId={authData?.sub.toString() || ''}
          profilePicture="/placeholder-profile.png"
          error={true}
        />
      </main>
    </div>
    );
  }

  // If no auth data, just show a loading state as the mini app SDK will handle auth
  if (!authData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 font-oswald">
        <div className="text-lg animate-pulse">Initializing membership card...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 font-oswald">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold tracking-wide uppercase">Farcaster Pro Membership Card</h1>
        <VirtualCard
          membershipId={authData.sub.toString()}
          profilePicture="/placeholder-profile.png"
        />
      </main>
    </div>
  );
}