import type { NextApiRequest, NextApiResponse } from "next";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/client";
import { ApiResponse } from '@/types/api';

/**
 * Endpoint de la API para obtener un quiz temporalmente del backend por su ID.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({
            success: false,
            error: {
                code: "METHOD_NOT_ALLOWED",
                message: "Método no permitido"
            }
        });
    }

    try {
        const { quizId } = req.query;
        console.log(quizId)

        if (!quizId || typeof quizId !== 'string') {
            return res.status(400).json({
                success: false,
                error: {
                    code: "BAD_REQUEST",
                    message: "Se requiere un 'quizId' válido en la URL."
                }
            });
        }

        // Llamar al endpoint temporal del backend de Python para obtener el quiz
        const responseData: ApiResponse = await apiRequest(`${ENDPOINTS.quiz.get}/${quizId}`, {
            method: "GET",
        });

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Error al obtener el quiz:", error);
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error interno al obtener el quiz",
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            }
        });
    }
}
