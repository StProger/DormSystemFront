import { useEffect, useState } from 'react';
import { Ticket, getMyTickets } from '../api/client';

export default function Tickets() {
  const [items, setItems] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getMyTickets()
      .then(d => mounted && setItems(d))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h1 className="h1">Мои заявки</h1>
      {loading ? (
        <p className="p">Загрузка…</p>
      ) : items.length === 0 ? (
        <p className="p">У вас пока нет заявок.</p>
      ) : (
        <div style={{display:'grid', gap:12}}>
          {items.map(t => (
            <div key={t.id} className="card" style={{maxWidth: 760}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <div style={{fontWeight:700}}>{t.title}</div>
                <StatusBadge status={t.status} />
              </div>
              <div style={{fontSize:12, color:'#6b7280', margin:'6px 0 8px 0'}}>
                Тип: {prettyType(t.type)} · Создана: {formatDate(t.created_at)}
              </div>
              <div style={{whiteSpace:'pre-wrap'}}>{t.description}</div>

              {t.attachments?.length ? (
                <div style={{marginTop:12, display:'grid', gap:8}}>
                  {t.attachments.map((a, i) => (
                    <div key={i} style={{fontSize:13}}>
                      <a href={a.url} target="_blank" rel="noreferrer">{a.file_name}</a>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }:{status: 'in_processing'|'in_work'|'done'}) {
  const map = {
    in_processing: { bg: '#fff7ed', bd: '#ffedd5', text: '#c2410c', label: 'В обработке' },
    in_work: { bg: '#eff6ff', bd: '#dbeafe', text: '#1d4ed8', label: 'В работе' },
    done: { bg: '#ecfdf5', bd: '#d1fae5', text: '#047857', label: 'Готово' },
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

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth()+1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}


