# Farcaster Pro Membership Card

A virtual membership card generator for Farcaster users, featuring an interactive card that can be flipped and shared as an image.

## Features

- Interactive card with flip animation
- Automatic card image generation
- Share card images directly to Farcaster
- Costco-style membership card design
- Profile picture integration

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Required for Vercel Blob Storage (for image uploads)
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# Required for Farcaster Frame metadata
NEXT_PUBLIC_HOST=https://your-domain.com

# Optional: Base URL for Vercel Blob storage (for image caching)
NEXT_PUBLIC_BLOB_BASE_URL=https://public.blob.vercel-storage.com

# For development
# NEXT_PUBLIC_HOST=http://localhost:3000
```

### Setting up Vercel Blob Storage

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the "Storage" tab
4. Create a new Blob store
5. Copy the `BLOB_READ_WRITE_TOKEN` and add it to your `.env.local` file

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How it Works

1. **Card Generation**: The app generates a virtual membership card with the user's Farcaster profile information
2. **Interactive Experience**: Users can flip the card to see both front and back
3. **Image Sharing**: When users click "Share Card", the app:
   - Uses a static front-side image (same for all users)
   - Generates a unique filename based on user data (membership ID, name, profile picture)
   - Checks if the image already exists in storage (prevents duplicate uploads)
   - If not found, generates and uploads only the back-side image with user's personal information
   - Shares both front and back images to Farcaster via the Frame SDK

**Caching Benefits:**
- Prevents DDoS of blob storage from repeated shares
- Faster sharing for returning users
- Automatic cache invalidation when user data changes
- Cost-effective storage usage

## Technologies Used

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- html2canvas for image generation
- Vercel Blob Storage for image hosting
- Farcaster Frame SDK for social sharing

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
