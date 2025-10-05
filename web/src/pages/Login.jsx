import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.from?.pathname || '/dashboards';
  const wasRedirected = location.state?.from;

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);               // <<< atualiza contexto + localStorage
      nav(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Falha no login');
    }
  }

  return (
    <main className="container-sm">
      {wasRedirected && (
        <div className="alert alert-info" style={{ maxWidth: 480, margin: '0 auto 16px' }}>
          Faça o login para acessar esta página.
        </div>
      )}

      <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 className="text-center">Login</h1>
        <p className="text-center text-muted mb-lg">
          Acesse o sistema IFRS Voluntários
        </p>

        <form onSubmit={onSubmit} className="form auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Entrar
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span className="text-muted">Não tem uma conta? </span>
            <Link to="/register" style={{ fontWeight: 600 }}>
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}