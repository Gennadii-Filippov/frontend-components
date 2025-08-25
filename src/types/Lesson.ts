export type Lesson = {
  active: boolean;
  book: Record<string, string>;
  course: Record<string, string>;
  description: string;
  id: number;
  image: null | string;
  position: number;
  prize: string;
  seoName: string;
  refLink: string | null;
  questions: QuestionCollection;
  testInfo: {
    title: string;
    description: string;
    image: object;
    successfulFinalTestText?: string | null;
    turnOffPromocodes: boolean;
  };
  timeForLesson: number;
  title: string;
  status: string;
  topicsCount: number;
};

export type QuestionCollection = Record<string, Question>;

export type AnswerCollection = Record<string, Answer>;

export type ProgressCollection = Record<string, Progress>;

export type Question = {
  answers: AnswerCollection;
  image: string;
  question: string;
  answer: Answer;
};

export type Answer = {
  delete: boolean;
  explanation: object | null;
  isCorrect: boolean;
  text: string;
  selected: boolean;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  image: object | null;
};

export type Progress = {
  data: {
    test: Test[];
    topics: Record<
      string,
      {
        currentStep: number;
        dateStart: number;
        steps: Record<string, { dateStart: number }>;
        totalSteps: number;
      }
    >;
  };
  dateEnd: string | null;
  dateStart: {
    date: string;
    timezone: string;
    timezone_type: number;
  };
  lesson: number;
};

export type Test = {
  dateEnd: number;
  dateStart: number;
  status: string;
};

export type Topic = {
  description: string;
  id: number;
  image: string;
  number: 0;
  seoName: string;
  steps: Step[];
  timeForTopic: number;
  title: string;
  lesson: Lesson;
  status: string;
};

export type Step = {
  checkQuestion: {
    answers: Answer[];
    image: string | null;
    question: string;
  };
  text: string;
  title: string;
  image: string | null;
};

export type TestInformation = {
  countPerTest: number;
  description: string;
  image: string | null;
  title: string;
};

export type ResultTest = {
  nextLessonSeoName: string | null;
  promocode: {
    notice: string;
    promocode: string | null;
    status: string;
  };
  result: {
    answers: { answer: Answer; number: number }[];
    questionsCount: number;
    rightAnswers: number;
    testResult: string;
    wrongAnswers: { question: string }[];
  };
} | null;

export type LessonsPromoCodeInfo = {
  status: string;
  promocode: string | null;
  notice: string;
};
