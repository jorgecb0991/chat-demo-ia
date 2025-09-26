import Image from "next/image";
import { Button } from "@/components/ui/button";

// Colores corporativos UTEC
const UTEC_PRIMARY_BLUE = "#002C5B"; // Azul Principal
const UTEC_CYAN = "#00A3D7"; // Cyan

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center text-foreground transition-colors duration-500">

            {/* Contenido Principal */}
            <main className="flex flex-col gap-8 max-w-xl w-full">
                {/* Banner */}
                <div className="mx-auto mb-4 w-full max-w-md">
                    <Image
                        src="/img/utechie-banner.png"
                        alt="Ilustración o Banner de UTEC Coach"
                        width={400}
                        height={150}
                        priority
                        className="mx-auto w-full h-auto object-contain"
                    />
                </div>

                {/* Título */}
                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none">
                    <span
                        className="bg-clip-text text-transparent"
                        style={{
                            backgroundImage: `linear-gradient(to right, ${UTEC_PRIMARY_BLUE}, ${UTEC_CYAN})`
                        }}
                    >
                        UTEC Coach.
                    </span>
                    <br className="block sm:hidden" />
                    ¿Creamos juntos?
                </h1>

                {/* Subtítulo */}
                <p className="text-xl sm:text-2xl font-light text-muted-foreground mt-4 max-w-lg mx-auto">
                    Potenciamos tu visión docente con <strong>Inteligencia Artificial</strong>.
                    Una plataforma ágil, elegante y poderosa para <strong>transformar tu contenido educativo</strong>.
                </p>

                {/* Botón CTA */}
                <div className="mt-8">
                    <Button
                        asChild
                        size="lg"
                        className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                        style={{
                            backgroundColor: UTEC_PRIMARY_BLUE,
                            borderColor: UTEC_PRIMARY_BLUE,
                            color: "white"
                        }}
                    >
                        <a href="/slide">
                            Iniciar Tour Guiado →
                        </a>
                    </Button>
                </div>
            </main>

            {/* Footer */}
            <footer className="absolute bottom-4 text-sm text-muted-foreground opacity-70">
                Una herramienta exclusiva para profesores de la Universidad de Tecnología e Ingeniería.
            </footer>
        </div>
    );
}
