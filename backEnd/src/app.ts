import express from 'express';
import userRoutes from './routes/userRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import adminRoutes from './routes/adminRoutes';
import transactionRoutes from './routes/transactionRoutes';
import bidRoutes from './routes/bidRoutes';

import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user';
import { Admin } from '../models/admin';
import { Vehicle } from '../models/vehicle';
import { Auction } from '../models/auction';
import { Bid } from '../models/bid';
import { Transaction } from '../models/transaction';


const config = require('../config/config.json');
const app = express();
app.use(express.json());

const sequelize = new Sequelize({
    ...config.development,
    models: [User, Admin, Vehicle, Auction, Bid, Transaction],
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });

// routes -----------------------------
app.use('/user', userRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/admin', adminRoutes);
app.use('/transaction', transactionRoutes);
app.use('/bid', bidRoutes);
// ------------------------------------


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});