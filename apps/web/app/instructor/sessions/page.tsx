
'use client';
import React from 'react';
import useSWR from 'swr';
import Link from 'next/link';

export default function InstructorSessions() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const fetcher = (url: string) => fetch(url).then(r=>r.json());
  const { data } = useSWR(api + '/portal/overview?householdId=hh_1', fetcher, { refreshInterval: 10000 });
  const sessions = data?.sessions || [];

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Instructor Console — Sessions</h1>
      <div className="grid grid-cols-1 gap-3">
        {sessions.map((s:any)=> (
          <Link key={s.id} href={`/instructor/session/${s.id}`} className="card block">
            <div className="flex items-center justify-between">
              <div className="font-medium">{new Date(s.startsAt).toLocaleString()} • {s.durationMin} min</div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
          </Link>
        ))}
        {sessions.length===0 && <div className="card text-sm text-gray-600">No sessions scheduled. Create one from the Catalog.</div>}
      </div>
    </main>
  );
}
