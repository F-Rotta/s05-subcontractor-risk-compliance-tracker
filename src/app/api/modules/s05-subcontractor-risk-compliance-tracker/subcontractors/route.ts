export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { CreateSubcontractorSchema } from '@/lib/schemas/contract';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spokeOrgId = searchParams.get('spoke_org_id');

    if (!spokeOrgId) {
      return NextResponse.json({ error: 'Missing spoke_org_id parameter' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('subcontractors')
      .select('*')
      .eq('spoke_org_id', spokeOrgId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = CreateSubcontractorSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('subcontractors')
      .insert([validation.data])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
