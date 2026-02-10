import type { UserRole } from '../api/client';

export type MenuItem = { key: string; label: string; path: string };

const common: MenuItem[] = [
  { key: 'home', label: 'Главная', path: '/app' },
  { key: 'announcements', label: 'Лента объявлений', path: '/app/announcements' },
  { key: 'notifications', label: 'Уведомления', path: '/app/notifications' },
  // { key: 'logout', label: 'Выход', path: '/logout' },
];

const byRole: Record<UserRole, MenuItem[]> = {
  student: [
  ...common,
  { key: 'room', label: 'Моя комната', path: '/app/room' },
  { key: 'guests', label: 'Мои гости', path: '/app/guests' },
  { key: 'guest-new', label: 'Оформить гостя', path: '/app/guests/new' },
  { key: 'tickets', label: 'Мои заявки', path: '/app/tickets' },
  { key: 'tickets-new', label: 'Создать заявку', path: '/app/tickets/new' },
  { key: 'large', label: 'Внос/вынос КГВ', path: '/app/large-items' },
  { key: 'receipts', label: 'Запрос квитанции', path: '/app/receipts' },
],
comendant: [
  ...common,
  { key: 'guest-admin', label: 'Гости (админ)', path: '/app/guests-admin' },
  { key: 'tickets-admin', label: 'Обработка заявок', path: '/app/tickets' },
  { key: 'announcements-create', label: 'Публиковать объявление', path: '/app/announcements/new' },
  { key: 'assess', label: 'Оценка комнат', path: '/app/assess' },
  { key: 'reports', label: 'Отчётность', path: '/app/reports' },
  { key: 'receipts-admin', label: 'Запросы квитанций', path: '/app/receipts-admin' },
  { key: 'notifications-new', label: 'Отправить уведомление', path: '/app/notifications/new' },
],
head: [
  ...common,
  { key: 'rooms-admin', label: 'Комнаты', path: '/app/rooms-admin' },
  { key: 'student-new', label: 'Добавить студента', path: '/app/students/new' },
  { key: 'occupancy-admin', label: 'Заселение/переселение', path: '/app/occupancy-admin' },
  { key: 'guest-admin', label: 'Гости (админ)', path: '/app/guests-admin' },
  { key: 'tickets-admin', label: 'Обработка заявок', path: '/app/tickets' },
  { key: 'announcements-create', label: 'Публиковать объявление', path: '/app/announcements/new' },
  { key: 'reports', label: 'Отчётность', path: '/app/reports' },
  { key: 'import', label: 'Импорт Excel', path: '/app/import' },
  { key: 'receipts-admin', label: 'Запросы квитанций', path: '/app/receipts-admin' },
  { key: 'notifications-new', label: 'Отправить уведомление', path: '/app/notifications/new' },
],
guard: [
  ...common,
  { key: 'guest-check', label: 'Проверка гостя', path: '/app/guest-check' },
  { key: 'large-check', label: 'Проверка КГВ на посту', path: '/app/large-check' },
],
};

export function menuFor(role: UserRole): MenuItem[] {
  return byRole[role] ?? common;
}
