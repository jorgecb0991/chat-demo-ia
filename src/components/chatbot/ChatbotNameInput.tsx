import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Type, Pencil, X } from "lucide-react";


type ChatbotNameInputProps = {
    nameAssistant: string;
    setNameAssistant: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChatbotNameInput({
    nameAssistant,
    setNameAssistant,
}: ChatbotNameInputProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(nameAssistant);

    // Sincroniza el estado interno con el prop externo
    useEffect(() => {
        setTempName(nameAssistant);
    }, [nameAssistant]);

    const handleEditClick = () => {
        setIsEditing(true);
        setTempName(nameAssistant);
    };

    const handleSaveClick = () => {
        if (tempName.trim() !== "") {
            setNameAssistant(tempName);
        }
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setTempName(nameAssistant);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSaveClick();
        } else if (e.key === "Escape") {
            handleCancelClick();
        }
    };

    return (
        <Card className="mb-2 p-6 shadow-md rounded-xl">
            <div className="space-y-3">
                <Label
                    htmlFor="chatbot-name"
                    className="flex items-center gap-2 font-semibold text-blue-900"
                >
                    <Type className="w-5 h-5" />
                    Nombre del Chatbot
                </Label>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Input
                                id="chatbot-name"
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={handleSaveClick}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="flex-1 text-black"
                            />
                            <button
                                onClick={handleCancelClick}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                                aria-label="Cancelar edición"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 w-full">
                            <span className="text-lg font-medium flex-1 text-black">
                                {nameAssistant}
                            </span>
                            <button
                                onClick={handleEditClick}
                                className="p-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                                aria-label="Editar nombre"
                            >
                                <Pencil className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
