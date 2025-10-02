import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@ifrs.edu');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.from?.pathname || '/dashboards';

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
      <div className="card" style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 className="text-center">Login</h1>
        <p className="text-center text-muted mb-lg">
          Acesse o sistema IFRS Voluntários
        </p>

        <form onSubmit={onSubmit} className="form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Entrar
          </button>

          <div className="alert alert-info mt-md">
            <strong>Credenciais de teste:</strong>
            <br />
            Admin: admin@ifrs.edu / 123456
            <br />
            User: user@ifrs.edu / 123456
          </div>
        </form>
      </div>
    </main>
  );
}