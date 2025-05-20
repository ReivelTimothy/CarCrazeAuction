import {Table, Model, Column, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Bid } from './bid';
import { Transaction } from './transaction';
import { UUIDTypes } from 'uuid';

@Table({ timestamps: false })
export class User extends Model {
  @Column({
    primaryKey: true, 
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare user_id: string;

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
