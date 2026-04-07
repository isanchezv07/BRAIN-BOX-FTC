// @Isanchezv
// src/pages/api/auth/signout.ts
import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";
import { getLangFromUrl } from "@/i18n/utils";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const lang = getLangFromUrl(url);

  await supabase.auth.signOut();

  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  return redirect(`/${lang}/auth/signin`);
};