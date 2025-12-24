
// Provider-agnostic LLM stub — DO NOT train on user data.
export async function generate(options: { prompt: string }): Promise<string> {
  const provider = process.env.LLM_PROVIDER || 'disabled';
  if (provider === 'disabled') return 'LLM disabled in this environment';
  return 'stub-output'; // TODO: implement provider adapter
}
