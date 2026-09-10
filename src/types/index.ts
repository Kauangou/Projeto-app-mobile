export type ProfileType = 'cliente' | 'prestador';

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Provider {
  id: string;
  name: string;
  categoryId: string;
  city: string;
  state: string;
  description: string;
  priceReference: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  reviews: Review[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profileType: ProfileType;
}
