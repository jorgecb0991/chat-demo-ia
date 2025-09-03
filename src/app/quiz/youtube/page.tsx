"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Search, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setQuiz } from "@/store/slices/quizSlice";
import DefaultLayout from "@/components/layout/DefaultLayout"; // importa tu layout

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
            console.error("URL inválida de YouTube");
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
                }),
            });

            if (!response.ok) {
                throw new Error(`Error generando quiz: ${response.statusText}`);
            }

            const data = await response.json();
            const quiz = data?.data?.quiz;
            console.log("Quiz generado:", data);
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
            {/* Sección del logo y búsqueda */}
            <div className="bg-blue-50 rounded-lg p-2 flex flex-col items-center ">
                <div className="relative w-20 h-20">
                    <Image
                        src="/img/youtube_logo.png"
                        alt="YouTube"
                        fill
                        className="object-contain"
                    />
                </div>

                {!videoThumbnail && (
                    <div className="w-full flex items-center relative">
                        <input
                            type="text"
                            placeholder="Buscar en YouTube"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="flex-1 pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 transition-all duration-300 shadow-sm hover:shadow-md"
                        />
                        {/* Botón de búsqueda dentro del input */}
                        <button
                            onClick={handleSearchVideo}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black hover:bg-red-500 text-white p-2 rounded-full flex items-center justify-center transition-colors"
                        >
                            <Search size={20} />
                        </button>
                        {/* Botón de limpiar input */}
                        {youtubeUrl && (
                            <button
                                onClick={() => setYoutubeUrl("")}
                                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                                aria-label="Borrar búsqueda"
                            >
                                &#10005;
                            </button>
                        )}
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
                                <svg viewBox="0 0 68 48" width="24" height="24">
                                    <path
                                        d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 
                        C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 
                        C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                                        fill="#f03"
                                    />
                                    <path d="M 45,24 27,14 27,34" fill="#fff" />
                                </svg>
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

            {/* Tipo de preguntas y número de preguntas */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-6">
                <div className="flex-1">
                    <label className="font-medium text-gray-900">Tipo de preguntas</label>
                    <select
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value)}
                        className="w-full p-2 border rounded mt-1 bg-white text-gray-900"
                    >
                        <option value="multiple">Selección múltiple</option>
                        <option value="short">Respuestas cortas</option>
                        <option value="mixed">Mixto</option>
                    </select>
                </div>

                <div className="flex-1">
                    <label className="font-medium text-gray-900">Número de preguntas</label>
                    <select
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(Number(e.target.value))}
                        className="w-full p-2 border rounded mt-1 bg-white text-gray-900"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>

            {/* Instrucciones adicionales */}
            <div className="mt-6">
                <label className="font-medium text-gray-900">Instrucciones adicionales (opcional)</label>
                <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Escribe instrucciones para el quiz"
                    className="w-full p-2 border rounded mt-1 h-24 resize-none bg-white text-gray-900"
                />
            </div>

            {/* Nivel académico y idioma */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-6">
                <div className="flex-1">
                    <label className="font-medium text-gray-900">Nivel académico (opcional)</label>
                    <input
                        type="text"
                        value={academicLevel}
                        onChange={(e) => setAcademicLevel(e.target.value)}
                        placeholder="Ej. Secundaria, Universitario"
                        className="w-full p-2 border rounded mt-1 bg-white text-gray-900"
                    />
                </div>

                <div className="flex-1">
                    <label className="font-medium text-gray-900">Idioma</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 border rounded mt-1 bg-white text-gray-900"
                    >
                        <option value="es">Español</option>
                        <option value="en">Inglés</option>
                        <option value="pt">Portugués</option>
                    </select>
                </div>
            </div>

            <Button
                className="w-full rounded-lg py-2 mt-6 bg-red-600 hover:bg-red-500 text-white"
                onClick={handleGenerateQuiz}
            >
                Generar YouTube Quiz
            </Button>
        </DefaultLayout>
    );
}
