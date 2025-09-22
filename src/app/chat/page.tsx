"use client";

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal, ChevronLeft } from "lucide-react";

type Role = "user" | "assistant";
type Msg = { id: string; role: Role; text: string };

function LoadingDots() {
    return (
        <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150" />
            <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300" />
            <style jsx>{`
                        .delay-150 { animation-delay: .15s; }
                        .delay-300 { animation-delay: .3s; }`}
            </style>
        </span>
    );
}

function Avatar({ role }: { role: Role }) {
    if (role === "assistant") {
        return (
            <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm bg-white border border-gray-300">
                <Image
                    src="/img/utechie-001.png"
                    alt="UTEC Logo"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                />
            </div>
        );
    }
    return (
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 text-white font-bold shadow-sm">
            U
        </div>
    );
}

function MessageBubble({ message }: { message: Msg }) {
    const isUser = message.role === "user";
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start`}>
            {!isUser && <div className="mr-3"><Avatar role="assistant" /></div>}
            <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap
                        ${isUser
                        ? "bg-blue-900 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"}`
                }
            >
                {message.text}
            </div>
            {isUser && <div className="ml-3"><Avatar role="user" /></div>}
        </div>
    );
}

export default function ChatPage() {
    let messageWelcome = localStorage.getItem("messageWelcome") || "Bienvenido";
    let assistant = localStorage.getItem("nameAssistant") || "Asistente";
    const [messages, setMessages] = useState<Msg[]>([
        { id: uuidv4(), role: "assistant", text: messageWelcome },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => localStorage.getItem("session_id") || uuidv4());
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const router = useRouter();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [input]);

    const pushMessage = (role: Role, text: string) =>
        setMessages((m) => [...m, { id: uuidv4(), role, text }]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userText = input.trim();
        pushMessage("user", userText);
        setInput("");
        setIsLoading(true);

        const assistantId = uuidv4();
        setMessages((m) => [...m, { id: assistantId, role: "assistant", text: "" }]);

        const ac = new AbortController();
        abortControllerRef.current = ac;

        try {
            const res = await fetch("/api/chatbot/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userText, session_id: sessionId }),
                signal: ac.signal,
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const content = await res.json();
            await streamTextIntoMessage(assistantId, content.data.message);
        } catch {
            setMessages((m) =>
                m.map((msg) =>
                    msg.id === assistantId
                        ? { ...msg, text: "Lo siento, ocurrió un error." }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const streamTextIntoMessage = (msgId: string, fullText: string) =>
        new Promise<void>((resolve) => {
            let idx = 0;
            const step = 30;
            const tick = () => {
                if (idx >= fullText.length) return resolve();
                idx += step;
                setMessages((m) =>
                    m.map((msg) =>
                        msg.id === msgId ? { ...msg, text: fullText.slice(0, idx) } : msg
                    )
                );
                setTimeout(tick, 35);
            };
            tick();
        });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading) handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Card className="mx-auto w-full max-w-3xl flex flex-col overflow-hidden py-0 gap-2">
                <CardHeader className="flex items-center justify-between gap-4 p-4 md:p-6 bg-gradient-to-r from-[#002C5B] to-[#006AB5] rounded-t-xl shadow-lg">
                    {/* Botón de volver con ícono y texto */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push("/chatbot")}
                        className="group p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                        aria-label="Volver"
                    >
                        <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    </Button>

                    {/* Contenedor central con la información del asistente */}
                    <div className="flex items-center gap-3 md:gap-4 flex-grow justify-center">
                        {/*
                            Usamos el componente 'Image' de Next.js con la ruta de archivo local.
                            Este código no funcionará en este entorno de desarrollo, pero
                            es el correcto para un proyecto de Next.js.
                        */}
                        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white shadow-md overflow-hidden">
                            <Image
                                src="/img/utechie-001.png"
                                alt="Logo de Utechi"
                                layout="fill"
                                objectFit="cover"
                                priority
                            />
                        </div>
                        {/* Nombre del asistente, en color blanco para un mejor contraste */}
                        <div className="text-center">
                            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide truncate">
                                {assistant}
                            </h1>
                            <p className="text-xs md:text-sm text-white/80">
                                Asistente Virtual UTEC
                            </p>
                        </div>
                    </div>

                    {/* Espacio reservado para centrar el nombre si no hay botón a la derecha */}
                    <div className="w-8"></div>
                </CardHeader>


                <CardContent className="flex-1 p-6">
                    <ScrollArea className="h-[65vh] pr-4">
                        <div className="space-y-6">
                            {messages.map((m) => (
                                <div key={m.id} className="animate-fade-in">
                                    <MessageBubble message={m} />
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="mr-3"><Avatar role="assistant" /></div>
                                    <div className="bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
                                        <LoadingDots />
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="bg-gray-50 border-t px-4 py-4">
                    <div className="flex gap-3 items-center w-full">
                        <Textarea
                            ref={inputRef}
                            placeholder="Escribe un mensaje..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            className="resize-none overflow-hidden"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-900 hover:bg-blue-800"
                            size="icon"
                        >
                            <SendHorizontal className="h-5 w-5" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <style jsx>{`
                    .animate-fade-in {
                        animation: fadeIn .18s ease-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(6px); }
                        to { opacity: 1; transform: translateY(0); }`
            }
            </style>
        </div>
    );
}
