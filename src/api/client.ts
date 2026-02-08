export const API_BASE = 'http://localhost:8000/api';

export type LoginResp = { access_token: string; token_type: string };

export async function serverLogout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
  }
}

export function logoutClient() {
  try { localStorage.removeItem('access_token'); } catch {}
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token');

  // аккуратно собираем заголовки, не ломаем FormData
  const headers = new Headers(init.headers ?? {});
  const isForm = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (!isForm && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    // токен протух/невалиден — чистим и уводим на логин
    logoutClient();
    if (typeof window !== 'undefined') window.location.assign('/login');
    throw new Error('Unauthorized');
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || res.statusText);
  }
  return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
}

export async function login(email: string, password: string): Promise<LoginResp> {
  return apiFetch<LoginResp>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export type UserRole = 'student' | 'comendant' | 'head' | 'guard';
export type Me = {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
  phone?: string | null;
};

export function getMe() {
  return apiFetch<Me>('/users/me');
}


export type Announcement = {
  id: string;
  title: string;
  body: string;
  image_url?: string | null;
  publish_at: string; // ISO
};


export async function getAnnouncements(): Promise<Announcement[]> {
  return apiFetch<Announcement[]>('/announcements');
}

export async function createAnnouncementApi(params: { title: string; body: string; image?: File | null }) {
  const form = new FormData();
  form.append('title', params.title);
  form.append('body', params.body);
  if (params.image) form.append('image', params.image);
  const token = localStorage.getItem('access_token');

  const r = await fetch(`${API_BASE}/announcements`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(t || `HTTP ${r.status}`);
  }
  return r.json() as Promise<Announcement>;
}


export type TicketType = 'repair' | 'maintenance' | 'receipt' | 'large_item'; 
export type TicketStatus = 'in_processing' | 'in_work' | 'done';

export type TicketAttachment = {
  file_name: string;
  url: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  created_at: string; // ISO
  attachments: TicketAttachment[];
};

export async function getMyTickets(): Promise<Ticket[]> {
  return apiFetch<Ticket[]>('/tickets/me');
}

export async function createTicketApi(params: {
  title: string;
  description: string;
  type: TicketType;
  files?: File[];
}) {
  const form = new FormData();
  form.append('title', params.title);
  form.append('description', params.description);
  form.append('type', params.type);
  (params.files ?? []).forEach(f => form.append('files', f));

  const token = localStorage.getItem('access_token');
  const r = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  if (!r.ok) {
    throw new Error(await r.text());
  }
  return r.json() as Promise<Ticket>;
}

export type TicketAdmin = {
  id: string;
  title: string;
  description: string;
  type: 'repair'|'maintenance'|'receipt'|'large_item';
  status: 'in_processing'|'in_work'|'done';
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  created_by_id: string;
  created_by_email?: string | null;
  created_by_name?: string | null;
  assigned_to_id?: string | null;
  assigned_to_email?: string | null;
  assigned_to_name?: string | null;
  admin_comment?: string | null;
  attachments: { file_name: string; url: string }[];
};

export async function adminGetTickets(params?: {
  status?: 'in_processing'|'in_work'|'done';
  type?: 'repair'|'maintenance'|'receipt'|'large_item';
  only_unassigned?: boolean;
}): Promise<TicketAdmin[]> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.type) q.set('type', params.type);
  if (params?.only_unassigned) q.set('only_unassigned', 'true');
  const p = q.toString();
  return apiFetch<TicketAdmin[]>('/tickets' + (p ? `?${p}` : ''));
}

