import { useState } from 'react';
import { createTicketApi } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function LargeItemCreate() {
  const [item, setItem] = useState('Холодильник');
  const [when, setWhen] = useState(''); // ISO-local datetime (строка)
  const [reason, setReason] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    setFiles(list ? Array.from(list) : []);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const title = 'Заявка на вынос крупногабаритных вещей';
      const desc = [
        `Предмет(ы): ${item}`,
        when ? `Планируемое время: ${when}` : null,
        reason ? `Причина: ${reason}` : null,
      ].filter(Boolean).join('\n');

      await createTicketApi({
        title,
        description: desc,
        type: 'large_item',
        files,
      });
      navigate('/app/tickets', { replace: true });
    } catch (e:any) {
      setError('Не удалось отправить заявку');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Внос/вынос крупногабаритных вещей</h1>
      <p className="p">Укажите предмет, планируемое время и (опционально) вложения.</p>

      <form onSubmit={onSubmit} style={{display:'grid', gap:12, maxWidth:640}}>
        <div>
          <label style={{fontSize:12}}>Предмет(ы)</label>
          <input className="input" value={item} onChange={e=>setItem(e.target.value)} placeholder="Напр., Холодильник, шкаф" required />
        </div>

        <div>
          <label style={{fontSize:12}}>Планируемое время (опционально)</label>
          <input className="input" type="datetime-local" value={when} onChange={e=>setWhen(e.target.value)} />
        </div>

        <div>
          <label style={{fontSize:12}}>Причина (опционально)</label>
          <textarea className="input" rows={4} value={reason} onChange={e=>setReason(e.target.value)} />
        </div>

        <div>
          <label style={{fontSize:12}}>Файлы (опционально)</label>
          <input className="input" type="file" multiple onChange={onPickFiles} />
          {!!files.length && <div className="hint">Выбрано файлов: {files.length}</div>}
        </div>

        <button className="btn" disabled={submitting}>
          {submitting ? 'Отправляем…' : 'Отправить заявку'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
