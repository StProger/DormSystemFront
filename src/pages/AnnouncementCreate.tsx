import { useState } from 'react';
import { createAnnouncementApi } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function AnnouncementCreate() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setImage(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createAnnouncementApi({ title, body, image });
      navigate('/app/announcements', { replace: true });
    } catch (e: any) {
      setError('Ошибка при публикации объявления');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="h1">Публиковать объявление</h1>
      <p className="p">Заголовок, текст и (опционально) изображение.</p>

      <form onSubmit={onSubmit} style={{display:'grid', gap:12, maxWidth:640}}>
        <div>
          <label style={{fontSize:12}}>Заголовок</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label style={{fontSize:12}}>Текст объявления</label>
          <textarea className="input" rows={6} value={body} onChange={e=>setBody(e.target.value)} required />
        </div>
        <div>
          <label style={{fontSize:12}}>Изображение (опционально)</label>
          <input className="input" type="file" accept="image/*" onChange={onPickFile} />
        </div>

        <button className="btn" disabled={submitting}>
          {submitting ? 'Публикуем…' : 'Опубликовать'}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}
