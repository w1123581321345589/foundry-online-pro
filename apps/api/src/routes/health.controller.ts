
import { Controller, Get } from '@nestjs/common';
@Controller('health')
export class HealthController {
  @Get() ok() { return { ok: true, service: 'foundry-online-api', ts: new Date().toISOString() }; }
}
