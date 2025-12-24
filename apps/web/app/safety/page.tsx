
'use client';
import { useState } from 'react';
import { api } from '../lib/api';

export default function SafetyPage() {
  const [consent, setConsent] = useState<any>(null);
  const [incident, setIncident] = useState<any>(null);
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Online Safety</h1>
      <div className="card">
        <h3 className="font-medium mb-2">Recording Consent</h3>
        <button className="btn" onClick={async() => setConsent(await api('/safety/consent/recording', { method:'POST', body: JSON.stringify({ learnerId:'L1', courseId:'C1', consent:true }) }))}>
          Record Consent (sample)
        </button>
        {consent && <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">{JSON.stringify(consent, null, 2)}</pre>}
      </div>
      <div className="card">
        <h3 className="font-medium mb-2">Incident Intake</h3>
        <button className="btn" onClick={async() => setIncident(await api('/safety/incident', { method:'POST', body: JSON.stringify({ reporterId:'U1', type:'harassment', notes:'Inappropriate DMs' }) }))}>
          Log Incident (sample)
        </button>
        {incident && <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">{JSON.stringify(incident, null, 2)}</pre>}
      </div>
    </main>
  );
}
