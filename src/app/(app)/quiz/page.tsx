"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileQuestion, RefreshCw } from "lucide-react"; // Usamos el icono de "FileQuestion"
import { useAppDispatch } from "@/store/hooks";
import { setQuiz } from "@/store/slices/quizSlice";
import DefaultLayout from "@/components/layout/DefaultLayout";
import SubmitButton from "@/components/custom/SubmitButton";
import SourceMaterialInput from "@/components/ui/source-material-input";
import { ApiResponse } from "@/types/api";
import { toast } from "sonner";

export default function QuizPage() {
    const [sourceType, setSourceType] = useState("topic");
    const [sourceValue, setSourceValue] = useState("");
    const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const [questionType, setQuestionType] = useState("multiple");
    const [numQuestions, setNumQuestions] = useState(5);
    const [instructions, setInstructions] = useState("");
    const [codProgram, setCodProgram] = useState("1");
    const [language, setLanguage] = useState("es");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleGenerateQuiz = async () => {
        // Validación de campos
        if (sourceType === "file" && !fileBytes) {
            toast.error("Debes seleccionar un archivo para continuar.");
            return;
        } else if (sourceType !== "file" && !sourceValue.trim()) {
            toast.error("Completa el campo de origen antes de continuar.");
            return;
        }

        setLoading(true);

        try {
            // El FormData se construye con todos los datos
            const formData = new FormData();
            formData.append("questionType", questionType);
            formData.append("numQuestions", numQuestions.toString());
            formData.append("codProgram", codProgram);
            formData.append("language", language);
            formData.append("sourceValue", sourceValue);

            if (instructions.trim()) {
                formData.append("instructions", instructions.trim());
            }

            let typeToSend = sourceType;
            if (sourceType !== "file" && sourceValue.startsWith("http")) {
                typeToSend = detectarYouTube(sourceValue) ? "youtube" : "webpage";
            }
            formData.append("sourceType", typeToSend);

            if (sourceType === "file") {
                if (!fileBytes || !mimeType) {
                    setLoading(false);
                    toast.error("Debes subir un archivo para continuar.");
                    return;
                }
                formData.append(
                    "file",
                    new Blob([fileBytes.buffer as ArrayBuffer], { type: mimeType }),
                    "archivo"
                );
            }


            const response = await fetch("/api/quiz/generate", {
                method: "POST",
                body: formData,
            });
            const content: ApiResponse = await response.json();
            
            if (!response.ok || !content.success) {
                const errorMessage = content.error?.message || "Error al generar el quiz.";
                throw new Error(errorMessage);
            }
            
            const quiz = content?.data?.quiz;
            dispatch(setQuiz(quiz));

            toast.success("Quiz generado con éxito.");
            router.push(`/quiz/config`);
        } catch (error) {
            console.error("Error en la generación del quiz:", error);
            toast.error("Error al generar el quiz. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    function detectarYouTube(url: string): boolean {
        if (!url) return false;
        try {
            const parsedUrl = new URL(url);
            const hostname = parsedUrl.hostname.toLowerCase();
            return hostname.includes("youtube.com") || hostname.includes("youtu.be");
        } catch {
            return false;
        }
    }

    return (
        <DefaultLayout
            title="Generar Quiz"
            titleIcon={<FileQuestion className="w-6 h-6" />}
            description="Crea un quiz a partir de diferentes fuentes, como texto, URL, o archivos."
            loading={loading}
        >
            {/* Componente de entrada de material de origen */}
            <SourceMaterialInput
                sourceType={sourceType}
                onTypeChange={setSourceType}
                sourceValue={sourceValue}
                onValueChange={setSourceValue}
                onFileChange={(bytes, type) => {
                    setFileBytes(bytes);
                    setMimeType(type);
                }}
            />

            {/* Tipo y número de preguntas */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-6">
                <div className="flex-1">
                    <Label>Tipo de preguntas</Label>
                    <Select
                        value={questionType}
                        onValueChange={(val) => setQuestionType(val)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="multiple">Selección múltiple</SelectItem>
                            <SelectItem value="short">Respuestas cortas</SelectItem>
                            <SelectItem value="mixed">Mixto</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <Label>Número de preguntas</Label>
                    <Select
                        value={String(numQuestions)}
                        onValueChange={(val) => setNumQuestions(Number(val))}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecciona cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Instrucciones */}
            <div className="mt-6">
                <Label>Instrucciones adicionales (opcional)</Label>
                <Textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Escribe instrucciones para el quiz"
                    className="mt-1 h-24 resize-none"
                />
            </div>

            {/* Nivel académico y idioma */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-6">
                <div className="flex-1">
                    <Label>Nivel académico</Label>
                    <Select value={codProgram} onValueChange={(val) => setCodProgram(val)}>
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Pregrado</SelectItem>
                            <SelectItem value="2">Postgrado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <Label>Idioma</Label>
                    <Select
                        value={language}
                        onValueChange={(val) => setLanguage(val)}
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecciona idioma" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">Inglés</SelectItem>
                            <SelectItem value="pt">Portugués</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <SubmitButton
                text="Generar Quiz"
                loadingText={
                    <span className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generando...
                    </span>
                }
                size="lg"
                onClick={handleGenerateQuiz}
                className="mt-6 py-4"
            />
        </DefaultLayout>
    );
}
