// @Isanchezv
// src/pages/api/auth/delete-account.ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return new Response("Configuración incompleta: Faltan llaves de administrador en el servidor.", { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const accessToken = cookies.get("sb-access-token")?.value;

  if (!accessToken) {
    console.error("No se encontró token en las cookies");
    return redirect("/es/signin?error=session-expired");
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

  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  
  return redirect("/es/register?message=account-deleted");
};