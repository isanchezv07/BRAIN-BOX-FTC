// @Isanchezv
import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPlanLimit, getPlanAllowance } from '@/lib/credits';

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('x-test-secret');
  if (authHeader !== "debug-123") return new Response("Unauthorized", { status: 401 });

  const { userId, plan } = await request.json();
  if (!userId || !plan) return new Response("Missing data", { status: 400 });

  const todayStr = new Date().toLocaleDateString('sv-SE');

  try {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("ai_credits, subscription_plan")
      .eq("id", userId)
      .single();

    const currentCredits = profile?.ai_credits || 0;
    const oldAllowance = getPlanAllowance(profile?.subscription_plan || "free");
    const newAllowance = getPlanAllowance(plan);
    const newTotal = currentCredits + (newAllowance - oldAllowance);

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        subscription_plan: plan,
        ai_credits: newTotal,
        last_credit_reset: todayStr
      })
      .eq("id", userId);

    if (updateError) return new Response(JSON.stringify({ error: updateError }), { status: 500 });

    return new Response(JSON.stringify({ 
      success: true, 
      total: newTotal,
      reset_date: todayStr
    }), { status: 200 });

  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
