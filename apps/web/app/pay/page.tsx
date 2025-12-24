
'use client';
import { api } from '../lib/api';

export default function PayPage() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Tuition Checkout (Test)</h1>
      <button className="btn" onClick={async () => {
          const r = await api('/payments/checkout', {
            method: 'POST',
            body: JSON.stringify({
              amountCents: 25000,
              successUrl: window.location.origin + '/?paid=1',
              cancelUrl: window.location.href
            })
          });
          window.location.href = r.url;
        }}>
        Pay $250.00
      </button>
    </main>
  );
}
