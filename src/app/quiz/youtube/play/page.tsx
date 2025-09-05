"use client";

import { useAppDispatch } from "@/store/hooks";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { BookOpenCheck } from "lucide-react";
import VideoHeaderCard from "@/components/video/VideoHeaderCard";
import { useState } from "react";
import QuestionCard from "@/components/quiz/QuestionCard";
import { mockQuiz } from "@/mocks/quizMocks";
import SubmitButton from "@/components/common/SubmitButton";
import ResultCard from "@/components/quiz/ResultCard";

// shadcn/ui
import { Separator } from "@/components/ui/separator";

export default function PlayYoutubeQuizPage() {
    const dispatch = useAppDispatch();
    const quiz = mockQuiz;

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [score, setScore] = useState<number | null>(null);

    const handleAnswer = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        await new Promise((r) => setTimeout(r, 1000)); // simula delay

        let correctCount = 0;
        quiz.questions.forEach((q) => {
            const selected = answers[q.questionId];
            const correct = q.options?.find((opt) => opt.isCorrect);
            if (selected && selected === correct?.optionId) {
                correctCount++;
            }
        });

        const percentage = Math.round(
            (correctCount / quiz.questions.length) * 100
        );
        setScore(percentage);
    };

    return (
        <DefaultLayout
            title="Cuestionario"
            titleIcon={<BookOpenCheck className="w-6 h-6" />}
        >
            <div className="flex flex-col gap-6">
                {/* Resultado */}
                {score !== null && (
                    <ResultCard
                        studentName="jorge"
                        scorePercent={score}
                        correct={2}
                        incorrect={3}
                        feedback="Tu puedes campeon"
                    />
                )}

                {/* Header con video */}
                <VideoHeaderCard
                    thumbnail={quiz?.videoThumbnail || ""}
                    title={quiz?.title || ""}
                    description={quiz?.description || ""}
                    duration="12:34"
                    source="YouTube"
                    views={quiz?.metadata?.views || ""}
                    channelName={quiz?.metadata?.channelName || ""}
                    channelAvatar={quiz?.metadata?.channelAvatar || ""}
                    videoUrl={quiz?.videoUrl || ""}
                />

                {/* Separador shadcn */}
                <Separator />

                {/* Preguntas */}
                <div className="flex flex-col gap-4">
                    {quiz?.questions.map((q, index) => (
                        <QuestionCard
                            key={q.questionId}
                            question={q}
                            index={index}
                            onAnswer={handleAnswer}
                            selectedAnswer={answers[q.questionId]}
                            showResults={score !== null}
                        />
                    ))}
                </div>

                {/* Botón enviar (manteniendo tu SubmitButton) */}
                {score === null && (
                    <SubmitButton
                        text="Enviar Respuestas"
                        loadingText="Revisando..."
                        size="lg"
                        onClick={handleSubmit}
                        baseColor="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"
                    />
                )}
            </div>
        </DefaultLayout>
    );
}
