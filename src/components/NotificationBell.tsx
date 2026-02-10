import { useEffect, useState } from 'react';
import { getUnreadCount } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const nav = useNavigate();

  async function refresh() {
    try {
      const r = await getUnreadCount();
      setUnread(r.unread);
    } catch {}
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30000);

    const handler = () => refresh();
    window.addEventListener('notifications:refresh', handler);

    return () => {
      clearInterval(t);
      window.removeEventListener('notifications:refresh', handler);
    };
  }, []);

  return (
    <button
      className="btn btn-outline"
      style={{ position: 'relative' }}
      onClick={() => nav('/app/notifications')}
      title="Уведомления"
    >
      🔔
      {unread > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            background: '#7c3aed',
            color: 'white',
            borderRadius: 999,
            padding: '2px 7px',
            fontSize: 12,
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {unread}
        </span>
      )}
    </button>
  );
}
