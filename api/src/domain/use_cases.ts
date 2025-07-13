import { Answer, AttemptResult, Guess } from './entities';

export interface IStorageAdapter {
  fetchTrueAnswer(): Promise<string>;

  replaceTrueAnswer(newAnswer: string): Promise<void>;
}

export class CheckWordUseCase {
  constructor(private readonly storageAdapter: IStorageAdapter) {}

  public async execute(guessString: string): Promise<AttemptResult> {
    const answerString = await this.storageAdapter.fetchTrueAnswer();
    const answer = new Answer(answerString);
    const guess = new Guess(guessString);
    return answer.compare_to(guess);
  }
}

export class ReplaceAnswerUseCase {
  constructor(private readonly storageAdapter: IStorageAdapter) {}

  public async execute(newAnswer: string): Promise<void> {
    const answer = new Answer(newAnswer);
    await this.storageAdapter.replaceTrueAnswer(answer.value);
  }
}
