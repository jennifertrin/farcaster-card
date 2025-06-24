'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { sdk } from '@farcaster/frame-sdk';
import { uploadCardImageBlob, generateBackCardImageForFarcaster, generateCardFilename, checkCardImageExists } from '../utils/cardImage';

interface VirtualCardProps {
  membershipId: string;
  profilePicture: string;
  memberName?: string;
  error?: boolean;
}

export default function VirtualCard({ 
  membershipId,
  profilePicture ='/placeholder-profile.png',
  memberName = "Member",
  error = false
}: VirtualCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);  

  // Auto-flip sequence: flip to back after 1s, then to front after 2s, then show hint
  // Only run auto-flip if there's no error
  useEffect(() => {
    if (error) return;

    const timer1 = setTimeout(() => {
      setIsFlipped(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      setIsFlipped(false);
    }, 2000);

    const timer3 = setTimeout(() => {
      setShowHint(true);
    }, 3000);

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [error]);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
    setShowHint(false); // Hide hint once user interacts
  };

  const handleBarcodeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking barcode
    const profileUrl = `https://www.farcaster.xyz/${memberName}`;
    window.open(profileUrl, '_blank');
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      console.log('Starting share process...');
      
      // Generate unique filename for this user's card
      const cardFilename = generateCardFilename(membershipId, memberName, profilePicture);
      console.log('Generated card filename:', cardFilename);
      
      // Check if the image already exists
      console.log('Checking if card image already exists...');
      const existingImageUrl = await checkCardImageExists(cardFilename);
      
      let backImageUrl: string;
      
      if (existingImageUrl) {
        console.log('Card image already exists, using cached version:', existingImageUrl);
        backImageUrl = existingImageUrl;
      } else {
        console.log('Card image not found, generating new back-side image...');
        
        // Generate only the back-side card image as a blob
        const backImageBlob = await generateBackCardImageForFarcaster(
          membershipId,
          profilePicture,
          memberName
        );
        
        console.log('Back image generated, uploading...');
        
        // Upload the back image to get a hosted URL with the specific filename
        backImageUrl = await uploadCardImageBlob(backImageBlob, cardFilename);
        
        console.log('Back image uploaded successfully:', backImageUrl);
      }
      
      console.log('Sharing card images to Farcaster...');
      
      // Use static front image URL and back image URL
      const frontImageUrl = `${process.env.NEXT_PUBLIC_HOST || window.location.origin}/FarcasterPro.png`;
      
      // Share both images to Farcaster
      const result = await sdk.actions.composeCast({
        text: `Why do you need a Costco Membership Card when you can have a Farcaster Pro Membership Card? 💜\nMember Name: ${memberName}\nFID: ${membershipId}`,
        embeds: [frontImageUrl, backImageUrl] // Share both front and back images
      });
      
      if (result?.cast) {
        console.log('Successfully shared card images to Farcaster!');
        console.log('Cast hash:', result.cast.hash);
      }
      
    } catch (error) {
      console.error('Error in share process:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Handle different types of errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // User cancelled the share dialog - normal behavior
          console.log('Share cancelled by user');
          return;
        } else if (error.message.includes('Failed to generate card image')) {
          alert('Failed to generate card image. Please try again.');
        } else if (error.message.includes('Failed to upload image')) {
          alert('Failed to upload image. Please check your internet connection and try again.');
        } else if (error.message.includes('Failed to share')) {
          alert('Failed to share to Farcaster. Please make sure you\'re connected to Farcaster and try again.');
        } else {
          alert(`Failed to share card: ${error.message}`);
        }
      } else {
        alert('Failed to share card. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const displayMembershipId = membershipId;
  const displayProfilePicture = profilePicture;
  const displayName = memberName;

  return (
    <div className="relative">
      <div 
        ref={cardRef}
        className="relative w-[400px] h-[250px] cursor-pointer perspective-1000"
        onClick={handleClick}
      >
        <div 
          className={`relative w-full h-full transition-all duration-700 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of the card */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg overflow-hidden">
            <Image
              src="/FarcasterPro.png"
              alt="Farcaster Pro Card Front"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          {/* Back of the card - Costco style or Error state */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl shadow-lg overflow-hidden">
            {error ? (
              // Error state - keeping header and black bar
              <>
                {/* Header section with website info */}
                <div className="bg-white border-b border-gray-300 px-4 py-2">
                  <div className="text-center text-xs text-gray-600 font-medium">
                    24/7, VISIT WWW.FARCASTER.XYZ
                  </div>
                </div>

                {/* Black stripe */}
                <div className="bg-black h-8"></div>

                {/* Error message content */}
                <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
                  <div className="mt-4 mb-4">
                    <Image
                      src="/farcaster-logo.svg"
                      alt="Farcaster Logo"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Connect to Farcaster</h2>
                  <p className="text-gray-600 text-base mb-1">
                    You&apos;re not logged into Farcaster
                  </p>
                  <p className="text-gray-500 text-sm">
                    Sign in to access your membership details
                  </p>
                </div>
              </>
            ) : (
              // Normal card back
              <>
                {/* Header section with website info */}
                <div className="bg-white border-b border-gray-300 px-4 py-2">
                  <div className="text-center text-xs text-gray-600 font-medium">
                    24/7, VISIT WWW.FARCASTER.XYZ
                  </div>
                </div>

                {/* Black stripe */}
                <div className="bg-black h-8"></div>

                {/* Main content area */}
                <div className="px-6 py-4 flex flex-col h-[calc(100%-80px)]">
                  {/* Member number and name section */}
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 mr-2">Mbr#</span>
                      <div className="border-2 border-red-500 rounded px-2 py-1">
                        <span className="text-lg font-bold text-black">
                          {displayMembershipId}
                        </span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-black uppercase tracking-wide">
                      {displayName}
                    </div>
                  </div>

                  {/* Bottom section with barcode and photo */}
                  <div className="flex-1 flex items-end justify-between">
                    {/* Barcode section - now clickable */}
                    <div className="flex flex-col">
                      {/* Clickable barcode lines */}
                      <div 
                        className="flex items-end space-x-0.5 mb-2 w-48 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={handleBarcodeClick}
                        title={`Visit ${displayName}'s profile`}
                      >
                        {Array.from({ length: 35 }, (_, i) => (
                          <div
                            key={i}
                            className={`bg-black ${
                              i % 4 === 0 ? 'h-8' : i % 3 === 0 ? 'h-6' : i % 2 === 0 ? 'h-7' : 'h-5'
                            } w-0.5`}
                          />
                        ))}
                      </div>
                      {/* URL text below barcode */}
                      <div className="text-xs text-gray-500 mt-1">
                        farcaster.xyz/{displayName}
                      </div>
                    </div>

                    {/* Photo section */}
                    <div className="w-20 h-24 bg-gray-300 rounded overflow-hidden flex items-center justify-center">
                      {displayProfilePicture ? (
                       <Image
                          src={displayProfilePicture}
                          alt="Member Photo"
                          width={80}
                          height={96}
                          objectFit="cover"
                          className="rounded w-[80px] h-[96px]"
                        />
                      ) : (
                        // Default silhouette
                        <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                          <svg 
                            width="40" 
                            height="40" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="text-black"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Share button */}
      {!error && (
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="mt-4 w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSharing ? 'Sharing...' : 'Share Card'}
        </button>
      )}
      
      {/* Interactive hint */}
      {showHint && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-sm text-gray-600 animate-pulse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31c.39-.39.39-1.02 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"/>
          </svg>
          <span>Click to flip card</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="rotate-180">
            <path d="M7.38 21.01c.49.49 1.28.49 1.77 0l8.31-8.31c.39-.39.39-1.02 0-1.41L9.15 2.98c-.49-.49-1.28-.49-1.77 0s-.49 1.28 0 1.77L14.62 12l-7.25 7.25c-.48.48-.48 1.28.01 1.76z"/>
          </svg>
        </div>
      )}
    </div>
  );
}