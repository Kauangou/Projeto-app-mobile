const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

function parseIso(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

/** AAAA-MM-DD → DD/MM/AAAA */
export function formatDateShort(iso: string) {
  const { year, month, day } = parseIso(iso);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

/** AAAA-MM-DD → "12 de junho de 2026" */
export function formatDateLong(iso: string) {
  const { year, month, day } = parseIso(iso);
  return `${day} de ${MONTHS[month - 1]} de ${year}`;
}

export function todayShort() {
  const now = new Date();
  return formatDateShort(
    `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
  );
}

/** DD/MM/AAAA → AAAA-MM-DD, ou `null` se a data não existir. */
export function parseDateShort(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const [, day, month, year] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function isFutureIso(iso: string) {
  const { year, month, day } = parseIso(iso);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() > today.getTime();
}

/** Aplica a máscara DD/MM/AAAA enquanto o usuário digita. */
export function maskDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
