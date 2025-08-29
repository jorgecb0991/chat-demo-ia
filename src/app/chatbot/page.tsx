"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { MessageSquarePlus, RefreshCw, Bot, Sparkles, Loader2, Type } from "lucide-react";

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

      if (!res.ok) throw new Error("Error al crear chatbot");

      const resultado = await res.json();
      setResponse(resultado.data.instruction || "No hay respuesta del servidor.");
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

      router.push("/qr");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al generar el chatbot.");
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 font-sans relative">
      {/* Overlay de carga bloqueando pantalla */}
      {generating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
            <p className="text-blue-900 font-semibold">Generando Chatbot...</p>
          </div>
        </div>
      )}

      <div className="bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-4">
          <Bot className="w-10 h-10 text-blue-900" />
          <h1 className="text-4xl font-bold text-blue-900">Crear Chatbot</h1>
        </div>
        <p className="text-gray-700 mb-8">
          Diseña un chatbot personalizado con instrucciones claras y adaptadas a tus necesidades.
        </p>

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
            className="mt-10 bg-blue-50 border border-blue-900 rounded-xl p-8 shadow-lg animate-fadeIn"
            aria-live="polite"
          >
            {/* NUEVO INPUT para nombre del chatbot */}
            <div className="mb-8">
              <label className="block font-semibold text-gray-800 mb-2">
                <Type className="inline w-5 h-5 mr-2 text-blue-900" />
                Nombre del Chatbot
              </label>
              <input
                type="text"
                value={nameAssistant}
                onChange={(e) => setNameAssistant(e.target.value)}
                placeholder="Ejemplo: Asistente de Admisión UTEC"
                className="w-full p-4 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-600 
                  hover:border-blue-500 text-black transition-all duration-300"
              />
            </div>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">🎯 Objetivo Chatbot</h2>
                <p className="whitespace-pre-line text-gray-800">{intention}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">📋 Instrucciones</h2>
                <textarea
                  ref={responseRef}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="w-full p-5 border border-gray-300 rounded-lg resize-none
                    focus:outline-none focus:ring-2 focus:ring-blue-600 bg-blue-50 text-black overflow-hidden transition-all duration-300 hover:border-blue-500"
                  onInput={(e) => handleAutoResize(e.currentTarget)}
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handleGenerateChatbot}
                disabled={generating}
                className="bg-green-700 hover:bg-green-600 text-white w-full rounded-lg transition-colors py-3 px-7 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Generando...
                  </>
                ) : (
                  <>
                    <Bot className="w-5 h-5" /> Generar Chatbot
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
