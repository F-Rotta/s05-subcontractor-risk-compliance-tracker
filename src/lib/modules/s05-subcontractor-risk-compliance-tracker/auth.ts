import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface SpokeAuthContext {
  userId: string;
  userEmail: string;
  orgId: string;
  legalName: string;
  vatNumber: string;
  credits: number;
}

const SCHEMA_NAME = "S05_subcontractor_risk_compliance_tracker";

export async function resolveSpokeAuth(
  req: NextRequest
): Promise<{ auth: SpokeAuthContext | null; errorResponse?: { status: number; message: string; code: string } }> {
  try {
    const authHeader = req.headers.get("authorization");
    let token: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(/sb-access-token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    if (!token) {
      return {
        auth: null,
        errorResponse: {
          status: 401,
          code: "UNAUTHORIZED",
          message: "Missing or invalid authorization token.",
        },
      };
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !userData.user) {
      return {
        auth: null,
        errorResponse: {
          status: 401,
          code: "INVALID_SESSION",
          message: userError?.message || "User session could not be verified.",
        },
      };
    }

    const user = userData.user;
    const explicitOrgId =
      req.headers.get("x-spoke-org-id") ||
      (user.app_metadata?.spoke_org_id as string | undefined) ||
      (user.user_metadata?.spoke_org_id as string | undefined);

    let query = supabaseAdmin
      .schema(SCHEMA_NAME)
      .from("spoke_organizations")
      .select("id, legal_name, vat_number, primary_email, billing_address");

    if (explicitOrgId) {
      query = query.eq("id", explicitOrgId);
    } else {
      query = query.eq("primary_email", user.email || "");
    }

    const { data: orgData, error: orgError } = await query.maybeSingle();

    if (orgError) {
      return {
        auth: null,
        errorResponse: {
          status: 500,
          code: "DATABASE_ERROR",
          message: `Tenant lookup failed: ${orgError.message}`,
        },
      };
    }

    if (!orgData) {
      return {
        auth: null,
        errorResponse: {
          status: 403,
          code: "ORG_NOT_FOUND",
          message: "No legal tenant registered for this user in S05 compliance tracker.",
        },
      };
    }

    const billing = (orgData.billing_address as Record<string, unknown>) || {};
    const availableCredits = typeof billing.credits === "number" ? billing.credits : 0;

    return {
      auth: {
        userId: user.id,
        userEmail: user.email || "",
        orgId: orgData.id,
        legalName: orgData.legal_name,
        vatNumber: orgData.vat_number,
        credits: availableCredits,
      },
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      auth: null,
      errorResponse: {
        status: 500,
        code: "AUTH_INTERNAL_ERROR",
        message: error.message || "Failed to authenticate request context.",
      },
    };
  }
}

