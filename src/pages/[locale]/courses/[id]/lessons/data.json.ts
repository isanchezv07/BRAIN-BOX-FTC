// @Isanchezv
// src/pages/[locale]/courses/[id]/lessons/data.json.ts
import type { APIRoute } from 'astro';
import { supabase } from "@/lib/supabase";

const quizModules = import.meta.glob('/src/data/quizzes/**/*.json');

export const GET: APIRoute = async ({ params, request }) => {
  const { locale } = params; 
  const url = new URL(request.url);
  const lessonId = url.searchParams.get("lessonId");

  if (!lessonId) return new Response(null, { status: 400 });

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select(`quiz_data, quiz_questions_limit, courses ( title )`)
    .eq("id", lessonId)
    .single();

  if (error || !lesson?.quiz_data) return new Response(null, { status: 404 });

  const courseFolder = lesson.courses?.title.toLowerCase().trim().replace(/\s+/g, '-');
  const fileName = lesson.quiz_data.replace('.json', '');
  const path = `/src/data/quizzes/${locale}/${courseFolder}/${fileName}.json`;

  if (quizModules[path]) {
    const module: any = await quizModules[path]();
    const rawQuiz = JSON.parse(JSON.stringify(module.default));
    
    let questions = [...rawQuiz.questions];

    questions = questions.sort(() => Math.random() - 0.5);

    questions = questions.map(q => {
      const currentCorrectIdx = parseInt(q.correctAnswer) - 1;
      const correctText = q.answers[currentCorrectIdx];
      const shuffledAnswers = [...q.answers].sort(() => Math.random() - 0.5);
      const newCorrectAnswer = (shuffledAnswers.indexOf(correctText) + 1).toString();
      
      return { ...q, answers: shuffledAnswers, correctAnswer: newCorrectAnswer };
    });

    const limit = lesson.quiz_questions_limit;
    if (limit && limit > 0) {
      questions = questions.slice(0, limit);
    }

    return new Response(JSON.stringify({ ...rawQuiz, questions }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(null, { status: 404 });
};