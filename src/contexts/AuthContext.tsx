import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { AuthUser, ProfileType } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (params: { name: string; email: string; profileType: ProfileType }) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn: ({ name, email, profileType }) => {
        setUser({ id: `${Date.now()}`, name, email, profileType });
      },
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
