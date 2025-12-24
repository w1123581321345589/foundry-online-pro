
'use client';
import { useState } from 'react';
import { api } from '../lib/api';

function Block({ title, children }: any) {
  return <div className="card"><h3 className="font-medium mb-2">{title}</h3>{children}</div>;
}

export default function GLLPage() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [practice, setPractice] = useState<any>(null);
  const [clarity, setClarity] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [capstone, setCapstone] = useState<any>(null);
  const [qa, setQa] = useState<any>(null);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Learn Studio — Guided Learning Loop</h1>

      <Block title="1) Roadmap">
        <div className="flex gap-2">
          <input id="standard" placeholder="Standard or Topic" className="border rounded px-2 py-1" />
          <button onClick={async () => {
            const standardId = (document.getElementById('standard') as HTMLInputElement)?.value;
            const r = await api('/learn/roadmap', { method: 'POST', body: JSON.stringify({ standardId }) });
            setRoadmap(r);
          }} className="btn">Generate</button>
        </div>
        {roadmap && <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">{JSON.stringify(roadmap, null, 2)}</pre>}
      </Block>

      <Block title="2) 10 Drills">
        <div className="flex gap-2">
          <input id="interest" placeholder="Interest (e.g., basketball)" className="border rounded px-2 py-1" />
          <button onClick={async () => {
            const interests = [(document.getElementById('interest') as HTMLInputElement)?.value || 'everyday life'];
            const r = await api('/learn/practice', { method: 'POST', body: JSON.stringify({ interests }) });
            setPractice(r);
          }} className="btn">Generate</button>
        </div>
        {practice && <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">{JSON.stringify(practice, null, 2)}</pre>}
      </Block>

      <Block title="3) Clarity Card">
        <button onClick={async () => setClarity(await api('/learn/clarity', { method: 'POST', body: JSON.stringify({}) }))} className="btn">
          Generate
        </button>
        {clarity && <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">{JSON.stringify(clarity, null, 2)}</pre>}
      </Block>

      <Block title="4) Coach Review">
        <button onClick={async () => setReview(await api('/learn/review', { method: 'POST', body: JSON.stringify({}) }))} className="btn">
          Generate
        </button>
        {review && <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">{JSON.stringify(review, null, 2)}</pre>}
      </Block>

      <Block title="5) Capstone Builder">
        <button onClick={async () => setCapstone(await api('/learn/capstone', { method: 'POST', body: JSON.stringify({}) }))} className="btn">
          Generate
        </button>
        {capstone && <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">{JSON.stringify(capstone, null, 2)}</pre>}
      </Block>

      <Block title="QA Rubric Gate (approve ≥ 0.90)">
        <button onClick={async () => setQa(await api('/learn/qa/score', { method: 'POST', body: JSON.stringify({ lessonPackId: roadmap?.lessonPackId, accuracy:0.92, coverage:0.91, cognitiveLoad:0.8, engagement:0.93 }) }))} className="btn">
          Score Sample
        </button>
        {qa && <pre className="mt-2 text-xs bg-gray-50 p-2 rounded">{JSON.stringify(qa, null, 2)}</pre>}
      </Block>
    </main>
  );
}
