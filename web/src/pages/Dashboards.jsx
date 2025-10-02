import { useEffect, useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import api from '../lib/api';

export default function Dashboards() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get('/dashboards')
      .then(({ data }) => setData(data))
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <main className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </main>
    );
  }

  const { user, summary } = data;

  return (
    <main className="container">
      <h1>Dashboard</h1>
      <p className="text-muted">
        Bem-vindo, <strong>{user.email}</strong> •{' '}
        <span className="badge badge-primary">{user.role}</span>
      </p>

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

      <h3 className="mt-xl mb-md">Próximos Eventos</h3>

      {!summary.upcoming || summary.upcoming.length === 0 ? (
        <div className="alert alert-info">
          Nenhum evento próximo cadastrado.
        </div>
      ) : (
        <ul className="list">
          {summary.upcoming.map((u) => {
            const eventDate = new Date(u.event_date);
            const dateStr = eventDate.toLocaleDateString('pt-BR');
            const timeStr = eventDate.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <li key={u.id} className="list-item">
                <h4 className="mb-sm">{u.title}</h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    <span>{u.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>{dateStr} às {timeStr}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}