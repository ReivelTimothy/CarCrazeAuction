import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';
import { Auction } from './auction';
import { UUIDTypes } from 'uuid';
import { StringifyOptions } from 'querystring';

@Table({ timestamps: false })
export class Transaction extends Model {
  @Column({ 
    primaryKey: true, 
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare transaction_id: string;

  @ForeignKey(() => Auction)
  @Column(DataType.UUID)
  declare auction_id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare user_id: string;

  @Column(DataType.FLOAT)
  declare amount: number;

  @Column(DataType.DATE)
  declare transactionDate: Date;

  @Column(DataType.STRING)
  declare paymentMethod: string;

  @Column(DataType.STRING)
  declare status: string;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Auction)
  declare auction: Auction;
}
