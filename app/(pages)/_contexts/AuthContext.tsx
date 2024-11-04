'use client';
import { createContext, useState, useEffect, useCallback } from 'react';
import VerifyToken from '@actions/auth/verifyToken';
import AuthTokenInt from '@typeDefs/authToken';
import DeleteAuthToken from '@actions/auth/deleteAuthToken';

interface AuthProviderValue {
  user: AuthTokenInt;
  loading: boolean;
  login: (user: AuthTokenInt) => void;
  logout: () => void;
}

export type { AuthTokenInt, AuthProviderValue };

export const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthTokenInt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateAuth = async () => {
      const data = await VerifyToken();
      if (!data.ok) {
        setLoading(false);
        return;
      }
      const userData = data.body as AuthTokenInt;

      setUser(userData);
      setLoading(false);
    };

    updateAuth();
  }, []);

  const login = useCallback((user: AuthTokenInt | null) => {
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    DeleteAuthToken();
    setUser(null);
  }, []);

  const contextValue = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
