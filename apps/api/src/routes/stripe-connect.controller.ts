
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import Stripe from 'stripe';
import prisma from '../services/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

@Controller('stripe')
export class StripeConnectController {
  /** Create (or reuse) a connected account for an org and return an onboarding link */
  @Post('connect/start')
  async start(@Body() body: any) {
    const orgId = body.orgId || 'org_1';
    let org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      org = await prisma.organization.create({ data: { id: orgId, name: body.orgName || 'My Org', ownerId: body.ownerId || 'user_1', billingEmail: body.billingEmail || null } });
    }
    let acctId = org.stripeAccountId;
    if (!acctId) {
      const acct = await stripe.accounts.create({ type: 'express' });
      acctId = acct.id;
      await prisma.organization.update({ where: { id: orgId }, data: { stripeAccountId: acctId } });
    }
    const refresh_url = (process.env.APP_BASE_URL || 'http://localhost:3000') + '/operator/connect/refresh';
    const return_url  = (process.env.APP_BASE_URL || 'http://localhost:3000') + '/operator/connect/return';
    const link = await stripe.accountLinks.create({
      account: acctId,
      refresh_url,
      return_url,
      type: 'account_onboarding'
    });
    return { accountId: acctId, url: link.url };
  }

  /** Check onboarding status */
  @Get('connect/status')
  async status(@Query('orgId') orgId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId || 'org_1' } });
    if (!org?.stripeAccountId) return { connected: false };
    const acct = await stripe.accounts.retrieve(org.stripeAccountId);
    return { connected: acct.details_submitted, payouts_enabled: acct.payouts_enabled };
  }

  /** Start $199/mo floor fee billing for org (creates customer + subscription) */
  @Post('billing/start')
  async billingStart(@Body() body: any) {
    const orgId = body.orgId || 'org_1';
    let org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new Error('Org not found');
    if (!org.billingEmail && body.billingEmail) {
      org = await prisma.organization.update({ where: { id: orgId }, data: { billingEmail: body.billingEmail } });
    }
    if (!org.billingEmail) throw new Error('billingEmail required');
    if (!process.env.STRIPE_BILLING_PRICE_ID) throw new Error('Set STRIPE_BILLING_PRICE_ID');
    // Create customer if missing
    let customerId = org.stripeCustomerId;
    if (!customerId) {
      const cust = await stripe.customers.create({ email: org.billingEmail, name: org.name });
      customerId = cust.id;
      await prisma.organization.update({ where: { id: orgId }, data: { stripeCustomerId: customerId } });
    }
    // Create subscription if missing
    if (!org.stripeSubscriptionId) {
      const sub = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: process.env.STRIPE_BILLING_PRICE_ID! }]
      });
      await prisma.organization.update({ where: { id: orgId }, data: { stripeSubscriptionId: sub.id } });
      return { started: true, subscriptionId: sub.id };
    }
    return { started: false, subscriptionId: org.stripeSubscriptionId };
  }
}
