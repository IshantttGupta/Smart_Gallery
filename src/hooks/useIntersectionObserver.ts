import { useState, useEffect, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  target: RefObject<Element>;
  options?: IntersectionObserverInit;
}

// 👁️ INTERSECTION OBSERVER API - Custom hook for lazy loading and visibility detection
export const useIntersectionObserver = ({ target, options = {} }: UseIntersectionObserverOptions) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!target.current) return;

    // 👁️ INTERSECTION OBSERVER API - Create observer instance
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
        
        // Log intersection events for debugging
        if (entry.isIntersecting) {
          console.log('👁️ Element entered viewport:', entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...options
      }
    );

    // 👁️ INTERSECTION OBSERVER API - Start observing the target element
    observer.observe(target.current);

    return () => {
      // 👁️ INTERSECTION OBSERVER API - Clean up observer
      observer.disconnect();
    };
  }, [target, options]);

  return { isIntersecting, entry };
};