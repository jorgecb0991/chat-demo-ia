"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useState } from "react";
import { QuizQuestion, setQuiz } from "@/store/slices/quizSlice";
import { Save, ClipboardList, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/layout/DefaultLayout";
import QuestionCard from "@/components/ui/QuestionCard";
import VideoHeaderCard from "@/components/VideoHeaderCard";
import HoverButton from "@/components/ui/HoverButton";

export default function QuizConfigPage() {
    const quiz = useAppSelector((state) => state.quiz.current);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions, setQuestions] = useState(quiz?.questions || []);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleCardComplete = () => setCurrentIndex((prev) => prev + 1);

    const handleCardDelete = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.questionId !== id));
    };

    const handleAddQuestion = (insertIndex: number) => {
        const newQuestion: QuizQuestion = {
            questionId: crypto.randomUUID(),
            order: questions.length,
            type: "multiple",
            questionText: "",
            options: Array(4).fill(null).map(() => ({
                optionId: crypto.randomUUID(),
                text: "",
                isCorrect: false,
            })),
            suggestedAnswer: "",
            explanation: "",
        };

        setQuestions((prev) => {
            const updated = [...prev];
            updated.splice(insertIndex + 1, 0, newQuestion);
            return updated.map((q, idx) => ({ ...q, order: idx }));
        });
    };

    const handleUpdateQuestion = (updatedQuestion: QuizQuestion) => {
        setQuestions((prev) =>
            prev.map((q) => (q.questionId === updatedQuestion.questionId ? updatedQuestion : q))
        );
    };

    const handleSaveQuiz = () => {
        if (!quiz) return;
        const updatedQuiz = { ...quiz, questions };
        dispatch(setQuiz(updatedQuiz));
        router.push("/qr/quiz");
    };

    if (!quiz) {
        return (
            <DefaultLayout>
                <p className="text-gray-700">No hay quiz generado aún 🚀</p>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout
            title="Preguntas del Quiz"
            titleIcon={<ClipboardList className="w-6 h-6" />}
            >
            {/* Header con video */}
            <VideoHeaderCard
                thumbnail={quiz.videoThumbnail || ""}
                title={quiz.title || ""}
                description={quiz.description || ""}
                duration="12:34"
                source="YouTube"
                views={quiz?.metadata?.views || ""}
                channelName={quiz?.metadata?.channelName || ""}
                channelAvatar={quiz?.metadata?.channelAvatar || ""}
                videoUrl={quiz.videoUrl}
            />

            {/* Preguntas */}
            <div className="space-y-6">
                <div className="flex items-center justify-center mb-2 mt-4">
                    {/*<h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-primary" />
                        Preguntas del Quiz
                    </h2>*/}

                    <button
                        onClick={handleSaveQuiz}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-xl shadow hover:bg-blue-700 transition "
                    >
                        <Save size={18} />
                        Guardar
                    </button>
                </div>

                <div className="flex flex-col items-center text-black w-full">
                    {questions.slice(0, currentIndex + 1).map((q, index) => (
                        <div key={q.questionId} className="w-full">
                            <QuestionCard
                                question={q}
                                onComplete={index === currentIndex ? handleCardComplete : () => { }}
                                index={index}
                                onDelete={handleCardDelete}
                                onChange={handleUpdateQuestion}
                                editable={true}
                            />

                            {/* Botón agregar */}
                            <div className="flex justify-center my-2">
                                <HoverButton
                                    icon={<Plus size={16} />}
                                    text="Agregar pregunta"
                                    onClick={() => handleAddQuestion(index)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
}
