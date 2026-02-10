import { useState } from 'react';
import { adminSearchStudents, adminSendNotification } from '../api/client';
import type { StudentAdmin } from '../api/client';

export default function AdminNotificationCompose() {
  const [q, setQ] = useState('');
  const [found, setFound] = useState<StudentAdmin[]>([]);
  const [selected, setSelected] = useState<Record<string, StudentAdmin>>({});
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [msg, setMsg] = useState<string|null>(null);
  const [err, setErr] = useState<string|null>(null);

  async function search() {
    setErr(null);
    try {
      setFound(await adminSearchStudents(q.trim()));
    } catch {
      setErr('Поиск не удался');
    }
  }

  function toggle(s: StudentAdmin) {
    setSelected(prev => {
      const n = { ...prev };
      if (n[s.id]) delete n[s.id];
      else n[s.id] = s;
      return n;
    });
  }

  async function send() {
    setMsg(null); setErr(null);
    const ids = Object.keys(selected);
    if (!ids.length) { setErr('Выберите хотя бы одного получателя'); return; }
    if (!title.trim() || !body.trim()) { setErr('Заполните заголовок и текст'); return; }

    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('body', body.trim());
    fd.append('recipient_ids_json', JSON.stringify(ids));

    if (files) {
      Array.from(files).forEach(f => fd.append('files', f));
    }

    try {
      await adminSendNotification(fd);
      setMsg('Уведомление отправлено');
      setTitle(''); setBody(''); setFiles(null);
      setSelected({});
      window.dispatchEvent(new Event('notifications:refresh'));
    } catch (e:any) {
      setErr(e?.message || 'Не удалось отправить');
    }
  }

  return (
    <div>
      <h1 className="h1">Отправить уведомление</h1>

      <div className="card" style={{maxWidth:1000, display:'grid', gap:10}}>
        <div style={{display:'flex', gap:8}}>
          <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Найти студентов (ФИО или email)" />
          <button className="btn" onClick={search}>Найти</button>
        </div>

        {found.length > 0 && (
          <div style={{display:'grid', gap:6}}>
            {found.map(s => (
              <label key={s.id} className="card" style={{display:'flex', gap:8, alignItems:'center', cursor:'pointer'}}>
                <input type="checkbox" checked={!!selected[s.id]} onChange={()=>toggle(s)} />
                <div>
                  <div style={{fontWeight:800}}>{s.full_name ?? s.email ?? s.id}</div>
                  <div className="hint">Комната: {s.current_room_number ?? '—'}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="hint">Выбрано: {Object.keys(selected).length}</div>

        <div>
          <label style={{fontSize:12}}>Заголовок</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
        </div>

        <div>
          <label style={{fontSize:12}}>Текст</label>
          <textarea className="input" rows={5} value={body} onChange={e=>setBody(e.target.value)} />
        </div>

        <div>
          <label style={{fontSize:12}}>Вложения (опционально)</label>
          <input type="file" multiple onChange={e=>setFiles(e.target.files)} />
        </div>

        <button className="btn" onClick={send}>Отправить</button>

        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </div>
    </div>
  );
}
