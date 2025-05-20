import { checkWord } from '../src/domain';

describe('Checking guess against correct answer', () => {
  test('Correct answer and guess share some common letters', () => {
    const correctAnswer = 'black';
    const guess = 'blind';
    const result = checkWord(guess, correctAnswer);
    expect(result.overall).toBeFalsy();
    expect(result.byLetter[0]).toEqual({ index: 0, correct: true });
    expect(result.byLetter[4]).toEqual({ index: 4, correct: false });
  });

  test('Correct answer and guess are equal', () => {
    const correctAnswer = 'black';
    const guess = 'black';
    const result = checkWord(guess, correctAnswer);
    expect(result.overall).toBeTruthy();
  });
});
