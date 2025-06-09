import html2canvas from 'html2canvas';

// Create static card components for image generation (no animations/transforms)
export function createStaticCardElements(
  membershipId: string,
  profilePicture: string,
  memberName: string
): { frontElement: HTMLDivElement; backElement: HTMLDivElement } {
  
  // Create front card element
  const frontElement = document.createElement('div');
  frontElement.className = 'static-card-front';
  frontElement.style.cssText = `
    width: 400px;
    height: 250px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    background-image: url('/FarcasterPro.png');
    background-size: cover;
    background-position: center;
  `;

  // Create back card element
  const backElement = document.createElement('div');
  backElement.className = 'static-card-back';
  backElement.style.cssText = `
    width: 400px;
    height: 250px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    font-family: system-ui, -apple-system, sans-serif;
  `;

  // Build back card content
  backElement.innerHTML = `
    <!-- Header section -->
    <div style="background: white; border-bottom: 1px solid #d1d5db; padding: 8px 16px;">
      <div style="text-align: center; font-size: 12px; color: #6b7280; font-weight: 500;">
        24/7, VISIT WWW.FARCASTER.XYZ
      </div>
    </div>

    <!-- Black stripe -->
    <div style="background: black; height: 32px;"></div>

    <!-- Main content -->
    <div style="padding: 16px 24px; display: flex; flex-direction: column; height: calc(100% - 80px);">
      
      <!-- Member info -->
      <div style="margin-bottom: 16px;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 14px; font-weight: 500; color: #374151; margin-right: 8px;">Mbr#</span>
          <div style="border: 2px solid #ef4444; border-radius: 4px; padding: 4px 8px;">
            <span style="font-size: 18px; font-weight: bold; color: black;">
              ${membershipId}
            </span>
          </div>
        </div>
        <div style="font-size: 18px; font-weight: bold; color: black; text-transform: uppercase; letter-spacing: 0.05em;">
          ${memberName}
        </div>
      </div>

      <!-- Bottom section -->
      <div style="flex: 1; display: flex; align-items: flex-end; justify-content: space-between;">
        
        <!-- Barcode section -->
        <div style="display: flex; flex-direction: column;">
          <div style="display: flex; align-items: flex-end; gap: 2px; margin-bottom: 8px; width: 192px;">
            ${Array.from({ length: 35 }, (_, i) => 
              `<div style="background: black; width: 2px; height: ${
                i % 4 === 0 ? '32px' : i % 3 === 0 ? '24px' : i % 2 === 0 ? '28px' : '20px'
              };"></div>`
            ).join('')}
          </div>
          <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
            farcaster.xyz/${memberName}
          </div>
        </div>

        <!-- Photo section -->
        <div style="width: 80px; height: 96px; background: #d1d5db; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
          ${profilePicture && profilePicture !== '/placeholder-profile.png' ? 
            `<img src="${profilePicture}" alt="Member Photo" style="width: 100%; height: 100%; object-fit: cover;" />` :
            `<svg width="40" height="40" viewBox="0 0 24 24" fill="#6b7280">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>`
          }
        </div>
      </div>
    </div>
  `;

  return { frontElement, backElement };
}

// Enhanced wait function with multiple strategies
async function waitForRender(ms: number = 300): Promise<void> {
  return new Promise(resolve => {
    // Use both requestAnimationFrame and setTimeout for better reliability
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(resolve, ms);
      });
    });
  });
}

// Preload images to avoid CORS and loading issues
async function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Don't fail on image errors, just continue
    img.src = src;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(), 5000);
  });
}

// Main function using static elements (recommended approach)
export async function generateCombinedCardImageStatic(
  membershipId: string,
  profilePicture: string,
  memberName: string
): Promise<string> {
  let frontElement: HTMLDivElement | null = null;
  let backElement: HTMLDivElement | null = null;

  try {
    // Preload images first
    await Promise.all([
      preloadImage('/FarcasterPro.png'),
      preloadImage(profilePicture)
    ]);

    // Create static elements
    const { frontElement: front, backElement: back } = createStaticCardElements(
      membershipId,
      profilePicture,
      memberName
    );
    
    frontElement = front;
    backElement = back;

    // Add to DOM temporarily (positioned off-screen)
    frontElement.style.position = 'absolute';
    frontElement.style.left = '-9999px';
    frontElement.style.top = '-9999px';
    
    backElement.style.position = 'absolute';
    backElement.style.left = '-9999px';
    backElement.style.top = '-9999px';
    
    document.body.appendChild(frontElement);
    document.body.appendChild(backElement);

    // Wait for elements to render
    await waitForRender(200);

    // Capture both cards with enhanced options
    const [frontCanvas, backCanvas] = await Promise.all([
      html2canvas(frontElement, {
        width: 400,
        height: 250,
        useCORS: true,
        allowTaint: true,
        logging: false
      }),
      html2canvas(backElement, {
        width: 400,
        height: 250,
        useCORS: true,
        allowTaint: true,
        logging: false
      })
    ]);

    // Create final combined canvas
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 1024;
    finalCanvas.height = 1024;
    const ctx = finalCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Set background
    ctx.fillStyle = '#f5f0ec';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // Calculate positioning
    const cardWidth = 1024;
    const cardHeight = 640;
    const spacing = 32;
    const totalCardsHeight = (cardHeight * 2) + spacing;
    const startY = (1024 - totalCardsHeight) / 2;

    // Draw both cards with better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(frontCanvas, 0, startY, cardWidth, cardHeight);
    ctx.drawImage(backCanvas, 0, startY + cardHeight + spacing, cardWidth, cardHeight);

    return finalCanvas.toDataURL('image/png', 0.95);

  } catch (error) {
    console.error('Error generating combined card image:', error);
    throw new Error(`Failed to generate card image: ${(error as Error).message}`);
  } finally {
    // Clean up DOM elements
    if (frontElement && frontElement.parentNode) {
      frontElement.parentNode.removeChild(frontElement);
    }
    if (backElement && backElement.parentNode) {
      backElement.parentNode.removeChild(backElement);
    }
  }
}

// Improved version of your existing state-based approach with better timing
export async function generateCombinedCardImageWithStatesImproved(
  cardRef: React.RefObject<HTMLDivElement | null>,
  showBackState: () => void,
  showFrontState: () => void,
  resetState: () => void,
  animationDuration: number = 700
): Promise<string> {
  if (!cardRef.current) {
    throw new Error('Card element not found');
  }

  try {
    cardRef.current.style.transition = 'none';

    // Capture front state
    showFrontState();
    await waitForRender(animationDuration + 100); // Wait longer than animation
    
    const frontCanvas = await html2canvas(cardRef.current, {
      width: 400,
      height: 250,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Capture back state
    showBackState();
    await waitForRender(animationDuration + 100);
    
    const backCanvas = await html2canvas(cardRef.current, {
      width: 400,
      height: 250,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Restore original state and animations
    resetState();
    cardRef.current.style.transition = '';

    // Create combined canvas (same logic as before)
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 1024;
    finalCanvas.height = 1024;
    const ctx = finalCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    ctx.fillStyle = '#f5f0ec';
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    const cardWidth = 1024;
    const cardHeight = 640;
    const spacing = 32;
    const totalCardsHeight = (cardHeight * 2) + spacing;
    const startY = (1024 - totalCardsHeight) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(frontCanvas, 0, startY, cardWidth, cardHeight);
    ctx.drawImage(backCanvas, 0, startY + cardHeight + spacing, cardWidth, cardHeight);

    return finalCanvas.toDataURL('image/png', 0.95);

  } catch (error) {
    console.error('Error generating combined card image:', error);
    resetState(); // Ensure we reset state even on error
    throw new Error(`Failed to generate card image: ${(error as Error).message}`);
  }
}

// Keep your existing utility functions
export async function generateSingleCardImage(
  cardRef: React.RefObject<HTMLDivElement>,
  options: {
    width?: number;
    height?: number;
    dpi?: number;
    format?: 'png' | 'jpeg';
    quality?: number;
  } = {}
): Promise<string> {
  if (!cardRef.current) {
    throw new Error('Card element not found');
  }

  const {
    width = 400,
    height = 250,
    format = 'png',
    quality = 0.92
  } = options;

  try {
    const canvas = await html2canvas(cardRef.current, {
      width,
      height,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return canvas.toDataURL(mimeType, quality);
  } catch (error) {
    console.error('Error generating single card image:', error);
    throw new Error('Failed to generate card image');
  }
}

export async function downloadCardImage(
  dataURL: string,
  filename: string = 'card-image.png'
): Promise<void> {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading card image:', error);
    throw new Error('Failed to download image');
  }
}

export function generateCardImageFilename(
  cardTitle?: string,
  includeTimestamp: boolean = true
): string {
  const sanitizeTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  let filename = 'card';
  
  if (cardTitle) {
    filename = sanitizeTitle(cardTitle);
  }

  if (includeTimestamp) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    filename += `-${timestamp}`;
  }

  return `${filename}.png`;
}