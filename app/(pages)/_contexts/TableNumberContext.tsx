'use client';

import { createContext } from 'react';
import { useLocalStorage } from '@pages/_hooks/useLocalStorage';

interface TableNumberContextValue {
  storedValue: string | null;
  setValue: (val: string) => void;
  fetchValue: () => void;
  loading: boolean;
}

export type { TableNumberContextValue };

export const TableNumberContext = createContext<TableNumberContextValue>({
  storedValue: null,
  setValue: (_: string) => {},
  fetchValue: () => {},
  loading: false,
});

export default function TableNumberContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { storedValue, setValue, fetchValue, loading } =
    useLocalStorage('tableNumber');

  const normalizedStoredValue = (() => {
    if (storedValue === null) return null;
    const normalized = String(storedValue).trim();
    if (
      normalized.length === 0 ||
      normalized === 'null' ||
      normalized === 'undefined'
    ) {
      return null;
    }
    return normalized;
  })();

  const value = {
    storedValue: normalizedStoredValue,
    setValue,
    fetchValue,
    loading,
  };

  return (
    <TableNumberContext.Provider value={value}>
      {children}
    </TableNumberContext.Provider>
  );
}
