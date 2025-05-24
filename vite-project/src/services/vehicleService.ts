import { fetchFromAPI } from './api';
import type { Vehicle } from '../types/types';

export const getAllVehicles = (): Promise<Vehicle[]> => {
  return fetchFromAPI('/vehicle', 'GET');
};

export const getVehicleById = (id: string): Promise<Vehicle> => {
  return fetchFromAPI(`/vehicle/${id}/getVehicle`, 'GET');
};

export const createVehicle = (vehicleData: Omit<Vehicle, 'vehicle_id'>): Promise<Vehicle> => {
  return fetchFromAPI('/vehicle/createVehicle', 'POST', vehicleData);
};

export const updateVehicle = (id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  return fetchFromAPI(`/vehicle/${id}/updateVechicle`, 'PUT', vehicleData);
};

export const deleteVehicle = (id: string): Promise<{ message: string }> => {
  return fetchFromAPI(`/vehicle/${id}/deleteVehicle`, 'DELETE');
};