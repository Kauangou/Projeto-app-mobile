import { ReactNode, useEffect, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { CepAddress, formatCep, sanitizeCep } from '../services/viacep';
import { CepLookupState, useCepLookup } from '../hooks/useCepLookup';
import { TextField } from './TextField';
import { Button } from './Button';
import { Icon } from './Icon';

interface Props {
  /** Chamado com o endereço recebido do serviço (para preencher os campos do formulário). */
  onFound: (address: CepAddress) => void;
}

/**
 * Campo de CEP que consulta a API ViaCEP e mostra os quatro estados da comunicação:
 * carregamento, sucesso, erro e ausência de dados. A consulta é disparada ao completar os
 * 8 dígitos ou pelo botão "Buscar" (que vira "Tentar de novo" após uma falha de rede).
 */
export function CepLookupField({ onFound }: Props) {
  const { state, lookup, reset } = useCepLookup();
  const [text, setText] = useState('');

  const search = async (value: string) => {
    const address = await lookup(value);
    if (address) onFound(address);
  };

  const handleChange = (raw: string) => {
    const digits = sanitizeCep(raw);
    setText(formatCep(digits));
    if (digits.length === 8) {
      void search(digits);
    } else if (state.status !== 'idle') {
      reset(); // CEP editado: o resultado anterior deixou de valer
    }
  };

  // Leitores de tela: a mensagem muda sem o foco sair do campo, então ela é anunciada.
  const announcement = getAnnouncement(state);
  useEffect(() => {
    if (announcement) AccessibilityInfo.announceForAccessibility(announcement);
  }, [announcement]);

  const retryable = state.status === 'error' && state.kind !== 'invalid';

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.field}>
          <TextField
            label="CEP (opcional)"
            placeholder="74000-000"
            keyboardType="number-pad"
            textContentType="postalCode"
            autoComplete="postal-code"
            maxLength={9}
            style={styles.input}
            value={text}
            onChangeText={handleChange}
            returnKeyType="search"
            onSubmitEditing={() => search(text)}
          />
        </View>
        <Button
          label={retryable ? 'Tentar de novo' : 'Buscar'}
          icon={retryable ? 'refresh-outline' : 'search-outline'}
          variant="outline"
          loading={state.status === 'loading'}
          onPress={() => search(text)}
          style={styles.button}
        />
      </View>
      <CepStatus state={state} />
    </View>
  );
}

function CepStatus({ state }: { state: CepLookupState }) {
  // A região "live" fica sempre montada: o Android só anuncia mudanças de conteúdo dela.
  let content: ReactNode = null;

  if (state.status === 'loading') {
    content = (
      <View style={styles.status}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.statusText, { color: colors.textMuted }]}>Buscando CEP…</Text>
      </View>
    );
  } else if (state.status === 'success') {
    const { address } = state;
    const detail = [address.street, address.neighborhood].filter(Boolean).join(' · ');
    content = (
      <View style={[styles.status, styles.statusSuccess]}>
        <Icon name="checkmark-circle" size={18} color={colors.successText} />
        <Text style={[styles.statusText, { color: colors.successText }]}>
          Cidade e UF preenchidas: {address.city}/{address.state}
          {detail ? ` (${detail})` : ''}
        </Text>
      </View>
    );
  } else if (state.status === 'empty') {
    content = (
      <View style={styles.status}>
        <Icon name="information-circle-outline" size={18} color={colors.textMuted} />
        <Text style={[styles.statusText, { color: colors.textMuted }]}>{state.message}</Text>
      </View>
    );
  } else if (state.status === 'error') {
    content = (
      <View style={styles.status}>
        <Icon name="alert-circle-outline" size={18} color={colors.danger} />
        <Text style={[styles.statusText, { color: colors.danger }]}>{state.message}</Text>
      </View>
    );
  }

  return (
    <View accessibilityLiveRegion="polite" style={styles.statusWrapper}>
      {content}
    </View>
  );
}

function getAnnouncement(state: CepLookupState) {
  switch (state.status) {
    case 'loading':
      return 'Buscando CEP';
    case 'success':
      return `Endereço encontrado: ${state.address.city}, ${state.address.state}. Cidade e UF preenchidas.`;
    case 'empty':
    case 'error':
      return state.message;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  field: {
    flex: 1,
    minWidth: 0,
  },
  // No web, o <input> tem largura mínima intrínseca e vazaria por baixo do botão.
  input: {
    minWidth: 0,
  },
  // Alinha o botão à base do campo (o `TextField` tem margem inferior `spacing.md`) e impede que
  // o campo o espremça: o rótulo ("Tentar de novo") precisa caber inteiro dentro da borda.
  button: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    flexShrink: 0,
  },
  statusWrapper: {
    marginBottom: spacing.sm,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusSuccess: {
    backgroundColor: colors.successSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  statusText: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    lineHeight: 18,
  },
});
