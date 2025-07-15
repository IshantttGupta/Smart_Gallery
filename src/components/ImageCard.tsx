import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Palette, Loader2, Download, Maximize2, Zap, Heart } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCanvas } from '../hooks/useCanvas';
import { useBackgroundTasks } from '../hooks/useBackgroundTasks';

interface ImageCardProps {
  image: {
    id: number;
    url: string;
    thumbUrl: string;
    title: string;
    category: string;
    width: number;
    height: number;
    processed: boolean;
  };
  filter: string;
  quality: string;
  viewMode: string;
  onVisible: (imageId: number) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, filter, quality, viewMode, onVisible }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // ⚡ BACKGROUND TASKS API - Add image processing tasks
  const { addTask } = useBackgroundTasks();

  // 👁️ INTERSECTION OBSERVER API - Lazy loading detection
  const { isIntersecting } = useIntersectionObserver({
    target: cardRef,
    options: {
      rootMargin: '100px',
      threshold: 0.1
    }
  });

  // 🎨 CANVAS API - Apply image filters
  const { canvasRef, applyFilter } = useCanvas();

  useEffect(() => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true);
      onVisible(image.id);
    }
  }, [isIntersecting, isVisible, image.id, onVisible]);

  // 🎨 CANVAS API - Apply filter when image loads or filter changes
  useEffect(() => {
    if (loaded && imgRef.current && filter !== 'none') {
      applyFilter(imgRef.current, filter);
    }
  }, [loaded, filter, applyFilter]);

  const handleImageLoad = useCallback(() => {
    setLoaded(true);
    setError(false);
    
    // ⚡ BACKGROUND TASKS API - Process image in background
    addTask(`process-image-${image.id}`, () => {
      console.log(`🎨 Background processing image ${image.id} with ${filter} filter`);
      return new Promise(resolve => setTimeout(resolve, 800));
    });
  }, [image.id, filter, addTask]);

  const handleImageError = useCallback(() => {
    setError(true);
    setLoaded(false);
  }, []);

  const getImageUrl = useCallback(() => {
    if (!isVisible) return '';
    
    const baseUrl = image.thumbUrl;
    
    if (quality === 'low') {
      return baseUrl.replace('200', '150').replace('150', '100');
    } else if (quality === 'medium') {
      return baseUrl;
    }
    
    return image.url;
  }, [isVisible, image.url, image.thumbUrl, quality]);

  if (viewMode === 'list') {
    return (
      <div
        ref={cardRef}
        className="flex gap-4 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-lg hover:bg-zinc-900/50 transition-colors"
      >
        <div className="w-20 h-20 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
          {!isVisible && (
            <div className="w-full h-full bg-zinc-800 animate-pulse"></div>
          )}
          
          {isVisible && !loaded && !error && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-4 h-4 border border-zinc-600 rounded-full animate-spin border-t-zinc-400"></div>
            </div>
          )}
          
          {isVisible && (
            <>
              <img
                ref={imgRef}
                src={getImageUrl()}
                alt={image.title}
                className={`w-full h-full object-cover transition-opacity ${
                  loaded ? 'opacity-100' : 'opacity-0'
                } ${filter !== 'none' ? 'hidden' : ''}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              
              {filter !== 'none' && (
                <canvas
                  ref={canvasRef}
                  className={`w-full h-full object-cover transition-opacity ${
                    loaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-zinc-100 mb-1">{image.title}</h3>
          <p className="text-sm text-zinc-500 capitalize mb-2">{image.category}</p>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>{image.width} × {image.height}</span>
            {filter !== 'none' && (
              <span className="flex items-center gap-1">
                <Palette className="w-3 h-3" />
                {filter}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-md transition-colors ${
              liked ? 'text-red-500 bg-red-500/10' : 'text-zinc-500 hover:text-zinc-400'
            }`}
          >
            <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="group bg-zinc-900/30 border border-zinc-800/50 rounded-lg overflow-hidden hover:border-zinc-700/50 transition-all"
    >
      <div className="relative aspect-square bg-zinc-800">
        {/* Loading placeholder */}
        {!isVisible && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse"></div>
        )}
        
        {/* Loading spinner */}
        {isVisible && !loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border border-zinc-600 rounded-full animate-spin border-t-zinc-400"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
            <div className="text-center">
              <div className="w-8 h-8 bg-zinc-700 rounded-md mx-auto mb-2 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <p className="text-xs">Failed to load</p>
            </div>
          </div>
        )}
        
        {/* Image content */}
        {isVisible && (
          <>
            {/* 🎨 CANVAS API - Original image (hidden when filter applied) */}
            <img
              ref={imgRef}
              src={getImageUrl()}
              alt={image.title}
              className={`w-full h-full object-cover transition-opacity ${
                loaded ? 'opacity-100' : 'opacity-0'
              } ${filter !== 'none' ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* 🎨 CANVAS API - Filtered image canvas */}
            {filter !== 'none' && (
              <canvas
                ref={canvasRef}
                className={`w-full h-full object-cover transition-opacity ${
                  loaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
          </>
        )}
        
        {/* Hover overlay */}
        {loaded && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button className="bg-zinc-900/80 backdrop-blur-sm text-zinc-100 p-2 rounded-md hover:bg-zinc-800/80 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className={`backdrop-blur-sm p-2 rounded-md transition-colors ${
                  liked 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-zinc-900/80 text-zinc-100 hover:bg-zinc-800/80'
                }`}
              >
                <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {filter !== 'none' && (
            <div className="bg-zinc-900/80 backdrop-blur-sm text-zinc-100 px-2 py-1 rounded text-xs flex items-center gap-1">
              <Palette className="w-3 h-3" />
              <span className="capitalize">{filter}</span>
            </div>
          )}
        </div>
        
        {/* Quality indicator */}
        <div className="absolute bottom-2 left-2">
          <div className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${
            quality === 'high' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            quality === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {quality.toUpperCase()}
          </div>
        </div>
      </div>
      
      {/* Image info */}
      <div className="p-3">
        <h3 className="font-medium text-zinc-100 text-sm mb-1">{image.title}</h3>
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="capitalize">{image.category}</span>
          <span className="font-mono">{image.width} × {image.height}</span>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;