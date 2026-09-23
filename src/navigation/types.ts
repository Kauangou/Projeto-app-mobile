import { NavigatorScreenParams } from '@react-navigation/native';

/** Telas de detalhe de prestador, disponíveis em todas as stacks que listam prestadores. */
export type ProviderDetailParamList = {
  ProviderProfile: { providerId: string; preview?: boolean };
  ReviewDetail: { providerId: string; reviewId: string };
  ReviewForm: { providerId: string };
};

/** Telas de gestão da própria vitrine (somente prestador). */
export type ProviderOwnerParamList = {
  EditProviderProfile: undefined;
};

// ---- Cliente ----

export type HomeStackParamList = { Home: undefined } & ProviderDetailParamList;

export type SearchStackParamList = {
  Search: { categoryId?: string } | undefined;
} & ProviderDetailParamList;

export type FavoritesStackParamList = { Favorites: undefined } & ProviderDetailParamList;

// ---- Compartilhada (aba Perfil) ----

export type ProfileStackParamList = {
  UserProfile: undefined;
  EditAccount: undefined;
  About: undefined;
} & ProviderDetailParamList &
  ProviderOwnerParamList;

// ---- Prestador ----

export type DashboardStackParamList = { Dashboard: undefined } & ProviderDetailParamList &
  ProviderOwnerParamList;

export type ReceivedReviewsStackParamList = {
  ReceivedReviews: undefined;
} & ProviderDetailParamList;

// ---- Abas ----

export type ClientTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type ProviderTabParamList = {
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;
  ReceivedReviewsTab: NavigatorScreenParams<ReceivedReviewsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ---- Raiz ----

export type RootStackParamList = {
  Splash: undefined;
  Login: { email?: string; justRegistered?: boolean } | undefined;
  Register: undefined;
  ProviderSetup: undefined;
  ClientTabs: NavigatorScreenParams<ClientTabParamList>;
  ProviderTabs: NavigatorScreenParams<ProviderTabParamList>;
};

/** União de todas as telas das stacks internas, usada pelo navigator compartilhado. */
export type AppStackParamList = HomeStackParamList &
  SearchStackParamList &
  FavoritesStackParamList &
  ProfileStackParamList &
  DashboardStackParamList &
  ReceivedReviewsStackParamList;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
