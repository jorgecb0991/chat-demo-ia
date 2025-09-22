import type { NextApiRequest, NextApiResponse } from "next";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/client";
import { Quiz } from "@/types/quiz";
import { ApiResponse } from '@/types/api';

/**
 * Endpoint de la API para guardar un quiz temporalmente en el backend.
 * Este endpoint recibe el objeto de quiz completo y lo envía al backend de Python.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    // Solo permitir solicitudes POST
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({
            success: false,
            error: {
                code: "METHOD_NOT_ALLOWED",
                message: "Método no permitido"
            }
        });
    }

    try {
        const quiz: Quiz = req.body;
        console.log(quiz);

        if (!quiz || !quiz.quizId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: "BAD_REQUEST",
                    message: "El body de la solicitud debe contener un objeto de quiz con un 'quizId'."
                }
            });
        }

        // Llamar al endpoint temporal del backend de Python para guardar el quiz
        // ⭐ Corregimos la llamada para usar la variable de endpoints
        const responseData: ApiResponse = await apiRequest(ENDPOINTS.quiz.save, {
            method: "POST",
            body: JSON.stringify(quiz),
        });

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Error al guardar el quiz:", error);
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error interno al guardar quiz",
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            }
        });
    }
}