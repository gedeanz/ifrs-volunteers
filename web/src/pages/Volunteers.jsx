import { useEffect, useState } from 'react';
import { Trash2, Edit, UserPlus } from 'lucide-react';
import VolunteerForm from '../components/VolunteerForm';
import ManagementPage from '../components/ManagementLayout';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import api from '../lib/api';

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
  });
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = () => {
    setLoading(true);
    api
      .get('/volunteers')
      .then(({ data }) => {
        setVolunteers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setToast({ message: 'Erro ao carregar voluntários', type: 'error' });
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...formData };
    if (editingId && !payload.password) {
      delete payload.password;
    }

    const request = editingId
      ? api.put(`/volunteers/${editingId}`, payload)
      : api.post('/volunteers', payload);

    request
      .then(() => {
        setToast({
          message: editingId ? 'Voluntário atualizado com sucesso' : 'Voluntário criado com sucesso',
          type: 'success',
        });
        resetForm();
        loadVolunteers();
      })
      .catch((err) => {
        setToast({ message: err.response?.data?.error || 'Erro ao salvar voluntário', type: 'error' });
      });
  };

  const handleEdit = (volunteer) => {
    setEditingId(volunteer.id);
    setFormData({
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone || '',
      role: volunteer.role,
      password: '',
    });
    setShowForm(true);
  };

  const handleDelete = (id, name) => {
    setDeleteModal({ show: true, id, name });
  };

  const handleConfirmDelete = () => {
    api
      .delete(`/volunteers/${deleteModal.id}`)
      .then(() => {
        setToast({ message: 'Voluntário removido com sucesso', type: 'success' });
        setDeleteModal({ show: false, id: null, name: '' });
        loadVolunteers();
      })
      .catch((err) => {
        setToast({ message: err.response?.data?.error || 'Erro ao remover voluntário', type: 'error' });
        setDeleteModal({ show: false, id: null, name: '' });
      });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      password: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <ManagementPage
      title="Gerenciar Voluntários"
      description="Administração de usuários do sistema"
      backTo="/admin"
      toast={toast}
      onToastClose={() => setToast({ message: '', type: '' })}
      loading={loading}
    >
      {showForm && (
        <div className="card">
          <h3 className="card-title">{editingId ? 'Editar Voluntário' : 'Novo Voluntário'}</h3>
          <VolunteerForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
            isEditing={!!editingId}
            showRoleField={true}
            submitLabel={editingId ? 'Salvar Alterações' : 'Criar Voluntário'}
          />
        </div>
      )}

      <div className="mt-lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Lista de Voluntários ({volunteers.length})</h2>
          {!showForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <UserPlus size={18} />
              Novo Voluntário
            </button>
          )}
        </div>
        {volunteers.length === 0 ? (
          <div className="alert alert-info mt-md">Nenhum voluntário cadastrado.</div>
        ) : (
          <div className="table-container mt-md">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Função</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v) => (
                  <tr key={v.id}>
                    <td title={v.name}>{v.name}</td>
                    <td title={v.email}>{v.email}</td>
                    <td title={v.phone || '-'}>{v.phone || '-'}</td>
                    <td>
                      <span className={`badge ${v.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                        {v.role === 'admin' ? 'Admin' : 'Voluntário'}
                      </span>
                    </td>
                    <td>{new Date(v.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(v)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(v.id, v.name)}
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
        onClose={() => setDeleteModal({ show: false, id: null, name: '' })}
        onConfirm={handleConfirmDelete}
        itemType="voluntário"
        itemName={deleteModal.name}
      />
    </ManagementPage>
  );
}
