import providersData from '../data/mockProviders.json';
import { Provider } from '../types';

const providers = providersData as Provider[];

export function useProviders() {
  return providers;
}

export function useProviderById(providerId: string) {
  return providers.find((provider) => provider.id === providerId);
}
