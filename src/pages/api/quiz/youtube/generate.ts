import type { NextApiRequest, NextApiResponse } from "next";
import { ENDPOINTS } from '@/lib/api/endpoints';
import { apiRequest } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';

interface QuizGenerateRequest {
    videoUrl: string;
    questionType: "multiple" | "short" | "mixed";
    numQuestions: number;
    instructions?: string;
    language: string;
    session_Id?: string;
    user_Id?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ 
            success: false,
            error: {
                code: 'METHOD_NOT_ALLOWED',
                message: 'Método no permitido'
            }
        });
    }

    try {
        const body: QuizGenerateRequest = req.body;

        // Llamar al backend Python
        // La función apiRequest ya maneja errores y devuelve una respuesta en el formato ApiResponse.
        const responseData: ApiResponse = await apiRequest(ENDPOINTS.quiz.youtube.generate, {
                method: 'POST',
                body: JSON.stringify(body)
            }
        );

        // ✨ Devolver la respuesta del backend directamente, sin volver a encapsularla.
        return res.status(200).json(responseData);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            error: {
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error interno al generar quiz',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            }
        });
    }
}
