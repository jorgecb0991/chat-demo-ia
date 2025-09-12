import { QuizEvaluationResult } from "@/types/quiz";

// @ts-ignore
export const quizMock: QuizEvaluationResult = {
    "feedback": "Buen trabajo. Algunas respuestas podrían ser un poco más completas.",
    "questions": [
        {
            "correct": false,
            "feedback": "Incompleto. Si bien identificaste al creador, faltó mencionar su propósito original.",
            "questionId": 1,
            "score": 0.5
        },
        {
            "correct": true,
            "feedback": "Correcto.",
            "questionId": 2,
            "score": 1
        },
        {
            "correct": true,
            "feedback": "Correcto.",
            "questionId": 3,
            "score": 1
        },
        {
            "correct": false,
            "feedback": "Incompleto. Mencionaste la seguridad, pero faltó especificar que valida la identidad del sitio y cifra la comunicación.",
            "questionId": 4,
            "score": 0.5
        },
        {
            "correct": true,
            "feedback": "Correcto, aunque la redacción podría ser más clara.",
            "questionId": 5,
            "score": 1
        }
    ],
    "quizId": "quiz_60606AHuq8c_ae89277b",
    "studentName": "Alumno",
    "totalScore": 80
}
