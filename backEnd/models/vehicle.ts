import { Table, Model, Column, DataType, HasOne } from 'sequelize-typescript';
import { Auction } from './auction';

@Table({ timestamps: false })
export class Vehicle extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  declare id: number;

  @Column(DataType.STRING)
  declare type: string;

  @Column(DataType.STRING)
  declare brand: string;

  @Column(DataType.STRING)
  declare model: string;

  @Column(DataType.INTEGER)
  declare year: number;

  @Column(DataType.STRING)
  declare color: string;

  @Column(DataType.INTEGER)
  declare mileage: number;

  @Column(DataType.STRING)
  declare transmissionType: string;

  @Column(DataType.STRING)
  declare fuelType: string;

  @Column(DataType.STRING)
  declare condition: string;

  @Column(DataType.STRING)
  declare documents: string;

  @HasOne(() => Auction)
  declare auction: Auction;
}
