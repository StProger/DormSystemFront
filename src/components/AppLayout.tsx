import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { getMe, type Me } from '../api/client';

export default function AppLayout() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getMe().then((d) => { if (alive) setMe(d); })
           .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  if (loading) return <div style={{padding:16}}>Загрузка…</div>;
  if (!me) return null;

  return (
    <div style={{display:'grid', gridTemplateColumns:'240px 1fr', minHeight:'100vh'}}>
      <Sidebar me={me} />
      <div style={{display:'flex', flexDirection:'column', minWidth:0}}>
        <Header me={me} />
        <main style={{padding:16}}>
          <Outlet context={{ me }} />
        </main>
      </div>
    </div>
  );
}
