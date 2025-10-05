import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../lib/api';

const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      await api.post('/volunteers', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        nav('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta');
    }
  }

  if (success) {
    return (
      <main className="container-sm">
        <div className="card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: '24px' 
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle size={48} color="#059669" strokeWidth={2} />
            </div>
          </div>
          <h2 style={{ marginBottom: '12px', color: 'var(--text-primary)' }}>
            Conta criada com sucesso!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Redirecionando para o login em instantes...
          </p>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-sm">
      <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 className="text-center">Cadastro</h1>
        <p className="text-center text-muted mb-lg">
          Crie sua conta no IFRS Voluntários
        </p>

        <form onSubmit={onSubmit} className="form auth-form">
          <div className="form-group">
            <label htmlFor="name">Nome completo *</label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
              maxLength={15}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha *</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar senha *</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              minLength={6}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Criar Conta
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span className="text-muted">Já tem uma conta? </span>
            <Link to="/login" style={{ fontWeight: 600 }}>
              Faça login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
