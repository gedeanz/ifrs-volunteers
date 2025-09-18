import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Events() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/events').then(({data}) => setItems(data)).catch(console.error);
  }, []);
  return (
    <main style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
      <h1>Eventos</h1>
      <ul>
        {items.map(ev => (
          <li key={ev.id}>
            <strong>{ev.title}</strong> — {ev.location} — {new Date(ev.event_date).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
