// @Isanchezv
import type { APIRoute } from 'astro';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const POST: APIRoute = async ({ request, locals, url, redirect }) => {
  try {
    const formData = await request.formData();
    const priceId = formData.get('priceId')?.toString();
     const plan = formData.get('plan')?.toString();
     const lang = formData.get('lang')?.toString() || 'es';

     if (!priceId || !plan) {
       return new Response(JSON.stringify({ error: 'Missing priceId or plan' }), {status: 400 });
     }

     const { user, profile } = locals;

     if (!user || !profile) {
       return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 });
     }

     if (profile?.subscription_plan != "free" && profile?.subscription_plan != null) {
       return new Response(JSON.stringify({ 
         error: 'Already Subscribed', 
         message: 'Ya tienes una suscripción activa. Debes cancelarla antes de adquirir una nueva.' 
       }), { status: 400 });
     }

     let customerId = profile?.stripe_customer_id;
     if (!customerId) {
       try {
         const customer = await stripe.customers.create({
           email: user.email,
           name: profile?.full_name || user.user_metadata?.full_name || '',
           metadata: { userId: user.id }
         });
         customerId = customer.id;

         await supabaseAdmin
           .from("profiles")
           .update({ stripe_customer_id: customerId })
           .eq("id", user.id);
       } catch (stripeCustErr: any) {
         return new Response(JSON.stringify({ error: 'Stripe Customer Creation failed', details: stripeCustErr.message }), { status: 500 });
       }
     }

     const session = await stripe.checkout.sessions.create({
       customer: customerId,
       line_items: [{ price: priceId, quantity: 1 }],
       mode: 'subscription',
       success_url: `${url.origin}/${lang}/teacher/portfolio-ai?success=true&session_id={CHECKOUT_SESSION_ID}`,
       cancel_url: `${url.origin}/${lang}/shop/credits?canceled=true`,
       metadata: { userId: user.id, plan: plan },
       subscription_data: {
         metadata: { userId: user.id, plan: plan }
       }
     });

     if (!session.url) {
       return new Response(JSON.stringify({ error: 'Stripe Session URL was not generated' }), { status: 500 });
     }

     return redirect(session.url, 303);
   } catch (err: any) {
     console.error('CRITICAL ERROR IN CHECKOUT:', err);
     return new Response(JSON.stringify({ error: 'Internal Server Error', message: err.message }), { status: 500 });
   }
};