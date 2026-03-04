export const TICKET_STATUS_RU: Record<string, string> = {
  pending: 'В обработке',
  in_work: 'В работе',
  done: 'Готово',
  rejected: 'Отклонено',
};

export const TICKET_TYPE_RU: Record<string, string> = {
  repair: 'Ремонт',
  service: 'Обслуживание',
  receipt: 'Квитанция',
  bulky_inout: 'Крупногабарит (внос/вынос)',
};

export const GUEST_STATUS_RU: Record<string, string> = {
  pending: 'Ожидает',
  approved: 'Одобрено',
  rejected: 'Отклонено',
  checked_in: 'Вошёл',
  checked_out: 'Вышел',
  expired: 'Истёк срок',
};

export function ruLabel(map: Record<string, string>, key: string) {
  return map[key] ?? key;
}