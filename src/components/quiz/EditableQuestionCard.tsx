"use client";
import { useEffect, useState, useRef } from "react";
import TypewriterText from "@/components/common/TypewriterText";
import TypewriterInput from "@/components/common/TypewriterInput";
import { MoreVertical, Trash2 } from "lucide-react";
import { QuizQuestion } from "@/types/quiz";
import clsx from "clsx";

interface QuestionCardProps {
    question: QuizQuestion;
    index: number;
    onComplete: () => void;
    onDelete?: (id: number) => void;
    editable?: boolean;
    onChange?: (updated: QuizQuestion) => void;
}

export default function EditableQuestionCard({
    question,
    index,
    onComplete,
    onDelete,
    editable = false,
    onChange,
}: QuestionCardProps) {
    const [localQuestion, setLocalQuestion] = useState(question);
    const [selected, setSelected] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Opciones que ya se mostraron
    const [shownOptions, setShownOptions] = useState<number[]>([]);

    // refs para evitar disparos múltiples
    const questionDoneRef = useRef(false);
    const optionDoneRef = useRef<Record<number, boolean>>({});

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        setLocalQuestion(question);
        setShownOptions([]);
        questionDoneRef.current = false;
        optionDoneRef.current = {};
    }, [question.questionId]);

    const handleQuestionComplete = () => {
        if (questionDoneRef.current) return;
        questionDoneRef.current = true;
        console.log(`[Card ${index}] ✅ Pregunta terminada → mostrando primera opción`);
        if (localQuestion.options?.length) {
            setShownOptions([0]);
        } else {
            onComplete();
        }
    };

    const handleOptionComplete = (idx: number) => {
        if (optionDoneRef.current[idx]) return;
        optionDoneRef.current[idx] = true;

        console.log(`[Card ${index}] ✅ Opción ${idx} terminada`);

        if (idx < (localQuestion.options?.length ?? 0) - 1) {
            console.log(`[Card ${index}] ⏭️ Pasando a opción ${idx + 1}`);
            setShownOptions((prev) => [...prev, idx + 1]);
        } else {
            console.log(`[Card ${index}] 🏁 Todas las opciones completas → Card terminado`);
            onComplete();
        }
    };

    const handleCircleClick = (optIndex: number) => {
        if (!localQuestion.options) return;
        const updatedOptions = localQuestion.options.map((opt, i) => ({
            ...opt,
            isCorrect: i === optIndex,
        }));
        const updated = { ...localQuestion, options: updatedOptions };
        setLocalQuestion(updated);
        onChange?.(updated);
    };

    const handleQuestionTextChange = (value: string) => {
        const updated = { ...localQuestion, questionText: value };
        setLocalQuestion(updated);
        onChange?.(updated);
    };

    const handleShortAnswerChange = (value: string) => {
        const updated = { ...localQuestion, suggestedAnswer: value };
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
            className={`w-full mx-auto my-4 rounded-2xl border shadow-lg transition-colors ${selected ? "border-blue-500" : "border-gray-200"
                } bg-white`}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <button
                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-semibold transition-colors ${selected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                    onClick={() => setSelected(!selected)}
                >
                    {index + 1}
                </button>

                <div className="flex-1 px-3">
                    {editable ? (
                        <TypewriterInput
                            text={localQuestion.questionText}
                            speed={25}
                            onComplete={handleQuestionComplete}
                            onChange={handleQuestionTextChange}
                        />
                    ) : (
                        <TypewriterText
                            text={localQuestion.questionText}
                            speed={25}
                            onComplete={handleQuestionComplete}
                        />
                    )}
                </div>

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

            {/* Opciones o Respuesta libre */}
            <div className="p-4 flex flex-col gap-2">
                {localQuestion.type === "short" ? (
                    // Caja vacía para respuesta libre
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        {editable ? (
                            <input
                                type="text"
                                className="w-full border-0 bg-transparent px-1 py-2 text-gray-900 placeholder-gray-400 focus:border-b border-blue-500 focus:ring-0 focus:outline-none transition duration-200"
                                placeholder="Escribe tu respuesta aquí..."
                                value={localQuestion.suggestedAnswer}
                                onChange={(e) => handleShortAnswerChange(e.target.value)}
                            />
                        ) : (
                            <span className="text-gray-500 italic">Respuesta pendiente...</span>
                        )}
                    </div>
                ) : (shownOptions.map((optIdx) => (
                    <div
                        key={localQuestion.options![optIdx].optionId}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex flex-row items-baseline gap-4"
                    >
                        {/*Botón de Radio*/}
                        <div
                            className={clsx(
                                "grid place-items-center rounded-full font-semibold w-6 h-6",
                                "transition-all duration-200 transform cursor-pointer", // Transiciones y animación
                                localQuestion.options![optIdx].isCorrect
                                    ? "bg-emerald-700 border-2 border-emerald-700 text-white shadow-lg" // Estado Correcto
                                    : "bg-white border border-gray-400 text-gray-700 shadow-sm hover:border-[#F5A623] hover:text-[#F5A623]" // Estado Incorrecto + Hover
                            )}
                            onClick={() => handleCircleClick(optIdx)}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="relative bottom-px"   >{letters[optIdx]}</span>
                        </div>

                        {editable ? (
                            <TypewriterInput
                                text={localQuestion.options![optIdx].text}
                                speed={25}
                                onComplete={() => handleOptionComplete(optIdx)}
                                onChange={(value) =>
                                    handleOptionTextChange(optIdx, value)
                                }
                            />
                        ) : (
                            <TypewriterText
                                text={localQuestion.options![optIdx].text}
                                speed={25}
                                onComplete={() => handleOptionComplete(optIdx)}
                            />
                        )}
                    </div>
                )))}
            </div>
        </div>
    );
}
