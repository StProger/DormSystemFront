import { useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

type Props = {
  appTitle?: string;
  me?: { full_name?: string | null; email?: string; role: string };
};

export default function Header({ appTitle = 'DormSystem', me }: Props) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="left">
        <div className="title" onClick={() => navigate('/app')}>{appTitle}</div>
      </div>

      <div className="right">
        {/* {me && (
          <div className="user">
            <div className="name">{me.full_name ?? me.email}</div>
            <div className="role">{ruRole(me.role)}</div>
          </div>
        )} */}
        <NotificationBell />
        <button className="btn btn-outline" onClick={() => navigate('/logout')}>
          Выход
        </button>
      </div>
    </header>
  );
}

function ruRole(role: string) {
  switch (role) {
    case 'student': return 'Студент';
    case 'comendant': return 'Комендант';
    case 'head': return 'Заведующий';
    case 'guard': return 'Охрана';
    default: return role;
  }
}
