import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const S05_SCHEMA = 'S05_subcontractor_risk_compliance_tracker' as const;

export interface AuthContext {
  userId: string;
  email: string;
  spokeOrgId: string;
}

export async function authenticateS05Request(req: NextRequest): Promise<
  | { success: true; context: AuthContext }
  | { success: false; status: number; error: string; detail?: string }
> {
  const authHeader = req.headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    const cookie = req.cookies.get('sb-access-token');
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) {
    return {
      success: false,
      status: 401,
      error: 'UNAUTHORIZED',
      detail: 'Authorization token is missing',
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return {
      success: false,
      status: 401,
      error: 'INVALID_TOKEN',
      detail: authError?.message || 'User verification failed',
    };
  }

  const spokeOrgIdFromMeta =
    user.app_metadata?.spoke_org_id ||
    user.user_metadata?.spoke_org_id ||
    req.headers.get('x-spoke-org-id');

  if (!spokeOrgIdFromMeta) {
    return {
      success: false,
      status: 403,
      error: 'TENANT_NOT_ASSIGNED',
      detail: 'No spoke organization identified for this user context.',
    };
  }

  const { data: orgData, error: orgError } = await supabaseAdmin
    .schema(S05_SCHEMA)
    .from('spoke_organizations')
    .select('id, legal_name')
    .eq('id', spokeOrgIdFromMeta)
    .maybeSingle();

  if (orgError || !orgData) {
    return {
      success: false,
      status: 403,
      error: 'ORGANIZATION_FORBIDDEN',
      detail: 'Organization record could not be found or access is revoked.',
    };
  }

  return {
    success: true,
    context: {
      userId: user.id,
      email: user.email || '',
      spokeOrgId: orgData.id,
    },
  };
}
