'use client';
import { useEffect, useState } from 'react';

export function useLocalStorage(key: string) {
  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    setStoredValue(item);
    setLoading(false);
  }, [key]);

  const setValue = (value: string) => {
    window.localStorage.setItem(key, value);
    setStoredValue(value);
  };

  return { value: storedValue, setValue, loading };
}
