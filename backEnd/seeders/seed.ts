// src/seeders/seed.ts
import express from 'express';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user';
import { Admin } from '../models/admin';
import { Vehicle } from '../models/vehicle';
import { Auction } from '../models/auction';
import { Bid } from '../models/bid';
import { Transaction } from '../models/transaction';
import { dummyUsers, dummyAdmins, dummyVehicles, dummyAuctions, dummyBids, dummyTransactions } from '../dataDummy';

const config = require('../config/config.json');
const app = express();

const sequelize = new Sequelize({
  ...config.development,
  models: [User, Admin, Vehicle, Auction, Bid, Transaction],
});

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    await sequelize.sync({ force: true });
    console.log('Database synchronized.');

    await User.bulkCreate(dummyUsers);
    await Admin.bulkCreate(dummyAdmins);
    await Vehicle.bulkCreate(dummyVehicles);
    await Auction.bulkCreate(dummyAuctions);
    await Bid.bulkCreate(dummyBids);
    await Transaction.bulkCreate(dummyTransactions);

    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();