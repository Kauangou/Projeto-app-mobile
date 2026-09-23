import categoriesData from '../data/categories.json';
import { Provider, ServiceCategory } from '../types';

const categories = categoriesData as ServiceCategory[];

export function useCategories() {
  return categories;
}

export function useCategoryById(categoryId: string | undefined) {
  return categories.find((category) => category.id === categoryId);
}

/** "🎨 Pintor · Goiânia/GO" */
export function useProviderSubtitle(provider: Provider) {
  const category = useCategoryById(provider.categoryId);
  const location = `${provider.city}/${provider.state}`;
  return category ? `${category.icon} ${category.name} · ${location}` : location;
}
