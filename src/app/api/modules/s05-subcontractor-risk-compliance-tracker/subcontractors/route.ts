export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { InsertSubcontractorSchema } from '@/lib/schemas/contract';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Missing auth token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Invalid token' }, { status: 401 });
    }

    const url = new URL(request.url);
    const spokeOrgId = url.searchParams.get('spoke_org_id');

    if (!spokeOrgId) {
      return NextResponse.json({ error: 'BAD_REQUEST', message: 'Missing spoke_org_id parameter' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .schema('S05_subcontractor_risk_compliance_tracker')
      .from('subcontractors')
      .select('*')
      .eq('org_id', spokeOrgId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ subcontractors: data }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching subcontractors:', err);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR', message: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Missing auth token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Invalid token' }, { status: 401 });
    }

    const json = await request.json();
    const parsed = InsertSubcontractorSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'BAD_REQUEST', details: parsed.error.format() }, { status: 400 });
    }

    const payload = parsed.data;

    // Map Domain InsertSubcontractorSchema to Database Columns
    const dbPayload = {
      org_id: payload.spoke_org_id,
      legal_name: payload.company_name,
      trade_name: payload.company_name,
      vat_number: payload.vat_number,
      tax_code: payload.fiscal_code,
      registration_number: payload.inps_position_code || null,
      primary_contact_name: payload.legal_representative,
      primary_contact_email: payload.pec_email,
      risk_level: payload.compliance_rating < 0.5 ? 'high' : 'medium',
      risk_score: Math.round((1.0 - payload.compliance_rating) * 100),
      is_active: payload.status === 'verified' || payload.status === 'under_review',
      metadata: {
        applied_ccnl: payload.applied_ccnl,
        inail_position_code: payload.inail_position_code,
        cassa_edile_code: payload.cassa_edile_code,
        status: payload.status
      }
    };

    const { data, error } = await supabaseAdmin
      .schema('S05_subcontractor_risk_compliance_tracker')
      .from('subcontractors')
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ subcontractor: data }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating subcontractor:', err);
    return NextResponse.json({ error: 'INTERNAL_SERVER_ERROR', message: err.message }, { status: 500 });
  }
}
