// @Isanchezv
// src/pages/api/courses/save-quiz.ts
import type { APIRoute } from "astro";
import { saveLessonProgress } from "@/lib/courses";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { lessonId, score } = await request.json();
    const { user } = locals;

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { error } = await saveLessonProgress(user.id, lessonId, score);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
