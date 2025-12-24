
export async function api<T=any>(path: string, init?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(base + path, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, cache: 'no-store' });
  if(!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}
