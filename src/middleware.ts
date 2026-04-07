// @Isanchezv
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const pathname = url.pathname;

  const isPublicRoute =
    pathname === "/" ||
    pathname.match(/^\/(es|en|pt)$/) ||
    pathname.includes("/auth/signin") ||
    pathname.includes("/auth/register") ||
    pathname.includes("/auth/forgot-password") ||
    pathname.includes("/auth/update-password") ||
    pathname.includes("/auth/login-emergency") ||
    pathname.includes("/auth/verify-email") ||
    pathname.includes("/callback") ||
    pathname.includes("/api/auth/") ||
    pathname.includes("/legal/terms") ||
    pathname.includes("/legal/privacy") ||
    pathname.includes("/docs") ||
    pathname.includes("/resources") ||
    pathname.includes("/courses") ||
    pathname.includes("/explore") ||
    pathname.includes("/scout") ||
    pathname.includes("/teams/") ||
    pathname.includes("/event/") ||
    pathname.includes("/alliance/") || 
    pathname.includes("/account/banned");

  if (isPublicRoute) return next();

  const lang = pathname.split("/")[1] || "es";

  const accessToken = cookies.get("sb-access-token")?.value;

  if (!accessToken) {
    return redirect(`/${lang}/auth/signin`);
  }

  const supabaseAdmin = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (authError || !user) {
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });
    return redirect(`/${lang}/auth/signin`);
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role, status, ban_until") 
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });
    return redirect(`/${lang}/auth/signin`);
  }

  if (profile.status === "perma-ban") {
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });
    return redirect(`/${lang}/account/banned`); 
  }

  if (profile.status === "temporal-ban") {
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });

    const untilParam = profile.ban_until ? `?until=${encodeURIComponent(profile.ban_until)}` : "";
    return redirect(`/${lang}/account/banned${untilParam}`);
  }

  if (pathname.includes("/admin") && profile.role !== "admin") {
    return redirect(`/${lang}/account/dashboard`);
  }

  if (pathname.includes("/mod") && !["admin", "mod"].includes(profile.role)) {
    return redirect(`/${lang}/account/dashboard`);
  }

  if (pathname.includes("/teacher") && !["admin", "teacher"].includes(profile.role)) {
    return redirect(`/${lang}/account/dashboard`);
  }

  return next();
});