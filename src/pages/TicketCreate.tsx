import { useState } from 'react';
import { TicketType, createTicketApi } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function TicketCreate() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<TicketType>('repair');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) { setFiles([]); return; }
    setFiles(Array.from(list));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createTicketApi({ title, description, type, files });
      navigate('/app/tickets', { replace: true });
    } catch (e: any) {
      setError('Не удалось создать заявку');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Создать заявку</h1>
      <p className="p">Заполните данные и (опционально) прикрепите файлы/фото.</p>

      <form onSubmit={onSubmit} style={{display:'grid', gap:12, maxWidth:640}}>
        <div>
          <label style={{fontSize:12}}>Заголовок</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>

        <div>
          <label style={{fontSize:12}}>Тип заявки</label>
          <select className="input" value={type} onChange={e=>setType(e.target.value as TicketType)}>
            <option value="repair">Ремонт</option>
            <option value="maintenance">Обслуживание</option>
            <option value="receipt">Квитанция</option>
          </select>
        </div>

        <div>
          <label style={{fontSize:12}}>Описание</label>
          <textarea className="input" rows={6} value={description} onChange={e=>setDescription(e.target.value)} required />
        </div>

        <div>
          <label style={{fontSize:12}}>Файлы (опционально)</label>
          <input className="input" type="file" multiple onChange={onPickFiles} />
          {!!files.length && <div className="hint">Выбрано файлов: {files.length}</div>}
        </div>

        <button className="btn" disabled={submitting}>
          {submitting ? 'Отправляем…' : 'Отправить'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
