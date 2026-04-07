// @Isanchezv
// src/pages/api/auth/google.ts
import type { APIRoute } from "astro";
import { getSupabaseAdmin } from "@/lib/supabase";

export const GET: APIRoute = async ({ request, redirect }) => {
  const supabase = getSupabaseAdmin();
  const url = new URL(request.url);
  
  const referer = request.headers.get("referer") || "";
  const lang = referer.match(/\/(es|en)(\/|$)/)?.[1] || "es";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${url.origin}/api/auth/callback?lang=${lang}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  if (error) {
    return redirect(`/${lang}/signin?error=${encodeURIComponent(error.message)}`);
  }

  return redirect(data.url);
};