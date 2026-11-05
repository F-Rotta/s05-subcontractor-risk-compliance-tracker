import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const subcontractorId = searchParams.get('subcontractorId');

    return NextResponse.json({
      success: true,
      data: {
        assignments: [],
        filters: { projectId, subcontractorId },
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
          id: `asg-${Date.now()}`,
          ...body,
          assignedAt: new Date().toISOString(),
          status: 'ACTIVE',
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
