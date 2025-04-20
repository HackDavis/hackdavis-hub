'use client';
import { useCallback, useEffect, useState } from 'react';

export function useLocalStorage(key: string) {
  const [storedValue, setStoredValue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const setValue = (value: string) => {
    window.localStorage.setItem(key, value);
    setStoredValue(value);
  };

  const fetchValue = useCallback(() => {
    const item = window.localStorage.getItem(key);
    setStoredValue(item);
    setLoading(false);
  }, [key]);

  useEffect(() => {
    fetchValue();
  }, [fetchValue]);

  return { storedValue, setValue, fetchValue, loading };
}
