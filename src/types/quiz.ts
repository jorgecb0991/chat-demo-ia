// Tipos para las respuestas del alumno
export interface StudentMultipleChoiceAnswer {
    optionId: number;
}

export interface StudentShortAnswer {
    text: string;
}

export type StudentAnswer = StudentMultipleChoiceAnswer | StudentShortAnswer;

// Tipos para las opciones de preguntas
export interface QuizQuestionOption {
    optionId: number;
    text: string;
    isCorrect?: boolean;
}

// Tipo base para cualquier pregunta de un quiz, ahora con la respuesta del alumno
export interface QuizQuestionBase {
    questionId: number;
    order: number;
    type: "multiple" | "short" | "mixed";
    questionText: string;
    suggestedAnswer?: string;
    explanation?: string;
    options?: QuizQuestionOption[];
    studentAnswer?: StudentAnswer; // Campo unificado para la respuesta del alumno
}

export type QuizQuestion = QuizQuestionBase;

// Tipo para los metadatos del video
export interface QuizMetadata {
    videoId: string;
    videoThumbnail?: string;
    channelTitle?: string;
    tags?: string[];
    views?: string;
    publishedAt?: string;
    publishedAgo?: string;
    channelName?: string;
    channelAvatar?: string;
    likes?: string;
    comments?: string;
    duration?: string;
    videoTitle?: string;
    description?: string;
}

// El modelo completo del cuestionario (unificado)
export interface Quiz {
    quizId: string;
    title?: string;
    description?: string;
    videoUrl: string;
    language: string;
    academicLevel?: string;
    instructions?: string;
    questions: QuizQuestion[];
    metadata?: QuizMetadata;
    studentName?: string;
}

// Tipos para el resultado de la evaluación
export interface QuestionEvaluationResult {
    questionId: number;
    correct: boolean;
    feedback?: string;
    score: number;
}

export interface QuizEvaluationResult {
    quizId: string;
    studentName: string;
    totalScore: number;
    feedback: string;
    questions: QuestionEvaluationResult[];
}
