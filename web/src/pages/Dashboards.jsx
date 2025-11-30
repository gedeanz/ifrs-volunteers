import { useEffect, useState } from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Dashboards() {
  const [data, setData] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);

  useEffect(() => {
    api
      .get('/dashboards')
      .then(({ data }) => setData(data))
      .catch(console.error);
    
    loadMyRegistrations();
  }, []);

  const loadMyRegistrations = () => {
    api
      .get('/my-registrations')
      .then(({ data }) => setMyRegistrations(data))
      .catch(console.error);
  };

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

  // Mostrar todas as inscrições
  const displayedRegistrations = myRegistrations;

  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h1 id="dashboard-title" data-testid="dashboard-title" style={{ marginBottom: '4px' }}>Dashboard</h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Bem-vindo, <strong>{user.email}</strong>
          </p>
        </div>
        <Link
          to="/"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          Ver todos os eventos
          <ArrowRight size={18} />
        </Link>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '24px',
        marginTop: '32px'
      }}>
        {/* Card: Total de Eventos */}
        <div className="card">
          <div className="card-content">
            <div className="stat-value" style={{ marginBottom: '8px' }}>{summary.total_events}</div>
            <div className="stat-label">Total de Eventos</div>
          </div>
        </div>

        {/* Card: Eventos Inscritos */}
        <div className="card">
          <div className="card-content">
            <div className="stat-value" style={{ marginBottom: '8px' }}>{myRegistrations.length}</div>
            <div className="stat-label">Eventos em que estou inscrito</div>
          </div>
        </div>
      </div>

      {/* Seção de Inscrições */}
      <div style={{ marginTop: '48px' }}>
        <h3 style={{ marginBottom: '16px' }}>Minhas Inscrições</h3>

        {myRegistrations.length === 0 ? (
          <div className="alert alert-info">
            Você ainda não está inscrito em nenhum evento.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '16px'
          }}>
            {displayedRegistrations.map((reg) => {
              const eventDate = new Date(reg.event_date);
              const dateStr = eventDate.toLocaleDateString('pt-BR');
              const timeStr = eventDate.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={reg.id} className="card">
                  <div className="card-content">
                    <h4 style={{ marginBottom: '12px' }}>{reg.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} />
                        <span>{reg.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} />
                        <span>{dateStr} às {timeStr}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}