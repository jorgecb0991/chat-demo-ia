import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quiz } from '@/types/quiz';

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
