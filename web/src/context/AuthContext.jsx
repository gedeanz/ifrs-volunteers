import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser]   = useState(null); // { email, role }

  // carrega sessão do localStorage ao iniciar
  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) {
      setToken(t);
      try { setUser(JSON.parse(u)); } catch { setUser(null); }
    }
  }, []);

  const login = ({ token: t, user: u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const hasRole = (role) => user?.role === role;

  const value = useMemo(() => ({
    token, user, isAuthenticated, hasRole, login, logout
  }), [token, user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
