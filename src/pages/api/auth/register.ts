// @Isanchezv
// src/pages/api/auth/register.ts
import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, redirect, url }) => {
  const formData = await request.formData();

  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString().trim();
  const full_name = formData.get("full_name")?.toString().trim();

  const lang = url.pathname.split("/")[1] || "es";

  if (!email || !password || !username) {
    return new Response("Email, password y username son obligatorios", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${url.origin}/auth/callback`,
      data: {
        username: username,
        full_name: full_name || "",
        role: "student" 
      },
    },
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect(`/${lang}/verify-email`);
};