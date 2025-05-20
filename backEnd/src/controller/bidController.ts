import {Bid} from '../../models/bid';

// 1. get highest bid from a vehicle
export const getHighestBid = async (req: any, res: any) => {
    try {
        const vehicleId = req.params.vehicle_id;
        const highestBid = await Bid.findOne({
            where: { vehicle_id: vehicleId },
            order: [['amount', 'DESC']],
        });
        if (!highestBid) {
            return res.status(404).json({ message: "No bids found for this vehicle" });
        }
        res.status(200).json(highestBid);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving highest bid", error });
    }
};

// 2. update bid price with user_id and vehicle_id
export const updateBidPrice = async (req: any, res: any) => {
    try {
        const {vehicle_id, amount} = req.body;
        const user_id = req.params.user_id;
        const bid = await Bid.findOne({ where: { user_id, vehicle_id } });
        if (!bid) {
            return res.status(404).json({ message: "Bid not found" });
        }
        bid.amount = amount;
        await bid.save();
        res.status(200).json(bid);
    } catch (error) {
        res.status(500).json({ message: "Error updating bid", error });
    }
}


