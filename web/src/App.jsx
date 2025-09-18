import { Link, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import Login from './pages/Login';
import Events from './pages/Events';
import Dashboards from './pages/Dashboards';
import Admin from './pages/Admin';
import Header from './components/Header';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboards" element={<Dashboards />} />
        </Route>

        <Route element={<RequireRole role="admin" />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </>
  );
}
