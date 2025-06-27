import {
  CheckWordUseCase,
  IStorageAdapter,
  LetterResult,
  NB_CHARS,
  ReplaceAnswerUseCase,
} from '../src/domain';
import { CustomError } from '../src/error';

class FakeStorageAdapter implements IStorageAdapter {
  constructor(private correctAnswer: string) {}
  async fetchTrueAnswer(): Promise<string> {
    return this.correctAnswer;
  }

  async replaceTrueAnswer(newAnswer: string): Promise<void> {
    this.correctAnswer = newAnswer;
  }
}

const makeCorrectResult = (idx: number): LetterResult => {
  return {
    index: idx,
    correctAtPosition: true,
    presentElsewhere: false,
  };
};

const makePresentElsewhereResult = (idx: number): LetterResult => {
  return {
    index: idx,
    correctAtPosition: false,
    presentElsewhere: true,
  };
};

const makeFalseResult = (idx: number): LetterResult => {
  return {
    index: idx,
    correctAtPosition: false,
    presentElsewhere: false,
  };
};

describe('Checking guess against correct answer', () => {
  test('Guess is of wrong length', async () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'blue';
    await expect(async () => {
      await uc.execute(guess);
    }).rejects.toThrow(CustomError);
  });

  test('Correct answer and guess share some common letters', async () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'blind';
    const result = await uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeCorrectResult(0));
    expect(result.byLetter[1]).toEqual(makeCorrectResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makeFalseResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer and guess share letters at different indexes', async () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'cable';
    const result = await uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makePresentElsewhereResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makePresentElsewhereResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Guess contains a matching letter multiple times', async () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'abbey';
    const result = await uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makePresentElsewhereResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makeFalseResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Guess contains a matching letter at the right index and elsewhere', async () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'bible';
    const result = await uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeCorrectResult(0));
    expect(result.byLetter[1]).toEqual(makeFalseResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer has multiple occasions of the same letter', async () => {
    const adapter = new FakeStorageAdapter('eagle');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'bleed';
    const result = await uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeFalseResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makePresentElsewhereResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer and guess are equal', async () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'black';
    const result = await uc.execute(guess);
    expect(result.overall).toBeTruthy();
    for (let i = 0; i < NB_CHARS; i++) {
      expect(result.byLetter[i]).toEqual(makeCorrectResult(i));
    }
  });
});

describe('Replacing the correct answer', () => {
  test('New answer is of wrong length', async () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new ReplaceAnswerUseCase(adapter);
    const newAnswer = 'blue';
    await expect(async () => {
      await uc.execute(newAnswer);
    }).rejects.toThrow(CustomError);
  });

  test('New answer is stored in adapter', async () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new ReplaceAnswerUseCase(adapter);
    const newAnswer = 'white';
    await uc.execute(newAnswer);
    const storedAnswer = await adapter.fetchTrueAnswer();
    expect(storedAnswer).toEqual(newAnswer);
  });
});
