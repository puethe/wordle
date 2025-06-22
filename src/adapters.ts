import { IStorageAdapter } from './domain';
import { promises as fs } from 'fs';
import { DataTypes, Sequelize } from 'sequelize';

export class HardcodedAdapter extends IStorageAdapter {
  async fetchTrueAnswer(): Promise<string> {
    return 'hullo';
  }

  async replaceTrueAnswer(newAnswer: string): Promise<void> {
    console.log(
      `Hard-coded adapter does not allow resetting the true answer to ${newAnswer}`,
    );
  }
}

export class FileSystemAdapter extends IStorageAdapter {
  constructor(private readonly inputFile: string) {
    super();
  }

  async fetchTrueAnswer(): Promise<string> {
    return await fs.readFile(this.inputFile, 'utf8');
  }

  async replaceTrueAnswer(newAnswer: string): Promise<void> {
    await fs.writeFile(this.inputFile, newAnswer, 'utf8');
  }
}

export class DatabaseAdapter extends IStorageAdapter {
  private session: Sequelize;

  constructor(readonly databaseUrl: string) {
    super();
    this.session = new Sequelize(databaseUrl);
  }

  async fetchTrueAnswer(): Promise<string> {
    const DbAnswer = this.session.define('answer', {
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    await DbAnswer.findOne();
    return 'hullo';
  }

  async replaceTrueAnswer(newAnswer: string): Promise<void> {
    console.log(
      `DatabaseAdapter does not allow resetting the true answer to ${newAnswer}`,
    );
  }
}
