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

export const checkWord = (guess: string, answer: string): AttemptResult => {
  if (guess.length !== NB_CHARS) {
    throw new CustomError({
      message: `Invalid input. Guesses must have ${NB_CHARS} characters, input has ${guess.length} characters`,
    });
  }

  // Loop over the word a first time to find exact matches
  const correctIndexes: Array<number> = [];
  const remainingLetters: Array<string> = [];
  for (let i = 0; i < NB_CHARS; i++) {
    if (guess[i] === answer[i]) {
      correctIndexes.push(i);
    } else if (answer.indexOf(guess[i]) !== -1) {
      remainingLetters.push(guess[i]);
    }
  }

  // Loop over the word a second time to find matches at different positions and build result
  const wordResult: WordResult = [];
  for (let i = 0; i < NB_CHARS; i++) {
    if (correctIndexes.indexOf(i) !== -1) {
      const letterResult: LetterResult = {
        index: i,
        correctAtPosition: true,
        presentElsewhere: false,
      };
      wordResult.push(letterResult);
    } else {
      const index = remainingLetters.indexOf(guess[i]);
      if (index !== -1) {
        const letterResult: LetterResult = {
          index: i,
          correctAtPosition: false,
          presentElsewhere: true,
        };
        wordResult.push(letterResult);
        remainingLetters.splice(index, 1);
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
