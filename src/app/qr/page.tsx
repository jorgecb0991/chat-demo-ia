"use client";

import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function QRPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
      {/* Contenedor del botón y QR */}
      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        {/* Botón encima del QR */}
        <button
          onClick={() => router.push("/chat-message")}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
        >
          Abrir chat
        </button>

        {/* QR */}
        <QRCode value="https://utec.edu.pe" size={200} />
        <p className="mt-2 text-center text-gray-700 font-medium">
          Escanea este código QR
        </p>
      </div>
    </div>
  );
}
