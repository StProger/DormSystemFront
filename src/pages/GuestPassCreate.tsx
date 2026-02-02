import { useState } from 'react';
import { createGuestPass } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function GuestPassCreate() {
  const [fullName, setFullName] = useState('');
  const [doc, setDoc] = useState('');
  const [note, setNote] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await createGuestPass({
        guest_full_name: fullName.trim(),
        guest_document: doc.trim() || undefined,
        note: note.trim() || undefined,
        planned_from: from,
        planned_to: to || undefined,
      });
      navigate('/app/guests', { replace: true });
    } catch (e:any) {
      setErr('Не удалось создать заявку на гостя');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Оформление гостевого прохода</h1>
      <form onSubmit={onSubmit} style={{display:'grid', gap:12, maxWidth:640}}>
        <div>
          <label style={{fontSize:12}}>ФИО гостя</label>
          <input className="input" value={fullName} onChange={e=>setFullName(e.target.value)} required />
        </div>
        <div>
          <label style={{fontSize:12}}>Документ (серия/номер) — опционально</label>
          <input className="input" value={doc} onChange={e=>setDoc(e.target.value)} />
        </div>
        <div>
          <label style={{fontSize:12}}>Цель/комментарий — опционально</label>
          <textarea className="input" rows={3} value={note} onChange={e=>setNote(e.target.value)} />
        </div>
        <div>
          <label style={{fontSize:12}}>Планируемое время визита</label>
          <div style={{display:'grid', gap:8, gridTemplateColumns:'1fr 1fr'}}>
            <input className="input" type="datetime-local" value={from} onChange={e=>setFrom(e.target.value)} required />
            <input className="input" type="datetime-local" value={to} onChange={e=>setTo(e.target.value)} />
          </div>
        </div>
        <button className="btn" disabled={loading}>{loading ? 'Отправляем…' : 'Отправить'}</button>
        {err && <div className="error">{err}</div>}
      </form>
    </div>
  );
}
