"use client";

import { useState } from "react";
// Asumimos que estos componentes existen en su ruta de proyecto
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
import Image from "next/image"; // Mantengo el componente Image si necesita un logo
import { Search, Video, Play, RefreshCw, Calendar, Clock } from "lucide-react"; // Se usa 'Video' en lugar de 'Youtube'
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks"; // Asumido
import { setQuiz } from "@/store/slices/quizSlice"; // Asumido
import DefaultLayout from "@/components/layout/DefaultLayout"; // Asumido
import SubmitButton from "@/components/custom/SubmitButton"; // Asumido
import { VideoData ,ApiResponse } from "@/types";

export default function ZoomVideoQuizPage() {
    const [zoomUrl, setZoomUrl] = useState("");
    const [videoData, setVideoData] = useState<VideoData | null>(null); 
    const [questionType, setQuestionType] = useState("multiple");
    const [numQuestions, setNumQuestions] = useState(5);
    const [instructions, setInstructions] = useState("");
    const [codProgram, setCodProgram] = useState("1");
    const [language, setLanguage] = useState("es");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    // --- Lógica de Búsqueda de Video (Adaptada a Zoom) ---
    const handleSearchVideo = async () => { // Hacemos la función asíncrona
        if (!zoomUrl) return;
        setLoading(true);
        setVideoData(null); // Limpiamos data anterior

        try {
            const response = await fetch("/api/zoom/video-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: zoomUrl }),
            });

            if (!response.ok) {
                 // Captura errores 400 o 500 del handler de Next.js
                const errorContent = await response.json();
                throw new Error(errorContent.error?.message || `Error: ${response.statusText}`);
            }

            const content: ApiResponse<VideoData> = await response.json();
            
            if (content.success && content.data) {
                setVideoData(content.data); // Guardamos la info del video
            } else {
                throw new Error(content.error?.message || "No se pudo obtener la información del video.");
            }
        } catch (error) {
            console.error(error);
            alert(`Error al buscar video`);
        } finally {
            setLoading(false);
        }
    };

    // --- Lógica de Generación de Quiz ---
    const handleGenerateQuiz = async () => {
        if (!zoomUrl) return alert("Ingresa la URL del Video de Zoom");
        
        setLoading(true);

        try {
            const response = await fetch("/api/quiz/zoom/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // *** CAMBIO CLAVE: sourceType es 'zoom' ***
                    sourceType: 'zoom', 
                    sourceValue: zoomUrl,
                    questionType,
                    numQuestions,
                    instructions,
                    codProgram,
                    language,
                    userId: "jorge",
                    sessionId: "7880918367119343616"
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
            router.push("/quiz/config");
        } catch (error) {
            console.error(error);
            alert("Error generando el quiz. Asegúrate que la URL de Zoom sea accesible.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayout
            title="Crear Quiz desde Video Zoom"
            titleIcon={<Video className="w-6 h-6" />} // Ícono de video
            description="Genera un quiz a partir de un video de Zoom o un enlace de video privado."
            loading={loading}
        >
            {/* Sección logo y búsqueda */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-4">
                
                {/* Oculta el icono de Zoom si ya se ha cargado un video */}
                {!videoData && (
                    <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                        <Video className="w-10 h-10 text-blue-600" /> 
                    </div>
                )}

                {!videoData ? (
                    <div className="flex w-full max-w-xl items-center">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Ingresa la URL del Video de Zoom"
                                value={zoomUrl}
                                onChange={(e) => setZoomUrl(e.target.value)}
                                className="pr-10 pl-10 py-2 rounded-xl border focus:ring-2 focus:ring-blue-400 transition-all"
                            />

                            {zoomUrl && (
                                <button
                                    onClick={() => setZoomUrl("")}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    &#10005;
                                </button>
                            )}
                        </div>

                        {/* Botón buscar: Añadido hover:bg-blue-700 */}
                        <Button
                            onClick={handleSearchVideo}
                            size="icon"
                            disabled={loading || !zoomUrl} 
                            className="ml-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white shadow-md"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    /* Vista Previa del Video (Responsive y Elegante) */
                    <div className="w-full max-w-xl mt-2 rounded-xl shadow-xl border border-gray-100 bg-white group p-5 transition-all duration-300 hover:shadow-2xl">
                        <div className="relative">
                            
                            {/* Botón para cambiar video (posicionamiento absoluto) */}
                            <button
                                onClick={() => { setVideoData(null); setZoomUrl(videoData.playUrl); }} 
                                className="absolute top-0 right-0 z-10 bg-gray-100 rounded-full p-2 shadow hover:bg-red-500 hover:text-white transition-colors"
                                aria-label="Cambiar video"
                            >
                                &#10005;
                            </button>

                            <a href={videoData.playUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 pr-10">
                                
                                {/* Ícono de Play */}
                                <div className="w-12 h-12 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                                    <Play size={20} className="text-white fill-white" />
                                </div>

                                <div className="flex-1 text-left min-w-0">
                                    {/* Título: Aumentado a 4 líneas y `text-base` en móvil */}
                                    <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-4 leading-snug">
                                        {videoData.title}
                                    </h3>
                                    
                                    {/* Metadatos (Fecha) */}
                                    <div className="flex items-center text-sm text-gray-500 mt-2 gap-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span className="font-medium">{videoData.date}</span>
                                        </div>
                                    </div>

                                    {/* Play URL (Discreto) */}
                                    <p className="text-xs text-blue-500 truncate mt-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                        {videoData.playUrl}
                                    </p>
                                </div>
                            </a>
                        </div>
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
                    placeholder="Escribe instrucciones para el quiz (ej. 'Enfócate en los últimos 5 minutos del video')"
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
                text="Generar Zoom Quiz"
                loadingText={
                    <span className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generando...
                    </span>
                }
                size="lg"
                onClick={handleGenerateQuiz}
                className="mt-6 py-4 bg-blue-600 hover:bg-blue-700" // Cambiado a color de Zoom
            />
        </DefaultLayout>
    );
}