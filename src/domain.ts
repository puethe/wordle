import { CustomError } from './error';

const NB_CHARS = 5;
export const TRUE_ANSWER = 'black';

interface LetterResult {
  index: number;
  correct: boolean;
}

type WordResult = Array<LetterResult>;

interface AttemptResult {
  byLetter: WordResult;
  overall: boolean;
}

export const checkWord = (guess: string, answer: string): AttemptResult => {
  if (guess.length !== NB_CHARS) {
    throw new CustomError({
      message: `Invalid input. Guesses must have ${NB_CHARS} characters, input has ${guess.length} characters`,
    });
  }

  const wordResult: WordResult = [];
  for (let i = 0; i < NB_CHARS; i++) {
    const letterResult: LetterResult = {
      index: i,
      correct: guess[i] === answer[i],
    };
    wordResult.push(letterResult);
  }
  return {
    byLetter: wordResult,
    overall: wordResult.every((lr) => lr.correct),
  };
};
