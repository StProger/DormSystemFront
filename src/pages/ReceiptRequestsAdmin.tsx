import { useEffect, useState } from 'react';
import { adminGetReceiptRequests, adminRespondReceiptRequest } from '../api/client';
import type { ReceiptRequest } from '../api/client';

export default function ReceiptRequestsAdmin() {
  const [items, setItems] = useState<ReceiptRequest[]>([]);
  const [status, setStatus] = useState<string>('pending');
  const [title, setTitle] = useState('Квитанция на оплату');
  const [body, setBody] = useState('Квитанция подготовлена. Файл во вложении.');
  const [files, setFiles] = useState<FileList | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string|null>(null);
  const [err, setErr] = useState<string|null>(null);

  async function load() {
    setItems(await adminGetReceiptRequests(status || undefined));
  }
  useEffect(() => { load(); }, [status]);

  async function respond(id: string) {
    setMsg(null); setErr(null);
    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('body', body.trim());
    if (files) Array.from(files).forEach(f => fd.append('files', f));

    try {
      await adminRespondReceiptRequest(id, fd);
      setMsg('Ответ отправлен, запрос закрыт');
      setActiveId(null);
      setFiles(null);
      await load();
      window.dispatchEvent(new Event('notifications:refresh'));
    } catch (e:any) {
      setErr(e?.message || 'Не удалось обработать запрос');
    }
  }

  return (
    <div>
      <h1 className="h1">Запросы квитанций</h1>

      <div style={{display:'flex', gap:10, marginBottom:10}}>
        <select className="input" value={status} onChange={e=>setStatus(e.target.value)} style={{maxWidth:240}}>
          <option value="pending">pending</option>
          <option value="processed">processed</option>
          <option value="rejected">rejected</option>
        </select>
        <button className="btn" onClick={load}>Обновить</button>
      </div>

      {msg && <div className="ok">{msg}</div>}
      {err && <div className="error">{err}</div>}

      <div style={{display:'grid', gap:10, maxWidth:1000}}>
        {items.map(x => (
          <div key={x.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div style={{fontWeight:900}}>Запрос {x.period ?? '(без периода)'}</div>
              <div className="hint">{new Date(x.created_at).toLocaleString()}</div>
            </div>
            {x.comment && <div style={{marginTop:6}}>{x.comment}</div>}
            <div className="hint" style={{marginTop:6}}>Статус: {x.status}</div>

            {x.status === 'pending' && (
              <div style={{marginTop:10, display:'grid', gap:8}}>
                <button className="btn btn-outline" onClick={() => setActiveId(activeId === x.id ? null : x.id)}>
                  {activeId === x.id ? 'Скрыть форму' : 'Ответить (уведомлением)'}
                </button>

                {activeId === x.id && (
                  <div className="card" style={{display:'grid', gap:8}}>
                    <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
                    <textarea className="input" rows={4} value={body} onChange={e=>setBody(e.target.value)} />
                    <input type="file" multiple onChange={e=>setFiles(e.target.files)} />
                    <button className="btn" onClick={() => respond(x.id)}>Отправить и закрыть</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="p">Нет запросов.</p>}
      </div>
    </div>
  );
}
