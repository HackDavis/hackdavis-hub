'use client';
import { createContext, useState } from 'react';

interface FormContextValue {
  data: { [key: string]: any };
  updateField: (field_name: string, value: any) => void;
  setData: (value: any) => void;
}

export type { FormContextValue };

export const FormContext = createContext<FormContextValue>({
  data: {},
  updateField: (_, __) => {},
  setData: (_) => {},
});

export default function FormContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState({});

  const updateField = (field_name: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [field_name]: value,
    }));
  };

  const value = {
    data,
    updateField,
    setData,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}
