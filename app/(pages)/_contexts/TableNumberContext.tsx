'use client';

import { createContext } from 'react';
import { useLocalStorage } from '@pages/_hooks/useLocalStorage';

interface TableNumberContextValue {
  storedValue: number | null;
  setValue: (val: any) => void;
  fetchValue: () => void;
  loading: boolean;
}

export type { TableNumberContextValue };

export const TableNumberContext = createContext<TableNumberContextValue>({
  storedValue: null,
  setValue: (_: any) => {},
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

  const value = {
    storedValue,
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
