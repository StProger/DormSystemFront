import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getMe, Me } from '../api/client';
import { clearToken } from '../api/auth';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    getMe()
      .then(u => mounted && setMe(u))
      .catch(() => {
        setError('Сессия истекла. Войдите заново.');
        clearToken();
        navigate('/login', { replace: true });
      });
    return () => { mounted = false; };
  }, [navigate]);

  if (!me && !error) {
    return <div className="splash">Загружаем профиль…</div>;
  }

  return (
    <div className="layout">
      {me && <Sidebar me={me} />}
      <main className="content">
        <div className="content__inner">
          <Outlet context={{ me }} />
        </div>
      </main>
    </div>
  );
}
