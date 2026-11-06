/**
 * Configuração dos serviços externos consumidos pelo app (Etapa 06).
 *
 * O ViaCEP é uma API pública e gratuita: NÃO exige chave, token nem cadastro. Mesmo assim, a URL
 * base é lida de uma variável de ambiente pública do Expo (`EXPO_PUBLIC_*`), o que permite
 * trocar o endereço (ex.: apontar para um servidor de teste ou simular falha de rede) sem mexer
 * no código. Variáveis `EXPO_PUBLIC_*` são embutidas no app e, portanto, NUNCA devem guardar
 * segredos. Veja `.env.example` e `docs/etapa-06.md`.
 */
const DEFAULT_VIACEP_URL = 'https://viacep.com.br/ws';

export const VIACEP_BASE_URL = (process.env.EXPO_PUBLIC_VIACEP_URL || DEFAULT_VIACEP_URL).replace(
  /\/+$/,
  '',
);

/** Tempo máximo de espera por uma resposta antes de tratar como erro de rede. */
export const REQUEST_TIMEOUT_MS = 8000;
