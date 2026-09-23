import { Provider, ProviderRecord, Review } from '../types';

export function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function withStats(record: ProviderRecord): Provider {
  return {
    ...record,
    rating: averageRating(record.reviews),
    reviewsCount: record.reviews.length,
  };
}
