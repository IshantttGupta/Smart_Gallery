import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Eye, Download, Palette, Activity, Wifi } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useBackgroundTasks } from '../hooks/useBackgroundTasks';
import ImageCard from './ImageCard';

interface ImageGalleryProps {
  filter: string;
  networkInfo: any;
  viewMode: string;
}

// Sample image data - in a real app, this would come from an API
const generateImages = (count: number) => {
  const categories = ['nature', 'city', 'people', 'abstract', 'food'];
  const images = [];
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const width = 400 + Math.floor(Math.random() * 200);
    const height = 300 + Math.floor(Math.random() * 300);
    
    images.push({
      id: i,
      url: `https://picsum.photos/${width}/${height}?random=${i}`,
      thumbUrl: `https://picsum.photos/200/150?random=${i}`,
      title: `Photo ${i}`,
      category,
      width,
      height,
      processed: false
    });
  }
  
  return images;
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ filter, networkInfo, viewMode }) => {
  const [images, setImages] = useState(generateImages(16));
  const [visibleImages, setVisibleImages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // ⚡ BACKGROUND TASKS API - Add tasks for image processing
  const { addTask } = useBackgroundTasks();

  // 👁️ INTERSECTION OBSERVER API - Detect when to load more images
  const { isIntersecting } = useIntersectionObserver({
    target: loadMoreRef,
    options: {
      rootMargin: '200px',
      threshold: 0.1
    }
  });

  // Load more images when intersection is detected
  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMoreImages();
    }
  }, [isIntersecting, hasMore, loading]);

  const loadMoreImages = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    
    // 🌐 NETWORK INFORMATION API - Adjust loading delay based on connection speed
    const delay = networkInfo.effectiveType === 'slow-2g' ? 2000 : 
                  networkInfo.effectiveType === '2g' ? 1500 :
                  networkInfo.effectiveType === '3g' ? 1000 : 500;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const newImages = generateImages(8);
    const startId = images.length + 1;
    
    const imagesWithIds = newImages.map((img, index) => ({
      ...img,
      id: startId + index
    }));
    
    setImages(prev => [...prev, ...imagesWithIds]);
    setLoading(false);
    
    // ⚡ BACKGROUND TASKS API - Process new images during idle time
    addTask(`process-batch-${startId}`, () => {
      console.log(`🔄 Background processing batch starting from ID ${startId}`);
      return new Promise(resolve => setTimeout(resolve, 1500));
    });
    
    if (images.length >= 40) {
      setHasMore(false);
    }
  }, [images.length, loading, networkInfo.effectiveType, addTask]);

  const handleImageVisible = useCallback((imageId: number) => {
    setVisibleImages(prev => {
      if (!prev.includes(imageId)) {
        return [...prev, imageId];
      }
      return prev;
    });
  }, []);

  // 🌐 NETWORK INFORMATION API - Determine image quality based on connection
  const getImageQuality = useCallback(() => {
    if (!networkInfo.effectiveType) return 'high';
    
    switch (networkInfo.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'low';
      case '3g':
        return 'medium';
      default:
        return 'high';
    }
  }, [networkInfo.effectiveType]);

  const getGridClasses = () => {
    if (viewMode === 'list') {
      return 'space-y-3 sm:space-y-4';
    }
    return 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-zinc-500 border-b border-zinc-800/30 pb-3">
        <div className="flex items-center gap-4 sm:gap-6">
          <span>{images.length} photos</span>
          <span>{visibleImages.length} loaded</span>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            <span className="capitalize">{networkInfo.effectiveType || 'unknown'}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${
            getImageQuality() === 'high' ? 'bg-green-500' :
            getImageQuality() === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="uppercase text-xs">{getImageQuality()}</span>
        </div>
      </div>

      {/* Image Grid/List */}
      <div className={getGridClasses()}>
        
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            filter={filter}
            quality={getImageQuality()}
            viewMode={viewMode}
            onVisible={handleImageVisible}
          />
        ))}
      </div>

      {/* 👁️ INTERSECTION OBSERVER API - Load more trigger */}
      <div ref={loadMoreRef} className="py-6 sm:py-8">
        {loading && (
          <div className="flex items-center justify-center gap-2 text-zinc-500">
            <div className="w-4 h-4 border border-zinc-700 rounded-full animate-spin border-t-zinc-400"></div>
            <span className="text-sm">Loading more...</span>
          </div>
        )}
        {!hasMore && !loading && (
          <div className="text-center text-zinc-600">
            <p className="text-sm">End of gallery</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;