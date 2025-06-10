import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['imagedelivery.net', 'public.blob.vercel-storage.com'],
    // OR use the newer remotePatterns (recommended):
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
export default nextConfig;
