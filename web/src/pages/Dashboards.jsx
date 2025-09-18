import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Dashboards() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get('/dashboards').then(({data}) => setData(data)).catch(console.error);
  }, []);
  if (!data) return <p style={{ padding:16 }}>Carregando...</p>;
  const { user, summary } = data;
  return (
    <main style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
      <h1>Dashboards</h1>
      <p>Bem-vindo, <strong>{user.email}</strong> (role: <em>{user.role}</em>)</p>
      <div style={{ display:'flex', gap:24, marginTop:16 }}>
        <div><h3>Total de eventos</h3><p>{summary.total_events}</p></div>
        <div><h3>Capacidade total</h3><p>{summary.total_capacity}</p></div>
      </div>
      <h3 style={{ marginTop:24 }}>Próximos</h3>
      <ul>
        {summary.upcoming?.map(u => (
          <li key={u.id}><strong>{u.title}</strong> — {u.location} — {new Date(u.event_date).toLocaleString()}</li>
        ))}
      </ul>
    </main>
  );
}