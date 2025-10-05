import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import api from '../lib/api';
import ManagementPage from '../components/ManagementLayout';
import EventForm from '../components/EventForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function EventsManage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 0,
  });
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    api
      .get('/events')
      .then(({ data }) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setToast({ message: 'Erro ao carregar eventos', type: 'error' });
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const event_date = formData.date && formData.time ? `${formData.date} ${formData.time}:00` : '';
    if (!event_date) {
      setToast({ message: 'Selecione data e hora', type: 'error' });
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      event_date,
      location: formData.location.trim(),
      capacity: Number(formData.capacity) || 0,
    };

    const request = editingId
      ? api.put(`/events/${editingId}`, payload)
      : api.post('/events', payload);

    request
      .then(() => {
        setToast({
          message: editingId ? 'Evento atualizado com sucesso' : 'Evento criado com sucesso',
          type: 'success',
        });
        resetForm();
        loadEvents();
      })
      .catch((err) => {
        setToast({ message: err.response?.data?.error || 'Erro ao salvar evento', type: 'error' });
      });
  };

  const handleEdit = (event) => {
    const eventDate = new Date(event.event_date);
    const date = eventDate.toISOString().split('T')[0];
    const time = eventDate.toTimeString().slice(0, 5);

    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description || '',
      date,
      time,
      location: event.location,
      capacity: event.capacity || 0,
    });
    setShowForm(true);
  };

  const handleDeleteClick = (event) => {
    setDeleteModal({ show: true, id: event.id, title: event.title });
  };

  const handleConfirmDelete = () => {
    api
      .delete(`/events/${deleteModal.id}`)
      .then(() => {
        setToast({ message: 'Evento excluído com sucesso', type: 'success' });
        setDeleteModal({ show: false, id: null, title: '' });
        loadEvents();
      })
      .catch((err) => {
        setToast({ message: err.response?.data?.error || 'Erro ao excluir evento', type: 'error' });
        setDeleteModal({ show: false, id: null, title: '' });
      });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      capacity: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <ManagementPage
      title="Gerenciar Eventos"
      description="Crie, edite e exclua eventos do sistema"
      backTo="/admin"
      toast={toast}
      onToastClose={() => setToast({ message: '', type: '' })}
      loading={loading}
    >
      {showForm && (
        <div className="card">
          <h3 className="card-title">{editingId ? 'Editar Evento' : 'Novo Evento'}</h3>
          <EventForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={!!editingId}
            submitLabel={editingId ? 'Salvar Alterações' : 'Criar Evento'}
          />
        </div>
      )}

      <div className="mt-lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Lista de Eventos ({events.length})</h2>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={18} />
              Novo Evento
            </button>
          )}
        </div>
        {events.length === 0 ? (
          <div className="alert alert-info mt-md">Nenhum evento cadastrado.</div>
        ) : (
          <div className="table-container mt-md">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Data/Hora</th>
                  <th>Local</th>
                  <th>Capacidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td title={event.title}>{event.title}</td>
                    <td>{new Date(event.event_date).toLocaleString('pt-BR')}</td>
                    <td title={event.location}>{event.location}</td>
                    <td>{event.capacity || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(event)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteClick(event)}
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null, title: '' })}
        onConfirm={handleConfirmDelete}
        itemType="evento"
        itemName={deleteModal.title}
      />
    </ManagementPage>
  );
}
