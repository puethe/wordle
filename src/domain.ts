import { CustomError } from './error';

export const NB_CHARS = 5;

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

export abstract class IStorageAdapter {
  abstract fetchTrueAnswer(): Promise<string>;

  abstract replaceTrueAnswer(newAnswer: string): Promise<void>;
}

export class CheckWordUseCase {
  constructor(private readonly storageAdapter: IStorageAdapter) {}

  public async execute(guess: string): Promise<AttemptResult> {
    // Retrieve the answer
    const answer = await this.storageAdapter.fetchTrueAnswer();

    // Check if guess is legitimate
    checkValidity(guess);

    // Loop over the word a first time to find exact matches
    const wordResult: WordResult = answer.split('').map((_v, i) => {
      return { index: i, correctAtPosition: false, presentElsewhere: false };
    });
    const remainingLetters: Array<LetterTmpResult> = answer
      .split('')
      .map((v) => {
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
  }
}

export class ReplaceAnswerUseCase {
  constructor(private readonly storageAdapter: IStorageAdapter) {}

  public async execute(newAnswer: string): Promise<void> {
    checkValidity(newAnswer);
    await this.storageAdapter.replaceTrueAnswer(newAnswer);
  }
}

const checkValidity = (input: string): void => {
  if (input.length !== NB_CHARS) {
    throw new CustomError({
      message: `Invalid input. Wordle words must have ${NB_CHARS} characters, input has ${input.length} characters`,
    });
  }
};
