import type { APIRoute } from 'astro';
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const GET: APIRoute = async ({ request }) => {
  try {
    const { data: draftCourses } = await supabaseAdmin
      .from("courses")
      .select("*, lessons(id, title, content, quiz_data)")
      .eq("is_published", false);

    const startTime = Date.now();
    await supabaseAdmin.from('profiles').select('id').limit(1);
    const latency = Date.now() - startTime;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: activeHour } = await supabaseAdmin
      .from("lesson_progress")
      .select("user_id", { count: 'exact', head: true })
      .gt("completed_at", oneHourAgo);

    const { count: activeDay } = await supabaseAdmin
      .from("lesson_progress")
      .select("user_id", { count: 'exact', head: true })
      .gt("completed_at", twentyFourHoursAgo);

    const lessonsWithIssues = draftCourses?.flatMap(c => 
      c.lessons?.filter((l: any) => !l.content || l.content.length < 50)
        .map((l: any) => ({ title: l.title, courseTitle: c.title })) || []
    ) || [];

    const coursesWithoutLessons = draftCourses?.filter(c => !c.lessons || c.lessons.length === 0) || [];

    const { data: recentLogs } = await supabaseAdmin
      .from("audit_logs")
      .select("*, profiles:target_user_id(username)")
      .order("created_at", { ascending: false })
      .limit(5);

    return new Response(JSON.stringify({
      metrics: {
        latency: `${latency}ms`,
        activeHour,
        activeDay,
        backlogCount: draftCourses?.length || 0,
        integrityCount: lessonsWithIssues.length + coursesWithoutLessons.length,
        latencyStatus: latency > 500 ? "DEGRADED" : "NOMINAL",
        integrityStatus: (lessonsWithIssues.length + coursesWithoutLessons.length > 0 ? "WARNING" : "OPTIMAL")
      },
      integrity: {
        lessonsWithIssues,
        coursesWithoutLessons
      },
      logs: recentLogs?.map(log => ({
        time: new Date(log.created_at).toLocaleTimeString(),
        action: log.action,
        target: log.profiles?.username || 'System'
      })) || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
