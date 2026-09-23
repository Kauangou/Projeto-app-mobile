import { useProvidersContext } from '../contexts/ProvidersContext';
import { useAuth } from '../contexts/AuthContext';

export function useProviders() {
  return useProvidersContext().providers;
}

export function useProviderById(providerId: string | undefined) {
  const { getProvider } = useProvidersContext();
  return providerId ? getProvider(providerId) : undefined;
}

/** Vitrine do prestador logado (ou `undefined` para clientes). */
export function useMyProvider() {
  const { user } = useAuth();
  return useProviderById(user?.providerId);
}

/** Quantidade de avaliações escritas pelo usuário logado. */
export function useMyReviewsCount() {
  const { user } = useAuth();
  const providers = useProviders();
  if (!user) return 0;
  const email = user.email.toLowerCase();
  return providers.reduce(
    (count, provider) =>
      count +
      provider.reviews.filter((review) => review.authorEmail?.toLowerCase() === email).length,
    0
  );
}
