
import axios from 'axios';

export async function createDailyRoom(): Promise<string> {
  if (!process.env.DAILY_API_KEY) {
    // Fallback to public room URL (env) or placeholder
    return process.env.NEXT_PUBLIC_DAILY_ROOM_URL || 'https://example.org/meet/demo';
  }
  const r = await axios.post('https://api.daily.co/v1/rooms', {
    properties: { enable_screenshare: true, enable_recording: 'cloud' },
    privacy: 'private',
  }, { headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` } });
  return r.data?.url || '';
}
