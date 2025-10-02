import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isAuthenticated, hasRole, user, logout } = useAuth();
  const nav = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const onLogout = () => {
    logout();
    setDropdownOpen(false);
    nav('/', { replace: true });
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extrai primeiro nome do email
  const getFirstName = (email) => {
    if (!email) return 'Usuário';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Traduz role
  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Administrador';
    return 'Voluntário';
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '24px' }}>
          <img src="/ifrs_icon.PNG" alt="IFRS" style={{ height: '40px' }} />
          <span style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--text-primary)' }}>
            IFRS Voluntários
          </span>
        </Link>
        <nav className="header-nav">
          <Link to="/">Eventos</Link>
          <Link to="/dashboards">Dashboards</Link>
          {hasRole('admin') && <Link to="/admin">Admin</Link>}
        </nav>
        <div className="header-actions">
          {isAuthenticated ? (
            <div className={`user-dropdown ${dropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
              <button
                className="user-dropdown-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-info">
                  <span className="user-name">Olá, {getFirstName(user?.email)}</span>
                  <span className="user-role">{getRoleLabel(user?.role)}</span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </button>

              <div className="user-dropdown-menu">
                <button className="dropdown-item danger" onClick={onLogout}>
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
