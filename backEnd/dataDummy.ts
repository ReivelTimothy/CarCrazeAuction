import { User } from './models/user';
import { Admin } from './models/admin';
import { Vehicle } from './models/vehicle';
import { Auction } from './models/auction';
import { Bid } from './models/bid';
import { Transaction } from './models/transaction';
import { AuctionStatus, Category } from './models/enum';

export const dummyUsers: Partial<User>[] = [
  { username: 'reivel', email: 'reivel@mail.com', password: 'pass123', phoneNum: '08123456789' },
  { username: 'joel', email: 'joel@mail.com', password: 'pass456', phoneNum: '08234567890' },
];

export const dummyAdmins: Partial<Admin>[] = [
  { username: 'admin1', email: 'admin1@mail.com', password: 'adminpass', phoneNum: '0800111222' },
];

export const dummyVehicles: Partial<Vehicle>[] = [
  {
    type: 'Car',
    brand: 'Toyota',
    model: 'Avanza',
    year: 2020,
    color: 'Black',
    mileage: 15000,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline',
    condition: 'Good',
    documents: 'BPKB, STNK',
  },
  {
    type: 'Motorcycle',
    brand: 'Yamaha',
    model: 'NMAX',
    year: 2022,
    color: 'Blue',
    mileage: 5000,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline',
    condition: 'Excellent',
    documents: 'STNK',
  },
];

export const dummyAuctions: Partial<Auction>[] = [
  {
    title: 'Lelang Avanza 2020',
    description: 'Mobil keluarga hemat bahan bakar',
    startingPrice: 100_000_000,
    currentPrice: 105_000_000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000),
    status: AuctionStatus.OPEN,
    category: Category.CAR,
    image: 'avanza2020.jpg',
    vehicleId: 1,
  },
  {
    title: 'Lelang NMAX 2022',
    description: 'Motor matic nyaman dan irit',
    startingPrice: 25_000_000,
    currentPrice: 27_000_000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 172800000),
    status: AuctionStatus.OPEN,
    category: Category.MOTORCYCLE,
    image: 'nmax2022.jpg',
    vehicleId: 2,
  },
];

export const dummyBids: Partial<Bid>[] = [
  {
    auctionId: 1,
    userId: 1,
    amount: 102_000_000,
    bidTime: new Date(),
  },
  {
    auctionId: 1,
    userId: 2,
    amount: 105_000_000,
    bidTime: new Date(),
  },
  {
    auctionId: 2,
    userId: 1,
    amount: 26_000_000,
    bidTime: new Date(),
  },
];

export const dummyTransactions: Partial<Transaction>[] = [
  {
    auctionId: 1,
    userId: 2,
    amount: 105_000_000,
    transactionDate: new Date(),
    paymentMethod: 'Credit Card',
    status: 'Completed',
  },
  {
    auctionId: 2,
    userId: 1,
    amount: 26_000_000,
    transactionDate: new Date(),
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
  },
];
