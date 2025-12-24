
'use client';
import { useState } from 'react';

export default function OperatorConnectPage() {
  const [url, setUrl] = useState<string | null>(null);
  return (
    <main className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Stripe Connect Onboarding</h1>
      <p className="text-sm text-gray-600">Create your payouts account.</p>
      <button
        className="btn"
        onClick={async () => {
          const r = await fetch((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/stripe/connect/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orgId: 'org_1', orgName: 'My Org', billingEmail: 'owner@example.com' })
          }).then(r=>r.json());
          setUrl(r.url);
          if (r.url) window.location.href = r.url;
        }}
      >
        Start Onboarding
      </button>
      {url && <p className="text-xs mt-2">If you weren't redirected, <a className="text-accent underline" href={url}>click here</a>.</p>}
    </main>
  );
}
