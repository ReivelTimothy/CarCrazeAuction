import { Table, Model, Column, DataType } from 'sequelize-typescript';
import { UUIDTypes } from 'uuid';

@Table({ timestamps: false })
export class Admin extends Model {
  @Column({
    primaryKey: true,
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare admin_id: string;

  @Column(DataType.STRING)
  declare username: string;

  @Column(DataType.STRING)
  declare email: string;

  @Column(DataType.STRING)
  declare password: string;

  @Column(DataType.STRING)
  declare phoneNum: string;
}
