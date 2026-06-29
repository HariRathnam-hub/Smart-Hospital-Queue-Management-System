import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const PRIORITY_COLOR = {
  emergency: 'bg-red-100 border-red-400 text-red-800',
  urgent: 'bg-orange-100 border-orange-400 text-orange-800',
  normal: 'bg-green-100 border-green-400 text-green-800',
};

export default function PatientView() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    socket.emit('queue:fetch');
    socket.on('queue:state', setQueue);
    socket.on('queue:update', ({ type, patient, patientId }) => {
      if (type === 'next') {
        setCurrent(patient);
        setQueue((q) => q.filter((p) => p._id !== patient._id));
      }
      if (type === 'complete') {
        setCurrent(null);
      }
    });
    return () => socket.off();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Live Queue</h1>

      {current && (
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-400 rounded-lg">
          <p className="text-sm text-blue-600 font-medium uppercase tracking-wide">Now serving</p>
          <p className="text-3xl font-bold text-blue-800">Token #{current.tokenNumber}</p>
          <p className="text-blue-700">{current.name}</p>
        </div>
      )}

      <div className="space-y-3">
        {queue.length === 0 && (
          <p className="text-gray-500 text-center py-12">No patients in queue</p>
        )}
        {queue.map((patient, idx) => (
          <div
            key={patient._id}
            className={`flex items-center gap-4 p-4 border rounded-lg ${PRIORITY_COLOR[patient.priority]}`}
          >
            <span className="text-2xl font-bold w-12 text-center">#{patient.tokenNumber}</span>
            <div className="flex-1">
              <p className="font-semibold">{patient.name}</p>
              <p className="text-sm opacity-80">{patient.symptoms}</p>
            </div>
            <span className="text-xs font-medium uppercase px-2 py-1 rounded border">
              {patient.priority}
            </span>
            <span className="text-sm opacity-70">~{(idx + 1) * 10} min wait</span>
          </div>
        ))}
      </div>
    </div>
  );
}
