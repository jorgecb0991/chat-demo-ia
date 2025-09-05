"use client";

import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { MessageSquare, QrCode } from "lucide-react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QRPage() {
  const router = useRouter();

  return (
    <DefaultLayout
      title="Tu Chatbot está listo"
      titleIcon={<QrCode className="w-7 h-7 text-blue-900" />}
      description="Escanea el código QR o abre el chat directamente desde tu navegador."
    >
      <div className="flex flex-col items-center gap-6">
        {/* QR dentro de Card */}
        <Card className="shadow-md gap-2">
          <CardContent className="flex items-center justify-center p-6">
            <QRCode value="https://utec.edu.pe" size={200} />
          </CardContent>
        </Card>

        {/* Texto descriptivo */}
        <p className="text-center text-muted-foreground text-sm leading-relaxed max-w-md">
          Escanea este código QR para acceder al chatbot desde tu dispositivo móvil.
        </p>

        {/* Botón estilizado con shadcn */}
        <Button
          onClick={() => router.push("/chat")}
          size="lg"
          className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-white flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Abrir Chat
        </Button>
      </div>
    </DefaultLayout>
  );
}
