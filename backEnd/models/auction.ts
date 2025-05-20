import { Table, Model, Column, DataType, ForeignKey, HasMany, BelongsTo, HasOne } from 'sequelize-typescript';
import { Vehicle } from './vehicle';
import { Bid } from './bid';
import { UUIDTypes } from 'uuid';
import { col } from 'sequelize';

@Table({ timestamps: false })
export class Auction extends Model {
  @Column({ 
    primaryKey: true, 
    allowNull: false,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, 
  })
  declare auction_id: string;

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

  @Column(DataType.STRING)
  declare status: string;

  @Column(DataType.STRING)
  declare category: string;

  @Column(DataType.STRING)
  declare image: string;

  @ForeignKey(() => Vehicle)
  @Column(DataType.UUID)
  declare vehicle_id: string;

  @BelongsTo(() => Vehicle)
  declare vehicle: Vehicle;

  @HasMany(() => Bid)
  declare bids: Bid[];
}
