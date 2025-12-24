
'use client';
import Link from 'next/link';

const tiles = [
  { key: 'identity', title: 'Identity & Banking', href: '/operator/onboarding', desc: 'KYC/KYB, payouts', state: 'Auto-Running' },
  { key: 'background', title: 'Background Checks', href: '#', desc: 'Instructor screening', state: 'Needs Input' },
  { key: 'catalog', title: 'Course Catalog', href: '/catalog', desc: 'Create courses & cohorts', state: 'Done' },
  { key: 'classroom', title: 'Virtual Classroom', href: '/classroom/sample-session-id', desc: 'Video, whiteboard, recordings', state: 'Auto-Running' },
  { key: 'instructor', title: 'Instructor Console', href: '/instructor/sessions', desc: 'Rosters, moderation, recording', state: 'Auto-Running' },
  { key: 'learn', title: 'Learn Studio (GLL)', href: '/gll', desc: 'Roadmap, Drills, Clarity, Review, Capstone', state: 'Needs Input' },
  { key: 'safety', title: 'Online Safety', href: '/safety', desc: 'Recording consent, incidents', state: 'Auto-Running' },
  { key: 'payments', title: 'Payments & ESA', href: '/pay', desc: 'Tuition plans, refunds, proration', state: 'Done' },
  { key: 'parents', title: 'Parent/Learner Portal', href: '/parent', desc: 'Attendance, artifacts, NPS', state: 'Auto-Running' },
];

export default function Page() {
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-1">Foundry Online</h1>
      <p className="text-sm text-gray-600 mb-6">One plan. One dashboard. Launch an online micro‑school in days.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map(t => (
          <Link href={t.href} key={t.key} className="card block">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{t.title}</h2>
              <span className={`badge ${t.state==='Done' ? 'bg-green-100 text-green-700' : t.state==='Needs Input' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{t.state}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{t.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
