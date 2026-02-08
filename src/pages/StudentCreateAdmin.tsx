import { useEffect, useState } from 'react';
import { adminCreateStudent, adminRooms } from '../api/client';
import type { RoomAdmin } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function StudentCreateAdmin() {
  const [rooms, setRooms] = useState<RoomAdmin[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [roomId, setRoomId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    adminRooms().then(setRooms).catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      await adminCreateStudent({
        email: email.trim(),
        password,
        full_name: fullName.trim() || undefined,
        phone: phone.trim() || undefined,
        is_active: isActive,
        room_id: roomId || null,
      });
      setMsg('Студент создан');
      // можно перекинуть на заселение/переселение
      setTimeout(() => navigate('/app/occupancy-admin'), 400);
    } catch (e:any) {
      setErr(e?.message || 'Не удалось создать студента');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Добавить студента</h1>

      <form onSubmit={submit} className="card" style={{maxWidth:720, display:'grid', gap:12}}>
        <div>
          <label style={{fontSize:12}}>Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>

        <div>
          <label style={{fontSize:12}}>Пароль</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <div className="hint">Минимум 6 символов</div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div>
            <label style={{fontSize:12}}>ФИО (опционально)</label>
            <input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} />
          </div>
          <div>
            <label style={{fontSize:12}}>Телефон (опционально)</label>
            <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{fontSize:12}}>Комната (опционально, для заселения сразу)</label>
          <select className="input" value={roomId} onChange={e=>setRoomId(e.target.value)}>
            <option value="">— не заселять сейчас —</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>
                {r.number} (занято {r.occupancy}{r.capacity ? `/${r.capacity}` : ''})
              </option>
            ))}
          </select>
        </div>

        <label style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="checkbox" checked={isActive} onChange={e=>setIsActive(e.target.checked)} />
          <span>Активный пользователь</span>
        </label>

        <button className="btn" disabled={loading}>
          {loading ? 'Создаём…' : 'Создать'}
        </button>

        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
