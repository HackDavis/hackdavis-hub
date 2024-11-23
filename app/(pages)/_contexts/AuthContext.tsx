'use client';
import { createContext, useState, useEffect, useCallback } from 'react';
import VerifyToken from '@actions/auth/verifyToken';
import AuthToken from '@typeDefs/authToken';
import DeleteAuthToken from '@actions/auth/deleteAuthToken';

interface AuthProviderValue {
  user: AuthToken;
  loading: boolean;
  login: (user: AuthToken) => void;
  logout: () => void;
}

export type { AuthToken, AuthProviderValue };

export const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateAuth = async () => {
      const data = await VerifyToken();
      if (!data.ok) {
        setLoading(false);
        return;
      }
      const userData = data.body as AuthToken;

      setUser(userData);
      setLoading(false);
    };

    updateAuth();
  }, []);

  const login = useCallback((user: AuthToken | null) => {
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
