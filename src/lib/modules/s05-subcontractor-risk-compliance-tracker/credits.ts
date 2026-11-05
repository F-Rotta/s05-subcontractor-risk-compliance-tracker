import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SCHEMA_NAME = "S05_subcontractor_risk_compliance_tracker";

export async function verifyAndDeductCredits(
  orgId: string,
  requiredCredits: number = 1
): Promise<{ success: boolean; currentBalance: number; error?: string }> {
  try {
    const { data: org, error: fetchError } = await supabaseAdmin
      .schema(SCHEMA_NAME)
      .from("spoke_organizations")
      .select("billing_address")
      .eq("id", orgId)
      .single();

    if (fetchError || !org) {
      return {
        success: false,
        currentBalance: 0,
        error: fetchError?.message || "Organization not found.",
      };
    }

    const billing = (org.billing_address as Record<string, unknown>) || {};
    const currentCredits = typeof billing.credits === "number" ? billing.credits : 0;

    if (currentCredits < requiredCredits) {
      return {
        success: false,
        currentBalance: currentCredits,
        error: `Insufficient compliance audit credits. Balance: ${currentCredits}, Required: ${requiredCredits}.`,
      };
    }

    const updatedCredits = currentCredits - requiredCredits;
    const updatedBilling = {
      ...billing,
      credits: updatedCredits,
      last_metered_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabaseAdmin
      .schema(SCHEMA_NAME)
      .from("spoke_organizations")
      .update({
        billing_address: updatedBilling,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orgId);

    if (updateError) {
      return {
        success: false,
        currentBalance: currentCredits,
        error: updateError.message,
      };
    }

    return {
      success: true,
      currentBalance: updatedCredits,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      currentBalance: 0,
      error: error.message || "Credit processing failed.",
    };
  }
}

export async function creditOrganizationAccount(
  orgId: string,
  creditsToAdd: number
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  try {
    const { data: org, error: fetchError } = await supabaseAdmin
      .schema(SCHEMA_NAME)
      .from("spoke_organizations")
      .select("billing_address")
      .eq("id", orgId)
      .single();

    if (fetchError || !org) {
      return {
        success: false,
        newBalance: 0,
        error: fetchError?.message || "Organization not found.",
      };
    }

    const billing = (org.billing_address as Record<string, unknown>) || {};
    const currentCredits = typeof billing.credits === "number" ? billing.credits : 0;
    const newBalance = currentCredits + creditsToAdd;

    const updatedBilling = {
      ...billing,
      credits: newBalance,
      last_credited_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabaseAdmin
      .schema(SCHEMA_NAME)
      .from("spoke_organizations")
      .update({
        billing_address: updatedBilling,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orgId);

    if (updateError) {
      return {
        success: false,
        newBalance: currentCredits,
        error: updateError.message,
      };
    }

    return {
      success: true,
      newBalance,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      newBalance: 0,
      error: error.message || "Failed to add credits.",
    };
  }
}
