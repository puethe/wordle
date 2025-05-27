import { IStorageAdapter } from './domain';
import fs from 'node:fs';

export class HardcodedAdapter extends IStorageAdapter {
  fetchTrueAnswer(): string {
    return 'hullo';
  }
}

export class FileSystemAdapter extends IStorageAdapter {
  constructor(private readonly inputFile: string) {
    super();
  }

  fetchTrueAnswer(): string {
    return fs.readFileSync(this.inputFile, 'utf8');
  }
}
