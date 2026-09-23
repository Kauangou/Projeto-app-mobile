import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ImageRef, Provider, ProviderProfileInput, ProviderRecord, Review } from '../types';
import { getJSON, setJSON, storageKeys } from '../storage/storage';
import { withStats } from '../utils/rating';
import mockProviders from '../data/mockProviders.json';

interface ProvidersContextValue {
  hydrated: boolean;
  providers: Provider[];
  getProvider: (providerId: string) => Provider | undefined;
  createProvider: (ownerEmail: string, input: ProviderProfileInput) => string;
  updateProvider: (providerId: string, input: ProviderProfileInput) => void;
  addPortfolioPhoto: (providerId: string, photo: ImageRef) => void;
  removePortfolioPhoto: (providerId: string, photo: ImageRef) => void;
  addReview: (providerId: string, review: Omit<Review, 'id'>) => void;
}

const ProvidersContext = createContext<ProvidersContextValue | undefined>(undefined);

const seedProviders = mockProviders as ProviderRecord[];

/**
 * Os prestadores mockados vêm do JSON; tudo que o usuário cria ou altera (vitrine, portfólio,
 * avaliações) fica salvo como "sobrescrita" por id no armazenamento local.
 */
type Overrides = Record<string, ProviderRecord>;

export function ProvidersProvider({ children }: PropsWithChildren) {
  const [hydrated, setHydrated] = useState(false);
  const [overrides, setOverrides] = useState<Overrides>({});

  useEffect(() => {
    getJSON<Overrides>(storageKeys.providers, {}).then((stored) => {
      setOverrides(stored);
      setHydrated(true);
    });
  }, []);

  const providers = useMemo(() => {
    const merged = seedProviders.map((record) => overrides[record.id] ?? record);
    const created = Object.values(overrides).filter(
      (record) => !seedProviders.some((seed) => seed.id === record.id),
    );
    return [...merged, ...created].map(withStats);
  }, [overrides]);

  const saveRecord = useCallback(
    (providerId: string, change: (current: ProviderRecord) => ProviderRecord) => {
      setOverrides((current) => {
        const base = current[providerId] ?? seedProviders.find((seed) => seed.id === providerId);
        if (!base) return current;
        const next = { ...current, [providerId]: change(base) };
        setJSON(storageKeys.providers, next);
        return next;
      });
    },
    [],
  );

  const getProvider = useCallback(
    (providerId: string) => providers.find((provider) => provider.id === providerId),
    [providers],
  );

  const createProvider = useCallback((ownerEmail: string, input: ProviderProfileInput) => {
    const id = `p-${Date.now()}`;
    setOverrides((current) => {
      const next = {
        ...current,
        [id]: { ...input, id, ownerEmail, portfolio: [], reviews: [] },
      };
      setJSON(storageKeys.providers, next);
      return next;
    });
    return id;
  }, []);

  const updateProvider = useCallback(
    (providerId: string, input: ProviderProfileInput) =>
      saveRecord(providerId, (current) => ({ ...current, ...input })),
    [saveRecord],
  );

  const addPortfolioPhoto = useCallback(
    (providerId: string, photo: ImageRef) =>
      saveRecord(providerId, (current) => ({ ...current, portfolio: [...current.portfolio, photo] })),
    [saveRecord],
  );

  const removePortfolioPhoto = useCallback(
    (providerId: string, photo: ImageRef) =>
      saveRecord(providerId, (current) => ({
        ...current,
        portfolio: current.portfolio.filter((item) => item !== photo),
      })),
    [saveRecord],
  );

  const addReview = useCallback(
    (providerId: string, review: Omit<Review, 'id'>) =>
      saveRecord(providerId, (current) => ({
        ...current,
        reviews: [{ ...review, id: `${providerId}-${Date.now()}` }, ...current.reviews],
      })),
    [saveRecord],
  );

  const value = useMemo<ProvidersContextValue>(
    () => ({
      hydrated,
      providers,
      getProvider,
      createProvider,
      updateProvider,
      addPortfolioPhoto,
      removePortfolioPhoto,
      addReview,
    }),
    [
      hydrated,
      providers,
      getProvider,
      createProvider,
      updateProvider,
      addPortfolioPhoto,
      removePortfolioPhoto,
      addReview,
    ],
  );

  return <ProvidersContext.Provider value={value}>{children}</ProvidersContext.Provider>;
}

export function useProvidersContext() {
  const context = useContext(ProvidersContext);
  if (!context) {
    throw new Error('useProvidersContext deve ser usado dentro de um ProvidersProvider');
  }
  return context;
}
