import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/modules/s05-subcontractor-risk-compliance-tracker/webhook',
    message: 'Webhook receiver is active and ready to process events.'
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const eventType = payload.event || payload.type || 'unknown_event';
    const timestamp = new Date().toISOString();

    return NextResponse.json({
      received: true,
      event: eventType,
      timestamp,
      message: 'Subcontractor compliance webhook processed successfully.'
    });
  } catch (error) {
    return NextResponse.json(
      {
        received: false,
        message: 'Invalid payload or error processing webhook',
        error: String(error)
      },
      { status: 400 }
    );
  }
}
