import { checkWord, LetterResult, NB_CHARS } from '../src/domain';

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
