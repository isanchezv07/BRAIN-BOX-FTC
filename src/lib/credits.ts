import { supabaseAdmin } from "./supabaseAdmin";

export const BASE_CREDITS = 3;

export const planAllowances: Record<string, number> = {
  "free": 0,
  "prod_UIkBvj0Xy5XV5V": 5,  // Rookie (+3 = 8)
  "prod_UIkCACSFAOw86l": 10, // Pro (+3 = 13)
  "prod_UIkDq4szJTfqv8": 20  // Elite (+3 = 23)
};

export function getPlanLimit(planId: string | null): number {
  return (planAllowances[planId || "free"] || 0) + BASE_CREDITS;
}

export function getPlanAllowance(planId: string | null): number {
  return planAllowances[planId || "free"] || 0;
}

export async function checkAndResetCredits(userId: string) {
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("ai_credits, subscription_plan, last_credit_reset")
    .eq("id", userId)
    .single();

  if (error || !profile) return null;

  const now = new Date();
  const todayStr = now.toLocaleDateString('sv-SE');
  const lastResetStr = profile.last_credit_reset || "";
  const plan = profile.subscription_plan || "free";
  const planLimit = getPlanLimit(plan);

  let shouldReset = false;

  if (!lastResetStr || String(lastResetStr).length < 10) {
    shouldReset = true;
  } else {
    const lastDate = new Date(String(lastResetStr).split('T')[0] + "T00:00:00");
    const nextDate = new Date(lastDate);
    nextDate.setMonth(lastDate.getMonth() + 1);

    if (now >= nextDate) {
      shouldReset = true;
    }
  }

  if (shouldReset) {
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        ai_credits: planLimit,
        last_credit_reset: todayStr
      })
      .eq("id", userId);

    if (!updateError) {
      return planLimit;
    }
  }

  return profile.ai_credits;
}
