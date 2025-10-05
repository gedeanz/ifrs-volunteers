import { useEffect, useState } from 'react';
import { MapPin, Calendar, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

export default function Events() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadEvents();
    if (isAuthenticated) {
      loadMyRegistrations();
    }
  }, [isAuthenticated]);

  const loadEvents = () => {
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
  };

  const loadMyRegistrations = () => {
    api
      .get('/my-registrations')
      .then(({ data }) => {
        setMyRegistrations(data.map(r => r.id));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleRegister = (eventId) => {
    api
      .post(`/events/${eventId}/register`)
      .then(() => {
        setMyRegistrations([...myRegistrations, eventId]);
        loadEvents(); // Recarrega eventos para atualizar contador de vagas
        alert('Inscrição realizada com sucesso!');
      })
      .catch((err) => {
        alert(err.response?.data?.error || 'Erro ao realizar inscrição');
      });
  };

  const handleUnregister = (eventId) => {
    if (!confirm('Deseja cancelar sua inscrição neste evento?')) return;
    
    api
      .delete(`/events/${eventId}/register`)
      .then(() => {
        setMyRegistrations(myRegistrations.filter(id => id !== eventId));
        loadEvents(); // Recarrega eventos para atualizar contador de vagas
        alert('Inscrição cancelada com sucesso!');
      })
      .catch((err) => {
        alert(err.response?.data?.error || 'Erro ao cancelar inscrição');
      });
  };

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

            const isRegistered = myRegistrations.includes(ev.id);
            const registeredCount = ev.registered_count || 0;
            const availableSpots = ev.capacity > 0 ? ev.capacity - registeredCount : 0;
            const isFull = ev.capacity > 0 && availableSpots <= 0;

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
                      <div className={`badge ${isFull ? 'badge-danger' : 'badge-primary'}`}>
                        {availableSpots} {availableSpots === 1 ? 'vaga' : 'vagas'}
                      </div>
                    )}
                  </div>

                  {isAuthenticated && (
                    <div style={{ marginTop: '16px' }}>
                      {isRegistered ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleUnregister(ev.id)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          <X size={18} />
                          Cancelar Inscrição
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleRegister(ev.id)}
                          disabled={isFull}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          <Check size={18} />
                          {isFull ? 'Esgotado' : 'Inscrever-se'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
