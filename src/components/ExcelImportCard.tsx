import { useState } from 'react';
import type { ImportResult } from '../api/client';

type Props = {
  title: string;
  hint: string;
  onUpload: (file: File) => Promise<ImportResult>;
};

export default function ExcelImportCard({ title, hint, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [res, setRes] = useState<ImportResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!file) return;
    setLoading(true);
    setErr(null);
    setRes(null);
    try {
      const r = await onUpload(file);
      setRes(r);
    } catch (e:any) {
      setErr(e?.message || 'Ошибка импорта');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{maxWidth:900, display:'grid', gap:10}}>
      <div style={{fontWeight:800, fontSize:18}}>{title}</div>
      <div className="hint">{hint}</div>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button className="btn" onClick={submit} disabled={!file || loading}>
        {loading ? 'Импортируем…' : 'Импортировать'}
      </button>

      {err && <div className="error">{err}</div>}

      {res && (
        <div style={{display:'grid', gap:8}}>
          <div className="ok">
            Всего строк: {res.total_rows} · Добавлено: {res.inserted} · Обновлено: {res.updated} · Пропущено: {res.skipped}
          </div>

          {res.errors.length > 0 && (
            <div className="error">
              Ошибки: {res.errors.length}
              <ul>
                {res.errors.slice(0, 20).map((e, i) => (
                  <li key={i}>
                    row {e.row}: {e.field} — {e.message}
                  </li>
                ))}
              </ul>
              {res.errors.length > 20 && <div>…и ещё {res.errors.length - 20}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
