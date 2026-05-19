// @Isanchezv
import type { APIRoute } from 'astro';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPlanLimit, getPlanAllowance } from '@/lib/credits';
import type Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET;

export const POST: APIRoute = async ({ request }) => {
  const signature = request.headers.get('stripe-signature');
  console.log(`[WEBHOOK] Incoming request to /api/stripe/webhook`);

  if (!signature || !STRIPE_WEBHOOK_SECRET) {
    console.error('[WEBHOOK ERROR] Signature or Secret missing');
    return new Response(JSON.stringify({ error: 'Webhook signature missing or secret not configured' }), { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.arrayBuffer();
    console.log(`[WEBHOOK] Body received, length: ${rawBody.byteLength}`);
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      signature,
      STRIPE_WEBHOOK_SECRET
    );
    console.log(`[WEBHOOK SUCCESS] Event verified: ${event.type}`);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId || session.client_reference_id;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        await handleSubscriptionUpdate(userId, plan);
      }
      break;
    }
    case 'invoice.paid':
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === 'string' 
        ? invoice.subscription 
        : (invoice.subscription as any)?.id;

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.userId;
        const plan = subscription.metadata?.plan;

        if (userId && plan) {
          await handleSubscriptionUpdate(userId, plan);
        }
      } else {
        console.error('[WEBHOOK ERROR] No subscription ID found in invoice');
      }
      break;
    }
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const isDeleted = event.type === 'customer.subscription.deleted';
      const isCancelling = subscription.cancel_at_period_end;
      let userId = subscription.metadata?.userId;
      const plan = subscription.metadata?.plan;

      if (!userId) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("stripe_customer_id", subscription.customer as string)
          .single();
        userId = profile?.id;
      }

      if (userId) {
        const shouldClearPlan = isDeleted || isCancelling || subscription.status === 'canceled' || subscription.status === 'unpaid';

        if (shouldClearPlan) {
          console.log(`[WEBHOOK] CLEANING plan for user ${userId} (Reason: ${event.type}, Cancelling: ${isCancelling}, Status: ${subscription.status})`);
          await supabaseAdmin
            .from("profiles")
            .update({ subscription_plan: "free" })
            .eq("id", userId);
        } else if (plan) {
          console.log(`[WEBHOOK] RESTORING/UPDATING plan for user ${userId} (Plan: ${plan}, Status: ${subscription.status})`);
          await supabaseAdmin
            .from("profiles")
            .update({ subscription_plan: plan })
            .eq("id", userId);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};

async function handleSubscriptionUpdate(userId: string, plan: string) {
  console.log(`Updating subscription for user ${userId} with plan ${plan}`);
  
  const today = new Date().toISOString().slice(0, 10);

  try {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("ai_credits, subscription_plan")
      .eq("id", userId)
      .single();

    const currentCredits = profile?.ai_credits || 0;
    const oldPlanAllowance = getPlanAllowance(profile?.subscription_plan || "free");
    const newPlanAllowance = getPlanAllowance(plan);

    const newCreditsTotal = currentCredits + (newPlanAllowance - oldPlanAllowance);

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        subscription_plan: plan,
        ai_credits: newCreditsTotal,
        last_credit_reset: today
      })
      .eq("id", userId);

    if (updateError) {
      console.error(`Error updating credits for ${userId}:`, updateError);
    } else {
      console.log(`Successfully updated credits for ${userId}. New total: ${newCreditsTotal}`);
    }
  } catch (err) {
    console.error(`Unexpected error updating subscription for ${userId}:`, err);
  }
}
