// app/pages/api/quiz/generate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ENDPOINTS } from '@/lib/api/endpoints';
import { apiRequest } from '@/lib/api/client';

interface QuizGenerateRequest {
    videoUrl: string;
    questionType: "multiple" | "short" | "mixed";
    numQuestions: number;
    instructions?: string;
    academicLevel?: string;
    language: string;
    sessionId?: string;
    userId?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Método no permitido" });
    }

    try {
        const body: QuizGenerateRequest = req.body;

        // Llamar al backend Python
        const data = await apiRequest(ENDPOINTS.quiz.youtube.generate, {
                method: 'POST',
                body: JSON.stringify(body)
            }
        );

        return res.status(200).json({ data });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error interno al generar quiz" });
    }
}
