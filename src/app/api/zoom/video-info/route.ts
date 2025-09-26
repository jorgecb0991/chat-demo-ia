import { NextResponse } from "next/server";
import { ApiResponse } from '@/types/api';

// Definimos la estructura de datos que esperamos devolver para el video de Zoom
export interface ZoomVideoInfo {
    title: string;
    playUrl: string; // La URL de reproducción/compartir que usarás
    date: string;
    // Podrías añadir más: duration, thumbnailPlaceholder, etc.
}

/**
 * Maneja las peticiones POST para buscar información de un video de Zoom.
 *
 * @param {Request} request - El objeto de la petición de Next.js.
 */
export async function POST(request: Request) {
    try {
        const { url }: { url: string } = await request.json();

        // 1. Validación de URL
        if (!url || !url.includes("zoom.us")) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "INVALID_URL",
                    message: "La URL proporcionada no parece ser un enlace de Zoom válido."
                }
            }, { status: 400 });
        }
        
        // --- SIMULACIÓN DE LLAMADA A TU BACKEND O LÓGICA DE OBTENCIÓN DE DATOS ---
        // En una implementación real, aquí llamarías a tu backend (apiRequest) 
        // para que éste use la API de Zoom con autenticación y obtenga los datos.
        
        // Datos Ficticios para la simulación
        const mockVideoInfo: ZoomVideoInfo = {
            title: "Proyecto Final de Ingeniería Civil II - CI5006 - TEORÍA VIRTUAL - 2 - 11:00 - 13:00",
            playUrl: "https://utec.zoom.us/rec/play/2oxrU3b3OKYdCaNhc5R-WvooTVU3pHUJpZBVInmjHy9Wn8vLT95GxAlkaM_2wx30TpAx9nmp-luz5f8S.UlJJ-UcPoRpqBsU-", // Usamos la misma URL como URL de reproducción/compartir
            date: "2025-09-25",
        };

        const responseData: ApiResponse<ZoomVideoInfo> = {
            success: true,
            data: mockVideoInfo,
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error("Error en /api/zoom/video-info:", error);
        return NextResponse.json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error interno al procesar la solicitud de video de Zoom",
                details: process.env.NODE_ENV === 'development' ? JSON.stringify(error) : undefined
            }
        }, { status: 500 });
    }
}