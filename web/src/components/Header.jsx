import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isAuthenticated, hasRole, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav('/', { replace: true });
  };

  return (
    <nav style={{ display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee' }}>
      <Link to="/">Eventos</Link>
      <Link to="/dashboards">Dashboards</Link>
      {hasRole('admin') && <Link to="/admin">Admin</Link>}

      <span style={{ marginLeft:'auto' }}>
        {isAuthenticated
          ? <button onClick={onLogout}>Sair</button>
          : <Link to="/login">Entrar</Link>}
      </span>
    </nav>
  );
}
