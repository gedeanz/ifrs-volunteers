import { Link, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Dashboards from './pages/Dashboards';
import Admin from './pages/Admin';
import Volunteers from './pages/Volunteers';
import EventsManage from './pages/EventsManage';
import Profile from './pages/Profile';
import Header from './components/Header';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboards" element={<Dashboards />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<RequireRole role="admin" />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/events-manage" element={<EventsManage />} />
        </Route>
      </Routes>
    </>
  );
}
