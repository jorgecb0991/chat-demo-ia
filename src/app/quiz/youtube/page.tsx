"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Search, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setQuiz } from "@/store/slices/quizSlice";
import DefaultLayout from "@/components/layout/DefaultLayout";
import SubmitButton from "@/components/common/SubmitButton";

export default function YoutubeQuizPage() {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
    const [questionType, setQuestionType] = useState("multiple");
    const [numQuestions, setNumQuestions] = useState(5);
    const [instructions, setInstructions] = useState("");
    const [academicLevel, setAcademicLevel] = useState("");
    const [language, setLanguage] = useState("es");
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSearchVideo = () => {
        if (!youtubeUrl) return;
        try {
            const urlObj = new URL(youtubeUrl);
            let videoId = "";
            if (urlObj.hostname.includes("youtu.be")) {
                videoId = urlObj.pathname.slice(1);
            } else {
                videoId = urlObj.searchParams.get("v") || "";
            }
            if (videoId) {
                setVideoThumbnail(`https://img.youtube.com/vi/${videoId}/0.jpg`);
            }
        } catch (error) {
            console.error(error);
            setVideoThumbnail(null);
        }
    };

    const handleGenerateQuiz = async () => {
        if (!youtubeUrl) return alert("Ingresa la URL de YouTube");

        try {
            const response = await fetch("/api/quiz/youtube/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    videoUrl: youtubeUrl,
                    questionType,
                    numQuestions,
                    instructions,
                    academicLevel,
                    language,
                    userId: "jorge",
                    sessionId:"6438521839198142464"
                }),
            });

            if (!response.ok) {
                throw new Error(`Error generando quiz: ${response.statusText}`);
            }

            const data = await response.json();
            const quiz = data?.data?.quiz;
            dispatch(setQuiz(quiz));
            router.push("/quiz/youtube/config");
        } catch (error) {
            console.error(error);
            alert("Error generando el quiz");
        }
    };

    return (
        <DefaultLayout
            title="Crear YouTube Quiz"
            titleIcon={<Youtube className="w-6 h-6" />}
            description="Genera un quiz a partir de un video de YouTube con diferentes tipos de preguntas."
        >
            {/* Sección logo y búsqueda */}
            <div className="bg-blue-50 rounded-lg p-2 flex flex-col items-center">
                <div className="relative w-20 h-20">
                    <Image
                        src="/img/youtube_logo.png"
                        alt="YouTube"
                        fill
                        className="object-contain"
                    />
                </div>

                {!videoThumbnail && (
                    <div className="flex w-full max-w-xl items-center">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Buscar en YouTube"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                className="pr-8" // deja espacio para el botón X dentro del input
                            />

                            {/* Botón limpiar dentro del input */}
                            {youtubeUrl && (
                                <button
                                    onClick={() => setYoutubeUrl("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                                >
                                    &#10005;
                                </button>
                            )}
                        </div>

                        {/* Botón buscar al costado */}
                        <Button
                            onClick={handleSearchVideo}
                            size="icon"
                            className="ml-2 bg-black hover:bg-red-500 text-white shadow-md"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {videoThumbnail && (
                    <div className="relative w-80 mt-2 rounded shadow-md overflow-hidden flex justify-center">
                        <a
                            href={youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-48 block"
                        >
                            <div
                                className="w-full h-full bg-center bg-cover rounded"
                                style={{ backgroundImage: `url(${videoThumbnail})` }}
                            />
                            <button
                                className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center rounded-full transition-colors"
                                aria-label="Reproducir video"
                                style={{ top: "50%", transform: "translateY(-50%)" }}
                            >
                                ▶
                            </button>
                        </a>
                        <button
                            onClick={() => setVideoThumbnail(null)}
                            className="absolute top-2 right-2 text-gray-800 p-1 rounded-full shadow hover:font-bold transition-colors"
                            aria-label="Cerrar miniatura"
                        >
                            &#10005;
                        </button>
                    </div>
                )}
            </div>

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
                    <Label>Nivel académico (opcional)</Label>
                    <Input
                        type="text"
                        value={academicLevel}
                        onChange={(e) => setAcademicLevel(e.target.value)}
                        placeholder="Ej. Pregrado, Postgrado"
                        className="mt-1"
                    />
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
                text="Generar YouTube Quiz"
                loadingText="Generando..."
                size="lg"
                onClick={handleGenerateQuiz}
                className="mt-6 py-4" // ✅ margen arriba + padding vertical extra
                baseColor="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"
            />
        </DefaultLayout>
    );
}
