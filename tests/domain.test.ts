import { checkWord, LetterResult, NB_CHARS } from '../src/domain';
import { CustomError } from '../src/error';

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
    const correctAnswer = 'black';
    const guess = 'blue';
    expect(() => {
      checkWord(guess, correctAnswer);
    }).toThrow(CustomError);
  });

  test('Correct answer and guess share some common letters', () => {
    const correctAnswer = 'black';
    const guess = 'blind';
    const result = checkWord(guess, correctAnswer);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeCorrectResult(0));
    expect(result.byLetter[1]).toEqual(makeCorrectResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makeFalseResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer and guess share letters at different indexes', () => {
    const correctAnswer = 'black';
    const guess = 'cable';
    const result = checkWord(guess, correctAnswer);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makePresentElsewhereResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makePresentElsewhereResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Guess contains a matching letter multiple times', () => {
    const correctAnswer = 'black';
    const guess = 'abbey';
    const result = checkWord(guess, correctAnswer);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makePresentElsewhereResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makeFalseResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Guess contains a matching letter at the right index and elsewhere', () => {
    const correctAnswer = 'black';
    const guess = 'bible';
    const result = checkWord(guess, correctAnswer);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeCorrectResult(0));
    expect(result.byLetter[1]).toEqual(makeFalseResult(1));
    expect(result.byLetter[2]).toEqual(makeFalseResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer has multiple occasions of the same letter', () => {
    const correctAnswer = 'eagle';
    const guess = 'bleed';
    const result = checkWord(guess, correctAnswer);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual(makeFalseResult(0));
    expect(result.byLetter[1]).toEqual(makePresentElsewhereResult(1));
    expect(result.byLetter[2]).toEqual(makePresentElsewhereResult(2));
    expect(result.byLetter[3]).toEqual(makePresentElsewhereResult(3));
    expect(result.byLetter[4]).toEqual(makeFalseResult(4));
  });

  test('Correct answer and guess are equal', () => {
    const correctAnswer = 'black';
    const guess = 'black';
    const result = checkWord(guess, correctAnswer);
    expect(result.overall).toBeTruthy();
    for (let i = 0; i < NB_CHARS; i++) {
      expect(result.byLetter[i]).toEqual(makeCorrectResult(i));
    }
  });
});
