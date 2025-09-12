import { Quiz } from "@/types/quiz";

// @ts-ignore
export const quizMock: Quiz = {
    quizId: "quiz-https-security-001",
    title: "Preguntas Clave: HTTP/HTTPS y la Seguridad Web",
    description: "Responde estas preguntas para consolidar tu comprensión sobre HTTP, HTTPS y cómo navegar de forma segura en la web.",
    videoUrl: "https://www.youtube.com/watch?v=Ej0gY6xT394", // Ejemplo de URL
    language: "es",
    questions: [
        {
            questionId: 1,
            order: 1,
            type: "short",
            questionText: "¿Cuál es la principal diferencia entre HTTP y HTTPS en términos de seguridad?",
            suggestedAnswer: "HTTPS cifra la información transmitida, mientras que HTTP no.",
            explanation: "HTTPS utiliza protocolos como SSL/TLS para encriptar los datos, protegiéndolos de interceptaciones. HTTP, en cambio, envía la información sin cifrar."
        },
        {
            questionId: 2,
            order: 2,
            type: "short",
            questionText: "¿Quién fue el creador de HTTP y cuál era su objetivo principal?",
            suggestedAnswer: "Tim Berners-Lee, para facilitar el intercambio de información entre investigadores.",
            explanation: "En 1989, Tim Berners-Lee inventó HTTP para permitir que los investigadores del CERN compartieran documentos a través de hipervínculos."
        },
        {
            questionId: 3,
            order: 3,
            type: "short",
            questionText: "¿Qué significa el término 'Man in the Middle' en el contexto de la seguridad web?",
            suggestedAnswer: "Un ataque donde un tercero intercepta la comunicación entre dos partes.",
            explanation: "Un ataque 'Man in the Middle' ocurre cuando un atacante se interpone en la comunicación entre un usuario y un servidor para robar o modificar la información."
        },
        {
            questionId: 4,
            order: 4,
            type: "short",
            questionText: "Además del candado en la barra de direcciones, ¿qué otra precaución importante debes tomar para evitar ser víctima de 'phishing'?",
            suggestedAnswer: "Verificar cuidadosamente la URL del sitio web.",
            explanation: "Los sitios de phishing pueden tener HTTPS, por lo que es crucial examinar la URL para detectar posibles errores o dominios sospechosos."
        },
        {
            questionId: 5,
            order: 5,
            type: "short",
            questionText: "¿Qué función cumplen los certificados SSL/TLS en la seguridad de un sitio web?",
            suggestedAnswer: "Cifrar la comunicación entre el navegador y el servidor, y verificar la identidad del sitio.",
            explanation: "Los certificados SSL/TLS aseguran que la información transmitida esté encriptada y que el sitio web es quien dice ser, evitando la suplantación de identidad."
        }
    ]
};
