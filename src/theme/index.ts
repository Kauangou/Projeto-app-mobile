export const colors = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  primarySoft: '#DBEAFE',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: '#E0E7FF',
  // Amber-700: versão escurecida do amber padrão (#F59E0B), que reprovava contraste
  // (2.15:1) como texto/botão sobre fundo claro. Com branco por cima, fica em 5.02:1 (AA).
  secondary: '#B45309',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  // Verde do WhatsApp escurecido: o tom oficial (#25D366) some com texto branco em cima
  // (1.98:1). Este tom mantém a identidade "verde WhatsApp" e passa em 5.43:1 (AA).
  whatsapp: '#0E7A3D',
  danger: '#DC2626',
  star: '#F59E0B',
  overlay: 'rgba(15, 23, 42, 0.92)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const },
  subtitle: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};
