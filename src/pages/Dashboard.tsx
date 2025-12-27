import { useOutletContext } from 'react-router-dom';
import type { Me } from '../api/client';

type Ctx = { me: Me };

export default function Dashboard() {
  const { me } = useOutletContext<Ctx>();
  return (
    <div>
      <h1 className="h1">Личный кабинет</h1>
      <p className="p">Добро пожаловать, {me.full_name ?? me.email}.</p>

      <div style={{display:'grid', gap:12, marginTop:12}}>
        <InfoRow label="Email" value={me.email} />
        <InfoRow label="Роль" value={prettyRole(me.role)} />
        {me.phone && <InfoRow label="Телефон" value={me.phone} />}
      </div>
    </div>
  );
}

function InfoRow({label, value}:{label:string, value:string}) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'160px 1fr', gap:12}}>
      <div style={{color:'#6b7280'}}>{label}</div>
      <div>{value}</div>
    </div>
  );
}

function prettyRole(role: Me['role']) {
  switch (role) {
    case 'student': return 'Студент';
    case 'comendant': return 'Комендант';
    case 'guard': return 'Охрана';
    case 'head': return 'Заведующий';
    default: return role;
  }
}
