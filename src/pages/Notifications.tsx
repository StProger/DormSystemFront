import { useEffect, useState } from 'react';
import { getMyNotifications, getNotification, markNotificationRead } from '../api/client';
import type { NotificationListItem, NotificationDetail } from '../api/client';

export default function Notifications() {
  const [list, setList] = useState<NotificationListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<NotificationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadList() {
    setLoading(true);
    try {
      const items = await getMyNotifications();
      setList(items);
      window.dispatchEvent(new Event('notifications:refresh'));
    } finally {
      setLoading(false);
    }
  }

  async function open(id: string) {
    setSelectedId(id);
    const d = await getNotification(id);
    setDetail(d);

    if (!d.is_read) {
      await markNotificationRead(id);
      // локально пометим + обновим колокольчик
      setList(prev => prev.map(x => x.id === id ? { ...x, is_read: true } : x));
      window.dispatchEvent(new Event('notifications:refresh'));
    }
  }

  useEffect(() => { loadList(); }, []);

  return (
    <div style={{display:'grid', gridTemplateColumns:'380px 1fr', gap:12}}>
      <div>
        <h1 className="h1">Уведомления</h1>
        {loading ? <p className="p">Загрузка…</p> : (
          <div style={{display:'grid', gap:8}}>
            {list.map(n => (
              <button
                key={n.id}
                className="card"
                onClick={() => open(n.id)}
                style={{
                  textAlign: 'left',
                  border: n.id === selectedId ? '1px solid #7c3aed' : undefined,
                  opacity: n.is_read ? 0.75 : 1,
                }}
              >
                <div style={{display:'flex', justifyContent:'space-between', gap:8}}>
                  <div style={{fontWeight:800}}>{n.title}</div>
                  {!n.is_read && <span style={{color:'#7c3aed', fontWeight:900}}>●</span>}
                </div>
                <div className="hint">{new Date(n.created_at).toLocaleString()}</div>
                <div style={{marginTop:6}}>{n.preview}</div>
              </button>
            ))}
            {list.length === 0 && <p className="p">Пока нет уведомлений.</p>}
          </div>
        )}
      </div>

      <div>
        <h2 className="h2">Просмотр</h2>
        {!detail ? (
          <div className="card"><p className="p">Выберите уведомление слева.</p></div>
        ) : (
          <div className="card" style={{display:'grid', gap:10}}>
            <div style={{fontWeight:900, fontSize:20}}>{detail.title}</div>
            <div className="hint">{new Date(detail.created_at).toLocaleString()}</div>
            <div style={{whiteSpace:'pre-wrap'}}>{detail.body}</div>

            {detail.attachments.length > 0 && (
              <div>
                <div style={{fontWeight:800, marginBottom:6}}>Вложения</div>
                <div style={{display:'grid', gap:6}}>
                  {detail.attachments.map(a => (
                    <a key={a.id} className="btn btn-outline" href={a.download_url} target="_blank">
                      📎 {a.filename}{a.size_bytes ? ` (${Math.round(a.size_bytes/1024)} KB)` : ''}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
