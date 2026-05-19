// @Isanchezv
// src/pages/api/courses/like.ts
import type { APIRoute } from "astro";
import { toggleCourseLike } from "@/lib/courses";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { courseId } = await request.json();
    const { user } = locals;

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const result = await toggleCourseLike(user.id, courseId);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};