
import { Body, Controller, Post } from '@nestjs/common';

@Controller('recap')
export class RecapController {
  @Post()
  async send(@Body() body: any) {
    const { householdId, sessionId, summary } = body;
    // TODO: integrate email (SendGrid/Mailgun). For now, preview only.
    return { ok: true, delivered: false, preview: `Recap for session ${sessionId}: ${String(summary||'').slice(0,120)}…` };
  }
}
