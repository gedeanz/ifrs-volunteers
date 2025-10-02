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

  if (!summary) {
    return (
      <main className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Painel Administrativo</h1>
      <p className="text-muted">Gerencie eventos e visualize estatísticas</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{summary.total_events}</div>
          <div className="stat-label">Total de Eventos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.total_capacity}</div>
          <div className="stat-label">Capacidade Total</div>
        </div>
      </div>

      <div className="card mt-xl">
        <h3 className="mb-md">Criar Novo Evento</h3>

        <form onSubmit={createEvent} className="form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Título *
            </label>
            <input
              id="title"
              className="form-input"
              placeholder="Ex: Campanha de Doação de Sangue"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descrição
            </label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Descreva o evento..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Data *
              </label>
              <input
                id="date"
                type="date"
                className="form-input"
                required
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time" className="form-label">
                Horário *
              </label>
              <input
                id="time"
                type="time"
                step="60"
                className="form-input"
                required
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Local *
            </label>
            <input
              id="location"
              className="form-input"
              placeholder="Ex: Campus Porto Alegre"
              required
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity" className="form-label">
              Capacidade (número de vagas)
            </label>
            <input
              id="capacity"
              type="number"
              min="0"
              className="form-input"
              placeholder="0"
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
            />
          </div>

          {msg && (
            <div className={msg.includes('Erro') ? 'alert alert-error' : 'alert alert-success'}>
              {msg}
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Criar Evento
          </button>
        </form>
      </div>
    </main>
  );
}
