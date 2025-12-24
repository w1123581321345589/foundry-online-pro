
'use client';
import React from 'react';
import { useEffect, useState } from 'react';

export default function OnboardingWizard() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const [orgName, setOrgName] = useState('My Org');
  const [billingEmail, setBillingEmail] = useState('owner@example.com');
  const [step, setStep] = useState<1|2|3>(1 as const);
  const [status, setStatus] = useState<any>(null);
  const orgId = 'org_1';

  useEffect(() => { (async () => {
    const s = await fetch(`${api}/operator/onboard/state?orgId=${orgId}`).then(r=>r.json());
    setStatus(s);
  })(); }, []);

  async function start() {
    const r = await fetch(`${api}/operator/onboard/start`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, orgName, billingEmail })
    }).then(r=>r.json());
    if (r.onboardingUrl) window.location.href = r.onboardingUrl;
    setStep(2);
  }

  async function refresh() {
    const s = await fetch(`${api}/operator/onboard/state?orgId=${orgId}`).then(r=>r.json());
    setStatus(s);
  }

  async function finish() {
    const f = await fetch(`${api}/operator/onboard/finish`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, billingEmail })
    }).then(r=>r.json());
    await refresh();
    setStep(3);
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Operator Onboarding</h1>

      {step === 1 && (
        <section className="card space-y-3">
          <div>
            <label className="block text-sm text-gray-600">Organization Name</label>
            <input value={orgName} onChange={e=>setOrgName(e.target.value)} className="border rounded w-full px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Billing Email (for $199/mo floor)</label>
            <input value={billingEmail} onChange={e=>setBillingEmail(e.target.value)} className="border rounded w-full px-2 py-1" />
          </div>
          <button className="btn" onClick={start}>Start Stripe Connect</button>
        </section>
      )}

      {step >= 2 && (
        <section className="card space-y-3">
          <h2 className="font-medium">Step 2 — Complete Stripe Onboarding</h2>
          <p className="text-sm text-gray-600">After completing the Stripe form, click refresh.</p>
          <div className="flex items-center gap-2">
            <button className="btn" onClick={refresh}>Refresh Status</button>
            <div className="text-sm">{status?.connected ? 'Details submitted ✅' : 'Not completed yet'}</div>
          </div>
          <button className="btn" disabled={!status?.connected} onClick={finish}>Start $199/mo floor</button>
          {status?.hasSubscription && <div className="text-sm text-green-700">Floor fee active ✅</div>}
        </section>
      )}

      {step >= 3 && (
        <section className="card space-y-3">
          <h2 className="font-medium">All Set</h2>
          <p className="text-sm">You can now accept tuition and receive payouts. Visit <a className="text-accent underline" href="/operator/payouts">Payouts</a> to view balances.</p>
        </section>
      )}
    </main>
  );
}
