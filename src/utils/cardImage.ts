import html2canvas from 'html2canvas';

export async function generateCombinedCardImage(
  frontCardRef: React.RefObject<HTMLDivElement | null>,
  backCardRef: React.RefObject<HTMLDivElement | null>
): Promise<string> {
  if (!frontCardRef.current || !backCardRef.current) {
    throw new Error('Card elements not found');
  }

  try {
    // Create canvas for front of card
    const frontCanvas = await html2canvas(frontCardRef.current, {
      width: 400,
      height: 250,
      useCORS: true,
      allowTaint: true
    });

    // Create canvas for back of card
    const backCanvas = await html2canvas(backCardRef.current, {
      width: 400,
      height: 250,
      useCORS: true,
      allowTaint: true
    });

    // Create final canvas with both front and back
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

    // Calculate card dimensions and positions
    const cardWidth = 1024;
    const cardHeight = 640;
    const spacing = 32;
    const totalCardsHeight = (cardHeight * 2) + spacing;
    const startY = (1024 - totalCardsHeight) / 2;

    // Draw front card at the top
    ctx.drawImage(frontCanvas, 0, startY, cardWidth, cardHeight);

    // Draw back card below with spacing
    ctx.drawImage(backCanvas, 0, startY + cardHeight + spacing, cardWidth, cardHeight);

    // Convert to base64 PNG
    return finalCanvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating combined card image:', error);
    throw new Error('Failed to generate card image');
  }
}

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
      allowTaint: true
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

// Alternative approach using separate card states without DOM manipulation
export async function generateCombinedCardImageWithStates(
  cardRef: React.RefObject<HTMLDivElement | null>,
  showBackState: () => void,
  showFrontState: () => void,
  resetState: () => void
): Promise<string> {
  if (!cardRef.current) {
    throw new Error('Card element not found');
  }

  try {
    // Ensure we start with front state
    showFrontState();
    await waitForRender();

    // Capture front
    const frontCanvas = await html2canvas(cardRef.current, {
      width: 400,
      height: 250,
      useCORS: true,
      allowTaint: true
    });

    // Switch to back state
    showBackState();
    await waitForRender();

    // Capture back
    const backCanvas = await html2canvas(cardRef.current, {
      width: 400,
      height: 250,
      useCORS: true,
      allowTaint: true
    });

    // Reset to original state
    resetState();

    // Create combined canvas
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

    // Draw both cards
    ctx.drawImage(frontCanvas, 0, startY, cardWidth, cardHeight);
    ctx.drawImage(backCanvas, 0, startY + cardHeight + spacing, cardWidth, cardHeight);

    return finalCanvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error generating combined card image:', error);
    resetState(); // Ensure we reset state even on error
    throw new Error('Failed to generate card image');
  }
}

// Helper function to wait for DOM changes to render
function waitForRender(ms: number = 100): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      setTimeout(resolve, ms);
    });
  });
}