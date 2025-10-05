import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';
import api from '../lib/api';

export default function Admin() {
  const navigate = useNavigate();
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
      <p className="text-muted">Gerencie eventos, voluntários e visualize estatísticas</p>

      <div className="mt-xl" style={{ display: 'flex', gap: '16px' }}>
      <button
          className="btn btn-secondary"
          onClick={() => navigate('/events-manage')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Calendar size={18} />
          Gerenciar Eventos
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/volunteers')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Users size={18} />
          Gerenciar Voluntários
        </button>  
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{summary.total_events}</div>
          <div className="stat-label">Total de Eventos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.total_volunteers}</div>
          <div className="stat-label">Voluntários Cadastrados</div>
        </div>
      </div>
    </main>
  );
}
