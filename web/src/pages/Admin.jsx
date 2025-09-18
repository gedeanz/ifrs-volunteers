import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Admin() {
  const [summary, setSummary] = useState(null);

  // opcional: pequeno form para criar novo evento (usa POST /events)
  const [form, setForm] = useState({
    title: '', description: '', event_date: '', location: '', capacity: 0
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/admin').then(({data}) => setSummary(data.summary)).catch(console.error);
  }, []);

  async function createEvent(e) {
    e.preventDefault();
    setMsg('');
    try {
      await api.post('/events', {
        ...form,
        capacity: Number(form.capacity || 0),
      });
      setMsg('Evento criado!');
      setForm({ title:'', description:'', event_date:'', location:'', capacity:0 });
    } catch (err) {
      setMsg(err.response?.data?.error || 'Erro ao criar evento');
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '24px auto', padding: 16 }}>
      <h1>Admin</h1>
      {!summary ? <p>Carregando…</p> : (
        <>
          <p>Eventos: <strong>{summary.total_events}</strong> | Capacidade total: <strong>{summary.total_capacity}</strong></p>
          <h3 style={{ marginTop:16 }}>Criar evento</h3>
          <form onSubmit={createEvent} style={{ display:'grid', gap:8, maxWidth: 500 }}>
            <input placeholder="Título" value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))}/>
            <input placeholder="Descrição" value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))}/>
            <input placeholder="Data/hora (YYYY-MM-DD HH:MM:SS)" value={form.event_date} onChange={e=>setForm(f=>({...f, event_date:e.target.value}))}/>
            <input placeholder="Local" value={form.location} onChange={e=>setForm(f=>({...f, location:e.target.value}))}/>
            <input placeholder="Capacidade" type="number" value={form.capacity} onChange={e=>setForm(f=>({...f, capacity:e.target.value}))}/>
            <button type="submit">Criar</button>
          </form>
          {msg && <p style={{ color: msg.includes('Erro')?'crimson':'green' }}>{msg}</p>}
        </>
      )}
    </main>
  );
}
