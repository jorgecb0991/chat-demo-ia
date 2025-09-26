"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginPage() {
    const handleGoogle = () => {
        window.location.href = "/api/auth/login";
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl shadow-xl rounded-2xl p-6 md:p-10 backdrop-blur-sm bg-white/80">
                <CardHeader className="text-center">
                    {/* Nueva sección: La imagen del robot */}
                    <img 
                        src="/img/utechie-graduado.png"
                        alt="UTEC Coach - Robot Graduado"
                        className="w-24 h-auto mx-auto mb-4" 
                    />
                    
                    <CardTitle className="text-3xl md:text-4xl font-bold">Bienvenido a UTEC Coach</CardTitle>
                    <CardDescription className="mt-2 text-gray-700 text-base md:text-lg">
                        Inicia sesión con tu cuenta de Google
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 mt-6">
                    <Button
                        onClick={handleGoogle}
                        className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:bg-gray-100 text-lg md:text-xl py-4"
                    >
                        <LogIn size={28} />
                        Continuar con Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}