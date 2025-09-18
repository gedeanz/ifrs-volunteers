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
    <main style={{ maxWidth: 420, margin: '48px auto', padding: 16 }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <label>Email<br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </label>
        <br/><br/>
        <label>Senha<br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </label>
        <br/><br/>
        <button type="submit">Entrar</button>
        {error && <p style={{ color:'crimson' }}>{error}</p>}
        <p style={{ marginTop: 12, fontSize: 12, opacity:.7 }}>
          Dica: admin@ifrs.edu / 123456 (admin) ou user@ifrs.edu / 123456 (user)
        </p>
      </form>
    </main>
  );
}