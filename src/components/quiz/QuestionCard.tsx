"use client";

import { useEffect, useState } from "react";
import { QuizQuestion, StudentAnswer, StudentShortAnswer, StudentMultipleChoiceAnswer } from "@/types/quiz";
import { motion } from "framer-motion";

interface QuestionCardProps {
    question: QuizQuestion;
    index: number;
    onAnswer: (questionId: string | number, answer: StudentAnswer) => void;
    studentAnswer?: StudentAnswer;
    showResults?: boolean;
}

export default function QuestionCard({
    question,
    index,
    onAnswer,
    studentAnswer,
    showResults = false,
}: QuestionCardProps) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Estado local para el input de respuesta corta
    const [shortAnswerText, setShortAnswerText] = useState("");

    useEffect(() => {
        // Inicializa con la respuesta corta del prop si existe
        if (question.type === "short" && studentAnswer && "text" in studentAnswer) {
            setShortAnswerText((studentAnswer as StudentShortAnswer).text || "");
        }
    }, [question.type, studentAnswer]);

    // Type guards
    const isStudentShort = (a?: StudentAnswer): a is StudentShortAnswer =>
        !!a && (a as StudentShortAnswer).text !== undefined;
    const isStudentMC = (a?: StudentAnswer): a is StudentMultipleChoiceAnswer =>
        !!a && (a as StudentMultipleChoiceAnswer).optionId !== undefined;

    // Normalización simple de strings (trim + lower)
    const normalize = (s?: string) => (s ?? "").trim().toLowerCase();

    // Evaluación simple y tolerante para respuestas cortas.
    // Devuelve: true = correcto, false = incorrecto, null = no se puede evaluar (falta suggestedAnswer)
    const evaluateShortAnswer = (student?: StudentAnswer, q?: QuizQuestion): boolean | null => {
        if (!q) return null;
        // Candidate to use as 'correct answer': suggestedAnswer first, fallback to explanation
        const correctRaw = q.suggestedAnswer ?? q.explanation ?? "";
        const correct = normalize(correctRaw);
        if (!correct) return null; // no hay referencia para evaluar

        const studentText = isStudentShort(student) ? normalize(student.text) : "";

        if (!studentText) return false; // alumno no respondió -> incorrecto (puedes ajustar)

        // reglas tolerantes: igualdad, o que una incluya a la otra
        if (studentText === correct) return true;
        if (correct.includes(studentText)) return true;
        if (studentText.includes(correct)) return true;

        // podrías añadir checks más sofisticados (levenshtein, stopwords, etc.)
        return false;
    };

    const handleSelect = (optionId: number) => {
        if (!showResults) {
            const answer: StudentMultipleChoiceAnswer = { optionId };
            onAnswer?.(question.questionId, answer);
        }
    };

    const handleShortAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setShortAnswerText(text);
        const answer: StudentShortAnswer = { text };
        onAnswer?.(question.questionId, answer);
    };

    const isMultipleChoice = question.type === "multiple";

    // Para mostrar evaluación del input corto
    const shortEval = showResults && !isMultipleChoice ? evaluateShortAnswer(studentAnswer, question) : null;
    // boolean|null: true(correct), false(incorrect), null(no hay referencia)

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 120,
                damping: 12
            }}
            className="w-full max-w-xl mx-auto my-4 rounded-2xl border shadow-lg bg-white"
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center font-semibold text-gray-700 bg-gray-50">
                    {index + 1}
                </div>
                <div className="flex-1 px-3 font-medium text-gray-900">
                    {question.questionText}
                </div>
            </div>

            {/* Options or Short Answer Input */}
            <div className="p-4 flex flex-col gap-2">
                {isMultipleChoice ? (
                    // Opciones múltiple
                    question.options?.map((opt, idx) => {
                        const isCorrect = !!opt.isCorrect;
                        const isSelected =
                            studentAnswer && "optionId" in studentAnswer && studentAnswer.optionId === opt.optionId;

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
                                disabled={showResults}
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
                    })
                ) : (
                    // Input para respuesta corta
                    <>
                        <input
                            type="text"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors
                                ${showResults
                                    ? shortEval === null
                                        ? "border-gray-300 bg-gray-50 text-gray-700 focus:ring-blue-300" // no hay referencia para evaluar
                                        : shortEval === true
                                            ? "border-green-500 bg-green-50 text-green-700 focus:ring-green-300"
                                            : "border-amber-400 bg-amber-50 text-amber-800 focus:ring-amber-200" // uso amber para no ser agresivo como rojo fuerte
                                    : "border-gray-300 focus:ring-blue-500"
                                }`}
                            placeholder="Escribe tu respuesta aquí..."
                            value={shortAnswerText}
                            onChange={handleShortAnswerChange}
                            disabled={showResults}
                        />

                        {/* Si mostramos resultados y es incorrecto, ofrecermos la respuesta sugerida (sutil) */}
                        {showResults && shortEval === false && (question.suggestedAnswer || question.explanation) && (
                            <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                <span className="font-semibold">Respuesta sugerida: </span>
                                <span>{question.suggestedAnswer ?? question.explanation}</span>
                            </div>
                        )}

                        {/* Si no hay referencia para evaluar, mostramos nota informativa */}
                        {showResults && shortEval === null && (
                            <div className="mt-2 text-sm text-gray-500 italic">
                                No hay una respuesta modelo disponible para evaluar automáticamente.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Explicación */}
            {showResults && question.explanation && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 px-4 py-3"
                >
                    <div className="rounded-lg border border-gray-200 bg-gray-50 shadow-sm p-4">
                        <p className="font-semibold text-gray-800">💡 Explicación</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {question.explanation}
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
