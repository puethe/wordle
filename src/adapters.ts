import { IStorageAdapter } from './domain';
import fs from 'node:fs';

export class HardcodedAdapter extends IStorageAdapter {
  fetchTrueAnswer(): string {
    return 'hullo';
  }
  replaceTrueAnswer(newAnswer: string): void {
    console.log(
      `Hard-coded adapter does not allow resetting the true answer to ${newAnswer}`,
    );
  }
}

export class FileSystemAdapter extends IStorageAdapter {
  constructor(private readonly inputFile: string) {
    super();
  }

  fetchTrueAnswer(): string {
    return fs.readFileSync(this.inputFile, 'utf8');
  }

  replaceTrueAnswer(newAnswer: string): void {
    fs.writeFileSync(this.inputFile, newAnswer, 'utf8');
  }
}
