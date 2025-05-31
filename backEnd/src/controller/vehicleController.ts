import { Vehicle } from "../../models/vehicle";
import { sendSuccess, sendError, sendNotFound, sendValidationError } from '../utils/responseHelper';

// 1 get all vehicles
export const getAllVehicles = async (req: any, res: any) => {
    try {
        const vehicles = await Vehicle.findAll();
        sendSuccess(res, vehicles, 'Vehicles retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving vehicles', 500, error);
    }
};

// 2 get vehicle by id
export const getVehicleById = async (req: any, res: any) => {
    try {
        const vehicleId = req.params.id;
        
        if (!vehicleId) {
            return sendValidationError(res, 'Vehicle ID is required');
        }
        
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: vehicleId } });
        if (!vehicle) {
            return sendNotFound(res, 'Vehicle');
        }
        
        sendSuccess(res, vehicle, 'Vehicle retrieved successfully');
    } catch (error) {
        sendError(res, 'Error retrieving vehicle', 500, error);
    }
};

// 3 create vehicle
export const createVehicle = async (req: any, res: any) => {
    try {
        const { type, brand, model, year, color, mileage, transmissionType, fuelType, condition, documents } = req.body;
        
        // Validate required fields
        if (!type || !brand || !model || !year || !color || !mileage || !transmissionType || !fuelType || !condition || !documents) {
            return sendValidationError(res, 'All required fields must be provided: type, brand, model, year, color, mileage, transmissionType, fuelType, condition, documents');
        }
        
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
            documents
        });
        
        sendSuccess(res, newVehicle, 'Vehicle created successfully', 201);
    } catch (error) {
        sendError(res, 'Error creating vehicle', 500, error);
    }
};

// 4 update vehicle
export const updateVehicle = async (req: any, res: any) => {
    try {
        const vehicleId = req.params.id;
        const { type, brand, model, year, color, mileage, transmissionType, fuelType, condition, documents } = req.body;
        
        if (!vehicleId) {
            return sendValidationError(res, 'Vehicle ID is required');
        }
        
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: vehicleId } });
        if (!vehicle) {
            return sendNotFound(res, 'Vehicle');
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
            documents
        });
        
        sendSuccess(res, vehicle, 'Vehicle updated successfully');
    } catch (error) {
        sendError(res, 'Error updating vehicle', 500, error);
    }
};

// 5 delete vehicle
export const deleteVehicle = async (req: any, res: any) => {
    try {
        const vehicleId = req.params.id;
        
        if (!vehicleId) {
            return sendValidationError(res, 'Vehicle ID is required');
        }
        
        const vehicle = await Vehicle.findOne({ where: { vehicle_id: vehicleId } });
        if (!vehicle) {
            return sendNotFound(res, 'Vehicle');
        }
        
        await vehicle.destroy();
        sendSuccess(res, null, 'Vehicle deleted successfully');
    } catch (error) {
        sendError(res, 'Error deleting vehicle', 500, error);
    }
};