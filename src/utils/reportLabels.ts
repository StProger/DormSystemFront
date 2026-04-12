export const TICKET_STATUS_RU: Record<string, string> = {
  pending: 'В обработке',
  in_processing: 'В обработке',
  in_work: 'В работе',
  done: 'Готово',
  rejected: 'Отклонено',
};

export const TICKET_TYPE_RU: Record<string, string> = {
  repair: 'Ремонт',
  maintenance: 'Обслуживание',
  service: 'Обслуживание',
  receipt: 'Квитанция',
  large_item: 'Крупногабаритные вещи',
  bulky_inout: 'Крупногабаритные вещи',
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