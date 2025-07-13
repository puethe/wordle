import { Sequelize } from 'sequelize';
import { DbAnswer, initDbAnswer } from './db_models';

import { IStorageAdapter } from '../domain/use_cases';

export class DatabaseAdapter implements IStorageAdapter {
  constructor(readonly databaseUrl: string) {
    const session = new Sequelize(databaseUrl);
    initDbAnswer(session);
  }

  async fetchTrueAnswer(): Promise<string> {
    const answer = await DbAnswer.findOne({
      attributes: ['value', 'isCurrent'],
      where: {
        isCurrent: true,
      },
    });
    if (answer) return answer.value;
    throw new Error();
  }

  async replaceTrueAnswer(newAnswer: string): Promise<void> {
    await DbAnswer.update(
      { isCurrent: false },
      {
        where: {
          isCurrent: true,
        },
      },
    );
    await DbAnswer.create({ value: newAnswer, isCurrent: true });
  }
}
