// @Isanchezv
// src/pages/api/save-quiz.ts
import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";

export const POST: APIRoute = async ({ request, cookies }) => {
  const { lessonId, score } = await request.json();
  
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  if (!accessToken || !refreshToken) {
    return new Response("No auth", { status: 401 });
  }

  const { data: { user } } = await supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  });

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { error } = await supabase.from("lesson_progress").upsert({
    user_id: user.id,
    lesson_id: lessonId,
    completed: score >= 70,
    quiz_score: score, 
    completed_at: new Date().toISOString()
  }, { onConflict: 'user_id,lesson_id' });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}