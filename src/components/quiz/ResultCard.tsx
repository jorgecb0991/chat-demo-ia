"use client";

import { RotateCcw, Check, X } from "lucide-react";
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
    bgColor?: string; // fondo sólido
    gradientColors?: string[]; // fondo degradado
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
    // degradado azul suave por defecto
    const defaultGradient = ["from-blue-100", "via-blue-200", "to-blue-300"];

    const hasGradient = gradientColors || !bgColor;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "group relative rounded-xl p-6 flex flex-col shadow-lg border",
                hasGradient
                    ? `bg-gradient-to-br ${(gradientColors || defaultGradient).join(" ")}`
                    : bgColor
            )}
        >
            {/* Línea superior */}
            <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-4 overflow-clip rounded-t-xl group-data-active:block">
                <div className="h-1.5 bg-primary"></div>
            </div>

            {/* Badge del Quiz */}
            <div className="flex items-center gap-2 self-start px-3 py-1.5 rounded-full border bg-orange-50 text-orange-600 text-xs font-semibold">
                <span>{quizTitle.toUpperCase()}</span>
            </div>

            {/* Título */}
            <h3 className="mt-4 text-xl font-semibold text-black dark:text-black">
                {scorePercent >= 70
                    ? `¡Excelente, ${studentName}!`
                    : `Buen esfuerzo, ${studentName}`}
            </h3>

            {/* Feedback y porcentaje */}
            <div className="mt-3 flex flex-col md:flex-row gap-6 items-start">
                <p className="flex-1 text-black dark:text-black">{feedback}</p>
                <p className="text-5xl font-bold text-primary">{scorePercent}%</p>
            </div>

            {/* Estadísticas */}
            <div className="mt-4 flex flex-row items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-full bg-green-500">
                        <Check className="w-3.5 h-3.5 stroke-white" />
                    </div>
                    <span>{correct} correct</span>
                </div>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                <div className="flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-full bg-red-500">
                        <X className="w-3.5 h-3.5 stroke-white" />
                    </div>
                    <span>{incorrect} incorrect</span>
                </div>
            </div>

            {/* Botón Restart */}
            {onRestart && (
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onRestart}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none min-w-28 bg-accent text-accent-foreground hover:bg-accent/90 border border-transparent h-10 px-4 py-2"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restart
                    </button>
                </div>
            )}
        </motion.div>
    );
}
