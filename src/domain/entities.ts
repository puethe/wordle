import { CustomError } from '../error';
import { NB_CHARS } from './constants';

export type LetterResult = {
  index: number;
  correctAtPosition: boolean;
  presentElsewhere: boolean;
};

type WordResult = Array<LetterResult>;

export type AttemptResult = {
  byLetter: WordResult;
  overall: boolean;
};

type LetterTmpResult = {
  isRemaining: boolean;
  value: string;
};

export class Guess {
  constructor(public readonly value: string) {
    this.checkValidity();
  }

  private checkValidity(): void {
    if (this.value.length !== NB_CHARS) {
      throw new CustomError({
        message: `Invalid input. Wordle words must have ${NB_CHARS} characters, input has ${this.value.length} characters`,
      });
    }
  }
}

export class Answer extends Guess {
  public compare_to(guess: Guess): AttemptResult {
    // Loop over the word a first time to find exact matches
    const wordResult: WordResult = this.value.split('').map((_v, i) => {
      return { index: i, correctAtPosition: false, presentElsewhere: false };
    });
    const remainingLetters: Array<LetterTmpResult> = this.value
      .split('')
      .map((v) => {
        return { isRemaining: true, value: v };
      });
    for (let i = 0; i < NB_CHARS; i++) {
      if (guess.value.charAt(i) === this.value.charAt(i)) {
        wordResult[i].correctAtPosition = true;
        remainingLetters[i].isRemaining = false;
      }
    }

    // Loop over the word a second time to find matches at different positions
    for (let i = 0; i < NB_CHARS; i++) {
      if (!wordResult[i].correctAtPosition) {
        const remainingLetterIndex = remainingLetters.findIndex(
          (el) => el.isRemaining && el.value === guess.value.charAt(i),
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
  }
}
