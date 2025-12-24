
'use client';
import { useEffect, useRef } from 'react';
import DailyIframe from '@daily-co/daily-js';

export default function SessionPage({ params }: { params: { sessionId: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const roomUrl = process.env.NEXT_PUBLIC_DAILY_ROOM_URL!;
    if (!ref.current || !roomUrl) return;
    const frame = DailyIframe.createFrame(ref.current, { showLeaveButton: true });
    frame.join({ url: roomUrl });
    return () => { frame?.destroy(); };
  }, []);
  return (<main className="w-full h-[92vh] p-2"><div ref={ref} className="w-full h-full rounded-xl overflow-hidden border shadow-card" /></main>);
}
