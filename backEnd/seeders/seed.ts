import { DataType, Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { User } from '../models/user';
import { Admin } from '../models/admin';
import { Vehicle } from '../models/vehicle';
import { Auction } from '../models/auction';
import { Bid } from '../models/bid';
import { Transaction } from '../models/transaction';

// Inisialisasi koneksi
const config = require("../config/config.json");

const sequelize = new Sequelize({
    ...config.development,
    models: [User, Admin, Vehicle, Auction, Bid, Transaction],
});

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        const user1 = await User.create({
            user_id: uuidv4(),
            username: 'reivel',
            email: 'reivel@mail.com',
            password: 'pass123',
            phoneNum: '08123456789',
        });

        const user2 = await User.create({
            user_id: uuidv4(),
            username: 'joel',
            email: 'joel@mail.com',
            password: 'pass456',
            phoneNum: '08234567890',
        });

        const admin1 = await Admin.create({
            admin_id: uuidv4(),
            username: 'admin1',
            email: 'admin1@mail.com',
            password: 'adminpass',
            phoneNum: '0800111222',
        });

        const vehicle1 = await Vehicle.create({
            vehicle_id: uuidv4(),
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
        });

        const vehicle2 = await Vehicle.create({
            vehicle_id: uuidv4(),
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
        });

        const auction1 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Lelang Avanza 2020',
            description: 'Mobil keluarga hemat bahan bakar',
            startingPrice: 100_000_000,
            currentPrice: 105_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000),
            status: "OPEN",
            category: "SUV",
            image: 'avanza2020.jpg',
            vehicle_id: vehicle1.vehicle_id,
        });

        const auction2 = await Auction.create({
            auction_id: uuidv4(),
            title: 'hinodutro 2022',
            description: 'Truk pengangkut barang',
            startingPrice: 25_000_000,
            currentPrice: 27_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 172800000),
            status: "OPEN",
            category: "Truck",
            image: 'nmax2022.jpg',
            vehicle_id: vehicle2.vehicle_id,
        });

        

        await Bid.bulkCreate([
            {
                bid_id: uuidv4(),
                auction_id: auction1.auction_id,
                user_id: user1.user_id,
                amount: 102_000_000,
                bidTime: new Date(),
            },
            {
                bid_id: uuidv4(),
                auction_id: auction1.auction_id,
                user_id: user2.user_id,
                amount: 105_000_000,
                bidTime: new Date(),
            },
            {
                bid_id: uuidv4(),
                auction_id: auction2.auction_id,
                user_id: user1.user_id,
                amount: 26_000_000,
                bidTime: new Date(),
            },
        ]);

        await Transaction.bulkCreate([
            {
                transaction_id: uuidv4(),
                auction_id: auction1.auction_id,
                user_id: user2.user_id,
                amount: 105_000_000,
                transactionDate: new Date(),
                paymentMethod: 'Credit Card',
                status: 'Completed',
            },
            {
                transaction_id: uuidv4(),
                auction_id: auction2.auction_id,
                user_id: user1.user_id,
                amount: 26_000_000,
                transactionDate: new Date(),
                paymentMethod: 'Bank Transfer',
                status: 'Pending',
            },
        ]);

        console.log('Data berhasil di-seed!');
        process.exit(0);
    } catch (err) {
        console.error('Gagal seed:', err);
        process.exit(1);
    }
}

seed();
