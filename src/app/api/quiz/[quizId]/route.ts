import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/client";
import { ApiResponse } from '@/types/api';

/**
 * Endpoint de la API para obtener un quiz temporalmente del backend por su ID.
 *
 * En el App Router, las rutas dinámicas como [quizId] se manejan a través
 * del objeto 'params' en los argumentos de la función.
 * @param {Request} request - El objeto de la petición (automáticamente inyectado por Next.js).
 * @param {{ params: { quizId: string } }} { params } - Objeto que contiene los parámetros dinámicos de la URL.
 */
export async function GET(
    request: Request,
    { params }: { params: { quizId: string } }
) {
    try {
        const { quizId } = params;
        console.log(`Obteniendo quiz con ID: ${quizId}`);

        if (!quizId) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "BAD_REQUEST",
                    message: "Se requiere un 'quizId' válido en la URL."
                }
            }, { status: 400 });
        }

        // Llamar al endpoint del backend de Python para obtener el quiz.
        const responseData: ApiResponse = await apiRequest(`${ENDPOINTS.quiz.get}/${quizId}`, {
            method: "GET",
        });

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Error al obtener el quiz:", error);
        return NextResponse.json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error interno al obtener el quiz",
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            }
        }, { status: 500 });
    }
}
