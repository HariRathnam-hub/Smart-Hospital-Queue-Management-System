import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import PatientView from './pages/PatientView';
import DoctorDashboard from './pages/DoctorDashboard';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-700 text-white px-6 py-3 flex gap-6 text-sm font-medium">
        <span className="font-bold text-lg mr-4">🏥 HospitalQ</span>
        <NavLink to="/" className={({ isActive }) => isActive ? 'underline' : 'opacity-80 hover:opacity-100'}>Queue Display</NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? 'underline' : 'opacity-80 hover:opacity-100'}>Register Patient</NavLink>
        <NavLink to="/doctor" className={({ isActive }) => isActive ? 'underline' : 'opacity-80 hover:opacity-100'}>Doctor Console</NavLink>
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'underline' : 'opacity-80 hover:opacity-100'}>Admin</NavLink>
      </nav>
      <main className="p-6 max-w-4xl mx-auto">
        <Routes>
          <Route path="/" element={<PatientView />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
