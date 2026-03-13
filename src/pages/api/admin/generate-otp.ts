// @Isanchezv
// src/pages/api/admin/generate-otp.ts
import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const { targetUserId } = await request.json();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const { error } = await supabase
    .from('manual_otps')
    .insert({
      user_id: targetUserId,
      otp_code: otp,
      expires_at: new Date(Date.now() + 15 * 60000).toISOString()
    });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });

  return new Response(JSON.stringify({ code: otp }), { status: 200 });
};