import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';
import { Auction } from './auction';

@Table({ timestamps: false })
export class Transaction extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Auction)
  @Column(DataType.INTEGER)
  declare auctionId: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  declare userId: number;

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
