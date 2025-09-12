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

    const isGradientBase = baseColor.includes("bg-gradient-to");

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className={clsx(
                "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-70 min-w-28 rounded-full border border-transparent",
                fullWidth && "w-full",
                sizeClasses[size],
                !isLoading &&
                    (isGradientBase ? `${baseColor} text-white` : baseColor),
                isLoading &&
                    `bg-gradient-to-r ${gradientColors.join(" ")} text-white`,
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
