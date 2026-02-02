import { useState } from 'react';
import { guardCheckIn, guardCheckOut } from '../api/client';

export default function GuestPassCheck() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function doCheck(fn: (c:string)=>Promise<any>) {
    setLoading(true); setErr(null); setMsg(null);
    try {
      await fn(code.trim());
      setMsg('Операция выполнена');
    } catch (e:any) {
      setErr('Ошибка: ' + (e?.message || 'не удалось выполнить'));
    } finally { setLoading(false); }
  }

  return (
    <div>
      <h1 className="h1">Проверка гостя</h1>
      <div className="card" style={{maxWidth:520, display:'grid', gap:12}}>
        <div>
          <label style={{fontSize:12}}>Код</label>
          <input className="input" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Введи код" />
        </div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <button className="btn" onClick={()=>doCheck(guardCheckIn)} disabled={loading || !code}>Вход</button>
          <button className="btn" onClick={()=>doCheck(guardCheckOut)} disabled={loading || !code}>Выход</button>
        </div>
        {msg && <div className="ok">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </div>
    </div>
  );
}
