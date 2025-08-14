"use client";

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        .delay-300 { animation-delay: .3s; }
      `}</style>
    </span>
  );
}

function Avatar({ role }: { role: Role }) {
  if (role === "assistant") {
    return (
      <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm bg-white border border-gray-300">
        <Image
          src="/img/UTEC-Logo.jpg"
          alt="UTEC Logo"
          width={36}
          height={36}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }else {
    // Avatar para usuario
    return (
      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-800 text-white font-bold shadow-sm">
        U
      </div>
    );
  }
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
            : "bg-gray-100 text-gray-900 rounded-bl-sm"}
        `}
      >
        {message.text}
      </div>
      {isUser && <div className="ml-3"><Avatar role="user" /></div>}
    </div>
  );
}

export default function ChatPage() {
  let messageWelcome = localStorage.getItem("messageWelcome")||"Bienvenido";
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: uuidv4(),
      role: "assistant",
      text: messageWelcome
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem("session_id")||uuidv4());
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
      const res = await fetch("/api/send-message-chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, session_id:sessionId }),
        signal: ac.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const content = await res.json();
      console.log("content:"+content)
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
      <div className="mx-auto w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        {/* header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <img
              src="/img/UTEC-Logo.jpg"
              alt="Logo"
              className="w-10 h-10 rounded-md object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Asistente</h1>
              <p className="text-xs text-gray-500">Sesión {sessionId}</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/chatbot")}
            className="text-sm px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Volver
          </button>
        </div>

        {/* chat */}
        <div className="flex-1 p-6 overflow-auto space-y-6 bg-white">
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

        {/* input */}
        <div className="border-t px-4 py-4 bg-gray-50">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              placeholder="Escribe un mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 resize-none overflow-hidden p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white text-black"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white shadow-sm ${
                isLoading || !input.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 hover:bg-blue-800"
              }`}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn .18s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
