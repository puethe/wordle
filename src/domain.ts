import { CustomError } from './error';

export const NB_CHARS = 5;
export const TRUE_ANSWER = 'black';

export interface LetterResult {
  index: number;
  correctAtPosition: boolean;
  presentElsewhere: boolean;
}

type WordResult = Array<LetterResult>;

interface AttemptResult {
  byLetter: WordResult;
  overall: boolean;
}

interface LetterTmpResult {
  isRemaining: boolean;
  value: string;
}

export const checkWord = (guess: string, answer: string): AttemptResult => {
  // Check if guess is legitimate
  if (guess.length !== NB_CHARS) {
    throw new CustomError({
      message: `Invalid input. Guesses must have ${NB_CHARS} characters, input has ${guess.length} characters`,
    });
  }

  // Loop over the word a first time to find exact matches
  const wordResult: WordResult = answer.split('').map((_v, i) => {
    return { index: i, correctAtPosition: false, presentElsewhere: false };
  });
  const remainingLetters: Array<LetterTmpResult> = answer.split('').map((v) => {
    return { isRemaining: true, value: v };
  });
  for (let i = 0; i < NB_CHARS; i++) {
    if (guess.charAt(i) === answer.charAt(i)) {
      wordResult[i].correctAtPosition = true;
      remainingLetters[i].isRemaining = false;
    }
  }

  // Loop over the word a second time to find matches at different positions
  for (let i = 0; i < NB_CHARS; i++) {
    if (!wordResult[i].correctAtPosition) {
      const remainingLetterIndex = remainingLetters.findIndex(
        (el) => el.isRemaining && el.value === guess.charAt(i),
      );
      if (remainingLetterIndex !== -1) {
        wordResult[i].presentElsewhere = true;
        remainingLetters[remainingLetterIndex].isRemaining = false;
      }
    }
  }

  return {
    byLetter: wordResult,
    overall: wordResult.every((lr) => lr.correctAtPosition),
  };
};
