"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

export default function CreateChatbotPage() {
  const [intention, setIntention] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const router = useRouter();

  const intentionRef = useRef<HTMLTextAreaElement>(null);
  const responseRef = useRef<HTMLTextAreaElement>(null);

  const handleAutoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

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
      const res = await fetch("/api/generate-instruction", {
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
      // Llamada a otro endpoint para generar el chatbot
      const res = await fetch("/api/send-message-chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: response , session_id: uuidv4() }),
      });

      if (!res.ok) throw new Error("Error al generar chatbot");
      // Obtener JSON de respuesta
      const content = await res.json();
      console.log("content:"+content)

      // Guardar message en localStorage
      if (content.data?.message) {
        localStorage.setItem("messageWelcome", content.data.message);
        localStorage.setItem("session_id",content.data.session_id);
      }

      // Redirigir después de crear el chatbot
      router.push("/qr");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al generar el chatbot.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div className="bg-white shadow-lg rounded-xl p-10 border border-gray-200">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Crear Chatbot</h1>
        <p className="text-gray-900 mb-8">
          Crea un chatbot personalizado según tus necesidades específicas e interacciones.
        </p>

        {!response && (
          <form onSubmit={handleCreate} className="space-y-6">
            <label htmlFor="intention" className="block font-semibold text-gray-800 mb-2">
              Ingresa las indicaciones del chatbot
            </label>
            <textarea
              ref={intentionRef}
              id="intention"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              required
              rows={1}
              placeholder="Describe el propósito, audiencia, tono, tareas clave y más..."
              className="w-full p-5 border border-gray-300 rounded-lg resize-none
                focus:outline-none focus:ring-3 focus:ring-blue-900 transition text-black overflow-hidden"
              disabled={loading}
              onInput={(e) => handleAutoResize(e.currentTarget)}
            />

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white py-3 px-7 rounded-lg
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Chatbot"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={loading && !intention.trim()}
                className="text-blue-900 border-blue-900 hover:bg-blue-900 hover:text-white"
              >
                Limpiar
              </Button>
            </div>
          </form>
        )}

        {response && (
          <div
            className="mt-10 bg-blue-50 border border-blue-900 rounded-xl p-8 shadow-md animate-fadeIn"
            aria-live="polite"
          >
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Objetivo Chatbot</h2>
                <p className="whitespace-pre-line text-gray-800">{intention}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">Instrucciones</h2>
                <textarea
                  ref={responseRef}
                  value={response}
                  readOnly={false}
                  className="w-full p-5 border border-gray-300 rounded-lg resize-none
                    focus:outline-none focus:ring-3 focus:ring-blue-900 bg-blue-50 text-black overflow-hidden"
                  onInput={(e) => handleAutoResize(e.currentTarget)}
                />
              </div>
            </div>

            {/* 🔹 Botón para generar chatbot y redirigir */}
            <div className="mt-8 flex gap-4">
              <Button
                onClick={handleGenerateChatbot}
                disabled={generating}
                className="bg-green-700 hover:bg-green-600 text-white w-full rounded-lg transition-colors py-3 px-7 "
              >
                {generating ? "Generando..." : "Generar Chatbot"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
