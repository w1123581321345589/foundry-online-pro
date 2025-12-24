
'use client';
import { useEffect, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';

export default function SessionDetail({ params }: { params: { id: string } }) {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [chatEnabled, setChatEnabled] = useState(false);
  const [recording, setRecording] = useState(false);

  async function toggleChat() {
    const r = await fetch(api + '/sessions/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId: params.id, enabled: !chatEnabled }) }).then(r=>r.json());
    setChatEnabled(r.chatEnabled);
  }
  async function toggleRecording() {
    const r = await fetch(api + '/sessions/recording', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId: params.id, recording: !recording }) }).then(r=>r.json());
    setRecording(r.recording);
  }

  // (Optional) embed live frame as instructor view
  useEffect(() => {
    const roomUrl = process.env.NEXT_PUBLIC_DAILY_ROOM_URL!;
    const el = document.getElementById('liveframe');
    if (!el || !roomUrl) return;
    const frame = DailyIframe.createFrame(el as HTMLDivElement, { showLeaveButton: true });
    frame.join({ url: roomUrl });
    return () => { frame?.destroy(); };
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Session Controls</h1>

      <section className="card space-y-3">
        <div className="flex gap-2">
          <button className="btn" onClick={toggleChat}>{chatEnabled ? 'Disable Chat' : 'Enable Chat'}</button>
          <button className="btn" onClick={toggleRecording}>{recording ? 'Stop Recording' : 'Start Recording'}</button>
          <a className="btn" href={`/classroom/${params.id}`} target="_blank">Start Class</a>
        </div>
        <div id="liveframe" className="w-full h-[60vh] rounded-xl border"></div>
      </section>

      <section className="card">
        <h2 className="font-medium mb-2">Attach Recording URL</h2>
        <Attach sessionId={params.id} api={api} />
      </section>
    </main>
  );
}

function Attach({ sessionId, api }: any) {
  const [url, setUrl] = useState('https://example.org/video.mp4');
  const [rows, setRows] = useState<any[]>([]);
  async function add() {
    await fetch(api + '/sessions/attach-recording', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId, url }) });
    const next = await fetch(api + '/sessions/recordings?sessionId=' + sessionId).then(r=>r.json());
    setRows(next);
  }
  useEffect(()=>{ add(); }, []);
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={url} onChange={e=>setUrl(e.target.value)} className="border rounded px-2 py-1 w-full" />
        <button className="btn" onClick={add}>Attach</button>
      </div>
      <ul className="divide-y">
        {rows.map((r:any)=> <li key={r.id} className="py-2 text-sm flex items-center justify-between"><span>{new Date(r.createdAt).toLocaleString()}</span><a className="text-accent underline" href={r.url} target="_blank">Open</a></li>)}
      </ul>
    </div>
  );
}
