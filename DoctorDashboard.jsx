import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DoctorDashboard() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [notes, setNotes] = useState('');

  const fetchQueue = async () => {
    const res = await fetch(`${API}/api/queue`);
    setQueue(await res.json());
  };

  useEffect(() => { fetchQueue(); }, []);

  const callNext = async () => {
    const res = await fetch(`${API}/api/queue/next`, { method: 'PUT' });
    if (res.ok) {
      const patient = await res.json();
      setCurrent(patient);
      fetchQueue();
    } else {
      alert('Queue is empty');
    }
  };

  const complete = async () => {
    if (!current) return;
    await fetch(`${API}/api/queue/${current._id}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
    setCurrent(null);
    setNotes('');
    fetchQueue();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Doctor Console</h1>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-3 text-gray-700">Current patient</h2>
          {current ? (
            <div className="p-4 border-2 border-blue-400 rounded-lg bg-blue-50">
              <p className="text-2xl font-bold text-blue-800">#{current.tokenNumber} — {current.name}</p>
              <p className="text-sm text-blue-600 mt-1">Age: {current.age} · Priority: {current.priority}</p>
              <p className="mt-2 text-gray-700">{current.symptoms}</p>
              <textarea className="w-full mt-4 border rounded p-2 text-sm" rows={3}
                placeholder="Consultation notes..." value={notes} onChange={e => setNotes(e.target.value)} />
              <button onClick={complete} className="mt-2 w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700">
                Mark complete
              </button>
            </div>
          ) : (
            <div className="p-4 border rounded-lg text-gray-400 text-center py-12">No patient in consultation</div>
          )}
          {!current && (
            <button onClick={callNext} className="mt-4 w-full bg-blue-700 text-white py-3 rounded-lg font-medium hover:bg-blue-800">
              Call next patient →
            </button>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-3 text-gray-700">Queue ({queue.length})</h2>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {queue.map((p, idx) => (
              <div key={p._id} className="flex items-center gap-3 p-3 border rounded-lg text-sm">
                <span className="font-bold w-6 text-center text-gray-400">{idx + 1}</span>
                <span className="font-medium">#{p.tokenNumber}</span>
                <span className="flex-1">{p.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  p.priority === 'emergency' ? 'bg-red-100 text-red-700' :
                  p.priority === 'urgent' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'}`}>{p.priority}</span>
              </div>
            ))}
            {queue.length === 0 && <p className="text-gray-400 text-center py-8">Queue is empty</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
