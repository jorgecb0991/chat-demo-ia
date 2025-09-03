"use client";

import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { MessageSquare, QrCode } from "lucide-react";
import DefaultLayout from "@/components/layout/DefaultLayout";

export default function QRPage() {
  const router = useRouter();

  return (
    <DefaultLayout
      title="Tu Chatbot está listo"
      titleIcon={<QrCode className="w-7 h-7 text-blue-900" />}
      description="Escanea el código QR o abre el chat directamente desde tu navegador."
    >
      <div className="flex flex-col items-center gap-6">
        {/* QR con borde */}
        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-md">
          <QRCode value="https://utec.edu.pe" size={200} />
        </div>

        <p className="text-center text-gray-700 text-sm leading-relaxed max-w-sm">
          Escanea este código QR para acceder al chatbot desde tu dispositivo móvil.
        </p>

        {/* Botón estilizado */}
        <button
          onClick={() => router.push("/chat")}
          className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Abrir Chat
        </button>
      </div>
    </DefaultLayout>
  );
}
