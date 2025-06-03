import { DataType, Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { User } from '../models/user';
import { Admin } from '../models/admin';
import { Vehicle } from '../models/vehicle';
import { Auction } from '../models/auction';
import { Bid } from '../models/bid';
import { Transaction } from '../models/transaction';
import { hashPassword } from '../src/utils/password_helper';

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

        // Clear existing data to prevent conflicts
        console.log('🧹 Clearing existing data...');
        await Transaction.destroy({ where: {} });
        await Bid.destroy({ where: {} });
        await Auction.destroy({ where: {} });
        await Vehicle.destroy({ where: {} });
        await Admin.destroy({ where: {} });
        await User.destroy({ where: {} });
        console.log('✅ Existing data cleared!');        console.log('📊 Creating new test data...');

        // Hash passwords for security
        const hashedPass123 = await hashPassword('pass123');
        const hashedPass456 = await hashPassword('pass456');
        const hashedAlice123 = await hashPassword('alice123');
        const hashedBob456 = await hashPassword('bob456');
        const hashedAdminPass = await hashPassword('adminpass');
        const hashedSuperPass = await hashPassword('superpass123');

        // Create test users
        const user1 = await User.create({
            user_id: uuidv4(),
            username: 'reivel',
            email: 'reivel@mail.com',
            password: hashedPass123,
            phoneNum: '08123456789',
        });

        const user2 = await User.create({
            user_id: uuidv4(),
            username: 'joel',
            email: 'joel@mail.com',
            password: hashedPass456,
            phoneNum: '08234567890',
        });

        const user3 = await User.create({
            user_id: uuidv4(),
            username: 'alice',
            email: 'alice@mail.com',
            password: hashedAlice123,
            phoneNum: '08345678901',
        });

        const user4 = await User.create({
            user_id: uuidv4(),
            username: 'bob',
            email: 'bob@mail.com',
            password: hashedBob456,
            phoneNum: '08456789012',
        });

        // Create test admins
        const admin1 = await Admin.create({
            admin_id: uuidv4(),
            username: 'admin1',
            email: 'admin1@mail.com',
            password: hashedAdminPass,
            phoneNum: '0800111222',
        });

        const admin2 = await Admin.create({
            admin_id: uuidv4(),
            username: 'superadmin',
            email: 'superadmin@mail.com',
            password: hashedSuperPass,
            phoneNum: '0800333444',
        });// Create diverse vehicle inventory
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

        const vehicle3 = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Car',
            brand: 'Honda',
            model: 'Civic',
            year: 2019,
            color: 'White',
            mileage: 25000,
            transmissionType: 'Manual',
            fuelType: 'Gasoline',
            condition: 'Good',
            documents: 'BPKB, STNK, Service Record',
        });

        const vehicle4 = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'SUV',
            brand: 'Mitsubishi',
            model: 'Pajero',
            year: 2021,
            color: 'Silver',
            mileage: 8000,
            transmissionType: 'Automatic',
            fuelType: 'Diesel',
            condition: 'Excellent',
            documents: 'BPKB, STNK, Warranty',
        });

        const vehicle5 = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Truck',
            brand: 'Hino',
            model: 'Dutro',
            year: 2018,
            color: 'Red',
            mileage: 45000,
            transmissionType: 'Manual',
            fuelType: 'Diesel',
            condition: 'Fair',
            documents: 'BPKB, STNK',
        });

        const vehicle6 = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Car',
            brand: 'BMW',
            model: 'X5',
            year: 2020,
            color: 'Black',
            mileage: 12000,
            transmissionType: 'Automatic',
            fuelType: 'Gasoline',
            condition: 'Excellent',
            documents: 'BPKB, STNK, Service Record, Warranty',
        });        // Create auctions with different statuses for testing admin functionality
        const auction1 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Toyota Avanza 2020 - Family Car',
            description: 'Excellent family car with low mileage. Perfect for daily commuting and family trips. Well-maintained with complete service records.',
            startingPrice: 100_000_000,
            currentPrice: 105_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
            status: "OPEN",
            category: "SUV",
            image: 'avanza2020.jpg',
            vehicle_id: vehicle1.vehicle_id,
        });

        const auction2 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Yamaha NMAX 2022 - Premium Scooter',
            description: 'Latest NMAX model with advanced features. Low mileage, excellent condition. Perfect for urban commuting.',
            startingPrice: 25_000_000,
            currentPrice: 27_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 172800000), // 2 days from now
            status: "OPEN",
            category: "Motorcycle",
            image: 'nmax2022.jpg',
            vehicle_id: vehicle2.vehicle_id,
        });

        const auction3 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Honda Civic 2019 - Sport Sedan',
            description: 'Sporty and reliable sedan with manual transmission. Great for driving enthusiasts. Well-maintained with service records.',
            startingPrice: 180_000_000,
            currentPrice: 185_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 259200000), // 3 days from now
            status: "OPEN",
            category: "Sedan",
            image: 'civic2019.jpg',
            vehicle_id: vehicle3.vehicle_id,
        });

        const auction4 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Mitsubishi Pajero 2021 - Luxury SUV',
            description: 'Premium SUV with advanced 4WD system. Low mileage, excellent condition with warranty. Perfect for adventure and luxury.',
            startingPrice: 450_000_000,
            currentPrice: 460_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 432000000), // 5 days from now
            status: "OPEN",
            category: "SUV",
            image: 'pajero2021.jpg',
            vehicle_id: vehicle4.vehicle_id,
        });

        const auction5 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Hino Dutro 2018 - Commercial Truck',
            description: 'Reliable commercial truck for business use. High mileage but well-maintained. Perfect for cargo transport.',
            startingPrice: 150_000_000,
            currentPrice: 150_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 345600000), // 4 days from now
            status: "pending",
            category: "Truck",
            image: 'dutro2018.jpg',
            vehicle_id: vehicle5.vehicle_id,
        });        const auction6 = await Auction.create({
            auction_id: uuidv4(),
            title: 'BMW X5 2020 - Luxury SUV',
            description: 'Premium luxury SUV with all features. Low mileage, excellent condition with warranty and service records.',
            startingPrice: 750_000_000,
            currentPrice: 820_000_000, // Updated to match the highest bid
            startDate: new Date(Date.now() - 86400000), // Started yesterday
            endDate: new Date(Date.now() - 3600000), // Ended 1 hour ago
            status: "closed",
            category: "Luxury",
            image: 'bmwx5_2020.jpg',
            vehicle_id: vehicle6.vehicle_id,
        });        

        // Tambahan kendaraan dan auction untuk kategori lain
        const vehicleSedan = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Sedan',
            brand: 'Toyota',
            model: 'Camry',
            year: 2021,
            color: 'Grey',
            mileage: 10000,
            transmissionType: 'Automatic',
            fuelType: 'Gasoline',
            condition: 'Excellent',
            documents: 'BPKB, STNK',
        });
        await Auction.create({
            auction_id: uuidv4(),
            title: 'Toyota Camry 2021 - Executive Sedan',
            description: 'Luxury sedan, low mileage, like new.',
            startingPrice: 350_000_000,
            currentPrice: 355_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Sedan",
            image: 'camry2021.jpg',
            vehicle_id: vehicleSedan.vehicle_id,
        });

        const vehicleSUV = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'SUV',
            brand: 'Hyundai',
            model: 'Santa Fe',
            year: 2022,
            color: 'White',
            mileage: 5000,
            transmissionType: 'Automatic',
            fuelType: 'Diesel',
            condition: 'Excellent',
            documents: 'BPKB, STNK',
        });
        await Auction.create({
            auction_id: uuidv4(),
            title: 'Hyundai Santa Fe 2022 - Modern SUV',
            description: 'SUV terbaru, fitur lengkap, siap pakai.',
            startingPrice: 500_000_000,
            currentPrice: 505_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "SUV",
            image: 'santafe2022.jpg',
            vehicle_id: vehicleSUV.vehicle_id,
        });

        const vehicleHatchback = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Hatchback',
            brand: 'Honda',
            model: 'Jazz',
            year: 2020,
            color: 'Yellow',
            mileage: 12000,
            transmissionType: 'Automatic',
            fuelType: 'Gasoline',
            condition: 'Good',
            documents: 'BPKB, STNK',
        });
        await Auction.create({
            auction_id: uuidv4(),
            title: 'Honda Jazz 2020 - Sporty Hatchback',
            description: 'Irit, lincah, cocok untuk anak muda.',
            startingPrice: 200_000_000,
            currentPrice: 205_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Hatchback",
            image: 'jazz2020.jpg',
            vehicle_id: vehicleHatchback.vehicle_id,
        });

        const vehicleTruck = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Truck',
            brand: 'Isuzu',
            model: 'Elf',
            year: 2019,
            color: 'Blue',
            mileage: 30000,
            transmissionType: 'Manual',
            fuelType: 'Diesel',
            condition: 'Fair',
            documents: 'BPKB, STNK',
        });
        await Auction.create({
            auction_id: uuidv4(),
            title: 'Isuzu Elf 2019 - Box Truck',
            description: 'Cocok untuk usaha, mesin bandel.',
            startingPrice: 180_000_000,
            currentPrice: 180_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Truck",
            image: 'elf2019.jpg',
            vehicle_id: vehicleTruck.vehicle_id,
        });

        const vehicleCoupe = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Coupe',
            brand: 'Mercedes-Benz',
            model: 'C-Class Coupe',
            year: 2021,
            color: 'Red',
            mileage: 8000,
            transmissionType: 'Automatic',
            fuelType: 'Gasoline',
            condition: 'Excellent',
            documents: 'BPKB, STNK',
        });
        await Auction.create({
            auction_id: uuidv4(),
            title: 'Mercedes-Benz C-Class Coupe 2021',
            description: 'Coupe mewah, sporty dan elegan.',
            startingPrice: 700_000_000,
            currentPrice: 710_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Coupe",
            image: 'cclasscoupe2021.jpg',
            vehicle_id: vehicleCoupe.vehicle_id,
        });

        const vehicleConvertible = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Convertible',
            brand: 'Mazda',
            model: 'MX-5',
            year: 2020,
            color: 'Silver',
            mileage: 9000,
            transmissionType: 'Manual',
            fuelType: 'Gasoline',
            condition: 'Excellent',
            documents: 'BPKB, STNK',
        });
        await Auction.create({
            auction_id: uuidv4(),
            title: 'Mazda MX-5 2020 - Convertible',
            description: 'Mobil atap terbuka, fun to drive!',
            startingPrice: 600_000_000,
            currentPrice: 605_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Convertible",
            image: 'mx52020.jpg',
            vehicle_id: vehicleConvertible.vehicle_id,
        });

        const vehicleVan = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Van',
            brand: 'Toyota',
            model: 'HiAce',
            year: 2018,
            color: 'White',
            mileage: 40000,
            transmissionType: 'Manual',
            fuelType: 'Diesel',
            condition: 'Good',
            documents: 'BPKB, STNK',
        });
        await Auction.create({
            auction_id: uuidv4(),
            title: 'Toyota HiAce 2018 - Family Van',
            description: 'Muatan banyak, cocok untuk travel.',
            startingPrice: 350_000_000,
            currentPrice: 355_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Van",
            image: 'hiace2018.jpg',
            vehicle_id: vehicleVan.vehicle_id,
        });

        const vehicleWagon = await Vehicle.create({
            vehicle_id: uuidv4(),
            type: 'Wagon',
            brand: 'Subaru',
            model: 'Outback',
            year: 2021,
            color: 'Green',
            mileage: 15000,
            transmissionType: 'Automatic',
            fuelType: 'Gasoline',
            condition: 'Excellent',
            documents: 'BPKB, STNK',
        });
        await Auction.create({
            auction_id: uuidv4(),
            title: 'Subaru Outback 2021 - Wagon',
            description: 'Wagon tangguh, nyaman untuk keluarga.',
            startingPrice: 500_000_000,
            currentPrice: 505_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Wagon",
            image: 'outback2021.jpg',
            vehicle_id: vehicleWagon.vehicle_id,
        });        // Create auctions with different statuses for testing admin functionality
        const auction7 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Toyota Camry 2021 - Executive Sedan',
            description: 'Luxury sedan, low mileage, like new.',
            startingPrice: 350_000_000,
            currentPrice: 355_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Sedan",
            image: 'camry2021.jpg',
            vehicle_id: vehicleSedan.vehicle_id,
        });

        const auction8 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Hyundai Santa Fe 2022 - Modern SUV',
            description: 'SUV terbaru, fitur lengkap, siap pakai.',
            startingPrice: 500_000_000,
            currentPrice: 505_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "SUV",
            image: 'santafe2022.jpg',
            vehicle_id: vehicleSUV.vehicle_id,
        });

        const auction9 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Honda Jazz 2020 - Sporty Hatchback',
            description: 'Irit, lincah, cocok untuk anak muda.',
            startingPrice: 200_000_000,
            currentPrice: 205_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Hatchback",
            image: 'jazz2020.jpg',
            vehicle_id: vehicleHatchback.vehicle_id,
        });

        const auction10 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Isuzu Elf 2019 - Box Truck',
            description: 'Cocok untuk usaha, mesin bandel.',
            startingPrice: 180_000_000,
            currentPrice: 180_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Truck",
            image: 'elf2019.jpg',
            vehicle_id: vehicleTruck.vehicle_id,
        });

        const auction11 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Mercedes-Benz C-Class Coupe 2021',
            description: 'Coupe mewah, sporty dan elegan.',
            startingPrice: 700_000_000,
            currentPrice: 710_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Coupe",
            image: 'cclasscoupe2021.jpg',
            vehicle_id: vehicleCoupe.vehicle_id,
        });

        const auction12 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Mazda MX-5 2020 - Convertible',
            description: 'Mobil atap terbuka, fun to drive!',
            startingPrice: 600_000_000,
            currentPrice: 605_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Convertible",
            image: 'mx52020.jpg',
            vehicle_id: vehicleConvertible.vehicle_id,
        });

        const auction13 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Toyota HiAce 2018 - Family Van',
            description: 'Muatan banyak, cocok untuk travel.',
            startingPrice: 350_000_000,
            currentPrice: 355_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Van",
            image: 'hiace2018.jpg',
            vehicle_id: vehicleVan.vehicle_id,
        });

        const auction14 = await Auction.create({
            auction_id: uuidv4(),
            title: 'Subaru Outback 2021 - Wagon',
            description: 'Wagon tangguh, nyaman untuk keluarga.',
            startingPrice: 500_000_000,
            currentPrice: 505_000_000,
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000 * 2),
            status: "OPEN",
            category: "Wagon",
            image: 'outback2021.jpg',
            vehicle_id: vehicleWagon.vehicle_id,
        });        // Create comprehensive bid data for testing
        await Bid.bulkCreate([
            // Bids for Toyota Avanza auction
            {
                bid_id: uuidv4(),
                auction_id: auction1.auction_id,
                user_id: user1.user_id,
                amount: 102_000_000,
                bidTime: new Date(Date.now() - 7200000), // 2 hours ago
            },
            {
                bid_id: uuidv4(),
                auction_id: auction1.auction_id,
                user_id: user2.user_id,
                amount: 105_000_000,
                bidTime: new Date(Date.now() - 3600000), // 1 hour ago
            },
            {
                bid_id: uuidv4(),
                auction_id: auction1.auction_id,
                user_id: user3.user_id,
                amount: 107_000_000,
                bidTime: new Date(Date.now() - 1800000), // 30 minutes ago
            },
            
            // Bids for Yamaha NMAX auction
            {
                bid_id: uuidv4(),
                auction_id: auction2.auction_id,
                user_id: user1.user_id,
                amount: 26_000_000,
                bidTime: new Date(Date.now() - 5400000), // 1.5 hours ago
            },
            {
                bid_id: uuidv4(),
                auction_id: auction2.auction_id,
                user_id: user4.user_id,
                amount: 27_000_000,
                bidTime: new Date(Date.now() - 1200000), // 20 minutes ago
            },
            
            // Bids for Honda Civic auction
            {
                bid_id: uuidv4(),
                auction_id: auction3.auction_id,
                user_id: user2.user_id,
                amount: 185_000_000,
                bidTime: new Date(Date.now() - 2700000), // 45 minutes ago
            },
            {
                bid_id: uuidv4(),
                auction_id: auction3.auction_id,
                user_id: user3.user_id,
                amount: 190_000_000,
                bidTime: new Date(Date.now() - 900000), // 15 minutes ago
            },
            
            // Bids for Mitsubishi Pajero auction
            {
                bid_id: uuidv4(),
                auction_id: auction4.auction_id,
                user_id: user1.user_id,
                amount: 460_000_000,
                bidTime: new Date(Date.now() - 600000), // 10 minutes ago
            },
            
            // Bids for closed BMW X5 auction
            {
                bid_id: uuidv4(),
                auction_id: auction6.auction_id,
                user_id: user2.user_id,
                amount: 780_000_000,
                bidTime: new Date(Date.now() - 7200000), // 2 hours ago
            },
            {
                bid_id: uuidv4(),
                auction_id: auction6.auction_id,
                user_id: user4.user_id,
                amount: 820_000_000,
                bidTime: new Date(Date.now() - 5400000), // 1.5 hours ago (winning bid)
            },
        ]);

        // Create transaction data
        await Transaction.bulkCreate([
            // Completed transaction for BMW X5 (auction ended)
            {
                transaction_id: uuidv4(),
                auction_id: auction6.auction_id,
                user_id: user4.user_id,
                amount: 820_000_000,
                transactionDate: new Date(Date.now() - 1800000), // 30 minutes ago
                paymentMethod: 'Bank Transfer',
                status: 'Completed',
            },
            
            // Pending transaction for demo purposes
            {
                transaction_id: uuidv4(),
                auction_id: auction1.auction_id,
                user_id: user3.user_id,
                amount: 107_000_000,
                transactionDate: new Date(),
                paymentMethod: 'Credit Card',
                status: 'Pending',
            },
        ]);        console.log('✅ Comprehensive test data seeded successfully!');
        console.log('\n📊 Seeded Data Summary:');
        console.log('👥 Users: 4 (reivel, joel, alice, bob)');
        console.log('🔧 Admins: 2 (admin1, superadmin)');
        console.log('🚗 Vehicles: 6 (cars, motorcycle, SUVs, truck)');
        console.log('🏷️  Auctions: 6 (4 OPEN, 1 pending, 1 closed)');
        console.log('💰 Bids: 10 (across multiple auctions)');
        console.log('🧾 Transactions: 2 (1 completed, 1 pending)');
        console.log('\n🔐 Test Accounts (passwords are hashed in database):');
        console.log('📝 Regular Users:');
        console.log('   - reivel@mail.com / pass123');
        console.log('   - joel@mail.com / pass456');
        console.log('   - alice@mail.com / alice123');
        console.log('   - bob@mail.com / bob456');
        console.log('⚙️  Admin Accounts:');
        console.log('   - admin1@mail.com / adminpass');    
        console.log('   - superadmin@mail.com / superpass123');
        console.log('\n🔒 Note: All passwords are properly hashed using bcrypt for security');
        console.log('\n🎯 Test Scenarios Available:');
        console.log('   - Active auctions for bidding');
        console.log('   - Pending auction for admin approval');
        console.log('   - Closed auction with completed transaction');
        console.log('   - Admin status update functionality');
        console.log('   - Role-based access control');
        
        process.exit(0);
    } catch (err) {
        console.error('Gagal seed:', err);
        process.exit(1);
    }
}

seed();
