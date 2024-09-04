export interface QnA {
    question: Question;
    answers: Answer[];
}

export interface Question {
    questionId: number;
    question: string;
    createdAt: string;
    name: string;
}

export interface Answer {
    answerId: number;
    content: string;
    createdAt: string;
}
