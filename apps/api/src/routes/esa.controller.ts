
import { Body, Controller, Post } from '@nestjs/common';
import prisma from '../services/prisma';

@Controller('esa')
export class EsaController {
  @Post('submit-claim')
  async submit(@Body() body: any) {
    const row = await prisma.eSAClaim.create({ data: {
      orgId: body.orgId || 'org_1',
      householdId: body.householdId || 'hh_1',
      state: body.state || 'AZ',
      amountCents: body.amountCents || 0,
      evidenceUrl: body.evidenceUrl || null,
    }});
    return row;
  }
}
