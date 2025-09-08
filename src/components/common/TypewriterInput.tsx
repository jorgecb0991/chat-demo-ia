"use client";

import React from 'react';
import { useEffect, useRef, useState } from "react";

interface TypewriterInputProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
    onChange?: (value: string) => void;
}

export default function TypewriterInput({
    text,
    speed = 40,
    onComplete,
    onChange,
}: TypewriterInputProps) {
    const [displayed, setDisplayed] = useState(""); 
    const [isTyping, setIsTyping] = useState(true); 
    const doneRef = useRef(false); // controla la animación
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        // Si ya se ejecutó la animación, simplemente pintamos el texto completo
        if (doneRef.current) {
            setDisplayed(text);
            setIsTyping(false);
            return;
        }

        // Primera vez → ejecutar efecto máquina de escribir
        setDisplayed("");
        setIsTyping(true);
        const chars = Array.from(text ?? "");
        let i = 0;

        const tick = () => {
            const nextDisplayed = chars.slice(0, i + 1).join("");
            setDisplayed(nextDisplayed);
            i += 1;

            if (i < chars.length) {
                timeoutRef.current = window.setTimeout(tick, speed);
            } else {
                setIsTyping(false);
                doneRef.current = true; //ya no se repite nunca más
                onComplete?.();
            }
        };

        timeoutRef.current = window.setTimeout(tick, speed);

        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [text, speed, onComplete]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayed(e.target.value);
        onChange?.(e.target.value);
    };

    return (
        <input
            type="text"
            value={displayed}
            onChange={handleChange}
            className="w-full border-0 bg-transparent px-1 py-2 text-gray-900 placeholder-gray-400 focus:border-b border-blue-500 focus:ring-0 focus:outline-none transition duration-200"
            disabled={isTyping}
        />
    );
}
