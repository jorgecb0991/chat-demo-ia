import type { NextApiRequest, NextApiResponse } from "next";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/client";
import {
    Quiz,
    QuizQuestion,
    QuizEvaluationResult,
    StudentAnswer
} from "@/types/quiz";
import { ApiResponse } from '@/types/api';

// Definimos los tipos de las respuestas del alumno que esperamos del frontend
interface StudentAnswers {
    [questionId: number]: StudentAnswer;
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
                code: "METHOD_NOT_ALLOWED",
                message: "Método no permitido"
            }
        });
    }

    try {
        // La propiedad 'answers' ahora se tipa correctamente
        const { quiz, answers }: { quiz: Quiz; answers: StudentAnswers } = req.body;

        const evaluationQuestions = quiz.questions.map((q: QuizQuestion) => {
            // Se usa directamente el objeto de respuesta del alumno que viene del frontend
            const studentAnswer = answers[q.questionId];

            // Construimos el objeto de la pregunta para el payload de la API
            return {
                questionId: q.questionId,
                type: q.type,
                questionText: q.questionText,
                options: q.options,
                suggestedAnswer: q.suggestedAnswer,
                explanation: q.explanation,
                studentAnswer: studentAnswer,
            };
        });

        const requestBody = {
            quizId: quiz.quizId,
            studentName: quiz.studentName || "Alumno",
            questions: evaluationQuestions,
            session_id:"1096227936299646976",
            user_id:"jorge"
        };

        const responseData: ApiResponse = await apiRequest(ENDPOINTS.quiz.evaluate, {
            method: "POST",
            body: JSON.stringify(requestBody),
        });

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Error en evaluate:", error);
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error interno al evaluar quiz",
                details: process.env.NODE_ENV === 'development' ? error : undefined
            }
        });
    }
}
