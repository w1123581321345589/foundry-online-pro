
import { Body, Controller, Post } from '@nestjs/common';
import prisma from '../services/prisma';

/** Online safety: recording consent, incident intake */
@Controller('safety')
export class SafetyController {
  @Post('consent/recording')
  async recordingConsent(@Body() body: any) {
    const row = await prisma.recordingConsent.create({ data: {
      learnerId: body.learnerId, courseId: body.courseId, consent: !!body.consent
    }});
    return row;
  }

  @Post('incident')
  async incident(@Body() body: any) {
    const row = await prisma.onlineIncident.create({ data: {
      orgId: body.orgId || 'org_1', reporterId: body.reporterId || 'user_1', type: body.type, notes: body.notes || null
    }});
    // TODO: notify parents & staff; compile PDF
    return row;
  }
}
