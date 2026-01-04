import { useEffect, useState } from 'react';
import { MyRoom, getMyRoom } from '../api/client';

export default function RoomInfo() {
  const [data, setData] = useState<MyRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getMyRoom()
      .then(d => alive && setData(d))
      .catch(()=> alive && setErr('Не удалось загрузить данные комнаты'))
      .finally(()=> alive && setLoading(false));
    return ()=> { alive = false; };
  }, []);

  return (
    <div>
      <h1 className="h1">Моя комната</h1>
      {loading ? <p className="p">Загрузка…</p> :
       err ? <div className="error">{err}</div> :
       !data ? <p className="p">Комната не найдена.</p> :
       <div className="card" style={{maxWidth:720}}>
         <div style={{fontSize:14, color:'#6b7280'}}>Номер комнаты</div>
         <div style={{fontSize:28, fontWeight:800, marginBottom:12}}>{data.room_number}</div>

         <div style={{fontSize:14, color:'#6b7280', marginTop:8}}>Последняя оценка</div>
         {data.last_assessment ? (
          <div>
            <Stars score={data.last_assessment.score} />
            {data.last_assessment.comment && (
              <div style={{marginTop:6, whiteSpace:'pre-wrap'}}>{data.last_assessment.comment}</div>
            )}
            <div style={{fontSize:12, color:'#6b7280', marginTop:6}}>
              Оценил: {data.last_assessment.assessed_by_name ?? '—'} · {fmt(data.last_assessment.assessed_at)}
            </div>
          </div>
         ) : (
           <div className="hint">Пока оценок нет.</div>
         )}
       </div>
      }
    </div>
  );
}

function Stars({ score }:{ score: number }) {
  const s = Math.max(1, Math.min(5, Math.round(score)));
  return (
    <div style={{fontSize:22, letterSpacing:2}}>
      {'★★★★★'.slice(0, s)}<span style={{color:'#d1d5db'}}>{'★★★★★'.slice(s)}</span>
    </div>
  );
}
function fmt(iso: string){
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2,'0');
  const mi = String(d.getMinutes()).padStart(2,'0');
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}
