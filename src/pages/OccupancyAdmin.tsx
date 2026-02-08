import { useEffect, useState } from 'react';
import {
  adminRooms, adminSearchStudents, adminAssignStudent, adminReleaseStudent,
  type RoomAdmin, type StudentAdmin
} from '../api/client';

export default function OccupancyAdmin() {
  const [rooms, setRooms] = useState<RoomAdmin[]>([]);
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState<StudentAdmin[]>([]);
  const [selected, setSelected] = useState<StudentAdmin | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminRooms().then(setRooms).catch(()=>setErr('Не удалось загрузить комнаты'));
  }, []);

  async function search() {
    setErr(null);
    try {
      const list = await adminSearchStudents(query.trim());
      setStudents(list);
      setSelected(null);
      setRoomId('');
    } catch {
      setErr('Не удалось выполнить поиск');
    }
  }

  function pick(s: StudentAdmin) {
    setSelected(s);
    setRoomId(s.current_room_id ?? '');
  }

  async function assign() {
    if (!selected || !roomId) return;
    setErr(null); setMsg(null);
    try {
      await adminAssignStudent(selected.id, roomId);
      setMsg(selected.current_room_id ? 'Переселение выполнено' : 'Заселение выполнено');
      // обновим выбранного студента
      await search();
    } catch (e:any) {
      setErr('Не удалось выполнить заселение/переселение (возможно, нет мест по capacity)');
    }
  }

  async function release() {
    if (!selected) return;
    setErr(null); setMsg(null);
    try {
      await adminReleaseStudent(selected.id);
      setMsg('Выселение выполнено');
      await search();
    } catch {
      setErr('Не удалось выполнить выселение');
    }
  }

  return (
    <div>
      <h1 className="h1">Заселение / переселение / выселение</h1>

      <div className="card" style={{maxWidth:900, display:'grid', gap:12}}>
        <div style={{display:'flex', gap:8}}>
          <input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск студента по ФИО или email" />
          <button className="btn" onClick={search}>Найти</button>
        </div>

        {students.length > 0 && (
          <div style={{display:'grid', gap:8}}>
            {students.map(s => (
              <div
                key={s.id}
                className="card"
                style={{
                  cursor:'pointer',
                  border: selected?.id === s.id ? '1px solid #7c3aed' : undefined
                }}
                onClick={()=>pick(s)}
              >
                <div style={{fontWeight:700}}>{s.full_name ?? s.email ?? s.id}</div>
                <div className="hint">
                  Текущая комната: {s.current_room_number ?? '—'}
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div className="card" style={{display:'grid', gap:10}}>
            <div style={{fontWeight:800}}>
              Выбран: {selected.full_name ?? selected.email ?? selected.id}
            </div>

            <div>
              <label style={{fontSize:12}}>Комната</label>
              <select className="input" value={roomId} onChange={e=>setRoomId(e.target.value)}>
                <option value="">— выберите комнату —</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.number} (занято {r.occupancy}{r.capacity ? `/${r.capacity}` : ''})
                  </option>
                ))}
              </select>
            </div>

            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <button className="btn" onClick={assign} disabled={!roomId}>
                {selected.current_room_id ? 'Переселить' : 'Заселить'}
              </button>
              <button className="btn btn-outline" onClick={release} disabled={!selected.current_room_id}>
                Выселить
              </button>
            </div>
          </div>
        )}

        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </div>
    </div>
  );
}
