// @Isanchezv
// src/pages/api/auth/getUserProfile.ts
import { supabase } from "@/lib/supabase";

export async function getUserProfile() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, full_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: profile.username,
    fullName: profile.full_name,
    role: profile.role,
    avatar:
      profile.avatar_url ??
      `https://api.dicebear.com/7.x/initials/svg?seed=${profile.full_name ?? profile.username}`,
  };
}