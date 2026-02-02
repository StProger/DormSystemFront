import { useEffect, useState } from 'react';
import { GuestPass, getMyGuestPasses } from '../api/client';

export default function GuestPassList() {
  const [items, setItems] = useState<GuestPass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getMyGuestPasses().then(d => alive && setItems(d)).finally(()=> alive && setLoading(false));
    return ()=> { alive = false; };
  }, []);

  return (
    <div>
      <h1 className="h1">Мои гости</h1>
      {loading ? <p className="p">Загрузка…</p> :
        items.length === 0 ? <p className="p">Пока нет заявок на гостей.</p> :
        <div style={{display:'grid', gap:12}}>
          {items.map(g => (
            <div key={g.id} className="card" style={{maxWidth:800}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <div style={{fontWeight:700}}>{g.guest_full_name}</div>
                <StatusBadge status={g.status}/>
              </div>
              <div className="hint">План: {fmt(g.planned_from)}{g.planned_to ? ` — ${fmt(g.planned_to)}` : ''}</div>
              {g.note && <div style={{marginTop:6}}>{g.note}</div>}
              {g.status === 'approved' && g.code && (
                <div style={{marginTop:8}}>
                  <div className="hint">Код для поста (покажите охране):</div>
                  <div style={{fontSize:28, fontWeight:800, letterSpacing:2}}>{g.code}</div>
                  {g.code_expires_at && <div className="hint">Действует до: {fmt(g.code_expires_at)}</div>}
                </div>
              )}
              {(g.status === 'checked_in' || g.status === 'checked_out') && (
                <div style={{fontSize:12, color:'#6b7280', marginTop:8}}>
                  Вход: {g.checked_in_at ? fmt(g.checked_in_at) : '—'} · Выход: {g.checked_out_at ? fmt(g.checked_out_at) : '—'}
                </div>
              )}
            </div>
          ))}
        </div>}
    </div>
  );
}

function StatusBadge({ status }:{status: 'pending'|'approved'|'rejected'|'checked_in'|'checked_out'|'expired'}) {
  const map = {
    pending:    { bg:'#fefce8', bd:'#fde68a', text:'#a16207', label:'На рассмотрении' },
    approved:   { bg:'#ecfdf5', bd:'#a7f3d0', text:'#065f46', label:'Одобрено' },
    rejected:   { bg:'#fef2f2', bd:'#fecaca', text:'#991b1b', label:'Отклонено' },
    checked_in: { bg:'#eff6ff', bd:'#bfdbfe', text:'#1d4ed8', label:'Внутри' },
    checked_out:{ bg:'#f3f4f6', bd:'#e5e7eb', text:'#374151', label:'Вышел' },
    expired:    { bg:'#fff7ed', bd:'#fed7aa', text:'#9a3412', label:'Истёк' },
  } as const;
  const s = map[status];
  return <span style={{background:s.bg, border:`1px solid ${s.bd}`, color:s.text, borderRadius:999, padding:'4px 10px', fontSize:12, fontWeight:600}}>{s.label}</span>;
}
function fmt(iso: string){ const d = new Date(iso); const dd = String(d.getDate()).padStart(2,'0'); const mm = String(d.getMonth()+1).padStart(2,'0'); const yyyy=d.getFullYear(); const hh=String(d.getHours()).padStart(2,'0'); const mi=String(d.getMinutes()).padStart(2,'0'); return `${dd}.${mm}.${yyyy} ${hh}:${mi}`; }
