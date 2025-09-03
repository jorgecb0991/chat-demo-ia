"use client";

import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import QuestionCard from "@/components/ui/QuestionCard";
import VideoHeaderCard from "@/components/VideoHeaderCard";
import HoverButton from "@/components/ui/HoverButton";
import { QuizQuestion } from "@/store/slices/quizSlice";
import { useAppDispatch } from "@/store/hooks";
import { setQuiz } from "@/store/slices/quizSlice";
import { Save, ClipboardList, Plus  } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuizConfigPage() {
    const quiz = useAppSelector((state) => state.quiz.current);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions, setQuestions] = useState(quiz?.questions || []);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleCardComplete = () => {
        setCurrentIndex((prev) => prev + 1);
    };

    const handleCardDelete = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.questionId !== id));
    };

    const handleAddQuestion = (insertIndex: number) => {
        const newQuestion: QuizQuestion = {
            questionId: crypto.randomUUID(),
            order: questions.length,
            type: "multiple",
            questionText: "",
            options: [
                { optionId: crypto.randomUUID(), text: "", isCorrect: false },
                { optionId: crypto.randomUUID(), text: "", isCorrect: false },
                { optionId: crypto.randomUUID(), text: "", isCorrect: false },
                { optionId: crypto.randomUUID(), text: "", isCorrect: false },
            ],
            suggestedAnswer: "",
            explanation: "",
        };

        setQuestions((prev) => {
            const updated = [...prev];
            // insertar justo después del índice actual
            updated.splice(insertIndex + 1, 0, newQuestion);

            // reordenar "order"
            return updated.map((q, idx) => ({
                ...q,
                order: idx,
            }));
        });
    };

    const handleUpdateQuestion = (updatedQuestion: QuizQuestion) => {
        setQuestions((prev) =>
            prev.map((q) => (q.questionId === updatedQuestion.questionId ? updatedQuestion : q))
        );
    };

    const handleSaveQuiz = () => {
        if (!quiz) return;
        const updatedQuiz = {
            ...quiz,
            questions,
        };
        dispatch(setQuiz(updatedQuiz));
        console.log("Quiz guardado en redux ✅", updatedQuiz);
        router.push("/qr/youtube");
    };

    if (!quiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
                <p>No hay quiz generado aún 🚀</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 font-sans relative">
            {/* Card de Cabecera + Video */}
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

            {/* Card de Preguntas */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-primary" />
                        Preguntas del Quiz
                    </h2>

                    <button
                        onClick={handleSaveQuiz}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
                    >
                        <Save size={18} />
                        Guardar
                    </button>
                </div>

                <div className="flex flex-col items-center text-black w-full">
                    {questions.slice(0, currentIndex + 1).map((q: any, index: number) => (
                        <div key={q.questionId} className="w-full">
                            <QuestionCard
                                question={q}
                                onComplete={index === currentIndex ? handleCardComplete : () => { }}
                                index={index}
                                onDelete={handleCardDelete}
                                onChange={handleUpdateQuestion}
                                editable={true}
                            />

                            {/* Botón “Agregar pregunta” entre cada card */}
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
        </div>
    );
}
