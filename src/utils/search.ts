import { Provider } from '../types';
import { normalizeText } from './text';

export interface SearchFilters {
  name: string;
  location: string;
  categoryId?: string;
  minRating: number;
}

export type SearchSort = 'rating' | 'reviews' | 'name';

export const EMPTY_FILTERS: SearchFilters = { name: '', location: '', categoryId: undefined, minRating: 0 };

export function hasActiveFilters(filters: SearchFilters) {
  return (
    filters.name.trim() !== '' ||
    filters.location.trim() !== '' ||
    !!filters.categoryId ||
    filters.minRating > 0
  );
}

export function filterProviders(providers: Provider[], filters: SearchFilters) {
  const name = normalizeText(filters.name);
  const location = normalizeText(filters.location);

  return providers.filter((provider) => {
    if (filters.categoryId && provider.categoryId !== filters.categoryId) return false;
    if (provider.rating < filters.minRating) return false;
    if (name && !normalizeText(provider.name).includes(name)) return false;
    if (location) {
      const place = normalizeText(`${provider.city} ${provider.state} ${provider.city}/${provider.state}`);
      if (!place.includes(location)) return false;
    }
    return true;
  });
}

export function sortProviders(providers: Provider[], sort: SearchSort) {
  const sorted = [...providers];
  switch (sort) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    case 'reviews':
      return sorted.sort((a, b) => b.reviewsCount - a.reviewsCount || b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }
}
