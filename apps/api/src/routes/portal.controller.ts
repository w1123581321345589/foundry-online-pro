
import { Controller, Get, Query } from '@nestjs/common';
import prisma from '../services/prisma';

@Controller('portal')
export class PortalController {
  @Get('overview')
  async overview(@Query('householdId') householdId: string = 'hh_1') {
    const invoices = await prisma.invoice.findMany({ where: { householdId }, orderBy: { createdAt: 'desc' }, take: 10 });
    // Demo sessions: fetch next 5 sessions across cohorts
    const sessions = await prisma.session.findMany({ orderBy: { startsAt: 'asc' }, take: 5 });
    return { invoices, sessions };
  }
}
