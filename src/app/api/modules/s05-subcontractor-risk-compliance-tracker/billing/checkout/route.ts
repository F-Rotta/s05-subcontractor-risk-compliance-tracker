export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { spoke_org_id, success_url, cancel_url } = body;

    if (!spoke_org_id) {
      return NextResponse.json({ error: 'Missing spoke_org_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Subcontractor Risk Compliance Tracker - Audit Credits',
            },
            unit_amount: 5000, // €50.00 pack
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url || 'https://example.com/success',
      cancel_url: cancel_url || 'https://example.com/cancel',
      metadata: {
        spoke_org_id,
        spoke_id: 'S05',
      },
    });

    return NextResponse.json({ checkout_url: session.url, session_id: session.id }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Stripe error' }, { status: 500 });
  }
}
