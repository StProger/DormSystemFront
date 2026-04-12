import { useEffect, useMemo, useState } from 'react';
import { getReportsList } from '../api/client';
import type { ReportInfo } from '../api/client';
import OccupancyReportView from './reports/OccupancyReportView';
import TicketsReportView from './reports/TicketsReportView';
import GuestPassReportView from './reports/GuestPassReportView';

export default function Reports() {
  const [reports, setReports] = useState<ReportInfo[]>([]);
  const [selected, setSelected] = useState<string>('occupancy');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await getReportsList();
        setReports(r);
        if (r.length && !r.find(x => x.id === selected)) setSelected(r[0].id);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedInfo = useMemo(() => reports.find(r => r.id === selected), [reports, selected]);

  return (
    <div>
      <h1 className="h1">Отчётность</h1>

      <div className="card" style={{maxWidth: 'none', display:'grid', gap:10}}>
        <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
          <div style={{minWidth: 260}}>
            <div className="hint">Выберите отчёт</div>
            <select className="input" value={selected} onChange={(e)=>setSelected(e.target.value)}>
              {reports.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            </select>
          </div>
          {selectedInfo && (
            <div style={{flex:1}}>
              <div className="hint">Описание</div>
              <div style={{fontWeight:700}}>{selectedInfo.description}</div>
            </div>
          )}
        </div>
      </div>

      {loading ? <p className="p">Загрузка…</p> : (
        <div style={{marginTop:12}}>
          {selected === 'occupancy' && <OccupancyReportView />}
          {selected === 'tickets' && <TicketsReportView />}
          {selected === 'guest_passes' && <GuestPassReportView />}
        </div>
      )}
    </div>
  );
}