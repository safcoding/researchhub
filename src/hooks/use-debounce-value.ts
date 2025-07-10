import { useState, useEffect } from 'react';

export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timeout to update the debounced value
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout when value or delay changes
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
