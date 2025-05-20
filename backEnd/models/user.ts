import {Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Bid } from './bid';
import { Transaction } from './transaction';

@Table({ timestamps: false })
export class User extends Model {
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

  @HasMany(() => Bid)
  declare bids: Bid[];

  @HasMany(() => Transaction)
  declare transactions: Transaction[];
}
