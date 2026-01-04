import { useState } from 'react';
import { resolveRoomByNumber, createRoomAssessment } from '../api/client';

export default function AssessRooms() {
  const [number, setNumber] = useState('');
  const [room, setRoom] = useState<{id:string; number:string} | null>(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function findRoom() {
    setMsg(null); setErr(null);
    try {
      const r = await resolveRoomByNumber(number.trim());
      setRoom(r);
    } catch {
      setRoom(null);
      setErr('Комната не найдена');
    }
  }

  async function submit() {
    if (!room) return;
    setLoading(true); setMsg(null); setErr(null);
    try {
      await createRoomAssessment(room.id, score, comment.trim() || undefined);
      setMsg('Оценка сохранена');
      setComment('');
    } catch {
      setErr('Не удалось сохранить оценку');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Оценка комнат</h1>

      <div className="card" style={{maxWidth:720, display:'grid', gap:12}}>
        <div>
          <label style={{fontSize:12}}>Номер комнаты</label>
          <div style={{display:'flex', gap:8}}>
            <input className="input" value={number} onChange={e=>setNumber(e.target.value)} placeholder="Например, 412" />
            <button className="btn" onClick={findRoom}>Найти</button>
          </div>
        </div>

        {room && (
          <>
            <div className="hint">Комната найдена: <b>{room.number}</b></div>
            <div>
              <label style={{fontSize:12}}>Оценка (1–5)</label>
              <select className="input" value={score} onChange={e=>setScore(Number(e.target.value))}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={{fontSize:12}}>Комментарий (опционально)</label>
              <textarea className="input" rows={4} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Например: чисто, мебель в порядке" />
            </div>
            <button className="btn" onClick={submit} disabled={loading}>{loading ? 'Сохраняем…' : 'Сохранить оценку'}</button>
          </>
        )}

        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </div>
    </div>
  );
}
