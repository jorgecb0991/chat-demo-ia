"use client";

import { useEffect, useState } from "react";
import TypewriterText from "@/components/common/TypewriterText";
import TypewriterInput from "@/components/common/TypewriterInput";
import { MoreVertical, Trash2 } from "lucide-react";
import { QuizQuestion } from "@/store/slices/quizSlice"; 

interface QuestionCardProps {
    question: QuizQuestion;
    index: number;
    onComplete: () => void;
    onDelete?: (id: string) => void;
    editable?: boolean;
    onChange?: (updated: QuizQuestion) => void;
}

export default function QuestionCard({
    question,
    index,
    onComplete,
    onDelete,
    editable = false,
    onChange,
}: QuestionCardProps) {
    const [showOptions, setShowOptions] = useState(false);
    const [revealedOptions, setRevealedOptions] = useState(0);
    const [localQuestion, setLocalQuestion] = useState(question);
    const [selected, setSelected] = useState(false); // para el efecto de selección del card
    const [menuOpen, setMenuOpen] = useState(false); // para el menú de tres puntos
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const handleQuestionComplete = () => {
        setShowOptions(true);
    };

    useEffect(() => {
        if (showOptions && revealedOptions < (localQuestion.options?.length ?? 0)) {
            const timer = setTimeout(() => {
                setRevealedOptions((prev) => prev + 1);
            }, 600);
            return () => clearTimeout(timer);
        }
        if (revealedOptions === (localQuestion.options?.length ?? 0)) {
            onComplete();
        }
    }, [showOptions, revealedOptions, localQuestion.options?.length ?? 0, onComplete]);

    useEffect(() => {
        setLocalQuestion(question);
    }, [question]);

    const handleCircleClick = (index: number) => {
        if (!localQuestion.options) return;
        const updatedOptions = localQuestion.options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index,
        }));
        const updated = { ...localQuestion, options: updatedOptions };
        setLocalQuestion(updated);
        onChange?.(updated);
    };

    const handleQuestionTextChange = ( value: string) => {
        const updated = { ...localQuestion, questionText: value };
        setLocalQuestion(updated);
        onChange?.(updated);
    };

    const handleOptionTextChange = (idx: number, value: string) => {
        if (!localQuestion.options) return;
        const updatedOptions = localQuestion.options.map((opt, i) =>
            i === idx ? { ...opt, text: value } : opt
        );
        const updated = { ...localQuestion, options: updatedOptions };
        setLocalQuestion(updated);
        onChange?.(updated);
    };
    

    return (
        <div
            className={`w-full max-w-xl mx-auto my-4 rounded-2xl border shadow-lg transition-colors ${selected ? "border-blue-500" : "border-gray-200"} bg-white`}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                {/* Botón de número de pregunta */}
                <button
                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-semibold transition-colors ${selected ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300"
                        }`}
                    onClick={() => setSelected(!selected)}
                >
                    {index + 1}
                </button>

                {/* Texto de la pregunta */}
                <div className="flex-1 px-3">
                {editable ? (
                        <TypewriterInput
                            text={localQuestion.questionText}
                            speed={35}
                            onComplete={handleQuestionComplete}
                            onChange={(value) => {handleQuestionTextChange(value)}}
                        />
                    ) : (
                        <TypewriterText
                            text={localQuestion.questionText}
                            speed={35}
                            onComplete={handleQuestionComplete}
                        />
                    )}
                </div>

                {/* Botón de menú de tres puntos */}
                <div className="relative">
                    <button
                        className="p-1 rounded hover:bg-gray-100 transition"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white border rounded shadow-md z-10">
                            <button
                                className="flex items-center gap-2 px-4 py-2 w-full hover:bg-red-100 text-red-600"
                                onClick={() => onDelete && onDelete(question.questionId)}
                            >
                                <Trash2 size={16} /> Eliminar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-2">
                {localQuestion.options?.slice(0, revealedOptions).map((opt: any, idx: number) => (
                    <div
                        key={opt.optionId}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex flex-row items-baseline gap-4 last:mb-0 hover:bg-gray-50"
                    >
                        {/* Círculo clickeable */}
                        <div
                            className={`grid place-items-center rounded-full border font-semibold w-6 h-6
                                        transition-colors
                                        ${opt.isCorrect ? "bg-green-500 border-green-500 text-white" : "bg-card border-gray-300 text-gray-700"}`}
                            onClick={() => handleCircleClick(idx)}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="select-none text-center text-sm">{letters[idx]}</span>
                        </div>

                        {/* Texto de la opción */}
                        {editable ? (
                            <TypewriterInput
                                text={opt.text}
                                speed={25}
                                onComplete={handleQuestionComplete}
                                onChange={(value) => handleOptionTextChange(idx, value)}
                            />
                        ) : (
                            <TypewriterText
                                text={opt.text}
                                speed={25}
                                onComplete={handleQuestionComplete}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
