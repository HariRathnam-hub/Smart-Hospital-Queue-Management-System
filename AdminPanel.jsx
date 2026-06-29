import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/queue/stats`)
      .then(r => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p className="text-gray-400">Loading stats...</p>;

  const cards = [
    { label: 'Waiting', value: stats.waiting, color: 'text-orange-600' },
    { label: 'In progress', value: stats.inProgress, color: 'text-blue-600' },
    { label: 'Completed today', value: stats.completed, color: 'text-green-600' },
    { label: 'Avg wait (min)', value: stats.avgWaitMinutes, color: 'text-purple-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin — Queue analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white border rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">{c.label}</p>
            <p className={`text-4xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
