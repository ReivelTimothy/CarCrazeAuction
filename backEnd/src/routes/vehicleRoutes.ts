import express from 'express';
import { createVehicle, getAllVehicles, getVehicleById, updateVehicle, deleteVehicle } from '../controller/vehicleController';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth'; 

const vehicleRoutes = express.Router();
// 1. Get All Vehicles 
vehicleRoutes.get('/', /*authenticateJWT,*/ getAllVehicles);
// 2. Get Vehicle by ID
vehicleRoutes.get('/:id', /*authenticateJWT,*/ getVehicleById);
// 3. Create Vehicle
vehicleRoutes.post('/createVehicle', /*authenticateJWT,*/  createVehicle);
// 4. Update Vehicle
vehicleRoutes.put('/:id/updateVechicle', /*authenticateJWT,*/ updateVehicle);
// 5. Delete Vehicle
vehicleRoutes.delete('/:id/deleteVehicle', authorizeAdmin, deleteVehicle);

export default vehicleRoutes;