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

interface LetterIntermediateResult {
  isRemaining: boolean;
  value: string;
}

export const checkWord = (guess: string, answer: string): AttemptResult => {
  if (guess.length !== NB_CHARS) {
    throw new CustomError({
      message: `Invalid input. Guesses must have ${NB_CHARS} characters, input has ${guess.length} characters`,
    });
  }

  // Loop over the word a first time to find exact matches
  const remainingLetters: Array<LetterIntermediateResult> = [];
  const correctIndexes: Set<number> = new Set();
  for (let i = 0; i < NB_CHARS; i++) {
    if (guess.charAt(i) === answer.charAt(i)) {
      correctIndexes.add(i);
      remainingLetters.push({ isRemaining: false, value: answer.charAt(i) });
    } else {
      remainingLetters.push({ isRemaining: true, value: answer.charAt(i) });
    }
  }

  // Loop over the word a second time to find matches at different positions and build result
  const wordResult: WordResult = [];
  for (let i = 0; i < NB_CHARS; i++) {
    if (correctIndexes.has(i)) {
      const letterResult: LetterResult = {
        index: i,
        correctAtPosition: true,
        presentElsewhere: false,
      };
      wordResult.push(letterResult);
    } else {
      const remIndex: number = remainingLetters.findIndex(
        (el) => el.isRemaining && el.value === guess.charAt(i),
      );
      if (remIndex !== -1) {
        const letterResult: LetterResult = {
          index: i,
          correctAtPosition: false,
          presentElsewhere: true,
        };
        wordResult.push(letterResult);
        remainingLetters[remIndex].isRemaining = false;
      } else {
        const letterResult: LetterResult = {
          index: i,
          correctAtPosition: false,
          presentElsewhere: false,
        };
        wordResult.push(letterResult);
      }
    }
  }
  return {
    byLetter: wordResult,
    overall: wordResult.every((lr) => lr.correctAtPosition),
  };
};
