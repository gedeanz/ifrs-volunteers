const formatPhone = (value) => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara (00) 00000-0000
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
  // Limita a 11 dígitos
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export default function VolunteerForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
  showRoleField = false,
  submitLabel = 'Salvar Alterações',
  cancelLabel = 'Cancelar',
}) {
  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    onChange({ ...formData, phone: formatted });
  };

  return (
    <form onSubmit={onSubmit} className="card-content">
      <div className="form-group">
        <label htmlFor="name">Nome *</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onChange({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Telefone</label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="(00) 00000-0000"
          maxLength={15}
        />
      </div>

      {showRoleField && (
        <div className="form-group">
          <label htmlFor="role">Função *</label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => onChange({ ...formData, role: e.target.value })}
            required
          >
            <option value="user">Voluntário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="password">
          {isEditing ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha *'}
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => onChange({ ...formData, password: e.target.value })}
          required={!isEditing}
          minLength={6}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn btn-neutral" onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}
