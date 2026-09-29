import { useEffect, useRef } from 'react';

/**
 * Custom hook to trigger a callback when an element enters the viewport.
 * Encapsulates the IntersectionObserver API with proper cleanup to prevent memory leaks.
 * 
 * @param {Object} options - Observer options (root, rootMargin, threshold)
 * @param {Function} callback - Function to execute on intersection
 * @returns {React.MutableRefObject} A ref to attach to the sentinel element
 */
export function useIntersectionObserver(options = {}, callback) {
  const targetRef = useRef(null);
  const callbackRef = useRef(callback);

  // Keep latest callback reference without re-binding observer needlessly
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: fire callback immediately
      callbackRef.current();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry && entry.isIntersecting) {
        callbackRef.current();
      }
    }, {
      root: options.root || null,
      rootMargin: options.rootMargin || '200px',
      threshold: options.threshold || 0.1
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [options.root, options.rootMargin, options.threshold]);

  return targetRef;
}
