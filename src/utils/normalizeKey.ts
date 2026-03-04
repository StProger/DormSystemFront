export function normalizeKey(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);

  // TicketStatus.pending -> pending
  // UserRole.head -> head
  if (s.includes('.')) return s.split('.').pop() || s;

  // Enum('pending') или что-то с кавычками — на всякий случай
  return s.replace(/['"]/g, '').trim();
}