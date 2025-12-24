
import { Body, Controller, Post } from '@nestjs/common';
import prisma from '../services/prisma';

/** Guided Learning Loop endpoints (persist + QA) */
@Controller('learn')
export class LearnStudioController {
  @Post('roadmap')
  async roadmap(@Body() b: any) {
    const levels = [1,2,3,4,5].map(n => ({
      level: n,
      focus: `Focus ${n}`,
      readiness: [`check ${n}`],
      minutes: 20 + (n - 1) * 5
    }));
    // Save a placeholder lesson pack for this unit
    const lp = await prisma.lessonPack.create({ data: { orgId: b.orgId || 'org_1', unitRef: b.standardId || 'unit', status: 'draft', linksJson: '{}' } });
    return { levels, lessonPackId: lp.id };
  }

  @Post('practice')
  async practice(@Body() b: any) {
    const interest = (b.interests && b.interests[0]) || 'everyday life';
    const exercises = Array.from({length:10}).map((_,i)=>({ idx: i+1, prompt: `(${interest}) Exercise ${i+1}`, answerKey: 'TBD' }));
    return { exercises };
  }

  @Post('clarity')
  clarity(@Body() b: any) {
    return {
      explanation: 'Explain like I am 12…',
      analogies: ['Bridge', 'Recipe', 'Map'],
      connectionMap: ['Known A → Concept X', 'Known B → Concept Y'],
      mnemonic: 'H.O.P.',
    };
  }

  @Post('review')
  review(@Body() b: any) {
    return { glows: ['Clear structure'], grows: ['Explain reasoning'], nextFocus: 'Use examples', rubric: { accuracy: 0.92, clarity: 0.91 } };
  }

  @Post('capstone')
  capstone(@Body() b: any) {
    return { brief: 'Project: Build & Share', milestones: ['Plan','Build','Share'], exhibition: 'Parent showcase', rubric: { creativity: 4, communication: 4 } };
  }

  /** Create QA ticket and compute score; persist decision */
  @Post('qa/score')
  async qa(@Body() b: any) {
    const { lessonPackId } = b;
    const accuracy = b.accuracy ?? 0.9;
    const coverage = b.coverage ?? 0.9;
    const cognitiveLoad = b.cognitiveLoad ?? 0.8;
    const engagement = b.engagement ?? 0.9;
    const score = (accuracy + coverage + (1 - Math.abs(cognitiveLoad - 0.8)) + engagement) / 4;
    const decision = score >= 0.90 ? 'approved' : 'rejected';
    const ticket = await prisma.qATicket.create({ data: { lessonPackId, status: decision as any, notes: `score=${score.toFixed(2)}` } });
    await prisma.lessonPack.update({ where: { id: lessonPackId }, data: { status: decision, rubricScore: score }});
    return { score, decision, ticketId: ticket.id };
  }
}
