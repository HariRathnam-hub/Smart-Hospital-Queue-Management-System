import { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
  const [form, setForm] = useState({ name: '', age: '', symptoms: '', priority: 'normal', phone: '' });
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/patients/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setToken(data.tokenNumber);
      setForm({ name: '', age: '', symptoms: '', priority: 'normal', phone: '' });
    } catch (err) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-2">Your token number is</p>
        <p className="text-7xl font-bold text-blue-700 mb-4">#{token}</p>
        <p className="text-gray-500 mb-6">Please wait. You will be called when it's your turn.</p>
        <button onClick={() => setToken(null)} className="text-blue-600 underline">Register another patient</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input required className="w-full border rounded-lg px-3 py-2" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Patient name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input required type="number" className="w-full border rounded-lg px-3 py-2" value={form.age}
            onChange={e => setForm({ ...form, age: e.target.value })} placeholder="Age" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Symptoms</label>
          <textarea required className="w-full border rounded-lg px-3 py-2" rows={3} value={form.symptoms}
            onChange={e => setForm({ ...form, symptoms: e.target.value })} placeholder="Describe symptoms" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select className="w-full border rounded-lg px-3 py-2" value={form.priority}
            onChange={e => setForm({ ...form, priority: e.target.value })}>
            <option value="normal">Normal — routine visit</option>
            <option value="urgent">Urgent — needs attention soon</option>
            <option value="emergency">Emergency — immediate care needed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone (optional)</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 00000 00000" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50">
          {loading ? 'Registering...' : 'Register and get token'}
        </button>
      </form>
    </div>
  );
}
