import type { APIRoute } from 'astro';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const POST: APIRoute = async ({ locals, url, request }) => {
  const { user, profile } = locals;

  if (!user || !profile) {
    return new Response("Unauthorized", { status: 401 });
  }

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: profile?.full_name || user.user_metadata?.full_name || '',
      metadata: { userId: user.id }
    });
    customerId = customer.id;
    await supabaseAdmin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const referer = request.headers.get('referer') || '';
  const isEnglish = referer.includes('/en/');
  const returnUrl = `${url.origin}/${isEnglish ? 'en' : 'es'}/shop/credits`;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return Response.redirect(session.url, 303);
};
