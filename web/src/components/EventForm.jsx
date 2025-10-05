export default function EventForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing = false,
  submitLabel = 'Salvar Alterações',
}) {
  // Data mínima: hoje
  const today = new Date().toISOString().split('T')[0];

  // Verifica se a data/hora já passou
  const isDateTimePast = () => {
    if (!formData.date || !formData.time) return false;
    
    const eventDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    
    return eventDateTime < now;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isDateTimePast()) {
      alert('Não é possível criar eventos com data/horário que já passaram.');
      return;
    }
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="card-content">
      <div className="form-group">
        <label htmlFor="title">Título *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => onChange({ ...formData, title: e.target.value })}
          placeholder="Ex: Campanha de Doação de Sangue"
          maxLength={50}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          placeholder="Descreva o evento..."
          rows="4"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Data *</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => onChange({ ...formData, date: e.target.value })}
            min={today}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Horário *</label>
          <input
            type="time"
            id="time"
            value={formData.time}
            onChange={(e) => onChange({ ...formData, time: e.target.value })}
            required
          />
        </div>
      </div>

      {isDateTimePast() && (
        <div className="alert alert-danger" style={{ marginTop: '16px' }}>
          A data e horário selecionados já passaram. Por favor, escolha uma data futura.
        </div>
      )}

      <div className="form-group">
        <label htmlFor="location">Local *</label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => onChange({ ...formData, location: e.target.value })}
          placeholder="Ex: Campus Porto Alegre"
          maxLength={50}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="capacity">Capacidade (número de vagas)</label>
        <input
          type="number"
          id="capacity"
          min="0"
          value={formData.capacity}
          onChange={(e) => onChange({ ...formData, capacity: e.target.value })}
          placeholder="0"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn btn-neutral" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
