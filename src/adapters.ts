import { IStorageAdapter } from './domain';

export class HardcodedAdapter extends IStorageAdapter {
  fetchTrueAnswer(): string {
    return 'black';
  }
}
