import { Quiz } from "@/store/slices/quizSlice";

export const mockQuiz: Quiz = {
    quizId: "mock-1",
    title: "Quiz de ejemplo",
    description: "Un cuestionario de práctica sobre geografía.",
    videoUrl: "https://youtube.com/watch?v=abcd1234",
    language: "es",
    metadata: {
        videoId:"xxxx",
        views: "1,234",
        channelName: "Canal Demo",
        channelAvatar: "https://placekitten.com/80/80",
        videoThumbnail: "https://img.youtube.com/vi/abcd1234/0.jpg",
    },
    questions: [
        {
            questionId: "q1",
            order: 1,
            type: "multiple",
            questionText: "¿Cuál es la capital de Francia?",
            options: [
                { optionId: "1", text: "Madrid" },
                { optionId: "2", text: "París", isCorrect: true },
                { optionId: "3", text: "Roma" },
            ],
            explanation: "París es la capital de Francia.",
        },
        {
            questionId: "q2",
            order: 2,
            type: "multiple",
            questionText: "¿Cuál es el río más largo del mundo?",
            options: [
                { optionId: "1", text: "Nilo", isCorrect: true },
                { optionId: "2", text: "Amazonas" },
                { optionId: "3", text: "Yangtsé" },
            ],
            explanation: "Generalmente se acepta que el Nilo es el más largo.",
        },
        {
            questionId: "q3",
            order: 3,
            type: "multiple",
            questionText: "¿Cuál es el río más largo del mundo?",
            options: [
                { optionId: "1", text: "Nilo", isCorrect: true },
                { optionId: "2", text: "Amazonas" },
                { optionId: "3", text: "Yangtsé" },
            ],
            explanation: "Generalmente se acepta que el Nilo es el más largo.",
        },
        
        
    ],
};
