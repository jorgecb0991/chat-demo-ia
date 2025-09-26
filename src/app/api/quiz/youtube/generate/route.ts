import { NextResponse } from "next/server";
import { ENDPOINTS } from '@/lib/api/endpoints';
import { apiRequest } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';

// Define la estructura del cuerpo de la petición para una tipificación clara
interface QuizGenerateRequest {
    videoUrl: string;
    questionType: "multiple" | "short" | "mixed";
    numQuestions: number;
    instructions?: string;
    language: string;
    session_Id?: string;
    user_Id?: string;
}

/**
 * Maneja las peticiones POST para la ruta /api/quiz/youtube/generate.
 *
 * En Next.js App Router, el objeto de la petición (Request) es el primer argumento,
 * y se obtiene el cuerpo usando request.json().
 * @param {Request} request - El objeto de la petición (automáticamente inyectado por Next.js).
 */
export async function POST(request: Request) {
    try {
        // Obtener el cuerpo de la petición en formato JSON
        const body: QuizGenerateRequest = await request.json();

        // Llamar al backend Python
        const responseData: ApiResponse = await apiRequest(ENDPOINTS.quiz.youtube.generate, {
            method: 'POST',
            body: JSON.stringify(body)
        });

        // Devolver la respuesta del backend directamente, usando NextResponse.
        // No es necesario un status 200 explícito si la operación fue exitosa,
        // ya que NextResponse.json() devuelve un 200 por defecto.
        return NextResponse.json(responseData);

    } catch (error) {
        console.error("Error al procesar la petición POST:", error);
        
        // Devolver un error con un estado HTTP 500 y un cuerpo JSON bien definido
        return NextResponse.json({
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno al generar el quiz',
                details: process.env.NODE_ENV === 'development' ? JSON.stringify(error) : undefined
            }
        }, { status: 500 });
    }
}
