import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

export class DbAnswer extends Model<
  InferAttributes<DbAnswer>,
  InferCreationAttributes<DbAnswer>
> {
  declare id: CreationOptional<number>;
  declare value: string;
  declare isCurrent: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initDbAnswer = (session: Sequelize) => {
  DbAnswer.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCurrent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize: session,
      tableName: 'answer',
    },
  );
};
