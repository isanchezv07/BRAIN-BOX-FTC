// @Isanchezv
// src/components/QuizComponent.astro
import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    unlockLesson?: (score: number) => void;
  }
}

interface QuizProps {
  quiz: {
    questions: Array<{
      question: string;
      answers: string[];
      correctAnswer: string;
    }>;
  };
  lessonId: string;
  courseId: string;
  isCompleted: boolean; 
  initialScore: number;
  courseAverage: number;
  timerEnabled: boolean;
  secondsPerQuestion: number;
  onPassed: (score: number) => void;
  t: any; 
  allCourseScores?: any[];
}

export default function QuizComponent({ 
  quiz, 
  lessonId, 
  courseId,
  isCompleted, 
  initialScore, 
  courseAverage,
  onPassed, 
  t,
  timerEnabled, 
  secondsPerQuestion,
  allCourseScores = []
}: QuizProps) {
  
  console.log('QuizComponent - initialScore:', initialScore, 'isCompleted:', isCompleted);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(isCompleted);
  const [isSaving, setIsSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Number(secondsPerQuestion) || 15);

  const i18n = {
    results: {
      timeout: t?.['quiz.results.timeout'] || "TIMEOUT",
      passed: t?.['quiz.results.passed'] || "SCORE",
      completed: t?.['quiz.results.completed'] || "COMPLETED",
      failed: t?.['quiz.results.failed'] || "FAILED"
    },
    description: {
      passed: t?.['quiz.description.passed'] || "Success!",
      failed: t?.['quiz.description.failed'] || "Try again",
    },
    buttons: {
      retry: t?.['quiz.buttons.retry'] || "Retry",
      practice: t?.['quiz.buttons.practice'] || "Practice"
    },
    status: {
      question: t?.['quiz.status.question'] || "QUESTION"
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (timerEnabled && !showResults && !isSaving && !isCompleted && isClient) {
      setTimeLeft(Number(secondsPerQuestion));

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAnswer(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, showResults, isClient]);

  const finishQuiz = async (finalScore: number) => {
    const finalPercentage = Math.round((finalScore / quiz.questions.length) * 100);
    setShowResults(true);
    
    if (finalPercentage >= 70) {
      setIsSaving(true);
      try {
        if (onPassed) await onPassed(finalPercentage);
        
        const newAverage = courseAverage > 0 
          ? Math.round((courseAverage + finalPercentage) / 2)
          : finalPercentage;
        
        if (typeof window !== 'undefined' && window.unlockLesson) {
          window.unlockLesson(newAverage);
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      } finally {
        setIsSaving(false);
      }
    } 
  };

  const handleAnswer = (index: number) => {
    if (showResults || isSaving) return;
    
    const isCorrect = (index + 1).toString() === quiz.questions[currentQuestion].correctAnswer;
    const updatedScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) setScore(updatedScore);
    
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishQuiz(updatedScore);
    }
  };

  if (!isClient || !quiz?.questions?.[currentQuestion]) return null;

  if (showResults) {
    const currentPercent = Math.round((score / quiz.questions.length) * 100);
    const displayPercent = isCompleted ? initialScore : currentPercent;
    const passed = isCompleted || displayPercent >= 70;

    console.log('Results - currentPercent:', currentPercent, 'initialScore:', initialScore, 'displayPercent:', displayPercent, 'isCompleted:', isCompleted);

    return (
      <div className="my-12 p-10 bg-[#080808] border-2 border-white/5 rounded-[2.5rem] text-center shadow-2xl animate-in zoom-in duration-300">
        <h2 className="text-3xl font-black italic uppercase mb-2 text-white">
          {passed ? i18n.results.completed : i18n.results.failed}
        </h2>
        <div className={`text-7xl font-black mb-6 ${passed ? 'text-yellow-500' : 'text-red-500'}`}>
          {displayPercent}%
        </div>
        <p className="text-gray-400 uppercase text-[10px] font-black tracking-[0.3em] mb-10">
          {passed ? i18n.description.passed : i18n.description.failed}
        </p>
      </div>
    );
  }

  return (
    <div className="my-12 p-8 md:p-12 bg-[#080808] border border-white/5 rounded-[2.5rem] relative shadow-2xl overflow-hidden animate-in fade-in duration-500">
      {timerEnabled && (
        <div 
          className={`absolute top-0 left-0 h-1 transition-all duration-1000 ease-linear ${timeLeft < 5 ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-yellow-500 shadow-[0_0_10px_#eab308]'}`} 
          style={{ width: `${(timeLeft / Number(secondsPerQuestion)) * 100}%` }}
        ></div>
      )}

      <header className="flex justify-between items-center mb-10">
        <span className="text-[10px] font-black uppercase text-gray-500 italic tracking-widest">
          {i18n.status.question} {currentQuestion + 1} / {quiz.questions.length}
        </span>
        
        {timerEnabled && (
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
             <div className={`w-2 h-2 rounded-full ${timeLeft < 5 ? 'bg-red-500 animate-ping' : 'bg-yellow-500 animate-pulse'}`}></div>
             <span className={`font-mono text-lg font-black ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>
                00:{timeLeft.toString().padStart(2, '0')}
             </span>
          </div>
        )}
      </header>
      
      <div className="min-h-[120px] flex items-center">
        <h3 className="text-xl md:text-4xl font-black text-white italic uppercase leading-tight tracking-tighter">
          {quiz.questions[currentQuestion].question}
        </h3>
      </div>

      <div className="grid gap-4 mt-12">
        {quiz.questions[currentQuestion].answers.map((answer, idx) => (
          <button 
            key={`${currentQuestion}-${idx}`} 
            onClick={() => handleAnswer(idx)} 
            className="w-full text-left p-6 bg-[#111] border border-white/5 rounded-2xl text-gray-300 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all flex items-center justify-between group font-bold italic"
          >
            <span className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] group-hover:bg-yellow-500 group-hover:text-black font-mono transition-colors">
                {String.fromCharCode(65 + idx)} {/* Muestra A, B, C... */}
              </span>
              {answer}
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500 text-xs">➔</span>
          </button>
        ))}
      </div>
    </div>
  );
}