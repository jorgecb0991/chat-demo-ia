"use client";

import React from 'react';
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {ApiResponse} from '@/types/api'

import { v4 as uuidv4 } from "uuid";
import { MessageSquarePlus, RefreshCw, Sparkles, Loader2, Type, Code, Target, ListChecks, Calendar as CalendarIcon  } from "lucide-react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import SubmitButton from "@/components/common/SubmitButton"
import ObjectiveCard from '@/components/common/ObjectiveCard';
import ChatbotInstructionsCard from '@/components/chatbot/ChatbotInstructionsCard';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import ChatbotNameInput from '@/components/chatbot/ChatbotNameInput';

export default function CreateChatbotPage() {
    const [intention, setIntention] = useState("");
    const [response, setResponse] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [nameAssistant, setNameAssistant] = useState("Utechie");

    const router = useRouter();

    const intentionRef = useRef<HTMLTextAreaElement>(null);
    const responseRef = useRef<HTMLTextAreaElement>(null);
    const [codProgram, setCodProgram] = useState("1");
    const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);

    const handleAutoResize = (el: HTMLTextAreaElement) => {
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    // Cargar nombre del chatbot si ya está en localStorage
    useEffect(() => {
        const storedName = localStorage.getItem("nameAssistant");
        if (storedName) setNameAssistant(storedName);
    }, []);

    // Guardar nombre del chatbot en localStorage cuando cambia
    useEffect(() => {
        if (nameAssistant.trim()) {
            localStorage.setItem("nameAssistant", nameAssistant);
        }
    }, [nameAssistant]);

    useEffect(() => {
        if (responseRef.current) handleAutoResize(responseRef.current);
    }, [response]);

    useEffect(() => {
        if (intentionRef.current) handleAutoResize(intentionRef.current);
    }, [intention]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!intention.trim()) return;

        setLoading(true);
        setResponse("");

        try {
            // Determina el nivel académico y crea un tag para las instrucciones
            const academicLevel = codProgram === "1" ? "pregrado" : "postgrado";
            const academicLevelTag = `[nivel academico: ${academicLevel}]`;

            // Combina el tag con la intención original
            const finalIntention = `${academicLevelTag} ${intention}`;

            const res = await fetch("/api/chatbot/instruction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ intention: finalIntention }),
            });

            // Leer la respuesta JSON una sola vez
            const content: ApiResponse = await res.json();

            // Combinar la verificación de éxito de la respuesta HTTP y la del backend
            if (!res.ok || !content.success) {
                const errorMessage = content.error?.message || "Error desconocido en el servidor";
                throw new Error(errorMessage);
            }

            // Desestructuración para acceso más limpio a los datos
            const { data } = content;

            // Asegurarse de que los datos tienen el formato esperado
            if (data?.instruction) {
                setResponse(data.instruction);
            } else {
                setResponse("No hay respuesta del servidor.");
            }
        } catch (error) {
            setResponse("Error al obtener respuesta del servidor.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleClear = () => {
        setIntention("");
        setResponse("");
    };

    const handleGenerateChatbot = async () => {
        if (!response) return;
        setGenerating(true);

        let message = response + " Eres Utechie, el asistente conversacional oficial de la Universidad de Ingeniería y Tecnología (UTEC). Tu propósito es interactuar con estudiantes de UTEC. En tu comunicación, busca reflejar la cultura de UTEC y los principios del modelo educativo TransformaTec, usando terminología como 'agentes de cambio', 'formación integral', 'ecosistema tecnológico' y 'TRANSFORMATEC' de forma adecuada y natural dentro de las conversaciones."

        try {
            const res = await fetch("/api/chatbot/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: message, session_id: uuidv4() }),
            });

            if (!res.ok) throw new Error("Error al generar chatbot");

            const content = await res.json();
            if (content.data?.message) {
                localStorage.setItem("messageWelcome", content.data.message);
                localStorage.setItem("session_id", content.data.session_id);
            }

            router.push("/qr/chatbot");
        } catch (error) {
            console.error(error);
            alert("Hubo un problema al generar el chatbot.");
            setGenerating(false);
        }
    };

    return (
        <DefaultLayout
            title="Crear Chatbot"
            titleIcon={<Code className="w-6 h-6" />}
            description="Diseña un chatbot personalizado con instrucciones claras y adaptadas a tus necesidades."
            loading={generating}
        >
            {!response && (
                <form onSubmit={handleCreate} className="space-y-6">
                    <label htmlFor="intention" className="block font-semibold text-gray-800 mb-2">
                        <MessageSquarePlus className="inline w-5 h-5 mr-2 text-blue-900" />
                        Ingresa las indicaciones del chatbot
                    </label>
                    <textarea
                        ref={intentionRef}
                        id="intention"
                        value={intention}
                        onChange={(e) => setIntention(e.target.value)}
                        required
                        rows={3}
                        placeholder="Ejemplo: 'Chatbot para instruir a estudiantes sobre inteligencia artificial'"
                        className="w-full p-5 border border-gray-300 rounded-lg resize-none
                                    focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 
                                    hover:border-blue-500 text-black overflow-hidden"
                        disabled={loading}
                        onInput={(e) => handleAutoResize(e.currentTarget)}
                    />

                    {/* Contenedor de los nuevos campos */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Campo Nivel académico */}
                        <div className="w-full sm:w-40 flex flex-col">
                            <Label htmlFor="academicLevel">Nivel académico</Label>
                            <Select value={codProgram} onValueChange={setCodProgram}>
                                <SelectTrigger id="program" className="mt-1">
                                    <SelectValue placeholder="Selecciona nivel" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Pregrado</SelectItem>
                                    <SelectItem value="2">Postgrado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Campo Fecha de caducidad */}
                        <div className="w-full sm:w-60 flex flex-col">
                            <Label htmlFor="expirationDate">Fecha de caducidad</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal mt-1",
                                            !expirationDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {expirationDate ? (
                                            format(expirationDate, "PPP", { locale: es })
                                        ) : (
                                            <span>Selecciona una fecha</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={expirationDate}
                                        onSelect={setExpirationDate}
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                        <Button
                            type="submit"
                            className="bg-blue-900 hover:bg-blue-800 text-white py-3 px-7 rounded-lg
                                transition-colors disabled:opacity-50 flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" /> Creando...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" /> Crear Chatbot
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClear}
                            disabled={loading && !intention.trim()}
                            className="text-blue-900 border-blue-900 hover:bg-blue-900 hover:text-white flex items-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" /> Limpiar
                        </Button>
                    </div>
                </form>
            )}

            {response && (
                <div
                    className="animate-fadeIn"
                    aria-live="polite"
                >
                    {/* NUEVO INPUT para nombre del chatbot */}
                    <ChatbotNameInput nameAssistant={nameAssistant} setNameAssistant={setNameAssistant} />

                    <div className="space-y-2">
                        {/* Uso del componente del objetivo */}
                        <ObjectiveCard intention={intention} />
                        
                        {/* Uso del componente de las instrucciones */}
                        <ChatbotInstructionsCard
                            response={response}
                            setResponse={setResponse}
                            responseRef={responseRef}
                            handleAutoResize={handleAutoResize}
                        />
                    </div>

                    {/* Botón personalizado */}
                    <div className="mt-2">
                        <SubmitButton
                            onClick={handleGenerateChatbot}
                            text="Generar Chatbot"
                            loadingText={
                                <span className="flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Generando...
                                </span>
                            }
                            size="lg"
                            fullWidth
                        />
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
}
