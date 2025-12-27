import { useOutletContext } from 'react-router-dom';
import type { Me } from '../api/client';
import TicketsStudent from './TicketsStudent';
import TicketsAdmin from './TicketsAdmin';

type Ctx = { me: Me };

export default function Tickets() {
  const { me } = useOutletContext<Ctx>();
  if (me.role === 'comendant' || me.role === 'head') {
    return <TicketsAdmin />;
  }
  return <TicketsStudent />;
}
