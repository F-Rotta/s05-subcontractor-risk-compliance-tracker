import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envStatus = {
    supabase_url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabase_anon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    stripe_price: Boolean(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || process.env.STRIPE_PRICE_ID),
  };
  const isHealthy = Object.values(envStatus).every(Boolean);
  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: envStatus
  }, { status: isHealthy ? 200 : 500 });
}
