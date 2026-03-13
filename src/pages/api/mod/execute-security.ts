// @Isanchezv
// src/pages/api/mod/execute-security.ts
import type { APIRoute } from "astro";
import { getSupabaseAdmin } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { action, target_id, target_username } = await request.json();
  const supabase = getSupabaseAdmin();

  const accessToken = cookies.get("sb-access-token")?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ details: "No autorizado" }), { status: 401 });
  }

  const { data: { user: moderator } } = await supabase.auth.getUser(accessToken);
  if (!moderator) {
    return new Response(JSON.stringify({ details: "Sesión inválida" }), { status: 401 });
  }

  const { data: modProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", moderator.id)
    .single();

  if (!modProfile || (modProfile.role !== 'admin' && modProfile.role !== 'mod')) {
    return new Response(JSON.stringify({ details: "Permisos insuficientes" }), { status: 403 });
  }

  const moderatorId = moderator.id;

  try {
    switch (action) {
      case 'GENERATE_OTP':
        await supabase
          .from("manual_otps")
          .update({ is_used: true, expires_at: new Date().toISOString() })
          .eq("user_id", target_id)
          .eq("is_used", false);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60000).toISOString(); 

        await supabase.from("manual_otps").insert({
          user_id: target_id,
          otp_code: otp,
          expires_at: expiresAt,
          is_used: false,
          generated_by: moderatorId
        });

        await supabase.from("audit_logs").insert({
          action_type: "GENERATE_OTP",
          target_user_id: target_id,
          moderator_id: moderatorId,
          details: `OTP generado para @${target_username}.`
        });

        return new Response(JSON.stringify({ otp }), { status: 200 });

      case 'PURGE_SESSIONS':
        const { error: signOutError } = await supabase.auth.admin.signOut(target_id);
        if (signOutError) throw signOutError;

        await supabase.from("audit_logs").insert({
          action_type: "PURGE_SESSIONS",
          target_user_id: target_id,
          moderator_id: moderatorId,
          details: `Sesiones cerradas forzosamente para @${target_username}.`
        });

        return new Response(JSON.stringify({ details: "Sesiones purgadas" }), { status: 200 });

      case 'FIX_STUCK_LESSON':
        const { error: fixError } = await supabase
          .from("user_lessons")
          .delete()
          .eq("user_id", target_id)
          .eq("completed", false);
        
        if (fixError) throw fixError;

        await supabase.from("audit_logs").insert({
          action_type: "FIX_PROGRESS",
          target_user_id: target_id,
          moderator_id: moderatorId,
          details: `Progreso reparado para @${target_username} (limpieza de caché).`
        });

        return new Response(JSON.stringify({ details: "Progreso reseteado correctamente" }), { status: 200 });

      case 'SCAN_MULTI_ACCOUNT':
        const { data: targetUser } = await supabase
          .from("profiles")
          .select("last_sign_in_ip")
          .eq("id", target_id)
          .single();

        if (!targetUser?.last_sign_in_ip) {
          return new Response(JSON.stringify({ details: "No hay registro de IP para este usuario." }), { status: 404 });
        }

        const { data: matches } = await supabase
          .from("profiles")
          .select("username")
          .eq("last_sign_in_ip", targetUser.last_sign_in_ip)
          .neq("id", target_id);

        const foundNames = matches?.map(m => "@" + m.username).join(", ");
        const detailMsg = matches && matches.length > 0 
          ? `Cuentas detectadas en la misma IP: ${foundNames}`
          : "No se encontraron otras cuentas vinculadas a esta IP.";

        await supabase.from("audit_logs").insert({
          action_type: "IP_SCAN",
          target_user_id: target_id,
          moderator_id: moderatorId,
          details: detailMsg
        });

        return new Response(JSON.stringify({ details: detailMsg }), { status: 200 });
      default:
        return new Response(JSON.stringify({ details: "Comando desconocido" }), { status: 400 });
    }
  } catch (error: any) {
    console.error(`Error en System Ops [${action}]:`, error.message);
    return new Response(JSON.stringify({ details: "Error crítico en la ejecución del comando" }), { status: 500 });
  }
};