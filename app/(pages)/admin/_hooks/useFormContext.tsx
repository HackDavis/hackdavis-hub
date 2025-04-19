import { useContext } from 'react';
import { FormContext } from '../_contexts/FormContext';

export default function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error(
      'useFormContext must be used within an FormContextProvider'
    );
  }
  return context;
}
