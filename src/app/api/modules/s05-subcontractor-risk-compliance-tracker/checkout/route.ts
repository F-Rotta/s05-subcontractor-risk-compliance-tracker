export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20' as any,
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Missing or invalid bearer token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Invalid Supabase session' }, { status: 401 });
    }

    const body = await request.json();
    const { priceId, spokeOrgId, creditsCount = 10 } = body;

    if (!priceId || !spokeOrgId) {
      return NextResponse.json({ error: 'BAD_REQUEST', message: 'Missing priceId or spokeOrgId' }, { status: 400 });
    }

    // Verify organization membership
    const { data: org, error: orgError } = await supabaseAdmin
      .schema('S05_subcontractor_risk_compliance_tracker')
      .from('spoke_organizations')
      .select('id, name')
      .eq('id', spokeOrgId)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: 'FORBIDDEN', message: 'Organization not found or access denied' }, { status: 403 });
    }

    const host = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${host}/dashboard/s05-subcontractor-risk-compliance-tracker?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/dashboard/s05-subcontractor-risk-compliance-tracker?payment=cancelled`,
      metadata: {
        spoke_slug: 's05-subcontractor-risk-compliance-tracker',
        spoke_org_id: spokeOrgId,
        user_id: user.id,
        credits: creditsCount.toString(),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id }, { status: 200 });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR', message: error.message }, { status: 500 });
  }
}
