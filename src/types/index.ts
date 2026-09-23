export type ProfileType = 'cliente' | 'prestador';

/** URI de uma foto escolhida na galeria do dispositivo. */
export type ImageRef = string;

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  authorName: string;
  authorEmail?: string;
  rating: number;
  comment: string;
  /** Data do serviço no formato ISO (AAAA-MM-DD). */
  date: string;
  service: string;
  photos: ImageRef[];
}

/** Prestador como é armazenado (mock ou criado pelo usuário). */
export interface ProviderRecord {
  id: string;
  name: string;
  categoryId: string;
  city: string;
  state: string;
  description: string;
  priceReference: string;
  phone: string;
  portfolio: ImageRef[];
  reviews: Review[];
  ownerEmail?: string;
}

/** Prestador com a nota média e a quantidade de avaliações calculadas. */
export interface Provider extends ProviderRecord {
  rating: number;
  reviewsCount: number;
}

export type ProviderProfileInput = Pick<
  ProviderRecord,
  'name' | 'categoryId' | 'city' | 'state' | 'description' | 'priceReference' | 'phone'
>;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profileType: ProfileType;
  /** Preenchido quando o prestador conclui o cadastro inicial da vitrine. */
  providerId?: string;
}

export interface StoredAccount extends AuthUser {
  password: string;
}
