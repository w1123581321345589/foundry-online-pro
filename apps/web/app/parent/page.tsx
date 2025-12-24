
'use client';
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r=>r.json());

import { useEffect, useState } from 'react';

function Attendance(){
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ fetch(api + '/attendance/learner?learnerId=L1').then(r=>r.json()).then(setRows); },[]);
  return (
    <ul className='divide-y'>{rows.map((r:any)=> <li key={r.id} className='py-2 text-sm'>{new Date(r.createdAt).toLocaleDateString()} • {r.status}{r.notes? ' — '+r.notes:''}</li>)}{rows.length===0 && <li className='py-2 text-sm text-gray-500'>No attendance yet.</li>}</ul>
  );
}

function Recordings(){
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [recs, setRecs] = useState<any[]>([]);
  useEffect(()=>{ /* demo: fetch latest 5 sessions then recordings per */
    fetch(api + '/portal/overview?householdId=hh_1').then(r=>r.json()).then(async d=>{
      const sess = (d.sessions||[]).slice(0,3);
      const all:any[]=[]; for (const s of sess){ const rows=await fetch(api+'/sessions/recordings?sessionId='+s.id).then(r=>r.json()); rows.forEach((row:any)=> all.push({session:s, row})); }
      setRecs(all);
    });
  },[]);
  return (
    <ul className='divide-y'>{recs.map((x:any,i:number)=> <li key={i} className='py-2 text-sm flex items-center justify-between'><span>{new Date(x.session.startsAt).toLocaleString()}</span><a className='btn' href={x.row.url} target='_blank'>Watch</a></li>)}{recs.length===0 && <li className='py-2 text-sm text-gray-500'>No recordings available.</li>}</ul>
  );
}

function Recap(){
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [b64, setB64] = useState<string>('');
  async function generate(){
    const r = await fetch(api + '/sessions/recap/weekly', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ householdId: 'hh_1' }) }).then(r=>r.json());
    setB64(r.previewBase64);
  }
  return (
    <div>
      <button className='btn' onClick={generate}>Generate Weekly Recap</button>
      {b64 && <iframe className='w-full h-96 mt-3 rounded-xl border' src={`data:application/pdf;base64,${b64}`} />}
    </div>
  );
}

export default function ParentPortal() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const { data } = useSWR(api + '/portal/overview?householdId=hh_1', fetcher, { refreshInterval: 15000 });
  const invoices = data?.invoices || [];
  const sessions = data?.sessions || [];

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Parent Portal</h1>

      <section className="card">
        <h2 className="font-medium mb-2">Upcoming Sessions</h2>
        <ul className="divide-y">
          {sessions.map((s:any)=> (
            <li key={s.id} className="py-2 text-sm flex items-center justify-between">
              <span>{new Date(s.startsAt).toLocaleString()} • {s.durationMin} min</span>
              <a className="btn" href={`/classroom/${s.id}`}>Join</a>
            </li>
          ))}
          {sessions.length === 0 && <li className="py-2 text-sm text-gray-500">No sessions scheduled yet.</li>}
        </ul>
      </section>

      <section className="card">
        <h2 className="font-medium mb-2">Invoices</h2>
        <ul className="divide-y">
          {invoices.map((i:any)=> (
            <li key={i.id} className="py-2 text-sm flex items-center justify-between">
              <span>${(i.amountCents/100).toFixed(2)} • {i.status}</span>
              {i.status !== 'paid' && (
                <a className="btn" href="/pay">Pay</a>
              )}
            </li>
          ))}
          {invoices.length === 0 && <li className="py-2 text-sm text-gray-500">No invoices.</li>}
        </ul>
      </section>

      <section className="card">
        <h2 className="font-medium mb-2">Attendance (Last 30)</h2>
        <Attendance />
      </section>

      <section className="card">
        <h2 className="font-medium mb-2">Recordings (Recent)</h2>
        <Recordings />
      </section>

      <section className="card">
        <h2 className="font-medium mb-2">Weekly Recap</h2>
        <Recap />
      </section>
    </main>
  );
}
