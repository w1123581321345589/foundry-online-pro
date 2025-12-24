
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import prisma from '../services/prisma';

@Controller('attendance')
export class AttendanceController {
  @Post('mark')
  async mark(@Body() b: any) {
    const { sessionId, learnerId, status='present', notes=null } = b;
    const row = await prisma.attendance.create({ data: { sessionId, learnerId, status, notes } });
    return row;
  }

  @Get('session')
  async bySession(@Query('sessionId') sessionId: string) {
    const rows = await prisma.attendance.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' } });
    return rows;
  }

  @Get('learner')
  async byLearner(@Query('learnerId') learnerId: string) {
    const rows = await prisma.attendance.findMany({ where: { learnerId }, orderBy: { createdAt: 'desc' }, take: 50 });
    return rows;
  }
}
