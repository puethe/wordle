import {
  CheckWordUseCase,
  IStorageAdapter,
  LetterResult,
  NB_CHARS,
  ReplaceAnswerUseCase,
} from '../src/domain';
import { CustomError } from '../src/error';

class FakeStorageAdapter extends IStorageAdapter {
  constructor(private correctAnswer: string) {
    super();
  }
  fetchTrueAnswer(): string {
    return this.correctAnswer;
  }
  replaceTrueAnswer(newAnswer: string): void {
    this.correctAnswer = newAnswer
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
  test('Guess is of wrong length', () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'blue';
    expect(() => {
      uc.execute(guess);
    }).toThrow(CustomError);
  });

  test('Correct answer and guess share some common letters', () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'blind';
    const result = uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeCorrectResult(0));
    expect(result.byLetter[1]).toEqual(makeCorrectResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makeFalseResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer and guess share letters at different indexes', () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'cable';
    const result = uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makePresentElsewhereResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makePresentElsewhereResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Guess contains a matching letter multiple times', () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'abbey';
    const result = uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makePresentElsewhereResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makeFalseResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Guess contains a matching letter at the right index and elsewhere', () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'bible';
    const result = uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeCorrectResult(0));
    expect(result.byLetter[1]).toEqual(makeFalseResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer has multiple occasions of the same letter', () => {
    const adapter = new FakeStorageAdapter('eagle');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'bleed';
    const result = uc.execute(guess);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeFalseResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makePresentElsewhereResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer and guess are equal', () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new CheckWordUseCase(adapter);
    const guess = 'black';
    const result = uc.execute(guess);
    expect(result.overall).toBeTruthy();
    for (let i = 0; i < NB_CHARS; i++) {
      expect(result.byLetter[i]).toEqual(makeCorrectResult(i));
    }
  });
});


describe('Replacing the correct answer', () => {
  test('New answer is of wrong length', () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new ReplaceAnswerUseCase(adapter);
    const newAnswer = 'blue';
    expect(() => {
      uc.execute(newAnswer);
    }).toThrow(CustomError);
  });

  test('New answer is stored in adapter', () => {
    const adapter = new FakeStorageAdapter('black');
    const uc = new ReplaceAnswerUseCase(adapter);
    const newAnswer = 'white';
    uc.execute(newAnswer)
    expect(adapter.fetchTrueAnswer()).toEqual(newAnswer)
  });
})
