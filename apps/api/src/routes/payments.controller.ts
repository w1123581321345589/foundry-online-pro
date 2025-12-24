
import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import Stripe from 'stripe';
import prisma from '../services/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

@Controller('payments')
export class PaymentsController {
  /** Create a checkout session (tuition/deposit). Application fee = 5% */
  @Post('checkout')
  async checkout(@Body() body: any) {
    const { householdId='hh_1', amountCents, successUrl, cancelUrl, orgId='org_1' } = body;
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    const destination = org?.stripeAccountId || undefined;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{ quantity: 1, price_data: {
        currency: 'usd',
        unit_amount: amountCents,
        product_data: { name: 'Tuition Payment' },
      }}],
      payment_intent_data: {
        transfer_data: destination ? { destination } : undefined,
        application_fee_amount: Math.round(amountCents * 0.05),
      },
      metadata: { householdId }
    });
    await prisma.invoice.create({ data: { orgId: 'org_1', householdId, amountCents, status: 'open', stripeInvoiceId: session.id }});
    return { id: session.id, url: session.url };
  }

  /** Webhook: mark invoice paid, add transaction */
  @Post('webhook')
  async webhook(@Headers('stripe-signature') sig: string, @Req() req: any) {
    let event = req.body;
    try {
      if (process.env.STRIPE_WEBHOOK_SECRET) {
        event = stripe.webhooks.constructEvent(req.rawBody || JSON.stringify(req.body), sig, process.env.STRIPE_WEBHOOK_SECRET);
      }
    } catch (err) {
      return { ok: false, error: 'invalid signature' };
    }
    if (event.type === 'checkout.session.completed') {
      const s: any = event.data.object;
      const inv = await prisma.invoice.findFirst({ where: { stripeInvoiceId: s.id }});
      if (inv) {
        await prisma.invoice.update({ where: { id: inv.id }, data: { status: 'paid' }});
        await prisma.transaction.create({ data: { invoiceId: inv.id, amountCents: inv.amountCents, status: 'succeeded' }});
        // Auto-start floor billing if needed
        const org = await prisma.organization.findFirst({ where: { id: inv.orgId }});
        if (org && !org.stripeSubscriptionId && org.billingEmail && process.env.STRIPE_BILLING_PRICE_ID) {
          const cust = org.stripeCustomerId ? { id: org.stripeCustomerId } : await stripe.customers.create({ email: org.billingEmail, name: org.name });
          if (!org.stripeCustomerId) await prisma.organization.update({ where: { id: org.id }, data: { stripeCustomerId: (cust as any).id } });
          const sub = await stripe.subscriptions.create({ customer: (cust as any).id, items: [{ price: process.env.STRIPE_BILLING_PRICE_ID! }] });
          await prisma.organization.update({ where: { id: org.id }, data: { stripeSubscriptionId: sub.id } });
        }
      }
    }
    return { ok: true };
  }
}
