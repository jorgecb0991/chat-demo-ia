import { NextResponse } from "next/server";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/client";
import { Quiz } from "@/types/quiz";
import { ApiResponse } from '@/types/api';

/**
 * Maneja las peticiones POST para guardar un quiz temporalmente en el backend.
 *
 * En el App Router de Next.js, esta función es invocada automáticamente cuando
 * una solicitud POST llega a este endpoint.
 * @param {Request} request - El objeto de la petición (automáticamente inyectado por Next.js).
 */
export async function POST(request: Request) {
    try {
        const quiz: Quiz = await request.json();
        console.log(quiz);

        if (!quiz || !quiz.quizId) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "BAD_REQUEST",
                    message: "El body de la solicitud debe contener un objeto de quiz con un 'quizId'."
                }
            }, { status: 400 });
        }

        const responseData: ApiResponse = await apiRequest(ENDPOINTS.quiz.save, {
            method: "POST",
            body: JSON.stringify(quiz),
        });

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Error al guardar el quiz:", error);
        return NextResponse.json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error interno al guardar quiz",
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            }
        }, { status: 500 });
    }
}
