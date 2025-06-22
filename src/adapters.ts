import { IStorageAdapter } from './domain';
import fs from 'node:fs';
import { DataTypes, Sequelize } from 'sequelize';

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

export class DatabaseAdapter extends IStorageAdapter {
  private session: Sequelize;

  constructor(readonly databaseUrl: string) {
    super();
    this.session = new Sequelize(databaseUrl);
  }

  fetchTrueAnswer(): string {
    const DbAnswer = this.session.define('answer', {
      value: DataTypes.STRING,
    });
    return DbAnswer.toString();
  }

  replaceTrueAnswer(newAnswer: string): void {
    console.log(
      `DatabaseAdapter does not allow resetting the true answer to ${newAnswer}`,
    );
  }
}
