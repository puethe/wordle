import { promises as fs } from 'fs';

import { IStorageAdapter } from '../domain/use_cases';

export class FileSystemAdapter implements IStorageAdapter {
  constructor(private readonly inputFile: string) {}

  async fetchTrueAnswer(): Promise<string> {
    return await fs.readFile(this.inputFile, 'utf8');
  }

  async replaceTrueAnswer(newAnswer: string): Promise<void> {
    await fs.writeFile(this.inputFile, newAnswer, 'utf8');
  }
}
