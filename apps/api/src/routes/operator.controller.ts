
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import prisma from '../services/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

@Controller('operator/onboard')
export class OperatorOnboardController {
  /** Start onboarding: create/update org, store billingEmail, and initiate Connect */
  @Post('start')
  async start(@Body() body: any) {
    const orgId = body.orgId || 'org_1';
    const data: any = {
      name: body.orgName || 'My Org',
      ownerId: body.ownerId || 'user_1',
      billingEmail: body.billingEmail || null,
      onboardingStatus: 'started'
    };
    let org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (org) org = await prisma.organization.update({ where: { id: orgId }, data });
    else org = await prisma.organization.create({ data: { id: orgId, ...data } });
    // Create/reuse connect account
    let acctId = org.stripeAccountId;
    if (!acctId) {
      const acct = await stripe.accounts.create({ type: 'express' });
      acctId = acct.id;
      await prisma.organization.update({ where: { id: orgId }, data: { stripeAccountId: acctId } });
    }
    const refresh_url = (process.env.APP_BASE_URL || 'http://localhost:3000') + '/operator/connect/refresh';
    const return_url  = (process.env.APP_BASE_URL || 'http://localhost:3000') + '/operator/connect/return';
    const link = await stripe.accountLinks.create({ account: acctId, refresh_url, return_url, type: 'account_onboarding' });
    return { accountId: acctId, onboardingUrl: link.url };
  }

  /** Poll current onboarding state: connect status + billing subscription presence */
  @Get('state')
  async state(@Query('orgId') orgId: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId || 'org_1' } });
    if (!org) return { exists: false };
    let connected = false, payouts_enabled = false;
    if (org.stripeAccountId) {
      const acct = await stripe.accounts.retrieve(org.stripeAccountId);
      connected = !!acct.details_submitted;
      payouts_enabled = !!acct.payouts_enabled;
    }
    const hasSubscription = !!org.stripeSubscriptionId;
    return {
      exists: true,
      connected, payouts_enabled,
      hasSubscription,
      onboardingStatus: org.onboardingStatus,
      billingEmail: org.billingEmail,
      org,
    };
  }

  /** Finish: start $199/mo floor subscription if not present */
  @Post('finish')
  async finish(@Body() body: any) {
    const orgId = body.orgId || 'org_1';
    let org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new Error('Org not found');
    if (!org.billingEmail && body.billingEmail) {
      org = await prisma.organization.update({ where: { id: orgId }, data: { billingEmail: body.billingEmail } });
    }
    if (!org.billingEmail) throw new Error('billingEmail required');
    if (org.stripeSubscriptionId) {
      await prisma.organization.update({ where: { id: orgId }, data: { onboardingStatus: 'completed', onboardingCompletedAt: new Date() as any } });
      return { started: false, subscriptionId: org.stripeSubscriptionId };
    }
    if (!process.env.STRIPE_BILLING_PRICE_ID) throw new Error('Set STRIPE_BILLING_PRICE_ID');
    // Ensure customer
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
    let customerId = org.stripeCustomerId;
    if (!customerId) {
      const cust = await stripe.customers.create({ email: org.billingEmail, name: org.name });
      customerId = cust.id;
      await prisma.organization.update({ where: { id: orgId }, data: { stripeCustomerId: customerId } });
    }
    // Create subscription
    const sub = await stripe.subscriptions.create({ customer: customerId, items: [{ price: process.env.STRIPE_BILLING_PRICE_ID! }] });
    await prisma.organization.update({ where: { id: orgId }, data: { stripeSubscriptionId: sub.id, onboardingStatus: 'completed', onboardingCompletedAt: new Date() as any } });
    return { started: true, subscriptionId: sub.id };
  }
}
