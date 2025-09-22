import Image from "next/image";
import { Button } from "@/components/ui/button"; // Asume que Button está en esta ruta

// Definición de colores UTEC para clases de Tailwind personalizadas
// Nota: Deberás asegurarte de que estos colores estén definidos en tu archivo tailwind.config.js
// como un tema extendido para que las clases 'utec-principal' o 'utec-cyan' funcionen.
// Por ahora, usamos clases 'custom' con colores inline para el degradado.
const UTEC_PRIMARY_BLUE = "#002C5B"; // Azul Principal
const UTEC_CYAN = "#00A3D7"; // Cyan

export default function Home() {
  return (
    // Contenedor principal: Centrado, altura completa, dark mode con fondo neutro.
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-foreground transition-colors duration-500">
      
      {/* Contenido Principal: Centrado y con espacio para respirar */}
      <main className="flex flex-col gap-8 max-w-xl w-full">

        {/* *** SECCIÓN DE IMAGEN MODIFICADA ***
          
          1. Se retira el borde para que el banner se vea más limpio.
          2. Se aumentan width y height (ejemplo: 400x150, ajústalos según la proporción de tu banner).
          3. Se añade la clase 'object-contain' para evitar distorsión.
          4. Se añade 'w-full' y 'h-auto' para que sea responsive.
        */}
        <div className="mx-auto mb-4 w-full max-w-md"> 
          <Image
            src="/img/utechie-banner.png"
            alt="Ilustración o Banner de UTEC Coach"
            width={400} // Valor base para el componente Image (ajusta a la proporción real)
            height={150} // Valor base para el componente Image (ajusta a la proporción real)
            priority
            className="mx-auto w-full h-auto object-contain" // **CLASES CLAVE AÑADIDAS**
          />
        </div>

        {/* Título Elegante y Colaborativo (El toque de 'IA' y 'apoyo') */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none">
          {/* Degradado de UTEC (Azul Principal a Cyan) */}
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

        {/* Subtítulo Inspirador y Bonito */}
        <p className="text-xl sm:text-2xl font-light text-muted-foreground mt-4 max-w-lg mx-auto">
          Potenciamos tu visión docente con **Inteligencia Artificial**. Una plataforma ágil, elegante y poderosa para **transformar tu contenido educativo**.
        </p>

        {/* Botón CTA (Comenzar el 'Slide' o Tutorial) */}
        <div className="mt-8">
          <Button 
            asChild
            size="lg"
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            // Estilo personalizado para usar el Azul Principal de UTEC
            style={{ 
              backgroundColor: UTEC_PRIMARY_BLUE, 
              borderColor: UTEC_PRIMARY_BLUE,
              color: 'white' // Aseguramos que el texto sea blanco para contrastar
            }}
          >
            <a href="/slide">
              Iniciar Tour Guiado →
            </a>
          </Button>
        </div>
      </main>
      
      {/* Pie de página muy discreto */}
      <footer className="absolute bottom-4 text-sm text-muted-foreground opacity-70">
        Una herramienta exclusiva para profesores de la Universidad de Tecnología e Ingeniería.
      </footer>
    </div>
  );
}