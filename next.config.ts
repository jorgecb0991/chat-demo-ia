// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Agrega la propiedad 'rewrites' como una función asíncrona
    async rewrites() {
        return [
            {
                source: '/settings.json', // El camino que tu código cliente solicita
                destination: 'http://localhost:5050/geofrontend/settings.json', // El destino real del geofrontend-server
            },
            // Puedes agregar más reglas de reescritura aquí si las necesitas
        ];
    },
};

export default nextConfig;