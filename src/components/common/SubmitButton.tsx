"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface SubmitButtonProps {
    text?: string;
    loadingText?: string | React.ReactNode;
    onClick?: () => Promise<void> | void;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
    baseColor?: string;
    gradientColors?: string[];
    className?: string;
}

export default function SubmitButton({
    text = "Submit Answers",
    loadingText = (
        <span className="flex items-center gap-2">
            Generando <span className="loading-dots">...</span>
        </span>
    ),
    onClick,
    fullWidth = true,
    size = "md",
    baseColor = "bg-blue-600 text-white hover:bg-blue-700",
    gradientColors = ["from-purple-500", "via-pink-500", "to-blue-500"],
    className,
}: SubmitButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await onClick?.();
        } finally {
            setIsLoading(false);
        }
    };

    const sizeClasses = {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
    };

    // Determinar si se usa un degradado de color base
    const isGradientBase = baseColor.includes("bg-gradient-to");
    // Determinar si se usan los colores por defecto
    const useDefaultColors = baseColor === "bg-blue-600 text-white hover:bg-blue-700" &&
                            gradientColors[0] === "from-purple-500";
    //from-[#00A3D7] via-[#006AB5] to-[#002C5B]
    //[#E54D7E] via-[#006AB5] to-[#002C5B]
    const defaultRestingClasses = `bg-gradient-to-r from-[#006AB5] via-[#E54D7E] to-[#002C5B] text-white hover:from-[#006AB5] hover:via-[#F5A623] hover:to-[#002C5B]`;
    // Nuevos colores de carga con un degradado animado
    const defaultLoadingClasses = `bg-gradient-to-r from-[#006AB5] via-[#F5A623] to-[#002C5B] text-white animate-pulse`;

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-70 min-w-28 rounded-full border border-transparent",
                fullWidth && "w-full",
                sizeClasses[size],
                // Colores en reposo
                !isLoading && (useDefaultColors ? defaultRestingClasses : (isGradientBase ? `${baseColor} text-white` : baseColor)),
                // Colores mientras está cargando
                isLoading && (useDefaultColors ? defaultLoadingClasses : `bg-gradient-to-r ${gradientColors.join(" ")} text-white animate-pulse`),
                className //merge de clases externas
            )}
        >
            {isLoading ? (
                typeof loadingText === "string" ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {loadingText}
                    </span>
                ) : (
                    loadingText
                )
            ) : (
                text
            )}
        </button>
    );
}
