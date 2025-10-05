import { X } from 'lucide-react';

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemType = 'item',
  itemName,
}) {
  if (!isOpen) return null;

  const typeLabels = {
    evento: { singular: 'evento', article: 'o' },
    voluntário: { singular: 'voluntário', article: 'o' },
    conta: { singular: 'conta', article: 'a' },
  };

  const label = typeLabels[itemType] || { singular: itemType, article: 'o' };
  const title = `Excluir ${label.singular.charAt(0).toUpperCase() + label.singular.slice(1)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
            Tem certeza que deseja excluir {label.article} {label.singular}{' '}
            <strong>"{itemName}"</strong>? Esta ação não pode ser desfeita.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-danger" onClick={onConfirm}>
              Sim, excluir {label.singular}
            </button>
            <button className="btn btn-neutral" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
