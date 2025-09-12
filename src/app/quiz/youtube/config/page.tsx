"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useState } from "react";
import {QuizQuestion} from "@/types/quiz"
import { setQuiz } from "@/store/slices/quizSlice";
import { Save, ClipboardList, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/layout/DefaultLayout";
import EditableQuestionCard from "@/components/quiz/EditableQuestionCard";
import VideoHeaderCard from "@/components/video/VideoHeaderCard";
import HoverButton from "@/components/ui/HoverButton";
//import { mockQuiz } from "@/mocks/quizMocks";
import { Button } from "@/components/ui/button";

export default function QuizConfigPage() {
    const quiz = useAppSelector((state) => state.quiz.current);
    //const quiz = mockQuiz;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions, setQuestions] = useState(quiz?.questions || []);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleCardComplete = () => {
        console.log(` Card ${currentIndex} completo → pasando al siguiente`);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleCardDelete = (id: number) => {
        setQuestions((prev) => prev.filter((q) => q.questionId !== id));
    };

    const handleAddQuestion = (insertIndex: number) => {
        
        let numOptions = questions[0]?.options?.length
        const newQuestion: QuizQuestion = {
            questionId: questions.length,
            order: questions.length,
            type: "multiple",
            questionText: "",
            options: Array(numOptions)
                .fill(null)
                .map((_, index) => ({
                    optionId: index,
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
            prev.map((q) =>
                q.questionId === updatedQuestion.questionId ? updatedQuestion : q
            )
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

            {/* Preguntas */}
            <div className="space-y-6">
                <div className="flex items-center justify-center mb-2 mt-4">
                    <Button
                        onClick={handleSaveQuiz}
                        variant="default"
                        className="bg-blue-900 hover:bg-blue-800 text-white py-3 px-7 rounded-lg"
                    >
                        <Save className="w-5 h-5" />
                        Guardar
                    </Button>
                </div>

                <div className="flex flex-col items-center text-black w-full">
                    {questions.slice(0, currentIndex + 1).map((q, index) => (
                        <div key={q.questionId} className="w-full">
                            <EditableQuestionCard
                                question={q}
                                onComplete={
                                    index === currentIndex ? handleCardComplete : () => {}
                                }
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
