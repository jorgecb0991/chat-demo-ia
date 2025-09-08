"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { BookOpenCheck } from "lucide-react";
import VideoHeaderCard from "@/components/video/VideoHeaderCard";
import { useState, useEffect } from "react";
import QuestionCard from "@/components/quiz/QuestionCard";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/common/SubmitButton";
import ResultCard from "@/components/quiz/ResultCard";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function PlayYoutubeQuizPage() {
    const dispatch = useAppDispatch();
    const quiz = useAppSelector((state) => state.quiz.current);

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [score, setScore] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const { width, height } = useWindowSize();

    const handleAnswer = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const handleSubmit = async () => {
        await new Promise((r) => setTimeout(r, 1000));

        let correctCount = 0;
        quiz?.questions.forEach((q) => {
            const selected = answers[q.questionId];
            const correct = q.options?.find((opt) => opt.isCorrect);
            if (selected && selected === correct?.optionId) {
                correctCount++;
            }
        });

        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            setScore(0);
        } else {
            const percentage = Math.round(
                (correctCount / quiz.questions.length) * 100
            );
            setScore(percentage);

            // 🎉 Activa confeti si pasa con 50%+
            if (percentage >= 50) {
                setShowConfetti(true);
            }
        }
    };

    // ⏱️ Auto-apagar confeti después de 5 segundos
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    return (
        <DefaultLayout
            title="Cuestionario"
            titleIcon={<BookOpenCheck className="w-6 h-6" />}
        >
            {/* 🎉 Confetti celebration */}
            {showConfetti && <Confetti width={width} height={height} />}

            <div className="flex flex-col gap-6">
                {/* Resultado */}
                {score !== null && (
                    <ResultCard
                        studentName="jorge"
                        scorePercent={score}
                        correct={2}
                        incorrect={3}
                        feedback={score >= 50 ? "¡Felicitaciones! 🎉" : "Sigue practicando 💪"}
                    />
                )}

                {/* Header con video */}
                <VideoHeaderCard
                    thumbnail={quiz?.metadata?.videoThumbnail || ""}
                    videoTitle={quiz?.metadata?.videoTitle || ""}
                    description={quiz?.description || ""}
                    duration={quiz?.metadata?.duration|| ""}
                    publishedAgo={quiz?.metadata?.publishedAgo|| ""}
                    views={quiz?.metadata?.views || ""}
                    channelName={quiz?.metadata?.channelName || ""}
                    channelAvatar={quiz?.metadata?.channelAvatar || ""}
                    videoUrl={quiz?.videoUrl || ""}
                />


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

                {/* Botón enviar */}
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
