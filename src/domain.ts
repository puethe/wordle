export const checkWord = (guess: string): boolean => {
  const trueAnswer = 'black';
  return guess === trueAnswer;
};
