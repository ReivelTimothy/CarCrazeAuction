import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ timestamps: false })
export class Admin extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  declare id: number;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare phoneNum: string;
}
