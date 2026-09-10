import categoriesData from '../data/categories.json';
import { ServiceCategory } from '../types';

const categories = categoriesData as ServiceCategory[];

export function useCategories() {
  return categories;
}

export function useCategoryById(categoryId: string) {
  return categories.find((category) => category.id === categoryId);
}
