import html2canvas from 'html2canvas';

// Compression options interface
interface CompressionOptions {
  quality?: number; // 0.1 to 1.0
  maxWidth?: number;
  maxHeight?: number;
  format?: 'png' | 'jpeg' | 'webp';
}

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
    img.onerror = () => resolve();
    img.src = src;
    setTimeout(() => resolve(), 5000);
  });
}

// MODIFIED: Convert canvas to Blob and create object URL
async function canvasToObjectURL(
  canvas: HTMLCanvasElement,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    quality = 0.8,
    maxWidth = 800,
    maxHeight = 800,
    format = 'jpeg'
  } = options;

  // Create a new canvas for compression if needed
  let finalCanvas = canvas;
  
  if (canvas.width > maxWidth || canvas.height > maxHeight) {
    const compressedCanvas = document.createElement('canvas');
    const ctx = compressedCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context for compression');
    }

    // Calculate new dimensions while maintaining aspect ratio
    let { width, height } = canvas;
    
    const aspectRatio = width / height;
    
    if (width > height) {
      width = Math.min(width, maxWidth);
      height = width / aspectRatio;
    } else {
      height = Math.min(height, maxHeight);
      width = height * aspectRatio;
    }

    compressedCanvas.width = width;
    compressedCanvas.height = height;

    // Enable image smoothing for better quality when resizing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the original canvas onto the compressed canvas
    ctx.drawImage(canvas, 0, 0, width, height);
    finalCanvas = compressedCanvas;
  }

  // Convert canvas to Blob
  const mimeType = format === 'png' ? 'image/png' : 
                   format === 'webp' ? 'image/webp' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    finalCanvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create blob from canvas'));
        return;
      }
      
      // Create object URL from blob
      const url = URL.createObjectURL(blob);
      resolve(url);
    }, mimeType, quality);
  });
}

// Compression presets remain the same
export const COMPRESSION_PRESETS = {
  high: {
    quality: 0.9,
    maxWidth: 1024,
    maxHeight: 1024,
    format: 'png' as const
  },
  medium: {
    quality: 0.75,
    maxWidth: 800,
    maxHeight: 800,
    format: 'jpeg' as const
  },
  low: {
    quality: 0.6,
    maxWidth: 600,
    maxHeight: 600,
    format: 'jpeg' as const
  },
  thumbnail: {
    quality: 0.5,
    maxWidth: 400,
    maxHeight: 400,
    format: 'jpeg' as const
  }
};

// MODIFIED: Main function now returns object URL
export async function generateCombinedCardImageStatic(
  membershipId: string,
  profilePicture: string,
  memberName: string,
  compressionOptions: CompressionOptions = COMPRESSION_PRESETS.medium
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

    // Capture both cards with standard options
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

    // Convert canvas to object URL
    return await canvasToObjectURL(finalCanvas, compressionOptions);

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

// MODIFIED: Enhanced version with object URL
export async function generateCombinedCardImageWithStatesImproved(
  cardRef: React.RefObject<HTMLDivElement | null>,
  showBackState: () => void,
  showFrontState: () => void,
  resetState: () => void,
  animationDuration: number = 700,
  compressionOptions: CompressionOptions = COMPRESSION_PRESETS.medium
): Promise<string> {
  if (!cardRef.current) {
    throw new Error('Card element not found');
  }

  try {
    cardRef.current.style.transition = 'none';

    // Capture front state
    showFrontState();
    await waitForRender(animationDuration + 100);
    
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

    // Create combined canvas
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

    // Convert to object URL
    return await canvasToObjectURL(finalCanvas, compressionOptions);

  } catch (error) {
    console.error('Error generating combined card image:', error);
    resetState();
    throw new Error(`Failed to generate card image: ${(error as Error).message}`);
  }
}

// MODIFIED: Single card with object URL
export async function generateSingleCardImage(
  cardRef: React.RefObject<HTMLDivElement>,
  options: {
    width?: number;
    height?: number;
    dpi?: number;
    format?: 'png' | 'jpeg';
    quality?: number;
  } = {},
  compressionOptions: CompressionOptions = COMPRESSION_PRESETS.medium
): Promise<string> {
  if (!cardRef.current) {
    throw new Error('Card element not found');
  }

  const {
    width = 400,
    height = 250
  } = options;

  try {
    const canvas = await html2canvas(cardRef.current, {
      width,
      height,
      useCORS: true,
      allowTaint: true,
      logging: false
    });

    // Convert to object URL
    return await canvasToObjectURL(canvas, compressionOptions);
  } catch (error) {
    console.error('Error generating single card image:', error);
    throw new Error('Failed to generate card image');
  }
}

// NEW: Utility function to revoke object URL (important for memory management)
export function revokeImageURL(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

// NEW: Utility function to get blob from object URL
export async function getImageBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return response.blob();
}

// MODIFIED: Download function now works with both data URLs and object URLs
export async function downloadCardImage(
  imageURL: string,
  filename: string = 'card-image.png'
): Promise<void> {
  try {
    let downloadURL = imageURL;
    
    // If it's an object URL, we can use it directly
    // If it's a data URL, we can also use it directly
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = downloadURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading card image:', error);
    throw new Error('Failed to download image');
  }
}

// NEW: Convert object URL back to data URL if needed
export async function objectURLToDataURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
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