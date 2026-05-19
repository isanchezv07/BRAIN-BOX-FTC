import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { identifier } = await request.json(); 
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, username")
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single();

    if (userError || !userProfile) {
      return new Response(JSON.stringify({ message: "Si el usuario existe, se ha generado un código." }), { status: 200 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000).toISOString(); 

    const { error: otpError } = await supabaseAdmin.from("manual_otps").insert({
      user_id: userProfile.id,
      otp_code: otp,
      expires_at: expiresAt,
      is_used: false,
      generated_by: userProfile.id 
    });

    if (otpError) throw otpError;

    await supabaseAdmin.from("audit_logs").insert({
      action_type: "USER_REQUESTED_OTP",
      target_user_id: userProfile.id,
      details: `El usuario @${userProfile.username} ha solicitado un código de acceso de emergencia.`
    });

    return new Response(JSON.stringify({ 
        message: "Código generado correctamente. Revisa tu canal de comunicación oficial." 
    }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: "Error al procesar la solicitud" }), { status: 500 });
  }
};
