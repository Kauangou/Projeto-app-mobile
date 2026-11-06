import { REQUEST_TIMEOUT_MS, VIACEP_BASE_URL } from '../config/api';

/**
 * Cliente da API ViaCEP (https://viacep.com.br) — consulta de endereço a partir do CEP.
 *
 *   GET {VIACEP_BASE_URL}/{cep}/json/
 *
 * Esta camada só fala HTTP e converte a resposta no formato do app (`CepAddress`); não conhece
 * React nem a interface. O estado de tela (carregando/sucesso/erro/vazio) fica em `useCepLookup`.
 */

/** Endereço no formato usado pelo app (os campos da API vêm em português e abreviados). */
export interface CepAddress {
  /** CEP com 8 dígitos, sem máscara. */
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  /** Sigla da UF, ex.: "GO". */
  state: string;
}

/** Corpo de resposta do ViaCEP (campos que o app usa). */
interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  /** Presente (`true`, ou `"true"` em versões antigas) quando o CEP tem formato válido mas não existe. */
  erro?: boolean | string;
}

export type CepErrorKind =
  /** CEP com formato inválido (não tem 8 dígitos). */
  | 'invalid'
  /** Formato válido, mas o CEP não existe na base: é o caso de "ausência de dados". */
  | 'not_found'
  /** Sem conexão, DNS/host inalcançável. */
  | 'network'
  /** Nenhuma resposta dentro de `REQUEST_TIMEOUT_MS`. */
  | 'timeout'
  /** Servidor respondeu com erro HTTP ou com um corpo que não é o JSON esperado. */
  | 'server';

export class CepLookupError extends Error {
  readonly kind: CepErrorKind;

  constructor(kind: CepErrorKind, message: string) {
    super(message);
    this.name = 'CepLookupError';
    this.kind = kind;
  }
}

/** Mantém só os dígitos (no máximo 8): "74.000-000" → "74000000". */
export function sanitizeCep(value: string) {
  return value.replace(/\D/g, '').slice(0, 8);
}

export function isValidCep(value: string) {
  return /^\d{8}$/.test(value.replace(/\D/g, ''));
}

/** Máscara de exibição: "74000000" → "74000-000" (aceita CEP incompleto durante a digitação). */
export function formatCep(value: string) {
  const digits = sanitizeCep(value);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

/**
 * Consulta o endereço de um CEP.
 *
 * @param signal permite ao chamador cancelar a requisição (ex.: o usuário digitou outro CEP).
 *   Quando cancelada por ele, a promessa rejeita com o `AbortError` original (e não com
 *   `CepLookupError`), para o chamador poder ignorar o resultado.
 * @throws {CepLookupError} formato inválido, CEP inexistente, falha de rede, timeout ou erro do servidor.
 */
export async function fetchAddressByCep(cep: string, signal?: AbortSignal): Promise<CepAddress> {
  const digits = cep.replace(/\D/g, '');
  if (!isValidCep(digits)) {
    throw new CepLookupError('invalid', 'O CEP deve ter 8 dígitos.');
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', forwardAbort);

  try {
    let response: Response;
    try {
      response = await fetch(`${VIACEP_BASE_URL}/${digits}/json/`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
    } catch (error) {
      if (signal?.aborted) throw error; // cancelado pelo chamador: não é uma falha do serviço
      if (timedOut) {
        throw new CepLookupError('timeout', 'O serviço de CEP demorou demais para responder.');
      }
      throw new CepLookupError('network', 'Não foi possível conectar ao serviço de CEP.');
    }

    // O ViaCEP responde 400 (corpo HTML) para CEP malformado; como já validamos o formato,
    // isso só aconteceria por mudança na API — tratamos como CEP inválido mesmo assim.
    if (response.status === 400) {
      throw new CepLookupError('invalid', 'CEP em formato inválido.');
    }
    if (response.status === 404) {
      throw new CepLookupError('not_found', 'CEP não encontrado.');
    }
    if (!response.ok) {
      throw new CepLookupError('server', `O serviço de CEP respondeu com erro (HTTP ${response.status}).`);
    }

    let body: ViaCepResponse;
    try {
      body = (await response.json()) as ViaCepResponse;
    } catch (error) {
      if (signal?.aborted) throw error;
      if (timedOut) {
        throw new CepLookupError('timeout', 'O serviço de CEP demorou demais para responder.');
      }
      throw new CepLookupError('server', 'Resposta inesperada do serviço de CEP.');
    }

    const notFound = body.erro === true || body.erro === 'true';
    if (notFound || !body.localidade || !body.uf) {
      throw new CepLookupError('not_found', 'CEP não encontrado.');
    }

    return {
      cep: digits,
      street: body.logradouro?.trim() ?? '',
      neighborhood: body.bairro?.trim() ?? '',
      city: body.localidade.trim(),
      state: body.uf.trim().toUpperCase(),
    };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}
