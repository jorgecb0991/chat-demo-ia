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
import { Search, Youtube, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setQuiz } from "@/store/slices/quizSlice";
import DefaultLayout from "@/components/layout/DefaultLayout";
import SubmitButton from "@/components/common/SubmitButton";
import {ApiResponse} from "@/types/api"

export default function YoutubeQuizPage() {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
    const [questionType, setQuestionType] = useState("multiple");
    const [numQuestions, setNumQuestions] = useState(5);
    const [instructions, setInstructions] = useState("");
    const [codProgram, setCodProgram] = useState("1");
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
                    codProgram,
                    language,
                    user_id: "jorge",
                    session_id: "7880918367119343616"
                }),
            });

            if (!response.ok) {
                throw new Error(`Error generando quiz: ${response.statusText}`);
            }

            const content: ApiResponse = await response.json();
            if (!content.success) {
                throw new Error(`API error: ${content.error?.message}`);
            }
            const quiz = content?.data?.quiz;
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
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-4">
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
                                className="pr-10 pl-10 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 transition-all" // deja espacio para el botón X dentro del input
                            />

                            {/* Botón limpiar dentro del input */}
                            {youtubeUrl && (
                                <button
                                    onClick={() => setYoutubeUrl("")}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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

                {videoThumbnail && (<div className="relative w-80 mt-2 rounded-2xl shadow-lg overflow-hidden group">
                    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                        <div
                            className="w-full h-48 bg-center bg-cover"
                            style={{ backgroundImage: `url(${videoThumbnail})` }}
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <button className="w-16 h-16 flex items-center justify-center text-red-600 shadow-lg">
                                <Play size={32} />
                            </button>
                        </div>
                    </a>
                    <button
                        onClick={() => setVideoThumbnail(null)}
                        className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-red-100"
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
                text="Generar YouTube Quiz"
                loadingText="Generando..."
                size="lg"
                onClick={handleGenerateQuiz}
                className="mt-6 py-4" //margen arriba + padding vertical extra
                baseColor="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500"
            />
        </DefaultLayout>
    );
}
