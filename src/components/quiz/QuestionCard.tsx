"use client";

import { useState, useEffect } from "react";
import { QuizQuestion } from "@/store/slices/quizSlice";

interface QuestionCardProps {
    question: QuizQuestion;
    index: number;
    onAnswer?: (questionId: string, optionId: string) => void;
    selectedAnswer?: string | null; // respuesta marcada
    showResults?: boolean; // activa modo revisión
}

export default function QuestionCard({
    question,
    index,
    onAnswer,
    selectedAnswer,
    showResults = false,
}: QuestionCardProps) {
    const [revealedOptions, setRevealedOptions] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        if (!showResults && revealedOptions < (question.options?.length ?? 0)) {
            const timer = setTimeout(() => {
                setRevealedOptions((prev) => prev + 1);
            }, 500);
            return () => clearTimeout(timer);
        } else if (showResults) {
            // mostrar todas si es modo revisión
            setRevealedOptions(question.options?.length ?? 0);
        }
    }, [revealedOptions, question.options?.length, showResults]);

    const handleSelect = (optionId: string) => {
        if (!showResults) {
            onAnswer?.(question.questionId, optionId);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto my-4 rounded-2xl border shadow-lg bg-white">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center font-semibold text-gray-700 bg-gray-50">
                    {index + 1}
                </div>

                <div className="flex-1 px-3 font-medium text-gray-900">
                    {question.questionText}
                </div>
            </div>

            {/* Options */}
            <div className="p-4 flex flex-col gap-2">
                {question.options?.slice(0, revealedOptions).map((opt, idx) => {
                    const isCorrect = !!opt.isCorrect;
                    const isSelected = selectedAnswer === opt.optionId;

                    let optionStyle =
                        "w-full px-4 py-2 border rounded-lg text-left flex items-center gap-3 transition-colors";

                    if (showResults) {
                        if (isCorrect) {
                            optionStyle += " border-green-500 bg-green-50 text-green-700";
                        } else if (isSelected && !isCorrect) {
                            optionStyle += " border-red-500 bg-red-50 text-red-700";
                        } else {
                            optionStyle += " border-gray-300 bg-gray-50 text-gray-600";
                        }
                    } else {
                        optionStyle += isSelected
                            ? " border-blue-500 bg-blue-50 text-blue-700"
                            : " border-gray-300 hover:bg-gray-50";
                    }

                    return (
                        <button
                            key={opt.optionId}
                            className={optionStyle}
                            onClick={() => handleSelect(opt.optionId)}
                            disabled={showResults} // no se puede cambiar en revisión
                        >
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold
                                        ${showResults
                                        ? isCorrect
                                            ? "bg-green-500 text-white"
                                            : isSelected
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                        : isSelected
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {letters[idx]}
                            </div>
                            <span>{opt.text}</span>
                        </button>
                    );
                })}
            </div>

            {/* Explicación */}
            {showResults && (
                <div className="border-t border-gray-200 px-4 py-3">
                    <div className="rounded-lg border border-gray-200 bg-green-50 shadow-sm p-4">
                        <p className="font-semibold text-gray-800">💡 Explicación</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {question.explanation}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}
