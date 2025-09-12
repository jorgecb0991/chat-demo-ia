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
import { MessageSquarePlus, RefreshCw, Sparkles, Loader2, Type, Code, Target, ListChecks } from "lucide-react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import SubmitButton from "@/components/common/SubmitButton"

export default function CreateChatbotPage() {
    const [intention, setIntention] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [nameAssistant, setNameAssistant] = useState("");

    const router = useRouter();

    const intentionRef = useRef<HTMLTextAreaElement>(null);
    const responseRef = useRef<HTMLTextAreaElement>(null);

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
        setResponse(null);

        try {
            const res = await fetch("/api/chatbot/instruction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ intention }),
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
        setResponse(null);
    };

    const handleGenerateChatbot = async () => {
        if (!response) return;
        setGenerating(true);

        try {
            const res = await fetch("/api/chatbot/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: response, session_id: uuidv4() }),
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
            loadingMessage="Generando Chatbot..."
            loadingIcon={<Loader2 className="w-12 h-12 animate-spin text-blue-500" />}
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
                        rows={1}
                        placeholder="Ejemplo: 'Chatbot para responder dudas sobre admisión de UTEC, tono formal, breve y preciso...'"
                        className="w-full p-5 border border-gray-300 rounded-lg resize-none
                                    focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 
                                    hover:border-blue-500 text-black overflow-hidden"
                        disabled={loading}
                        onInput={(e) => handleAutoResize(e.currentTarget)}
                    />

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
                    <Card className="mb-2 p-6 shadow-md gap-2">
                        <div className="space-y-3">
                            <Label
                                htmlFor="chatbot-name"
                                className="flex items-center gap-2 font-semibold text-blue-900"
                            >
                                <Type className="w-5 h-5" />
                                Nombre del Chatbot
                            </Label>
                            <Input
                                id="chatbot-name"
                                type="text"
                                value={nameAssistant}
                                onChange={(e) => setNameAssistant(e.target.value)}
                                placeholder="Ejemplo: Asistente de Admisión UTEC"
                                className="text-black"
                            />
                        </div>
                    </Card>

                    <div className="space-y-2">
                        {/* Objetivo */}
                        <Card className="p-6 shadow-sm gap-2">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-900 mb-3">
                                <Target className="w-5 h-5" />
                                Objetivo del Chatbot
                            </h2>
                            <p className="whitespace-pre-line text-gray-800">{intention}</p>
                        </Card>

                        {/* Instrucciones */}
                        <Card className="p-6 shadow-sm gap-2">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-blue-900 mb-3">
                                <ListChecks className="w-5 h-5" />
                                Instrucciones
                            </h2>
                            <Textarea
                                ref={responseRef}
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                className="min-h-[150px] resize-none text-black"
                                onInput={(e) => handleAutoResize(e.currentTarget)}
                            />
                        </Card>
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
                            baseColor="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:opacity-90"
                            fullWidth
                        />
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
}
