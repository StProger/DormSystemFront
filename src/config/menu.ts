// src/config/menu.ts
import type { UserRole } from '../api/client';

export type MenuItem = { key: string; label: string; path: string };

const common: MenuItem[] = [
  { key: 'home', label: 'Главная', path: '/app' },
  { key: 'announcements', label: 'Лента объявлений', path: '/app/announcements' },
];

const byRole: Record<UserRole, MenuItem[]> = {
  student: [
  ...common,
  { key: 'room', label: 'Моя комната', path: '/app/room' },
  { key: 'tickets', label: 'Мои заявки', path: '/app/tickets' },
  { key: 'tickets-new', label: 'Создать заявку', path: '/app/tickets/new' },
  { key: 'large', label: 'Внос/вынос КГВ', path: '/app/large-items' },
  ],
  comendant: [
    ...common,
    { key: 'tickets-admin', label: 'Обработка заявок', path: '/app/tickets' },
    { key: 'announcements-create', label: 'Публиковать объявление', path: '/app/announcements/new' },
    { key: 'assess', label: 'Оценка комнат', path: '/app/assess' },
    { key: 'reports', label: 'Отчётность', path: '/app/reports' },
  ],
  head: [
    ...common,
    { key: 'tickets-admin', label: 'Обработка заявок', path: '/app/tickets' },
    { key: 'announcements-create', label: 'Публиковать объявление', path: '/app/announcements/new' },
    { key: 'reports', label: 'Отчётность', path: '/app/reports' },
  ],
  guard: [
    ...common,
    { key: 'visits', label: 'Журнал посещений', path: '/app/visits' },
    { key: 'large-check', label: 'Проверка КГВ на посту', path: '/app/large-check' },
  ],
};

export function menuFor(role: UserRole): MenuItem[] {
  return byRole[role] ?? common;
}
