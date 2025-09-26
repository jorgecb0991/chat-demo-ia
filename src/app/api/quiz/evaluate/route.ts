import { NextResponse } from "next/server";
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

/**
 * Maneja las peticiones POST para evaluar un quiz en el backend.
 *
 * Esta función se invoca automáticamente cuando una solicitud POST llega
 * al endpoint /api/quiz/evaluate.
 * @param {Request} request - El objeto de la petición (automáticamente inyectado por Next.js).
 */
export async function POST(request: Request) {
    try {
        // Obtener el cuerpo de la petición en formato JSON
        const { quiz, answers }: { quiz: Quiz; answers: StudentAnswers } = await request.json();

        // Validar que se recibieron los datos necesarios
        if (!quiz || !answers) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "BAD_REQUEST",
                    message: "El cuerpo de la solicitud debe contener los objetos 'quiz' y 'answers'."
                }
            }, { status: 400 });
        }

        const evaluationQuestions = quiz.questions.map((q: QuizQuestion) => {
            const studentAnswer = answers[q.questionId];

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
            sessionId: "1096227936299646976", // Considera hacer esto dinámico
            userId: "jorge" // Considera hacer esto dinámico
        };

        const responseData: ApiResponse = await apiRequest(ENDPOINTS.quiz.evaluate, {
            method: "POST",
            body: JSON.stringify(requestBody),
        });

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Error en evaluate:", error);
        return NextResponse.json({
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error interno al evaluar quiz",
                details: process.env.NODE_ENV === 'development' ? JSON.stringify(error) : undefined
            }
        }, { status: 500 });
    }
}
