import { useEffect, useMemo, useState } from 'react';
import { downloadReportExcel, getOccupancyReport } from '../../api/client';
import type { OccupancyReport } from '../../api/client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function OccupancyReportView() {
  const [data, setData] = useState<OccupancyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setData(await getOccupancyReport());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const chart = useMemo(() => {
    if (!data) return null;

    const occ = data.summary.occupied_total;
    const free = data.summary.free_total;

    return {
      labels: ['Заселено', 'Свободно'],
      datasets: [
        {
          data: [occ, free],
          // ✅ разные цвета для разных данных внутри одного графика
          backgroundColor: [
            'hsl(255, 75%, 45%)', // Заселено
            'hsl(255, 75%, 82%)', // Свободно
          ],
          borderColor: [
            'hsl(255, 75%, 45%)',
            'hsl(255, 75%, 82%)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  const chartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' as const },
        tooltip: { enabled: true },
      },
      cutout: '65%',
    };
  }, []);

  if (loading) return <p className="p">Загрузка отчёта…</p>;
  if (!data) return <p className="p">Нет данных.</p>;

  return (
    <div className="occupancy-report">
      {/* Сводка — компактная полоса сверху */}
      <div className="card" style={{ maxWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 900, fontSize: 18, marginRight: 'auto' }}>
            Сводка — загрузка {Math.round(data.summary.occupancy_rate * 100)}%
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
            <div>Комнат: <b>{data.summary.rooms_total}</b></div>
            <div>Вместимость: <b>{data.summary.capacity_total}</b></div>
            <div>Заселено: <b>{data.summary.occupied_total}</b></div>
            <div>Свободно: <b>{data.summary.free_total}</b></div>
          </div>
          <div style={{ height: 120, width: 120 }}>
            {chart && <Doughnut data={chart} options={chartOptions} />}
          </div>
          <button
            className="btn btn-sm"
            style={{ width: 'auto' }}
            onClick={() => downloadReportExcel('occupancy')}
          >
            Скачать Excel
          </button>
        </div>
      </div>

      {/* Таблица на всю ширину */}
      <div className="card" style={{ maxWidth: 'none' }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Комнаты</div>
        <div className="hint" style={{ textAlign: 'left', marginTop: 4 }}>Таблица загрузки по комнатам (и последняя оценка, если есть)</div>

        <div className="report-table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th>Комната</th>
                <th style={{ minWidth: 140 }}>Загрузка</th>
                <th>Заселено</th>
                <th>Свободно</th>
                <th>Оценка</th>
                <th style={{ minWidth: 200 }}>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {data.rooms.map((r) => {
                const pct = r.capacity > 0 ? Math.round((r.occupied / r.capacity) * 100) : 0;
                const barColor = pct === 100 ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#22c55e';
                return (
                  <tr key={r.room_id}>
                    <td className="cell-number">{r.number}</td>
                    <td>
                      <div className="occupancy-bar">
                        <div className="occupancy-bar__track">
                          <div className="occupancy-bar__fill" style={{ width: `${pct}%`, background: barColor }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36 }}>{pct}%</span>
                      </div>
                    </td>
                    <td>{r.occupied} / {r.capacity}</td>
                    <td>{r.free}</td>
                    <td>{r.last_rating != null ? <span style={{ fontWeight: 600 }}>{r.last_rating}</span> : <span className="cell-muted">—</span>}</td>
                    <td className="cell-muted">{r.last_rating_comment ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}