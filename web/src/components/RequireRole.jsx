import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireRole({ role = 'admin' }) {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated || !hasRole(role)) return <Navigate to="/login" replace />;
  return <Outlet />;
}
