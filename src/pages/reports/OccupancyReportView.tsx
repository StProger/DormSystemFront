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
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 12 }}>
      <div className="card">
        <div style={{ fontWeight: 900, fontSize: 18 }}>Сводка</div>
        <div className="hint" style={{ marginTop: 6 }}>
          Загрузка: {Math.round(data.summary.occupancy_rate * 100)}%
        </div>

        <div style={{ marginTop: 12, height: 220 }}>
          {chart && <Doughnut data={chart} options={chartOptions} />}
        </div>

        <div style={{ display: 'grid', gap: 6, marginTop: 12 }}>
          <div>Комнат: <b>{data.summary.rooms_total}</b></div>
          <div>Вместимость: <b>{data.summary.capacity_total}</b></div>
          <div>Заселено: <b>{data.summary.occupied_total}</b></div>
          <div>Свободно: <b>{data.summary.free_total}</b></div>
        </div>

        <button
          className="btn btn-sm"
          style={{ marginTop: 12 }}
          onClick={() => downloadReportExcel('occupancy')}
        >
          Скачать Excel
        </button>
      </div>

      <div className="card">
        <div style={{ fontWeight: 900, fontSize: 18 }}>Комнаты</div>
        <div className="hint">Таблица загрузки по комнатам (и последняя оценка, если есть)</div>

        <div style={{ overflow: 'auto', marginTop: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th>Комната</th>
                <th>Вместимость</th>
                <th>Заселено</th>
                <th>Свободно</th>
                <th>Оценка</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {data.rooms.map((r) => (
                <tr key={r.room_id} style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <td>{r.number}</td>
                  <td>{r.capacity}</td>
                  <td>{r.occupied}</td>
                  <td>{r.free}</td>
                  <td>{r.last_rating ?? '—'}</td>
                  <td style={{ maxWidth: 360 }}>{r.last_rating_comment ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}