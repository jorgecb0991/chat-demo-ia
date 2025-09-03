import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuizOption {
    optionId: string;
    text: string;
    isCorrect?: boolean;
}

export interface QuizQuestion {
    questionId: string;
    order: number;
    type: 'multiple' | 'short' | 'mixed';
    questionText: string;
    options?: QuizOption[];
    suggestedAnswer?: string;
    explanation?: string;
}

export interface QuizMetadata {
    createdAt?: string;
    updatedAt?: string;
    author?: string;
    tags?: string[];
    views?: string;
    publishedAt?: string;
    publishedAgo?: string;
    channelName?: string;
    channelAvatar?: string;
}

export interface Quiz {
    quizId: string;
    title?: string;
    description?: string;
    videoUrl: string;
    videoThumbnail?: string;
    language: string;
    academicLevel?: string;
    instructions?: string;
    questions: QuizQuestion[];
    metadata?: QuizMetadata;
}

interface QuizState {
    current: Quiz | null;
}

const initialState: QuizState = {
    current: null,
};

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setQuiz: (state, action: PayloadAction<Quiz>) => {
            state.current = action.payload;
        },
        clearQuiz: (state) => {
            state.current = null;
        },
    },
});

export const { setQuiz, clearQuiz } = quizSlice.actions;
export default quizSlice.reducer;
