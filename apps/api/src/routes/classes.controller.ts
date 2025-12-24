
import { Body, Controller, Get, Post } from '@nestjs/common';
import prisma from '../services/prisma';
import { createDailyRoom } from '../services/daily';

@Controller('classes')
export class ClassesController {
  @Post('create-course')
  async createCourse(@Body() body: any) {
    const c = await prisma.course.create({ data: {
      orgId: body.orgId || 'org_1', title: body.title, description: body.description || '', gradeBand: body.gradeBand || null,
    }});
    return c;
  }

  @Post('create-cohort')
  async createCohort(@Body() body: any) {
    const cohort = await prisma.cohort.create({ data: {
      courseId: body.courseId, title: body.title, timezone: body.timezone || 'UTC', meetsPerWeek: body.meetsPerWeek || 2
    }});
    return cohort;
  }

  @Post('create-session')
  async createSession(@Body() body: any) {
    const roomUrl = await createDailyRoom();
    const sess = await prisma.session.create({ data: {
      cohortId: body.cohortId, startsAt: new Date(body.startsAt), durationMin: body.durationMin || 60, recordingUrl: roomUrl
    }});
    return { ...sess, joinUrl: roomUrl };
  }

  @Get('catalog')
  async catalog() {
    const courses = await prisma.course.findMany({ take: 20 });
    return courses;
  }
}
