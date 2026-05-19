// @Isanchezv
import { stripe } from './stripe';
import { supabaseAdmin } from './supabaseAdmin';
import { getPlanLimit, getPlanAllowance } from './credits';

export async function verifyAndProcessSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return { success: false, message: 'Pago no completado' };

    const userId = session.metadata?.userId || session.client_reference_id;
    const plan = session.metadata?.plan;
    if (!userId || !plan) return { success: false, message: 'Datos incompletos en la sesión' };

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("subscription_plan, ai_credits")
      .eq("id", userId)
      .single();

    if (profileError) return { success: false, message: 'Perfil no encontrado' };

    // Si ya tiene este plan, ignorar para no "reponer" créditos por recarga de página.
    if (profile.subscription_plan === plan) {
      console.log(`[VERIFY] User ${userId} already has plan ${plan}. Refill ignored.`);
      return { success: true, total: profile.ai_credits, alreadyProcessed: true };
    }

    const currentCredits = profile.ai_credits || 0;
    const oldPlanAllowance = getPlanAllowance(profile.subscription_plan || "free");
    const newPlanAllowance = getPlanAllowance(plan);
    const newTotal = currentCredits + (newPlanAllowance - oldPlanAllowance);

    console.log(`[VERIFY] Granting ${newPlanAllowance - oldPlanAllowance} extra credits for plan ${plan} to user ${userId}.`);

    const todayStr = new Date().toLocaleDateString('sv-SE');

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        subscription_plan: plan,
        ai_credits: newTotal,
        last_credit_reset: todayStr
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    return { success: true, total: newTotal };

  } catch (err: any) {
    console.error('Error verifying Stripe session:', err.message);
    return { success: false, message: err.message };
  }
}
