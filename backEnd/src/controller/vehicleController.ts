import { Vehicle } from "../../models/vehicle";

// 1 get all vehicles
export const getAllVehicles = async (req: any, res: any) => {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving vehicles", error });
    }
};

// 2 get vehicle by id
export const getVehicleById = async (req: any, res: any) => {
    try {
        const vehicleId = req.params.id;
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: vehicleId } });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving vehicle", error });
    }
};

// 3 create vehicle
export const createVehicle = async (req: any, res: any) => {
    try {
        const { type, brand, model, year, color, mileage, transmissionType, fuelType, condition, documents, name, price } = req.body;
        const newVehicle = await Vehicle.create({
            type,
            brand,
            model,
            year,
            color,
            mileage,
            transmissionType,
            fuelType,
            condition,
            documents,
            name,
            price,
        });
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ message: "Error creating vehicle", error });
    }
};

// 4 update vehicle
export const updateVehicle = async (req: any, res: any) => {
    try {
        const vehicleId = req.params.id;
        const { type, brand, model, year, color, mileage, transmissionType, fuelType, condition, documents, name, price } = req.body;
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: vehicleId } });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        await vehicle.update({
            type,
            brand,
            model,
            year,
            color,
            mileage,
            transmissionType,
            fuelType,
            condition,
            documents,
            name,
            price,
        });
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: "Error updating vehicle", error });
    }
};

// 5 delete vehicle
export const deleteVehicle = async (req: any, res: any) => {
    try {
        const vehicleId = req.params.id;
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: vehicleId } });
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        await vehicle.destroy();
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting vehicle", error });
    }
};