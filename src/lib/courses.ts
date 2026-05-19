// @Isanchezv
// src/lib/courses.ts
import { supabase } from "./supabase";
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Obtiene los cursos publicados y filtrados por el rol del usuario
 */
export async function getFilteredCourses(userRole: string) {
  const { data: coursesData } = await supabase
    .from("courses")
    .select(`*, categories (name), lessons (id)`)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const filteredCourses = coursesData?.filter(course => {
    if (!course.required_role) return true;
    if (userRole === 'admin') return true;
    
    try {
      const requiredRoles = typeof course.required_role === 'string' ? JSON.parse(course.required_role) : course.required_role;
      return Array.isArray(requiredRoles) && requiredRoles.includes(userRole);
    } catch {
      return true;
    }
  }) || [];

  return filteredCourses;
}

/**
 * Obtiene los IDs de los cursos completados por el usuario
 */
export async function getCompletedCoursesIds(userId: string, filteredCourses: any[]) {
  const completedCoursesIds = new Set<string>();
  
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("completed", true);

  const completedLessonIds = new Set(progress?.map(p => p.lesson_id));

  filteredCourses.forEach(course => {
    const totalLessons = course.lessons?.length || 0;
    if (totalLessons === 0) return;
    const completedInThisCourse = course.lessons.filter((l: any) => completedLessonIds.has(l.id)).length;
    if (completedInThisCourse === totalLessons) {
      completedCoursesIds.add(course.id);
    }
  });

  return completedCoursesIds;
}

/**
 * Obtiene los cursos a los que el usuario les ha dado like
 */
export async function getLikedCourseIds(userId: string) {
  const { data: userLikes } = await supabase.from('course_likes').select('course_id').eq('user_id', userId);
  return new Set(userLikes?.map(l => l.course_id));
}

/**
 * Obtiene un curso específico con sus lecciones
 */
export async function getCourseWithLessons(courseId: string) {
  const { data: course, error } = await supabase
    .from("courses")
    .select(`*, lessons(*)`)
    .eq("id", courseId)
    .single();

  if (error || !course) return null;

  course.lessons = (course.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index);
  return course;
}

/**
 * Obtiene el progreso de lecciones de un usuario para un curso o globalmente
 */
export async function getUserLessonProgress(userId: string, courseId?: string) {
  let query = supabase
    .from("lesson_progress")
    .select("lesson_id, completed, quiz_score")
    .eq("user_id", userId);

  const { data: progressRes } = await query;
  
  if (!progressRes) return new Set<string>();

  return new Set(
    progressRes
      .filter(p => p.completed === true || (p.quiz_score !== null && p.quiz_score >= 70))
      .map(p => p.lesson_id)
  );
}

/**
 * Verifica si el usuario tiene acceso a un curso basado en su rol
 */
export function checkCourseAccess(course: any, userRole: string) {
  if (!course?.required_role) return true;
  if (userRole === 'admin') return true;
  
  try {
    const requiredRoles = typeof course.required_role === 'string' ? JSON.parse(course.required_role) : course.required_role;
    return Array.isArray(requiredRoles) && requiredRoles.includes(userRole);
  } catch {
    return true;
  }
}

/**
 * Obtiene los detalles de una lección específica
 */
export async function getLessonDetails(lessonId: string) {
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (error || !lesson) return null;
  return lesson;
}

/**
 * Obtiene todas las lecciones de un curso
 */
export async function getCourseLessons(courseId: string) {
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("id, title, order_index")
    .eq("course_id", courseId)
    .order("order_index");

  return lessons || [];
}

/**
 * Guarda el progreso de una lección para un usuario
 */
export async function saveLessonProgress(userId: string, lessonId: string, score: number) {
  const { error } = await supabase
    .from("lesson_progress")
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      quiz_score: score,
      completed_at: new Date().toISOString()
    }, { 
      onConflict: 'user_id,lesson_id' 
    });

  return { error };
}

/**
 * Obtiene el puntaje promedio de un usuario en un curso
 */
export async function getUserCourseAverage(userId: string, lessonIds: string[]) {
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("quiz_score")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds)
    .gt("quiz_score", 0);

  if (progress && progress.length > 0) {
    const totalScore = progress.reduce((sum, item) => sum + (item.quiz_score || 0), 0);
    return Math.round(totalScore / progress.length);
  }
  
  return 0;
}

/**
 * Obtiene todas las categorías disponibles
 */
export async function getAllCategories() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return categories || [];
}

/**
 * Procesa el toggle de like de un curso
 */
export async function toggleCourseLike(userId: string, courseId: string) {
  const { data: existingLike } = await supabase
    .from("course_likes")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existingLike) {
    await supabase.from("course_likes").delete().eq("id", existingLike.id);
    return { liked: false };
  } else {
    await supabase.from("course_likes").insert({ user_id: userId, course_id: courseId });
    return { liked: true };
  }
}

