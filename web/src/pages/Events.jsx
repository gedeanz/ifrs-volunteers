import { useEffect, useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import api from '../lib/api';

export default function Events() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/events')
      .then(({ data }) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
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
      <h1>Eventos de Voluntariado</h1>
      <p className="text-muted">
        Confira os eventos disponíveis e participe das ações sociais do IFRS
      </p>

      {items.length === 0 ? (
        <div className="alert alert-info mt-lg">
          Nenhum evento cadastrado no momento.
        </div>
      ) : (
        <div className="cards-grid">
          {items.map((ev) => {
            const eventDate = new Date(ev.event_date);
            const dateStr = eventDate.toLocaleDateString('pt-BR');
            const timeStr = eventDate.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div key={ev.id} className="card">
                <h3 className="card-title">{ev.title}</h3>
                <div className="card-content">
                  {ev.description && <p>{ev.description}</p>}
                  <div className="card-footer">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                        <strong>{ev.location}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                        <span className="text-muted">
                          {dateStr} às {timeStr}
                        </span>
                      </div>
                    </div>
                    {ev.capacity > 0 && (
                      <div className="badge badge-primary">
                        {ev.capacity} vagas
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
