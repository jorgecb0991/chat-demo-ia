"use client";

import { RotateCcw, Check, X, Award } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ResultCardProps {
    studentName: string;
    scorePercent: number; // porcentaje 0 - 100
    correct: number;
    incorrect: number;
    feedback: string;
    quizTitle?: string;
    onRestart?: () => void;
    bgColor?: string; // fondo sólido personalizado
    gradientColors?: string[]; // fondo degradado personalizado
}

export default function ResultCard({
    studentName,
    scorePercent,
    correct,
    incorrect,
    feedback,
    quizTitle = "Quiz",
    onRestart,
    bgColor,
    gradientColors,
}: ResultCardProps) {
    // Gradientes suaves por defecto
    const defaultPassGradient = ["from-emerald-100", "via-teal-100", "to-sky-100"];
    const defaultFailGradient = ["from-amber-100", "via-orange-100", "to-yellow-100"];

    // Determinar aprobado/desaprobado
    const isPassed = scorePercent >= 70;

    const effectiveGradient =
        gradientColors ||
        (isPassed ? defaultPassGradient : defaultFailGradient);

    const hasGradient = !bgColor;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "rounded-2xl p-6 shadow-lg border bg-gradient-to-br",
                hasGradient ? effectiveGradient.join(" ") : bgColor
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">{quizTitle}</h2>
            </div>

            {/* Mensaje motivacional */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {isPassed
                    ? `¡Excelente trabajo, ${studentName}!`
                    : `Buen esfuerzo, ${studentName}. ¡Sigue practicando!`}
            </h3>

            {/* Feedback */}
            <p className="text-gray-800 mb-4">{feedback}</p>

            {/* Puntaje grande */}
            <div className="text-5xl font-extrabold text-primary mb-6">
                {scorePercent}%
            </div>

            {/* Estadísticas */}
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-full bg-green-500">
                        <Check className="w-3.5 h-3.5 stroke-white" />
                    </div>
                    <span>{correct} correctas</span>
                </div>
                <div className="h-6 w-px bg-gray-400"></div>
                <div className="flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-full bg-red-400">
                        <X className="w-3.5 h-3.5 stroke-white" />
                    </div>
                    <span>{incorrect} incorrectas</span>
                </div>
            </div>

            {/* Botón Reiniciar */}
            {onRestart && (
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onRestart}
                        className="inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-white px-4 py-2 hover:opacity-90 transition"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Intentar de nuevo
                    </button>
                </div>
            )}
        </motion.div>
    );
}
