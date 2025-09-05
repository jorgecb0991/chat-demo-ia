"use client";

import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";
import { FileQuestion, QrCode } from "lucide-react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QRPage() {
  const router = useRouter();

  return (
    <DefaultLayout
      title="Tu Cuestionario está listo"
      titleIcon={<QrCode className="w-7 h-7 text-blue-900" />}
      description="Escanea el código QR o abre el chat directamente desde tu navegador."
    >
      <div className="flex flex-col items-center gap-6">
        {/* QR dentro de Card */}
        <Card className="p-6 border shadow-md rounded-xl bg-white gap-2">
          <CardContent className="flex justify-center">
            <QRCode value="https://utec.edu.pe" size={200} />
          </CardContent>
        </Card>

        {/* Texto */}
        <p className="text-center text-muted-foreground text-sm leading-relaxed max-w-sm">
          Escanea este código QR para acceder al chatbot desde tu dispositivo móvil.
        </p>

        {/* Botón estilizado con shadcn */}
        <Button
          onClick={() => router.push("/quiz/youtube/play")}
          className="bg-blue-900 hover:bg-blue-800 text-white gap-2"
        >
          <FileQuestion className="w-5 h-5" />
          Abrir Cuestionario
        </Button>
      </div>
    </DefaultLayout>
  );
}
