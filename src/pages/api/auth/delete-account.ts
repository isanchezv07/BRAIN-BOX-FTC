// @Isanchezv
// src/pages/api/auth/delete-account.ts
import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { clearSession } from "@/lib/auth-session";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const accessToken = cookies.get("sb-access-token")?.value;

  if (!accessToken) {
    console.error("No se encontró token en las cookies");
    return redirect("/es/auth/signin?error=session-expired");
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !user) {
    console.error("Error validando usuario:", authError?.message);
    return new Response("Sesión inválida o expirada", { status: 401 });
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("Error de Supabase al borrar:", deleteError.message);
    return new Response(`Error al borrar: ${deleteError.message}`, { status: 500 });
  }

  clearSession(cookies);
  
  return redirect("/es/register?message=account-deleted");
};