import { IStorageAdapter } from '../domain/use_cases';

export class HardcodedAdapter implements IStorageAdapter {
  async fetchTrueAnswer(): Promise<string> {
    return 'hullo';
  }

  async replaceTrueAnswer(newAnswer: string): Promise<void> {
    console.log(
      `Hard-coded adapter does not allow resetting the true answer to ${newAnswer}`,
    );
  }
}
