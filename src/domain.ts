import { CustomError } from './error';

const NB_CHARS = 5;

export const checkWord = (guess: string): boolean => {
  if (guess.length !== NB_CHARS) {
    throw new CustomError({
      message: `Invalid input. Guesses must have ${NB_CHARS} characters, input has ${guess.length} characters`,
    });
  }

  const trueAnswer = 'black';
  return guess === trueAnswer;
};

//TODO: implement error handling as shown in https://medium.com/@xiaominghu19922/proper-error-handling-in-express-server-with-typescript-8cd4ffb67188
