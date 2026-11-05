import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { S05_SCHEMA } from '@/lib/modules/s05/auth';

export async function checkAndDeductCredits(
  spokeOrgId: string,
  requiredCredits: number = 1
): Promise<{ allowed: boolean; remainingCredits: number }> {
  const { data: balanceRecord, error } = await supabaseAdmin
    .schema(S05_SCHEMA)
    .from('organization_credits')
    .select('credits')
    .eq('spoke_org_id', spokeOrgId)
    .maybeSingle();

  if (error) {
    return { allowed: false, remainingCredits: 0 };
  }

  const availableCredits = balanceRecord?.credits ?? 0;

  if (availableCredits < requiredCredits) {
    return { allowed: false, remainingCredits: availableCredits };
  }

  const { data: updatedRecord, error: updateError } = await supabaseAdmin
    .schema(S05_SCHEMA)
    .from('organization_credits')
    .update({ credits: availableCredits - requiredCredits })
    .eq('spoke_org_id', spokeOrgId)
    .select('credits')
    .single();

  if (updateError || !updatedRecord) {
    return { allowed: false, remainingCredits: availableCredits };
  }

  return { allowed: true, remainingCredits: updatedRecord.credits };
}

export async function addOrganizationCredits(
  spokeOrgId: string,
  creditsToAdd: number
): Promise<{ success: boolean; totalCredits: number }> {
  const { data: currentRecord } = await supabaseAdmin
    .schema(S05_SCHEMA)
    .from('organization_credits')
    .select('credits')
    .eq('spoke_org_id', spokeOrgId)
    .maybeSingle();

  const currentBalance = currentRecord?.credits ?? 0;
  const newBalance = currentBalance + creditsToAdd;

  const { error } = await supabaseAdmin
    .schema(S05_SCHEMA)
    .from('organization_credits')
    .upsert({
      spoke_org_id: spokeOrgId,
      credits: newBalance,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, totalCredits: currentBalance };
  }

  return { success: true, totalCredits: newBalance };
}
