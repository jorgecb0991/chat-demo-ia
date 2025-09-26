"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useState, useRef, useEffect } from "react";
import {QuizQuestion} from "@/types/quiz"
import { setQuiz } from "@/store/slices/quizSlice";
import { Save, ClipboardList, Plus, List, Type, X } from "lucide-react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/layout/DefaultLayout";
import EditableQuestionCard from "@/components/features/quiz/EditableQuestionCard";
import VideoHeaderCard from "@/components/features/video/VideoHeaderCard";
import SourceHeaderCard from "@/components/features/quiz/SourceHeaderCard"
import HoverButton from "@/components/ui/HoverButton";
import { quizMock } from "@/mocks/quizMocks";
import { Button } from "@/components/ui/button";

export default function QuizConfigPage() {
    const quiz = useAppSelector((state) => state.quiz.current);
    //const quiz = quizMock;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions, setQuestions] = useState(quiz?.questions || []);
    const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
    const [showAddQuestionPanel, setShowAddQuestionPanel] = useState(false);
    const [insertIndex, setInsertIndex] = useState(0);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleCardComplete = () => {
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        // Si ya se mostraron todas las preguntas iniciales, la carga ha terminado
        if (nextIndex >= questions.length) {
            console.log("Carga inicial completa. Habilitando modo de edición libre.");
            setIsInitialLoadComplete(true);
        }
    };

    const handleCardDelete = (id: number) => {
        // Filtra la pregunta a eliminar
        const updatedQuestions = questions.filter((q) => q.questionId !== id);
        // Resetea el orden y actualiza el estado
        setQuestions(updatedQuestions.map((q, idx) => ({ ...q, order: idx })));
        
        // Si se elimina una pregunta antes de que termine la carga inicial, ajusta el índice
        if (!isInitialLoadComplete && currentIndex > updatedQuestions.length - 1) {
            setCurrentIndex(updatedQuestions.length - 1);
        }
    };

    const handleOpenAddQuestionPanel = (index: number) => {
        // Si el panel ya está abierto en la misma posición, ciérralo. De lo contrario, ábrelo.
        if (showAddQuestionPanel && insertIndex === index) {
            setShowAddQuestionPanel(false);
        } else {
            setInsertIndex(index);
            setShowAddQuestionPanel(true);
        }
    };

    // Función que crea y agrega una nueva pregunta del tipo seleccionado
    const handleAddQuestion = (type:any) => {
        let newQuestion;
        let newQuestionId = questions.length +1
        const baseQuestion = {
            questionId: newQuestionId,
            order: 0,
            questionText: "",
            suggestedAnswer: "",
            explanation: "",
        };

        if (type == "multiple") {
            // Si es la primera pregunta, se crea con 4 opciones por defecto
            const numOptions = questions[0]?.options?.length;

            newQuestion = {
                ...baseQuestion,
                type: "multiple",
                options: Array(numOptions)
                    .fill(null)
                    .map((_, index) => ({
                        optionId: index,
                        text: "",
                        isCorrect: false,
                    })),
            };
        } else if (type == "short") {
            newQuestion = {
                ...baseQuestion,
                type: "short",
                options: [], // No tiene opciones
            };
        }
        
        if (newQuestion) {
            setQuestions((prev) => {
                const updated = [...prev];
                // Se inserta la nueva pregunta en la posición correcta
                updated.splice(insertIndex + 1, 0, newQuestion);
                return updated.map((q, idx) => ({ ...q, order: idx }));
            });
        }
        // Cerrar el panel después de agregar la pregunta
        setShowAddQuestionPanel(false);
    };

    const handleUpdateQuestion = (updatedQuestion: QuizQuestion) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.questionId === updatedQuestion.questionId ? updatedQuestion : q
            )
        );
    };

    const handleSaveQuiz = async () => {
        if (!quiz) return;
        const updatedQuiz = { ...quiz, questions };
        dispatch(setQuiz(updatedQuiz));
        // ⭐ NUEVA LÓGICA PARA GUARDAR EL QUIZ EN EL BACKEND TEMPORAL
        if (updatedQuiz) {
            const saveResponse = await fetch("/api/quiz/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedQuiz),
            });

            if (saveResponse.ok) {
                console.log(`Quiz con ID ${updatedQuiz.quizId} guardado en el backend.`);
            } else {
                console.error("Error al guardar el quiz en el backend.");
            }
        }
        // ⭐ FIN DE LA NUEVA LÓGICA
        // Aquí pasamos el sourceType como un parámetro de consulta
        router.push(`/qr/quiz?sourceType=${quiz.source}&quizId=${updatedQuiz.quizId}`);
    };

    if (!quiz) {
        return (
            <DefaultLayout>
                <p className="text-gray-700">No hay quiz generado aún 🚀</p>
            </DefaultLayout>
        );
    }

    // Definimos los tipos de fuente válidos para el componente SourceHeaderCard
    const validSourceTypes = ["topic", "text", "file", "webpage", "manual"];
    
    // Determinamos de forma segura el sourceType, asegurando que no sea undefined o "youtube"
    const sourceType = (quiz?.source && validSourceTypes.includes(quiz.source))
        ? quiz.source as "topic" | "text" | "file" | "webpage" | "manual"
        : "text";

    const header =  quiz?.source == "youtube" ? (<VideoHeaderCard
        thumbnail={quiz?.metadata?.videoThumbnail || ""}
        videoTitle={quiz?.metadata?.videoTitle || ""}
        description={quiz?.description || ""}
        duration={quiz?.metadata?.duration|| ""}
        publishedAgo={quiz?.metadata?.publishedAgo|| ""}
        views={quiz?.metadata?.views || ""}
        channelName={quiz?.metadata?.channelName || ""}
        channelAvatar={quiz?.metadata?.channelAvatar || ""}
        videoUrl={quiz?.videoUrl || ""}
    />) : (
        <SourceHeaderCard
            sourceType={sourceType}
            title={quiz?.title}
            description={quiz?.description}
        />
    )

    // Define el array de preguntas a renderizar
    const questionsToRender = isInitialLoadComplete ? questions : questions.slice(0, currentIndex + 1);

    return (
        <DefaultLayout
            title="Preguntas del Quiz"
            titleIcon={<ClipboardList className="w-6 h-6" />}
        >
            {/* Header*/}
            {header}

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
                    {questionsToRender.map((q, index) => (
                        <div key={q.questionId} className="w-full">
                            <EditableQuestionCard
                                question={q}
                                onComplete={
                                    !isInitialLoadComplete && index === currentIndex ? handleCardComplete : () => {}
                                }
                                index={index}
                                onDelete={handleCardDelete}
                                onChange={handleUpdateQuestion}
                                editable={true}
                            />

                            {/* Mostrar el panel o el botón, según el estado */}
                            <div className="flex justify-center my-2">
                                {showAddQuestionPanel && insertIndex === index ? (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-300 ease-in-out transform scale-100">
                                        <button
                                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                                            onClick={() => handleAddQuestion("multiple")}
                                        >
                                            <List size={14} className="text-gray-600" />
                                            <span>Múltiple</span>
                                        </button>
                                        <button
                                            className="flex items-center gap-1 px-3 py-1 text-sm rounded-full text-gray-800 hover:bg-gray-100 transition-colors"
                                            onClick={() => handleAddQuestion("short")}
                                        >
                                            <Type size={14} className="text-gray-600" />
                                            <span>Corta</span>
                                        </button>
                                        <button
                                            onClick={() =>  setShowAddQuestionPanel(false)}
                                            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <HoverButton
                                        icon={<Plus size={16} />}
                                        text="Agregar pregunta"
                                        onClick={() => handleOpenAddQuestionPanel(index)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );
}
