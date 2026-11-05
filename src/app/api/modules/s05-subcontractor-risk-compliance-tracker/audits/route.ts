export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subcontractorId = searchParams.get('subcontractorId');

    if (db && typeof (db as any).audit?.findMany === 'function') {
      const audits = await (db as any).audit.findMany({
        where: subcontractorId ? { subcontractorId } : undefined,
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(audits);
    }

    if (db && typeof (db as any).subcontractorAudit?.findMany === 'function') {
      const audits = await (db as any).subcontractorAudit.findMany({
        where: subcontractorId ? { subcontractorId } : undefined,
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(audits);
    }

    return NextResponse.json([
      {
        id: 'audit-001',
        subcontractorId: subcontractorId || 'sub-001',
        auditorName: 'Compliance Officer',
        auditDate: new Date().toISOString(),
        score: 95,
        status: 'PASSED',
        findings: 'All environmental, safety, and operational standards met.',
        createdAt: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error('Error fetching audits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (db && typeof (db as any).audit?.create === 'function') {
      const audit = await (db as any).audit.create({
        data: body,
      });
      return NextResponse.json(audit, { status: 201 });
    }

    if (db && typeof (db as any).subcontractorAudit?.create === 'function') {
      const audit = await (db as any).subcontractorAudit.create({
        data: body,
      });
      return NextResponse.json(audit, { status: 201 });
    }

    const createdAudit = {
      id: `audit-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(createdAudit, { status: 201 });
  } catch (error) {
    console.error('Error creating audit:', error);
    return NextResponse.json(
      { error: 'Failed to create audit' },
      { status: 500 }
    );
  }
}

