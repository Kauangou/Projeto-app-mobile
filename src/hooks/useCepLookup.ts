import { useCallback, useEffect, useRef, useState } from 'react';
import { CepAddress, CepErrorKind, CepLookupError, fetchAddressByCep, isValidCep } from '../services/viacep';

/**
 * Estados da comunicação com o serviço externo:
 *  - idle: nada consultado ainda;
 *  - loading: requisição em andamento;
 *  - success: endereço recebido;
 *  - empty: o serviço respondeu, mas o CEP não existe (ausência de dados);
 *  - error: falha (formato inválido, sem rede, timeout, erro do servidor).
 */
export type CepLookupState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; address: CepAddress }
  | { status: 'empty'; message: string }
  | { status: 'error'; kind: CepErrorKind; message: string };

const ERROR_MESSAGES: Record<Exclude<CepErrorKind, 'not_found'>, string> = {
  invalid: 'Digite os 8 números do CEP.',
  network: 'Sem conexão com o serviço de CEP. Verifique sua internet e tente novamente.',
  timeout: 'O serviço de CEP demorou para responder. Tente novamente.',
  server: 'O serviço de CEP está com problemas no momento. Tente novamente em instantes.',
};

const NOT_FOUND_MESSAGE =
  'CEP não encontrado. Confira os números ou preencha cidade e UF manualmente.';

export function useCepLookup() {
  const [state, setState] = useState<CepLookupState>({ status: 'idle' });
  const controllerRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  // Ao sair da tela, cancela a consulta pendente para não atualizar um componente desmontado.
  useEffect(() => cancel, [cancel]);

  /** Consulta o CEP. Uma nova consulta cancela a anterior (só a última resposta vale). */
  const lookup = useCallback(
    async (cep: string): Promise<CepAddress | null> => {
      cancel();

      if (!isValidCep(cep)) {
        setState({ status: 'error', kind: 'invalid', message: ERROR_MESSAGES.invalid });
        return null;
      }

      const controller = new AbortController();
      controllerRef.current = controller;
      setState({ status: 'loading' });

      try {
        const address = await fetchAddressByCep(cep, controller.signal);
        if (controller.signal.aborted) return null;
        setState({ status: 'success', address });
        return address;
      } catch (error) {
        if (controller.signal.aborted) return null; // substituída por outra consulta, ou desmontada
        if (error instanceof CepLookupError) {
          setState(
            error.kind === 'not_found'
              ? { status: 'empty', message: NOT_FOUND_MESSAGE }
              : { status: 'error', kind: error.kind, message: ERROR_MESSAGES[error.kind] },
          );
        } else {
          setState({ status: 'error', kind: 'server', message: ERROR_MESSAGES.server });
        }
        return null;
      }
    },
    [cancel],
  );

  /** Volta ao estado inicial (ex.: o usuário editou o CEP) e descarta consulta em andamento. */
  const reset = useCallback(() => {
    cancel();
    setState({ status: 'idle' });
  }, [cancel]);

  return { state, lookup, reset };
}
