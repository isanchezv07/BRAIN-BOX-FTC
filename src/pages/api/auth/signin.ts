// @Isanchezv
// src/pages/api/auth/signin.ts
import type { APIRoute } from "astro";
import { getSupabaseAdmin } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = getSupabaseAdmin();
  const formData = await request.formData();
  
  const emailInput = formData.get("email")?.toString().trim().toLowerCase();
  const otp = formData.get("otp")?.toString();
  const password = formData.get("password")?.toString();

  const referer = request.headers.get("referer") || "";
  const lang = referer.match(/\/(es|en)(\/|$)/)?.[1] || "es";

  let sessionData = null;

  if (otp && emailInput) {
    const { data: validOtp } = await supabase
      .from("manual_otps")
      .select("user_id, id")
      .eq("otp_code", otp.trim())
      .eq("is_used", false) 
      .gt("expires_at", new Date().toISOString()) 
      .single();

    if (!validOtp) {
      return redirect(`/${lang}/signin?error=${encodeURIComponent("Código inválido o reemplazado")}`);
    }

    const tempPassword = Array.from(crypto.getRandomValues(new Uint8Array(20)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      validOtp.user_id,
      { password: tempPassword }
    );

    if (updateError) {
      console.error("Error Admin Update:", updateError.message);
      return redirect(`/${lang}/signin?error=Security_Update_Failed`);
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: tempPassword,
    });

    if (signInError || !signInData.session) {
      console.error("Error SignIn Password Temporal:", signInError?.message);
      return redirect(`/${lang}/signin?error=Auth_Final_Failed`);
    }

    await supabase.from("manual_otps").update({ is_used: true }).eq("id", validOtp.id);
    sessionData = signInData.session;

  } else if (password && emailInput) {
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailInput, password });
    if (error || !data.session) return redirect(`/${lang}/signin?error=Credenciales_Incorrectas`);
    sessionData = data.session;
  }

  if (!sessionData) return redirect(`/${lang}/signin?error=Session_Null`);

  const { access_token, refresh_token, user } = sessionData;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  cookies.set("sb-access-token", access_token, { path: "/", sameSite: "lax", secure: true });
  cookies.set("sb-refresh-token", refresh_token, { path: "/", sameSite: "lax", secure: true });

  return redirect(profile?.role === "admin" ? `/${lang}/admin/dashboard` : `/${lang}/dashboard`);
};