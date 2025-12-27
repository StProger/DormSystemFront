import { useEffect, useState } from 'react';
import { Announcement, getAnnouncements } from '../api/client';

export default function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAnnouncements()
      .then(d => mounted && setItems(d))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h1 className="h1">Лента объявлений</h1>
      {loading ? (
        <p className="p">Загрузка…</p>
      ) : items.length === 0 ? (
        <p className="p">Пока нет объявлений.</p>
      ) : (
        <div style={{display:'grid', gap:12}}>
          {items.map(a => (
            <div key={a.id} className="card" style={{maxWidth: 760}}>
              <div style={{fontWeight:700, marginBottom:6}}>{a.title}</div>
              <div style={{whiteSpace:'pre-wrap'}}>{a.body}</div>
              {a.image_url && (
                <div style={{marginTop:12}}>
                  <img
                    src={a.image_url}
                    alt=""
                    style={{maxWidth:'100%', borderRadius:12, border:'1px solid #eee'}}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
