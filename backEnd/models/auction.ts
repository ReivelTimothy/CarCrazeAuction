import { Table, Model, Column, DataType, ForeignKey, HasMany, BelongsTo, HasOne } from 'sequelize-typescript';
import { Vehicle } from './vehicle';
import { Bid } from './bid';
import { AuctionStatus, Category } from './enum';

@Table({ timestamps: false })
export class Auction extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @Column(DataType.STRING)
  declare title: string;

  @Column(DataType.STRING)
  declare description: string;

  @Column(DataType.FLOAT)
  declare startingPrice: number;

  @Column(DataType.FLOAT)
  declare currentPrice: number;

  @Column(DataType.DATE)
  declare startDate: Date;

  @Column(DataType.DATE)
  declare endDate: Date;

  @Column({
    type: DataType.ENUM(...Object.values(AuctionStatus)),
  })
  declare status: AuctionStatus;

  @Column({
    type: DataType.ENUM(...Object.values(Category)),
  })
  declare category: Category;

  @Column(DataType.STRING)
  declare image: string;

  @ForeignKey(() => Vehicle)
  @Column(DataType.INTEGER)
  declare vehicleId: number;

  @BelongsTo(() => Vehicle)
  declare vehicle: Vehicle;

  @HasMany(() => Bid)
  declare bids: Bid[];
}
