// @Isanchezv
// src/lib/auth-session.ts
import type { AstroCookies } from "astro";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const PROFILE_COOKIE_NAME = "sb-profile-data";
const PROFILE_MAX_AGE = 3600; // 1 hora

export interface UserProfile {
  id: string;
  role: string;
  status: string;
  ban_until: string | null;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  ai_credits: number | null;
}

/**
 * Obtiene el perfil del usuario, prefiriendo la cookie de caché.
 * Si no hay cookie o es inválida, consulta a Supabase y actualiza la cookie.
 */
export async function getCachedProfile(
  cookies: AstroCookies,
  userId: string
): Promise<UserProfile | null> {
  // 1. Intentar desde cookie
  const profileCookie = cookies.get(PROFILE_COOKIE_NAME)?.value;
  if (profileCookie) {
    try {
      const profile = JSON.parse(atob(profileCookie)) as UserProfile;
      if (profile.id === userId) {
        return profile;
      }
    } catch (e) {
      // Ignorar error y seguir a la DB
    }
  }

  // 2. Si no hay cookie o ID no coincide, buscar en DB
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, role, status, ban_until, full_name, avatar_url, username, ai_credits")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return null;
  }

  // 3. Guardar en cookie para la próxima vez
  setProfileCookie(cookies, profile);

  return profile;
}

/**
 * Actualiza o crea la cookie de perfil.
 */
export function setProfileCookie(cookies: AstroCookies, profile: UserProfile) {
  cookies.set(PROFILE_COOKIE_NAME, btoa(JSON.stringify(profile)), {
    path: "/",
    maxAge: PROFILE_MAX_AGE,
    sameSite: "lax",
    secure: true,
  });
}

/**
 * Borra todas las cookies relacionadas con la sesión.
 */
export function clearSession(cookies: AstroCookies) {
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });
  cookies.delete(PROFILE_COOKIE_NAME, { path: "/" });
}
