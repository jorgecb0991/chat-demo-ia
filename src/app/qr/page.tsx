"use client";

import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { MessageSquare, QrCode } from "lucide-react";

export default function QRPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 text-gray-900 flex flex-col items-center justify-center font-sans p-6">
      {/* Card central */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center gap-6 animate-fadeIn max-w-md w-full">
        {/* Icono QR */}
        <div className="flex items-center gap-3">
          <QrCode className="w-8 h-8 text-blue-900" />
          <h1 className="text-2xl font-bold text-blue-900">Tu Chatbot está listo</h1>
        </div>

        {/* QR con borde */}
        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
          <QRCode value="https://utec.edu.pe" size={200} />
        </div>

        <p className="text-center text-gray-700 text-sm leading-relaxed">
          Escanea este código QR para acceder al chatbot desde tu dispositivo móvil.
        </p>

        {/* Botón estilizado */}
        <button
          onClick={() => router.push("/chat-message")}
          className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Abrir Chat
        </button>
      </div>
    </div>
  );
}
