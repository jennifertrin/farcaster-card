import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "../components/WagmiProvider";
import { SolanaWalletProvider } from "../components/SolanaWalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farcaster Pro Membership Card",
  description: "Farcaster Pro Membership Card",
  openGraph: {
    title: "Farcaster Pro Membership Card",
    description: "Farcaster Pro Membership Card",
    images: [process.env.NEXT_PUBLIC_HOST + "/FarcasterProLogo.png"],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: process.env.NEXT_PUBLIC_HOST + "/FarcasterProLogo.png",
      button: {
        title: "Launch Card",
        action: {
          type: "launch_frame",
          name: "Farcaster Pro Membership Card",
          url: "https://farcard.xyz"
        }
      }
    }),
    
    // Individual frame meta tags (for compatibility)
    "fc:frame:image": process.env.NEXT_PUBLIC_HOST + "/FarcasterProLogo.png",
    "fc:frame:button:1": "Launch Membership Card",
    "fc:frame:button:1:action": "launch_frame",
    
    // Ensure og:image is also set
    "og:image": process.env.NEXT_PUBLIC_HOST + "/FarcasterProLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
                  <WagmiProvider>
          <SolanaWalletProvider>
            {children}
          </SolanaWalletProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}