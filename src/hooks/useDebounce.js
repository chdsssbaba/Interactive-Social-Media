import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. search input).
 * Delays updating the debounced value until delay milliseconds have elapsed
 * since the last time the value changed.
 * 
 * @param {*} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
