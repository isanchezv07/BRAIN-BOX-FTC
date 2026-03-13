// @Isanchezv
// src/pages/api/courses/like.ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { courseId } = await request.json();
    const accessToken = cookies.get("sb-access-token")?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({ error: "No token" }), { status: 401 });
    }

    const supabaseAdmin = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
    }

    const { data: existingLike } = await supabaseAdmin
      .from("course_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .single();

    if (existingLike) {
      await supabaseAdmin.from("course_likes").delete().eq("id", existingLike.id);
      return new Response(JSON.stringify({ liked: false }), { status: 200 });
    } else {
      await supabaseAdmin.from("course_likes").insert({ user_id: user.id, course_id: courseId });
      return new Response(JSON.stringify({ liked: true }), { status: 200 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};