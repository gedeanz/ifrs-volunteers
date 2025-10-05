import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Toast from './Toast';

export default function ManagementPage({
  title,
  description,
  backTo,
  toast,
  onToastClose,
  loading,
  children,
}) {
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
      {toast && <Toast message={toast.message} type={toast.type} onClose={onToastClose} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1>{title}</h1>
          <p className="text-muted" style={{ marginBottom: 0 }}>{description}</p>
        </div>
        {backTo && (
          <Link
            to={backTo}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
        )}
      </div>

      {children}
    </main>
  );
}
