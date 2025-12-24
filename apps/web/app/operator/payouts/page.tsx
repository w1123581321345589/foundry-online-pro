
'use client';
import useSWR from 'swr';

export default function PayoutsDashboard() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const orgId = 'org_1';
  const fetcher = (url: string) => fetch(url).then(r=>r.json());
  const { data: bal } = useSWR(`${api}/stripe/connect/balance?orgId=${orgId}`, fetcher, { refreshInterval: 10000 });
  const { data: pts } = useSWR(`${api}/stripe/connect/payouts?orgId=${orgId}`, fetcher, { refreshInterval: 15000 });

  const available = bal?.available?.[0]?.amount ? (bal.available[0].amount/100).toFixed(2) : '0.00';
  const pending = bal?.pending?.[0]?.amount ? (bal.pending[0].amount/100).toFixed(2) : '0.00';
  const payouts = pts?.data || [];

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Payouts</h1>
      {!bal?.connected && <div className="card text-sm text-amber-700 bg-amber-50">Connect account not completed. Please finish onboarding.</div>}
      <section className="card">
        <h2 className="font-medium mb-2">Balance</h2>
        <div className="flex gap-6 text-sm">
          <div>Available: <span className="font-medium">${available}</span></div>
          <div>Pending: <span className="font-medium">${pending}</span></div>
        </div>
      </section>
      <section className="card">
        <h2 className="font-medium mb-2">Recent Payouts</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-600"><th>Date</th><th>Amount</th><th>Status</th><th>Method</th></tr></thead>
          <tbody>
            {payouts.map((p:any)=>(
              <tr key={p.id} className="border-t">
                <td>{new Date(p.created*1000).toLocaleString()}</td>
                <td>${(p.amount/100).toFixed(2)}</td>
                <td>{p.status}</td>
                <td>{p.method}</td>
              </tr>
            ))}
            {payouts.length === 0 && <tr><td colSpan={4} className="py-3 text-gray-500">No payouts yet.</td></tr>}
          </tbody>
        </table>
      </section>
    </main>
  );
}
