// @Isanchezv
// src/lib/admin.ts
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Procesa las acciones de formulario del panel de administración
 */
export async function handleAdminAction(form: FormData, adminId: string, lang: string) {
  const action = form.get("_action");
  const id = form.get("id")?.toString();
  const adminPath = `/${lang}/admin/dashboard`;
  const hasCertificate = form.get("has_certificate") === "on";

  if (!id && !["create-course", "create-lesson", "upsert-category"].includes(action as string)) {
      return null;
  }

  try {
    switch (action) {
      case "update-user-status":
        const newStatus = form.get("status")?.toString() || "active";
        let banUntil = null;

        if (newStatus === "temporal-ban") {
          const minutes = parseInt(form.get("ban_duration_custom")?.toString() || "60");
          banUntil = new Date(Date.now() + minutes * 60000).toISOString();
        }

        await supabaseAdmin
          .from("profiles")
          .update({ status: newStatus, ban_until: banUntil })
          .eq("id", id);

        if (newStatus.includes("ban")) {
          await supabaseAdmin.auth.admin.signOut(id!);
        }
        return { redirect: `${adminPath}?tab=users` };

      case "update-profile-role":
        await supabaseAdmin.from("profiles").update({ role: form.get("role") }).eq("id", id);
        return { success: true };

      case "update-course":
        const requiredRoles = form.getAll("required_roles");
        await supabaseAdmin.from("courses").update({ 
          title: form.get("title"), 
          description: form.get("description"),
          category_id: form.get("category_id"), 
          level: form.get("level"),
          team: form.get("team"),
          has_certificate: hasCertificate,
          required_role: requiredRoles && requiredRoles.length > 0 ? JSON.stringify(requiredRoles) : null
        }).eq("id", id);
        return { redirect: `${adminPath}?tab=courses` };

      case "update-lesson":
        const quizId = form.get("quiz_id");
        const rawLimit = form.get("quiz_questions_limit");
        const quizLimit = rawLimit && rawLimit.toString().trim() !== "" ? Number(rawLimit) : null;
        
        const lData = { 
          course_id: form.get("course_id"), title: form.get("title"), content: form.get("content"), 
          order_index: Number(form.get("order_index")), is_free: form.get("is_free") === "true",
          quiz_data: quizId && quizId.toString().trim() !== "" ? `${quizId.toString()}.json` : null,
          quiz_timer_enabled: form.get("quiz_timer_enabled") === "true",
          quiz_timer_seconds: Number(form.get("quiz_timer_seconds") || 30),
          quiz_questions_limit: quizLimit
        };
        
        await supabaseAdmin.from("lessons").update(lData).eq("id", id);
        return { redirect: `${adminPath}?course=${form.get("course_id")}&tab=courses` };

      case "create-course":
        const createRequiredRoles = form.getAll("required_roles");
        const { data: nc } = await supabaseAdmin.from("courses").insert({ 
          title: form.get("title"), 
          description: form.get("description"),
          category_id: form.get("category_id"), 
          level: form.get("level"), 
          team: form.get("team"),
          has_certificate: hasCertificate,
          required_role: createRequiredRoles && createRequiredRoles.length > 0 ? JSON.stringify(createRequiredRoles) : null,
          created_by: adminId 
        }).select().single();
        if (nc) return { redirect: `${adminPath}?course=${nc.id}&tab=courses` };
        break;

      case "create-lesson":
        await supabaseAdmin.from("lessons").insert({
          course_id: form.get("course_id"), title: form.get("title"), content: form.get("content"),
          order_index: Number(form.get("order_index")), is_free: form.get("is_free") === "true"
        });
        return { redirect: `${adminPath}?course=${form.get("course_id")}&tab=courses` };

      case "delete-course":
        await supabaseAdmin.from("courses").delete().eq("id", id);
        return { redirect: `${adminPath}?tab=courses` };
      
      case "delete-lesson":
        await supabaseAdmin.from("lessons").delete().eq("id", id);
        return { success: true };

      case "upsert-category":
        const catData = { name: form.get("name"), description: form.get("description") };
        id ? await supabaseAdmin.from("categories").update(catData).eq("id", id) : await supabaseAdmin.from("categories").insert(catData);
        return { redirect: `${adminPath}?tab=categories` };
      
      case "delete-category":
        await supabaseAdmin.from("categories").delete().eq("id", id);
        return { redirect: `${adminPath}?tab=categories` };

      case "publish-course":
        await supabaseAdmin.from("courses").update({ is_published: true }).eq("id", id);
        return { redirect: `${adminPath}?tab=courses` };

      case "unpublish-course":
        await supabaseAdmin.from("courses").update({ is_published: false }).eq("id", id);
        return { redirect: `${adminPath}?tab=courses` };
    }
  } catch (e) { 
    console.error("Error en handleAdminAction:", e);
  }
  return null;
}

/**
 * Obtiene todos los datos necesarios para el panel de administración
 */
export async function getAdminDashboardData(selectedCourseId?: string | null) {
  const [
    { data: profiles }, 
    { data: categories }, 
    { data: courses },
    { data: auditData }
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("categories").select("*").order("name"),
    supabaseAdmin.from("courses").select("*, categories(name)").order("created_at", { ascending: false }),
    supabaseAdmin.from("audit_logs").select("*, profiles:target_user_id(username), mod:moderator_id(username)").order('created_at', { ascending: false })
  ]);

  let lessons = [];
  if (selectedCourseId) {
    const { data } = await supabaseAdmin.from("lessons").select("*").eq("course_id", selectedCourseId).order("order_index");
    lessons = data || [];
  }

  return { profiles: profiles || [], categories: categories || [], courses: courses || [], auditData: auditData || [], lessons };
}

/**
 * Calcula estadísticas para el panel de administración
 */
export function calculateAdminStats(profiles: any[]) {
  const userGrowthData = new Array(12).fill(0);
  const firstStats = { FLL: 0, FTC: 0, FRC: 0 };
  const countryCounts: Record<string, number> = {};

  profiles.forEach(p => {
    const m = new Date(p.created_at).getMonth();
    userGrowthData[m]++;
    if (p.first_categories && Array.isArray(p.first_categories)) {
        p.first_categories.forEach((cat) => {
            if (cat in firstStats) firstStats[cat as keyof typeof firstStats]++;
        });
    }
    if (p.country) {
        countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
    }
  });

  const topCountries = Object.entries(countryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const bannedCount = profiles.filter(p => p.status === 'perma-ban' || p.status === 'banned').length;
  const tempBannedCount = profiles.filter(p => p.status === 'temporal-ban').length;

  return { userGrowthData, firstStats, topCountries, bannedCount, tempBannedCount };
}
