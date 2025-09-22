"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ListChecks, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useEffect, RefObject, Dispatch, SetStateAction } from "react";

type ChatbotInstructionsCardProps = {
    response: string;
    setResponse: Dispatch<SetStateAction<string>>;
    responseRef: RefObject<HTMLTextAreaElement|null>;
    handleAutoResize: (element: HTMLTextAreaElement) => void;
};

export default function ChatbotInstructionsCard({
    response,
    setResponse,
    responseRef,
    handleAutoResize,
}: ChatbotInstructionsCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (isEditing && responseRef.current) {
            responseRef.current.focus();
            handleAutoResize(responseRef.current);
        }
    }, [isEditing, responseRef, handleAutoResize]);

    return (
        <Card className="p-6 shadow-sm gap-2 bg-gradient-to-r from-blue-950/5 via-white to-white border-l-4 border-blue-950">
            <h2 className="flex items-center justify-between text-xl font-semibold text-blue-900 mb-3">
                <div className="flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-blue-900" />
                    Instrucciones
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1 rounded-full text-gray-500 hover:text-blue-900 hover:bg-gray-100 transition-colors"
                    aria-label={isEditing ? "Guardar y ver" : "Editar instrucciones"}
                >
                    <Pencil className="w-5 h-5" />
                </button>
            </h2>
            <motion.div
                key={isEditing ? "editing" : "viewing"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {isEditing ? (
                    <Textarea
                        ref={responseRef}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="min-h-[150px] resize-none text-black transition-all duration-300 ease-in-out"
                        onInput={(e) => handleAutoResize(e.currentTarget)}
                    />
                ) : (
                    <div className="min-h-[150px] whitespace-pre-line text-gray-800 transition-all duration-300 ease-in-out cursor-text" onClick={() => setIsEditing(true)}>
                        {response}
                    </div>
                )}
            </motion.div>
        </Card>
    );
}
