import { useEffect, useMemo, useState } from 'react';
import { TicketAdmin, adminGetTickets, adminUpdateTicket } from '../api/client';

type Status = 'in_processing'|'in_work'|'done'|''; 
type TType = 'repair'|'maintenance'|'receipt'|'large_item'|'';

export default function TicketsAdmin() {
  const [items, setItems] = useState<TicketAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>('');
  const [type, setType] = useState<TType>('');
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGetTickets({
        status: (status || undefined) as any,
        type: (type || undefined) as any,
        only_unassigned: onlyUnassigned,
      });
      setItems(data);
    } catch (e:any) {
      setError('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status, type, onlyUnassigned]);

  return (
    <div>
      <h1 className="h1">Обработка заявок</h1>

      <div style={{display:'flex', gap:12, margin:'8px 0 16px'}}>
        <select className="input" value={status} onChange={e=>setStatus(e.target.value as Status)} style={{maxWidth:220}}>
          <option value="">Статус: все</option>
          <option value="in_processing">В обработке</option>
          <option value="in_work">В работе</option>
          <option value="done">Готово</option>
        </select>
        <select className="input" value={type} onChange={e=>setType(e.target.value as TType)} style={{maxWidth:260}}>
          <option value="">Тип: все</option>
          <option value="repair">Ремонт</option>
          <option value="maintenance">Обслуживание</option>
          <option value="receipt">Квитанция</option>
          <option value="large_item">Крупногабаритные вещи</option>
        </select>
        <label style={{display:'flex', alignItems:'center', gap:8}}>
          <input type="checkbox" checked={onlyUnassigned} onChange={e=>setOnlyUnassigned(e.target.checked)} />
          Только без назначенного
        </label>
        <button className="btn" onClick={load}>Обновить</button>
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <p className="p">Загрузка…</p>
      ) : items.length === 0 ? (
        <p className="p">Заявок не найдено.</p>
      ) : (
        <div style={{display:'grid', gap:12}}>
          {items.map(t => (
            <TicketCard key={t.id} t={t} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function TicketCard({ t, onChanged }:{ t: TicketAdmin; onChanged: ()=>void }) {
  const [comment, setComment] = useState(t.admin_comment ?? '');

  async function setStatus(s: 'in_processing'|'in_work'|'done') {
    await adminUpdateTicket(t.id, { status: s, admin_comment: comment || null });
    onChanged();
  }
  async function assignSelf() {
    await adminUpdateTicket(t.id, { assign_self: true, admin_comment: comment || null });
    onChanged();
  }

  return (
    <div className="card" style={{maxWidth: 980}}>
      <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
        <div style={{fontWeight:700}}>{t.title}</div>
        <StatusBadge status={t.status} />
      </div>

      <div style={{fontSize:12, color:'#6b7280', margin:'6px 0 8px'}}>
        Тип: {prettyType(t.type)} · Создана: {fmt(t.created_at)}
        {t.assigned_to_name || t.assigned_to_email ? <> · Назначено: {t.assigned_to_name ?? t.assigned_to_email}</> : null}
        {t.closed_at ? <> · Закрыта: {fmt(t.closed_at)}</> : null}
      </div>

      <div style={{whiteSpace:'pre-wrap', marginBottom:8}}>{t.description}</div>

      {t.attachments?.length ? (
        <div style={{margin:'8px 0', display:'grid', gap:6}}>
          {t.attachments.map((a, i) => (
            <div key={i} style={{fontSize:13}}>
              <a href={a.url} target="_blank" rel="noreferrer">{a.file_name}</a>
            </div>
          ))}
        </div>
      ) : null}

      <div style={{display:'grid', gap:8, marginTop:10}}>
        <label style={{fontSize:12}}>Служебный комментарий</label>
        <textarea className="input" rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Комментарий для истории обработки (опц.)" />
      </div>

      <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
        <button className="btn" onClick={assignSelf}>Назначить на меня</button>
        <button className="btn" onClick={()=>setStatus('in_processing')}>Статус: В обработке</button>
        <button className="btn" onClick={()=>setStatus('in_work')}>Статус: В работе</button>
        <button className="btn" onClick={()=>setStatus('done')}>Статус: Готово</button>
      </div>
    </div>
  );
}

function StatusBadge({ status }:{status: 'in_processing'|'in_work'|'done'}) {
  const map = {
    in_processing: { bg: '#fff7ed', bd: '#ffedd5', text: '#c2410c', label: 'В обработке' },
    in_work:      { bg: '#eff6ff', bd: '#dbeafe', text: '#1d4ed8', label: 'В работе' },
    done:         { bg: '#ecfdf5', bd: '#d1fae5', text: '#047857', label: 'Готово' },
  } as const;
  const s = map[status];
  return (
    <span style={{
      background:s.bg, border:`1px solid ${s.bd}`, color:s.text,
      borderRadius:999, padding:'4px 10px', fontSize:12, fontWeight:600
    }}>{s.label}</span>
  );
}
function prettyType(t: 'repair'|'maintenance'|'receipt'|'large_item') {
  switch(t) {
    case 'repair': return 'Ремонт';
    case 'maintenance': return 'Обслуживание';
    case 'receipt': return 'Квитанция';
    case 'large_item': return 'Крупногабаритные вещи';
  }
}
function fmt(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth()+1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}
