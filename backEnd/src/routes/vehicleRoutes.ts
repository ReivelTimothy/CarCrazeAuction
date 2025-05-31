import express from 'express';
import { createVehicle, getAllVehicles, getVehicleById, updateVehicle, deleteVehicle } from '../controller/vehicleController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth'; 

const vehicleRoutes = express.Router();

// Vehicle routes with appropriate authentication
vehicleRoutes.get('/', getAllVehicles);
vehicleRoutes.get('/:id/getVehicle', getVehicleById);
vehicleRoutes.post('/createVehicle', authenticateJWT, createVehicle);
vehicleRoutes.put('/:id/updateVehicle', authenticateJWT, updateVehicle);
vehicleRoutes.delete('/:id/deleteVehicle', authenticateJWT, authorizeAdmin, deleteVehicle);

export default vehicleRoutes;