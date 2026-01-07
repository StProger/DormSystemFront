import { useEffect } from 'react';
import { logoutClient, serverLogout } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await serverLogout();
      logoutClient();
      navigate('/login', { replace: true });
    })();
  }, [navigate]);

  return null;
}
