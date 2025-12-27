import { NavLink } from 'react-router-dom';
import { Me } from '../api/client';
import { menuFor } from '../config/menu';

export default function Sidebar({ me }: { me: Me }) {
  const items = menuFor(me.role);
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">Dorm</div>
      <div className="sidebar__user">
        <div className="sidebar__name">{me.full_name ?? me.email}</div>
        <div className="sidebar__role">{roleName(me.role)}</div>
      </div>
      <nav className="sidebar__nav">
        {items.map(i => (
          <NavLink
            key={i.key}
            to={i.path}
            className={({ isActive }) => 'navlink' + (isActive ? ' navlink--active' : '')}
            end
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function roleName(role: Me['role']) {
  switch (role) {
    case 'student': return 'Студент';
    case 'comendant': return 'Комендант';
    case 'guard': return 'Охрана';
    case 'head': return 'Заведующий';
    default: return role;
  }
}
