"use client";

import { useState } from "react";
import TypewriterText from "@/components/common/TypewriterText";

interface HoverButtonProps {
    icon: React.ReactNode; // El ícono que quieres mostrar
    text: string;           // Texto que aparece al hover
    onClick?: () => void;   // Acción al hacer click
    className?: string;     // Clases adicionales para el botón
}

export default function HoverButton({ icon, text, onClick, className }: HoverButtonProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`flex items-center rounded-full border border-gray-300 bg-white text-gray-700 overflow-hidden transition-all duration-300 ${className || ""
                }`}
            style={{ width: hovered ? "auto" : 40, height: 40 }}
        >
            {/* Icono siempre visible */}
            <div className="flex items-center justify-center px-3 py-2">
                {icon}
                {hovered && (
                    <span className="ml-2 whitespace-nowrap transition-all duration-300">
                        <TypewriterText text={text} speed={40} />
                    </span>
                )}
            </div>
        </button>
    );
}