export async function adminUpdateTicket(id: string, body: {
  status?: 'in_processing'|'in_work'|'done';
  assign_self?: boolean;
  admin_comment?: string | null;
}): Promise<TicketAdmin> {
  return apiFetch<TicketAdmin>(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export type MyRoom = {
  room_id: string;
  room_number: string;
  last_assessment?: {
    score: number;
    comment?: string | null;
    assessed_at: string;         // ISO
    assessed_by_name?: string | null;
  } | null;
};

export async function getMyRoom(): Promise<MyRoom> {
  return apiFetch<MyRoom>('/rooms/me');
}

// для админов
export async function resolveRoomByNumber(number: string): Promise<{id: string; number: string}> {
  return apiFetch<{id:string; number:string}>(`/rooms/by-number/${encodeURIComponent(number)}`);
}

export async function createRoomAssessment(roomId: string, score: number, comment?: string) {
  return apiFetch(`/rooms/${roomId}/assess`, {
    method: 'POST',
    body: JSON.stringify({ score, comment: comment || null }),
  });
}

// types
export type GuestPassStatus = 'pending'|'approved'|'rejected'|'checked_in'|'checked_out'|'expired';

export type GuestPass = {
  id: string;
  guest_full_name: string;
  guest_document?: string | null;
  note?: string | null;
  planned_from: string;
  planned_to?: string | null;
  status: GuestPassStatus;
  code?: string | null;
  code_expires_at?: string | null;
  checked_in_at?: string | null;
  checked_out_at?: string | null;
  created_at: string;
};

export type GuestPassAdmin = GuestPass & {
  resident_id: string;
  resident_name?: string | null;
  approved_by?: string | null;
};

// student
export async function createGuestPass(body: {
  guest_full_name: string;
  guest_document?: string;
  note?: string;
  planned_from: string;  // ISO
  planned_to?: string;   // ISO
}): Promise<GuestPass> {
  return apiFetch<GuestPass>('/guest-passes', { method: 'POST', body: JSON.stringify(body) });
}

export async function getMyGuestPasses(): Promise<GuestPass[]> {
  return apiFetch<GuestPass[]>('/guest-passes/me');
}

// admin
export async function adminGetGuestPasses(params?: { status?: GuestPassStatus; date_from?: string; date_to?: string; }): Promise<GuestPassAdmin[]> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.date_from) q.set('date_from', params.date_from);
  if (params?.date_to) q.set('date_to', params.date_to);
  const p = q.toString();
  return apiFetch<GuestPassAdmin[]>('/guest-passes' + (p ? `?${p}` : ''));
}

export async function adminUpdateGuestPass(id: string, action: 'approve'|'reject'): Promise<GuestPassAdmin> {
  return apiFetch<GuestPassAdmin>(`/guest-passes/${id}`, { method:'PATCH', body: JSON.stringify({ action }) });
}

// guard
export async function guardCheckIn(code: string): Promise<{status:'ok'; id:string}> {
  return apiFetch('/guest-passes/check-in', { method:'POST', body: JSON.stringify({ code }) });
}
export async function guardCheckOut(code: string): Promise<{status:'ok'; id:string}> {
  return apiFetch('/guest-passes/check-out', { method:'POST', body: JSON.stringify({ code }) });
}


export type RoomAdmin = {
  id: string;
  number: string;
  capacity?: number | null;
  occupancy: number;
};

export type StudentAdmin = {
  id: string;
  full_name?: string | null;
  email?: string;
  current_room_id?: string | null;
  current_room_number?: string | null;
};

export async function adminRooms(): Promise<RoomAdmin[]> {
  return apiFetch<RoomAdmin[]>('/admin/rooms');
}

export async function adminCreateRoom(number: string, capacity?: number) {
  return apiFetch('/admin/rooms', {
    method: 'POST',
    body: JSON.stringify({ number, capacity: capacity ?? null }),
  });
}

export async function adminDeleteRoom(id: string) {
  return apiFetch(`/admin/rooms/${id}`, { method: 'DELETE' });
}

export async function adminSearchStudents(query: string): Promise<StudentAdmin[]> {
  const q = new URLSearchParams();
  if (query) q.set('query', query);
  return apiFetch<StudentAdmin[]>(`/admin/students?${q.toString()}`);
}

export async function adminAssignStudent(userId: string, roomId: string) {
  return apiFetch('/admin/occupancy/assign', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, room_id: roomId }),
  });
}

export async function adminReleaseStudent(userId: string) {
  return apiFetch('/admin/occupancy/release', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });
}

export type ImportRowError = {
  row: number;
  field: string;
  message: string;
  raw?: Record<string, any>;
};
export type ImportResult = {
  total_rows: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: ImportRowError[];
};

export async function adminImportRoomsXlsx(file: File): Promise<ImportResult> {
  const fd = new FormData();
  fd.append('file', file);
  return apiFetch<ImportResult>('/admin/import/rooms', { method: 'POST', body: fd });
}

export async function adminImportStudentsXlsx(file: File): Promise<ImportResult> {
  const fd = new FormData();
  fd.append('file', file);
  return apiFetch<ImportResult>('/admin/import/students', { method: 'POST', body: fd });
}


export async function adminCreateStudent(body: {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  is_active?: boolean;
  room_id?: string | null;
}): Promise<StudentAdmin> {
  return apiFetch<StudentAdmin>('/admin/students', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

