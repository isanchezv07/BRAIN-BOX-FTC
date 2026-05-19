// @Isanchezv
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCachedProfile, clearSession } from "@/lib/auth-session";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect, locals } = context;
  const pathname = url.pathname;

  locals.user = null;
  locals.profile = null;

  const isPublicRoute =
    pathname === "/" ||
    pathname.match(/^\/(es|en)$/) ||
    pathname === "/sitemap-index.xml" ||
    pathname === "/sitemap-0.xml" ||
    pathname === "/robots.txt" ||
    pathname.includes("/auth/signin") ||
    pathname.includes("/auth/register") ||
    pathname.includes("/auth/forgot-password") ||
    pathname.includes("/auth/update-password") ||
    pathname.includes("/auth/login-emergency") ||
    pathname.includes("/auth/verify-email") ||
    pathname.includes("/callback") ||
    pathname.includes("/api/auth/") ||
    pathname.includes("/api/stripe/") ||
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

  const accessToken = cookies.get("sb-access-token")?.value;

  const lang = pathname.split("/")[1] || "es";
  if (!accessToken) {
    if (isPublicRoute) return next();
    return redirect(`/${lang}/auth/signin`);
  }

  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      throw new Error("Invalid session");
    }

    locals.user = user;

    const profile = await getCachedProfile(cookies, user.id);

    if (!profile) {
      throw new Error("Profile not found");
    }

    locals.profile = profile;

    if (profile.status === "perma-ban") {
      clearSession(cookies);
      return redirect(`/${lang}/account/banned`);
    }

    if (profile.status === "temporal-ban") {
      const now = new Date();
      const banUntil = profile.ban_until ? new Date(profile.ban_until) : null;
      
      if (!banUntil || banUntil > now) {
        clearSession(cookies);
        const untilParam = profile.ban_until ? `?until=${encodeURIComponent(profile.ban_until)}` : "";
        return redirect(`/${lang}/account/banned${untilParam}`);
      }
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

  } catch (error) {
    if (!isPublicRoute) {
      clearSession(cookies);
      return redirect(`/${lang}/auth/signin`);
    }
  }

  return next();
});