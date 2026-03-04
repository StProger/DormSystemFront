import { useEffect, useMemo, useState } from 'react';
import { downloadReportExcel, getGuestPassReport } from '../../api/client';
import type { GuestPassReport } from '../../api/client';

import { GUEST_STATUS_RU, ruLabel } from '../../utils/reportLabels';
import { normalizeKey } from '../../utils/normalizeKey';
import { makePalette } from '../../utils/chartPalette';

import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, PointElement, LineElement, ArcElement,
  Tooltip, Legend,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const pieOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } },
};

const barOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
};

const lineOptions = {
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' as const } },
};

function niceDayLabel(isoDay: string) {
  const [y, m, d] = isoDay.split('-');
  if (!y || !m || !d) return isoDay;
  return `${d}.${m}`;
}

export default function GuestPassReportView() {
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [data, setData] = useState<GuestPassReport | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setData(await getGuestPassReport(from || undefined, to || undefined));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const byStatus = useMemo(() => {
    if (!data) return null;
    const labels = data.by_status.map(x => ruLabel(GUEST_STATUS_RU, normalizeKey(x.key)));
    const values = data.by_status.map(x => x.count);
    return { labels, values };
  }, [data]);

  // Doughnut: разные цвета сегментов
  const statusPie = useMemo(() => {
    if (!byStatus) return null;
    const colors = makePalette(byStatus.values.length);
    return { labels: byStatus.labels, datasets: [{ data: byStatus.values, backgroundColor: colors }] };
  }, [byStatus]);

  // Bar: разные цвета столбцов
  const statusBar = useMemo(() => {
    if (!byStatus) return null;
    const colors = makePalette(byStatus.values.length);
    return {
      labels: byStatus.labels,
      datasets: [{ label: 'Количество', data: byStatus.values, backgroundColor: colors }],
    };
  }, [byStatus]);

  // Line: точки разноцветные
  const dayLine = useMemo(() => {
    if (!data) return null;
    const values = data.by_day.map(x => x.count);
    const pointColors = makePalette(values.length);
    return {
      labels: data.by_day.map(x => niceDayLabel(x.day)),
      datasets: [{
        label: 'Посещения по дням',
        data: values,
        borderColor: '#6c5ce7',
        backgroundColor: 'rgba(108,92,231,0.15)',
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        tension: 0.25,
      }],
    };
  }, [data]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Липкий фильтр */}
      <div className="report-filter">
        <div className="report-controls">
          <div>
            <div className="hint" style={{ textAlign: 'left', marginTop: 0 }}>Период: с</div>
            <input className="input input-sm" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div>
            <div className="hint" style={{ textAlign: 'left', marginTop: 0 }}>по</div>
            <input className="input input-sm" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>

          <button className="btn btn-sm" onClick={load} disabled={loading}>
            {loading ? 'Загрузка…' : 'Показать'}
          </button>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => downloadReportExcel('guest_passes', from || undefined, to || undefined)}
          >
            Скачать Excel
          </button>
        </div>
      </div>

      {/* Графики */}
      <div className="report-charts">
        {!data && <p className="p">Нет данных.</p>}

        {data && (
          <div className="report-grid">
            <div className="card" style={{ maxWidth: 'none' }}>
              <div style={{ fontWeight: 900 }}>Гости по статусам</div>
              <div className="report-chart">
                {statusPie && <Doughnut data={statusPie} options={pieOptions} />}
              </div>
            </div>

            <div className="card" style={{ maxWidth: 'none' }}>
              <div style={{ fontWeight: 900 }}>Статусы (столбцы)</div>
              <div className="report-chart">
                {statusBar && <Bar data={statusBar} options={barOptions} />}
              </div>
            </div>

            <div className="card" style={{ maxWidth: 'none', gridColumn: '1 / span 2' }}>
              <div style={{ fontWeight: 900 }}>Динамика по дням</div>
              <div className="report-chart report-chart--wide">
                {dayLine && <Line data={dayLine} options={lineOptions} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}