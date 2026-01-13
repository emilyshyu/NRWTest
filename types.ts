
export interface QuestionData {
  id: number;
  questionDe: string;
  questionZh: string;
  optionsDe: string[];
  optionsZh: string[];
  answerIndex: number; // 0-3
}

export enum AppMode {
  HOME = 'HOME',
  FLASHCARD_ALL = 'FLASHCARD_ALL',
  FLASHCARD_UNIT = 'FLASHCARD_UNIT',
  TEST = 'TEST'
}

export interface TestResult {
  score: number;
  total: number;
  passed: boolean;
  userAnswers: (number | null)[];
  questions: QuestionData[];
}
