import { useState } from 'react';
import { login } from '../api/client';
import { setToken } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await login(email, password);
      setToken(resp.access_token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Неверная почта или пароль');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-wrap">
      <form className="card" onSubmit={onSubmit}>
        <h1 className="h1">Вход</h1>
        <p className="p">Введите почту и пароль, выданные администратором.</p>

        <div style={{display:'grid', gap:12}}>
          <div>
            <label style={{fontSize:12}}>Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{fontSize:12}}>Пароль</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="error">{error}</div>}
          </div>

          <button className="btn" disabled={loading}>
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </div>

        <div className="hint">Демо: admin@example.com / admin123</div>
      </form>
    </div>
  );
}
