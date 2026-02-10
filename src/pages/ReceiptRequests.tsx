import { useEffect, useState } from 'react';
import { createReceiptRequest, getMyReceiptRequests } from '../api/client';
import type { ReceiptRequest } from '../api/client';

export default function ReceiptRequests() {
  const [items, setItems] = useState<ReceiptRequest[]>([]);
  const [period, setPeriod] = useState('');
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState<string|null>(null);
  const [err, setErr] = useState<string|null>(null);
  const [sendToEmail, setSendToEmail] = useState(false);
  
  async function load() {
    setItems(await getMyReceiptRequests());
  }
  useEffect(() => { load(); }, []);

  async function submit() {
    setMsg(null); setErr(null);
    try {
      await createReceiptRequest({
            period: period.trim() || undefined,
            comment: comment.trim() || undefined,
            send_to_email: sendToEmail,
});
      setPeriod(''); setComment(''); setSendToEmail(false);
      setMsg('Запрос отправлен');
      await load();
    } catch (e:any) {
      setErr(e?.message || 'Не удалось отправить запрос');
    }
  }

  return (
    <div>
      <h1 className="h1">Квитанции</h1>

      <div className="card" style={{maxWidth:720, display:'grid', gap:10}}>
        <div>
          <label style={{fontSize:12}}>Период (опционально)</label>
          <input className="input" value={period} onChange={e=>setPeriod(e.target.value)} placeholder="Напр. 02.2026" />
        </div>
        <div>
          <label style={{fontSize:12}}>Комментарий (опционально)</label>
          <textarea className="input" value={comment} onChange={e=>setComment(e.target.value)} rows={3} />
        </div>
        <label style={{display:'flex', gap:8, alignItems:'center'}}>
            <input
                type="checkbox"
                checked={sendToEmail}
                onChange={(e)=>setSendToEmail(e.target.checked)}
            />
            <span>Отправить квитанцию на e-mail</span>
        </label>
        <button className="btn" onClick={submit}>Запросить квитанцию</button>
        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </div>

      <h2 className="h2" style={{marginTop:16}}>Мои запросы</h2>
      <div style={{display:'grid', gap:8, maxWidth:900}}>
        {items.map(x => (
          <div key={x.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div style={{fontWeight:800}}>{x.period || 'Период не указан'}</div>
              <div className="hint">Статус: {x.status}</div>
            </div>
            {x.comment && <div style={{marginTop:6}}>{x.comment}</div>}
            <div className="hint" style={{marginTop:6}}>
                Email: {x.send_to_email ? 'да' : 'нет'}
            </div>
            <div className="hint" style={{marginTop:6}}>Создано: {new Date(x.created_at).toLocaleString()}</div>
          </div>
        ))}
        {items.length === 0 && <p className="p">Пока запросов нет.</p>}
      </div>
    </div>
  );
}
