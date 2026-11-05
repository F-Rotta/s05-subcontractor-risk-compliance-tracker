import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subcontractorId = searchParams.get('subcontractorId');
    const status = searchParams.get('status');

    return NextResponse.json({
      success: true,
      data: {
        contracts: [],
        filters: { subcontractorId, status },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: `cnt-${Date.now()}`,
          ...body,
          createdAt: new Date().toISOString(),
          status: body.status || 'DRAFT',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
