import { useContext } from 'react';
import { TableNumberContext } from '@pages/_contexts/TableNumberContext';

export default function useTableNumberContext() {
  const context = useContext(TableNumberContext);
  if (!context) {
    throw new Error(
      'useTableNumberContext must be used within an FormContextProvider'
    );
  }
  return context;
}
