import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Admin() {
  const [summary, setSummary] = useState(null);

  // opcional: pequeno form para criar novo evento (usa POST /events)
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api
      .get('/admin')
      .then(({ data }) => setSummary(data.summary))
      .catch(console.error);
  }, []);

  async function createEvent(e) {
    e.preventDefault();
    setMsg('');

    const event_date = form.date && form.time ? `${form.date} ${form.time}:00` : '';
    if (!event_date) {
      setMsg('Selecione data e hora.');
      return;
    }

    try {
      await api.post('/events', {
        title: form.title.trim(),
        description: form.description?.trim() || null,
        event_date,
        location: form.location.trim(),
        capacity: Number(form.capacity) || 0,
      });
      setMsg('Evento criado!');
      setForm({ title: '', description: '', date: '', time: '', location: '', capacity: 0 });
    } catch (err) {
      setMsg(err.response?.data?.error || 'Erro ao criar evento');
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '24px auto', padding: 16 }}>
      <h1>Admin</h1>
      {!summary ? (
        <p>Carregando…</p>
      ) : (
        <>
          <p>
            Eventos: <strong>{summary.total_events}</strong> | Capacidade total:{' '}
            <strong>{summary.total_capacity}</strong>
          </p>
          <h3 style={{ marginTop: 16 }}>Criar evento</h3>
          <form onSubmit={createEvent} style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
            <input
              placeholder="Título"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
            <input
              placeholder="Descrição"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input
                type="date"
                required
                aria-label="Data"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
              <input
                type="time"
                step="60"
                required
                aria-label="Horário"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>
            <input
              placeholder="Local"
              required
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
            <input
              placeholder="Capacidade"
              type="number"
              min="0"
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
            />
            <button type="submit">Criar</button>
          </form>
          {msg && <p style={{ color: msg.includes('Erro') ? 'crimson' : 'green' }}>{msg}</p>}
        </>
      )}
    </main>
  );
}
