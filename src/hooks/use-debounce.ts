import { useState, useCallback, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;

  return debouncedCallback;
}

export function useDebouncedSearch(
  onSearch: (value: string) => void,
  delay: number = 300
) {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(onSearch, delay);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return {
    searchValue,
    handleSearchChange,
    setSearchValue,
  };
}
