
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import prisma from '../services/prisma';
import PDFDocument from 'pdfkit';

function makePdfBuffer(title: string, lines: string[]): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    const chunks: any[] = [];
    doc.on('data', (d) => chunks.push(d));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.fontSize(18).text(title, { underline: true });
    doc.moveDown();
    doc.fontSize(11);
    lines.forEach(l => doc.text('• ' + l));
    doc.end();
  });
}

@Controller('sessions')
export class SessionsController {
  /** Toggle recording flag (stub) */
  @Post('recording')
  async recording(@Body() b: any) {
    const { sessionId, recording } = b;
    const ss = await prisma.sessionSettings.upsert({
      where: { sessionId },
      update: { recording: !!recording },
      create: { sessionId, recording: !!recording, chatEnabled: false }
    });
    return ss;
  }

  /** Attach a recording URL to a session */
  @Post('attach-recording')
  async attachRecording(@Body() b: any) {
    const row = await prisma.recordingAsset.create({ data: { sessionId: b.sessionId, url: b.url } });
    return row;
  }

  /** Get session recordings */
  @Get('recordings')
  async recordings(@Query('sessionId') sessionId: string) {
    const rows = await prisma.recordingAsset.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' } });
    return rows;
  }

  /** Toggle chat moderation */
  @Post('chat')
  async chat(@Body() b: any) {
    const { sessionId, enabled } = b;
    const ss = await prisma.sessionSettings.upsert({
      where: { sessionId },
      update: { chatEnabled: !!enabled },
      create: { sessionId, chatEnabled: !!enabled, recording: false }
    });
    return ss;
  }

  /** Generate weekly recap PDF for a household (stub content) */
  @Post('recap/weekly')
  async weeklyRecap(@Body() b: any) {
    const { householdId='hh_1', weekOf } = b;
    const weekDate = weekOf ? new Date(weekOf) : new Date();
    const lines = [
      `Household: ${householdId}`,
      `Week of: ${weekDate.toDateString()}`,
      `Highlights: mastery gains, projects shared, attendance summary.`,
      `Next week: focus on applied practice and capstone milestones.`
    ];
    const buf = await makePdfBuffer('Weekly Learning Recap', lines);
    // In real impl, upload to S3; here we return a base64 preview and persist a row
    const row = await prisma.recapReport.create({ data: { householdId, weekOf: weekDate as any, summary: lines.join('\n') } });
    return { id: row.id, previewBase64: buf.toString('base64').slice(0, 20000) };
  }
}
