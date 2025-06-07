'use client'

import { useAuth } from "@/context/AuthContext";
import VirtualCard from "@/components/VirtualCard";

export default function Home() {
  const { authData, isLoading, error } = useAuth();

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

  if (isLoading) {
    return (
      <PageLayout>
        <div className="text-lg text-gray-600 animate-pulse">Loading your membership card...</div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <VirtualCard
          membershipId={authData?.sub.toString() || ''}
          profilePicture="/placeholder-profile.png"
          error={true}
        />
      </PageLayout>
    );
  }

  if (!authData) {
    return (
      <PageLayout>
        <div className="text-lg text-gray-600 animate-pulse">Initializing membership card...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <VirtualCard
        membershipId={authData.sub.toString()}
        profilePicture="/placeholder-profile.png"
      />
    </PageLayout>
  );
}