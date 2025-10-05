import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Toast from '../components/Toast';
import VolunteerForm from '../components/VolunteerForm';
import api from '../lib/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = () => {
    if (!user?.id) return;

    api
      .get(`/volunteers/${user.id}`)
      .then(({ data }) => {
        setProfileData(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          password: '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setToast({ message: 'Erro ao carregar perfil', type: 'error' });
        setLoading(false);
      });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone || '',
      password: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: profileData.role, // Mantém a role atual
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    api
      .put(`/volunteers/${user.id}`, payload)
      .then(() => {
        setToast({ message: 'Perfil atualizado com sucesso!', type: 'success' });
        loadProfile();
        setIsEditing(false);
        setFormData({ ...formData, password: '' });
      })
      .catch((err) => {
        setToast({ message: err.response?.data?.error || 'Erro ao atualizar perfil', type: 'error' });
      });
  };

  const handleConfirmDelete = () => {
    api
      .delete(`/volunteers/${user.id}`)
      .then(() => {
        setShowDeleteModal(false);
        logout();
        navigate('/', { replace: true });
      })
      .catch((err) => {
        setToast({ message: err.response?.data?.error || 'Erro ao excluir conta', type: 'error' });
        setShowDeleteModal(false);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h1 style={{ marginBottom: '4px' }}>Meu Perfil</h1>
          <p className="text-muted" style={{ marginBottom: 0 }}>Gerencie suas informações pessoais</p>
        </div>
        {!isEditing && (
          <button
            className="btn btn-primary btn-sm"
            onClick={handleEdit}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}
          >
            <Edit size={14} />
            Editar Perfil
          </button>
        )}
      </div>

      {!isEditing ? (
        // Modo Visualização
        <>
          <div className="card mt-lg">
            <h3 className="card-title">Informações Pessoais</h3>
          <div className="card-content">
            <div className="info-group">
              <label className="info-label">Nome</label>
              <p className="info-value">{profileData?.name}</p>
            </div>
            <div className="info-group">
              <label className="info-label">Email</label>
              <p className="info-value">{profileData?.email}</p>
            </div>
            <div className="info-group">
              <label className="info-label">Telefone</label>
              <p className="info-value">{profileData?.phone || 'Não informado'}</p>
            </div>
            <div className="info-group">
              <label className="info-label">Função</label>
              <p className="info-value">
                <span className={`badge ${profileData?.role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                  {profileData?.role === 'admin' ? 'Administrador' : 'Voluntário'}
                </span>
              </p>
            </div>
            <div className="info-group">
              <label className="info-label">Cadastro</label>
              <p className="info-value">
                {profileData?.created_at && new Date(profileData.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: '', type: '' })}
          />
        </>
      ) : (
        // Modo Edição
        <div className="card mt-lg">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>Editar Perfil</h3>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setShowDeleteModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={14} />
              Excluir
            </button>
          </div>
          <VolunteerForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            isEditing={true}
            showRoleField={false}
            submitLabel="Salvar Alterações"
          />
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemType="conta"
        itemName={profileData?.name || 'sua conta'}
      />
    </main>
  );
}
