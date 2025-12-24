
import { Controller, Get, Query } from '@nestjs/common';
import Stripe from 'stripe';
import prisma from '../services/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

@Controller('stripe/connect')
export class StripeConnectReportingController {
  @Get('balance')
  async balance(@Query('orgId') orgId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId || 'org_1' } });
    if (!org?.stripeAccountId) return { connected: false };
    const bal = await stripe.balance.retrieve({ stripeAccount: org.stripeAccountId });
    return { connected: true, available: bal.available, pending: bal.pending };
  }

  @Get('payouts')
  async payouts(@Query('orgId') orgId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId || 'org_1' } });
    if (!org?.stripeAccountId) return { connected: false, data: [] };
    const list = await stripe.payouts.list({ limit: 10 }, { stripeAccount: org.stripeAccountId });
    return { connected: true, data: list.data };
  }
}
