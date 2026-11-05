export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { authenticateS05Request, S05_SCHEMA } from '@/lib/modules/s05/auth';

const resolveAlertSchema = z.object({
  alert_id: z.string().uuid(),
  resolution_note: z.string().min(1, 'Resolution note is required'),
});

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateS05Request(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: (authResult as any).error, message: (authResult as any).detail },
        { status: (authResult as any).status }
      );
    }
    const { context } = authResult;

    const { searchParams } = new URL(req.url);
    const resolved = searchParams.get('resolved');

    let query = supabaseAdmin
      .schema(S05_SCHEMA)
      .from('compliance_alerts')
      .select('*, contract:contracts(contract_code, title), subcontractor:subcontractors(legal_name)')
      .eq('spoke_org_id', context.spokeOrgId)
      .order('due_date', { ascending: true });

    if (resolved === 'true') {
      query = query.not('resolved_at', 'is', null);
    } else if (resolved === 'false') {
      query = query.is('resolved_at', null);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'DATABASE_ERROR', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ alerts: data || [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authResult = await authenticateS05Request(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: (authResult as any).error, message: (authResult as any).detail },
        { status: (authResult as any).status }
      );
    }
    const { context } = authResult;

    const json = await req.json();
    const parseResult = resolveAlertSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'BAD_REQUEST',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { alert_id, resolution_note } = parseResult.data;

    const { data, error } = await supabaseAdmin
      .schema(S05_SCHEMA)
      .from('compliance_alerts')
      .update({
        resolved_at: new Date().toISOString(),
        resolution_note,
      })
      .eq('id', alert_id)
      .eq('spoke_org_id', context.spokeOrgId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: 'DATABASE_ERROR', message: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Alert not found in current organization' },
        { status: 404 }
      );
    }

    return NextResponse.json({ alert: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'INTERNAL_SERVER_ERROR', message: error.message },
      { status: 500 }
    );
  }
}

