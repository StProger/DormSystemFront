import { useEffect, useState } from 'react';
import type { GuestPassAdmin as GuestPassAdminDto } from '../api/client';
import { adminGetGuestPasses, adminUpdateGuestPass } from '../api/client';

export default function GuestPassAdminPage() {
  const [items, setItems] = useState<GuestPassAdminDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<''|'pending'|'approved'|'rejected'|'checked_in'|'checked_out'|'expired'>('');
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true); setErr(null);
    try {
      const data = await adminGetGuestPasses({ status: (status || undefined) as any });
      setItems(data);
    } catch {
      setErr('Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { load(); }, [status]);

  return (
    <div>
      <h1 className="h1">Гости (администрирование)</h1>
      <div style={{display:'flex', gap:12, margin:'8px 0 16px'}}>
        <select className="input" value={status} onChange={e=>setStatus(e.target.value as any)} style={{maxWidth:260}}>
          <option value="">Статус: все</option>
          <option value="pending">На рассмотрении</option>
          <option value="approved">Одобрено</option>
          <option value="rejected">Отклонено</option>
          <option value="checked_in">Внутри</option>
          <option value="checked_out">Вышел</option>
          <option value="expired">Истёк</option>
        </select>
        <button className="btn" onClick={load}>Обновить</button>
      </div>

      {err && <div className="error">{err}</div>}
      {loading ? (
        <p className="p">Загрузка…</p>
      ) : items.length === 0 ? (
        <p className="p">Нет записей.</p>
      ) : (
        <div style={{display:'grid', gap:12}}>
          {items.map(g => <Card key={g.id} x={g} onReload={load} />)}
        </div>
      )}
    </div>
  );
}

function Card({ x, onReload }:{ x: GuestPassAdminDto; onReload: ()=>void }) {
  async function approve(){ await adminUpdateGuestPass(x.id, 'approve'); onReload(); }
  async function reject(){ await adminUpdateGuestPass(x.id, 'reject'); onReload(); }

  return (
    <div className="card" style={{maxWidth:1000}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div style={{fontWeight:700}}>{x.guest_full_name}</div>
        <Badge status={x.status}/>
      </div>
      <div className="hint">Проживающий: {x.resident_name ?? x.resident_id}</div>
      <div className="hint">План: {fmt(x.planned_from)}{x.planned_to ? ` — ${fmt(x.planned_to)}` : ''}</div>
      {x.note && <div style={{marginTop:6}}>{x.note}</div>}
      {x.status === 'approved' && x.code && (
        <div style={{marginTop:8}}>
          <div className="hint">Код для поста:</div>
          <div style={{fontSize:24, fontWeight:800, letterSpacing:2}}>{x.code}</div>
          {x.code_expires_at && <div className="hint">Действует до: {fmt(x.code_expires_at)}</div>}
        </div>
      )}
      <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
        <button className="btn" onClick={approve} disabled={x.status!=='pending'}>Одобрить</button>
        <button className="btn" onClick={reject} disabled={x.status!=='pending'}>Отклонить</button>
      </div>
    </div>
  );
}

function Badge({ status }:{status: GuestPassAdminDto['status']}) {
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

function fmt(iso: string){
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1,'0').padStart(2,'0'); // fix pad
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2,'0');
  const mi = String(d.getMinutes()).padStart(2,'0');
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}
