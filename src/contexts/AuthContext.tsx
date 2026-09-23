import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthUser, ProfileType, StoredAccount } from '../types';
import { getJSON, removeKey, setJSON, storageKeys } from '../storage/storage';
import mockUsers from '../data/mockUsers.json';

type Result = { ok: true } | { ok: false; error: string };

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  profileType: ProfileType;
}

interface AuthContextValue {
  /** `true` depois que a sessão e as contas salvas foram carregadas do armazenamento local. */
  hydrated: boolean;
  user: AuthUser | null;
  register: (params: RegisterParams) => Promise<Result>;
  signIn: (email: string, password: string) => Promise<Result>;
  signOut: () => void;
  updateUser: (changes: Partial<Pick<AuthUser, 'name' | 'providerId'>>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const seedAccounts = mockUsers as StoredAccount[];

function toAuthUser({ password: _password, ...user }: StoredAccount): AuthUser {
  return user;
}

function sameEmail(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [hydrated, setHydrated] = useState(false);
  const [accounts, setAccounts] = useState<StoredAccount[]>(seedAccounts);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => {
      const [storedAccounts, session] = await Promise.all([
        getJSON<StoredAccount[]>(storageKeys.accounts, []),
        getJSON<AuthUser | null>(storageKeys.session, null),
      ]);
      const missingSeeds = seedAccounts.filter(
        (seed) => !storedAccounts.some((account) => sameEmail(account.email, seed.email)),
      );
      setAccounts([...missingSeeds, ...storedAccounts]);
      setUser(session);
      setHydrated(true);
    })();
  }, []);

  const saveAccounts = useCallback((next: StoredAccount[]) => {
    setAccounts(next);
    setJSON(storageKeys.accounts, next);
  }, []);

  const saveSession = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) {
      setJSON(storageKeys.session, next);
    } else {
      removeKey(storageKeys.session);
    }
  }, []);

  const register = useCallback<AuthContextValue['register']>(
    async ({ name, email, password, profileType }) => {
      if (accounts.some((account) => sameEmail(account.email, email))) {
        return { ok: false, error: 'Já existe uma conta com este e-mail' };
      }
      const account: StoredAccount = {
        id: `u-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        profileType,
      };
      saveAccounts([...accounts, account]);
      return { ok: true };
    },
    [accounts, saveAccounts],
  );

  const signIn = useCallback<AuthContextValue['signIn']>(
    async (email, password) => {
      const account = accounts.find(
        (candidate) => sameEmail(candidate.email, email) && candidate.password === password,
      );
      if (!account) {
        return { ok: false, error: 'E-mail ou senha inválidos' };
      }
      saveSession(toAuthUser(account));
      return { ok: true };
    },
    [accounts, saveSession],
  );

  const signOut = useCallback(() => saveSession(null), [saveSession]);

  const updateUser = useCallback<AuthContextValue['updateUser']>(
    (changes) => {
      if (!user) return;
      const nextUser = { ...user, ...changes };
      saveSession(nextUser);
      saveAccounts(
        accounts.map((account) =>
          sameEmail(account.email, user.email) ? { ...account, ...changes } : account,
        ),
      );
    },
    [user, accounts, saveSession, saveAccounts],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ hydrated, user, register, signIn, signOut, updateUser }),
    [hydrated, user, register, signIn, signOut, updateUser],
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
