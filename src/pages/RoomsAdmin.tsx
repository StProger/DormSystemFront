import { useEffect, useState } from 'react';
import { adminRooms, adminCreateRoom, adminDeleteRoom, type RoomAdmin } from '../api/client';

export default function RoomsAdmin() {
  const [rooms, setRooms] = useState<RoomAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState<string>('');
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      setRooms(await adminRooms());
    } catch {
      setErr('Не удалось загрузить комнаты');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setErr(null); setMsg(null);
    try {
      await adminCreateRoom(number.trim(), capacity ? Number(capacity) : undefined);
      setNumber('');
      setCapacity('');
      setMsg('Комната добавлена');
      load();
    } catch (e:any) {
      setErr('Не удалось добавить комнату (проверь уникальность номера / capacity)');
    }
  }

  async function remove(id: string, occ: number) {
    if (occ > 0) { setErr('Нельзя удалить комнату: в ней есть проживающие'); return; }
    if (!confirm('Удалить комнату?')) return;
    setErr(null); setMsg(null);
    try {
      await adminDeleteRoom(id);
      setMsg('Комната удалена');
      load();
    } catch {
      setErr('Не удалось удалить комнату');
    }
  }

  return (
    <div>
      <h1 className="h1">Комнаты</h1>

      <div className="card" style={{maxWidth:720, display:'grid', gap:12, marginBottom:12}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div>
            <label style={{fontSize:12}}>Номер комнаты</label>
            <input className="input" value={number} onChange={e=>setNumber(e.target.value)} placeholder="Напр. 412" />
          </div>
          <div>
            <label style={{fontSize:12}}>Вместимость (опц.)</label>
            <input className="input" value={capacity} onChange={e=>setCapacity(e.target.value)} placeholder="Напр. 2" />
          </div>
        </div>
        <button className="btn" onClick={create} disabled={!number.trim()}>Добавить комнату</button>
        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </div>

      {loading ? <p className="p">Загрузка…</p> : (
        rooms.length === 0 ? <p className="p">Комнат пока нет.</p> : (
          <div style={{display:'grid', gap:10, maxWidth:900}}>
            {rooms.map(r => (
              <div key={r.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:800, fontSize:18}}>Комната {r.number}</div>
                  <div className="hint">
                    Загрузка: {r.occupancy}{r.capacity ? ` / ${r.capacity}` : '' }
                  </div>
                </div>
                <button className="btn btn-outline" onClick={()=>remove(r.id, r.occupancy)}>Удалить</button>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
