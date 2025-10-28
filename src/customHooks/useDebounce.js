import { useRef, useCallback } from 'react';

export const useDebounce = (func, delay) => {
  const timeoutRef = useRef();

  const debouncedFn = useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );

  return debouncedFn;
};
