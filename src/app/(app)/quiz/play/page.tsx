"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useSearchParams, useRouter } from "next/navigation";
import DefaultLayout from "@/components/layout/DefaultLayout";
import { BookOpenCheck, RefreshCw } from "lucide-react";
import VideoHeaderCard from "@/components/features/video/VideoHeaderCard";
import SourceHeaderCard from "@/components/features/quiz/SourceHeaderCard";
import { useState, useEffect } from "react";
import QuestionCard from "@/components/features/quiz/QuestionCard";
import { Separator } from "@/components/ui/separator";
import SubmitButton from "@/components/custom/SubmitButton";
import ResultCard from "@/components/features/quiz/ResultCard";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
    QuizEvaluationResult,
    QuestionEvaluationResult,
    QuizQuestionOption,
    StudentAnswer,
    StudentMultipleChoiceAnswer
} from "@/types/quiz";
import { quizMock } from "@/mocks/quizMocks";
import {ApiResponse} from "@/types/api"
import { Quiz } from "@/types/quiz";     

export default function PlayQuizPage() {
    const dispatch = useAppDispatch();
    //const quiz = useAppSelector((state) => state.quiz.current);
    const searchParams = useSearchParams();
    const sourceType = searchParams?.get("sourceType");
    const quizId = searchParams?.get("quizId");
    // Nuevo estado para el quiz y el estado de carga
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loadingQuiz, setLoadingQuiz] = useState<boolean>(true);
    //const quiz = quizMock;

    // El estado 'answers' ahora almacena el objeto StudentAnswer
    const [answers, setAnswers] = useState<Record<number, StudentAnswer>>({});
    const [evaluationResult, setEvaluationResult] = useState<QuizEvaluationResult | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const { width, height } = useWindowSize();

    // La función handleAnswer ahora acepta el objeto StudentAnswer
    const handleAnswer = (questionId: string | number, answer: StudentAnswer) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!quizId) {
                console.error("No se encontró quizId en la URL.");
                setLoadingQuiz(false);
                return;
            }

            try {
                const response = await fetch(`/api/quiz/${quizId}`);
                const content: ApiResponse = await response.json();
                if (response.ok && content.success && content.data?.quiz) {
                    setQuiz(content.data.quiz);
                } else {
                    console.error("Error al obtener el quiz:", content.error?.message || "Error desconocido");
                }
            } catch (error) {
                console.error("Error de red al obtener el quiz:", error);
            } finally {
                setLoadingQuiz(false);
            }
        };

        fetchQuiz();
    }, [quizId]); // Dependencia del quizId en la URL

    //Evaluación
    /**
     * Evalúa localmente un quiz de opción múltiple.
     * @returns Un objeto de tipo QuizEvaluationResult.
     */
    const evaluateMultipleChoiceQuiz = (): QuizEvaluationResult => {
        let correctCount = 0;
        const evaluatedQuestions: QuestionEvaluationResult[] = [];

        quiz?.questions.forEach((q) => {
            const studentAnswer = answers[q.questionId];
            let isCorrect = false;

            // Validar que la respuesta sea de tipo StudentMultipleChoiceAnswer
            if (studentAnswer && "optionId" in studentAnswer) {
                const mcqOptions: QuizQuestionOption[] | undefined = q.options; // Safely access options
                const correctOption = mcqOptions?.find((opt) => opt.isCorrect);

                isCorrect = (studentAnswer as StudentMultipleChoiceAnswer).optionId === correctOption?.optionId;
            }

            if (isCorrect) {
                correctCount++;
            }

            evaluatedQuestions.push({
                questionId: q.questionId,
                correct: isCorrect,
                feedback: isCorrect ? "Respuesta correcta." : "Respuesta incorrecta.",
                score: isCorrect ? 10 : 0,
            });
        });

        const totalScore = quiz && quiz.questions.length > 0 ?
            Math.round((correctCount / quiz.questions.length) * 100) : 0;

        return {
            quizId: quiz?.quizId || "",
            studentName: quiz?.studentName || "Alumno",
            totalScore: totalScore,
            feedback: totalScore >= 50 ? "¡Felicitaciones! 🎉" : "Sigue practicando 💪",
            questions: evaluatedQuestions,
        };
    };
    const evaluateWithAgent = async (): Promise<QuizEvaluationResult | null> => {
        try {
            const response = await fetch("/api/quiz/evaluate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quiz, answers }),
            });
            
            // ✨ Leer la respuesta una sola vez
            const content: ApiResponse = await response.json();
    
            // ✨ Lógica unificada para manejar éxito y errores
            if (!response.ok || !content.success) {
                const errorMessage = content.error?.message || "Error al evaluar con agente.";
                throw new Error(errorMessage);
            }

            // ✨ Acceder al resultado desde la propiedad 'data'
            const result: QuizEvaluationResult = content?.data?.evaluation;

            if (result) {
                return result;
            } else {
                throw new Error("Respuesta inesperada del servidor: 'evaluation' no encontrado.");
            }
        } catch (error) {
            console.error("Error al evaluar con agente:", error);
            // Manejar el error y retornar null para el caso de falla
            return null;
        }
    };

    //Detectar si todas son de opción múltiple
    const isAllMultipleChoice = () =>
        quiz?.questions.every((q) => q.type === "multiple") ?? false;

    //Manejar envío
    const handleSubmit = async () => {
        await new Promise((r) => setTimeout(r, 1000));

        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            setEvaluationResult({
                quizId: quiz?.quizId || "",
                studentName: quiz?.studentName || "Jorge",
                totalScore: 0,
                feedback: "No hay preguntas para evaluar.",
                questions: [],
            });
            return;
        }

        let evaluationData: QuizEvaluationResult | null = null;

        if (isAllMultipleChoice()) {
            evaluationData = evaluateMultipleChoiceQuiz();
        } else {
            evaluationData = await evaluateWithAgent();
        }

        if (evaluationData) {
            //Normalización del score en el frontend
            if (evaluationData.totalScore <= 1) {
                evaluationData.totalScore = Math.round(evaluationData.totalScore * 100);
            }

            setEvaluationResult(evaluationData);
            if (evaluationData.totalScore >= 50) {
                setShowConfetti(true);
            }
        } else {
            setEvaluationResult({
                quizId: quiz?.quizId || "",
                studentName: quiz?.studentName || "Jorge",
                totalScore: 0,
                feedback: "Error al evaluar el cuestionario.",
                questions: [],
            });
        }
    };


    //Auto-apagar confeti después de 5 segundos
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 10000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    // Use evaluationResult to render content
    const totalCorrect = evaluationResult && evaluationResult.questions
        ? evaluationResult.questions.filter((q) => q.correct).length
        : 0;

    const totalIncorrect = evaluationResult && evaluationResult.questions
        ? evaluationResult.questions.filter((q) => !q.correct).length
        : 0;

    const header = sourceType == "youtube" ? (
        <VideoHeaderCard
            thumbnail={quiz?.metadata?.videoThumbnail || ""}
            videoTitle={quiz?.metadata?.videoTitle || ""}
            description={quiz?.description || ""}
            duration={quiz?.metadata?.duration || ""}
            publishedAgo={quiz?.metadata?.publishedAgo || ""}
            views={quiz?.metadata?.views || ""}
            channelName={quiz?.metadata?.channelName || ""}
            channelAvatar={quiz?.metadata?.channelAvatar || ""}
            videoUrl={quiz?.videoUrl || ""}
        />
    ) : (
        <SourceHeaderCard
            sourceType={sourceType as any}
            title={quiz?.title}
            description={quiz?.description}
        />
    );

    return (
        <DefaultLayout
            title="Cuestionario"
            titleIcon={<BookOpenCheck className="w-6 h-6" />}
        >
            {/*Confetti celebration */}
            {showConfetti && <Confetti width={width} height={height} />}

            <div className="flex flex-col gap-6">
                {/* Resultado */}
                {evaluationResult && (
                    <ResultCard
                        studentName={evaluationResult.studentName}
                        scorePercent={evaluationResult.totalScore}
                        correct={totalCorrect}
                        incorrect={totalIncorrect}
                        feedback={evaluationResult.feedback}
                    />
                )}

                {/* Header */}
                {header}


                <Separator />

                {/* Preguntas */}
                <div className="flex flex-col gap-4">
                    {quiz?.questions.map((q, index) => (
                        <QuestionCard
                            key={q.questionId}
                            question={q}
                            index={index}
                            onAnswer={handleAnswer}
                            // Se pasa el objeto de respuesta completo.
                            studentAnswer={answers[q.questionId]}
                            showResults={evaluationResult !== null}
                        />
                    ))}
                </div>

                {evaluationResult === null && (
                    <SubmitButton
                        text="Enviar Respuestas"
                        loadingText={
                            <span className="flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Generando...
                            </span>
                        }
                        size="lg"
                        onClick={handleSubmit}
                    />
                )}
            </div>
        </DefaultLayout>
    );

}
