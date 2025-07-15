import { useRef, useCallback } from 'react';

// 🎨 CANVAS API - Custom hook for image filtering and manipulation
export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applyFilter = useCallback((image: HTMLImageElement, filter: string) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log(`🎨 Canvas API: Applying ${filter} filter to image`);

    // 🎨 CANVAS API - Set canvas dimensions to match image
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    // 🎨 CANVAS API - Apply CSS filter to canvas context
    switch (filter) {
      case 'blur':
        ctx.filter = 'blur(3px)';
        break;
      case 'brightness':
        ctx.filter = 'brightness(1.4)';
        break;
      case 'contrast':
        ctx.filter = 'contrast(1.5)';
        break;
      case 'grayscale':
        ctx.filter = 'grayscale(100%)';
        break;
      case 'sepia':
        ctx.filter = 'sepia(100%)';
        break;
      default:
        ctx.filter = 'none';
    }

    // 🎨 CANVAS API - Clear canvas and draw filtered image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    console.log(`🎨 Canvas API: Successfully applied ${filter} filter`);
  }, []);

  return { canvasRef, applyFilter };
};