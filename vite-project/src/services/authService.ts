import { fetchFromAPI } from './api';
import type { LoginCredentials, LoginResponse, RegisterData, User } from '../types/types';

export const login = (credentials: LoginCredentials): Promise<LoginResponse> => {
  return fetchFromAPI('/user/login', 'POST', credentials);
};

export const register = (userData: RegisterData): Promise<{ message: string; user: User }> => {
  return fetchFromAPI('/user/register', 'POST', userData);
};

export const logout = (): Promise<{ message: string }> => {
  return fetchFromAPI('/user/logout', 'POST');
};

export const getUserProfile = (): Promise<User> => {
  return fetchFromAPI('/user/getUserProfile', 'GET');
};

export const updateUserProfile = (userData: Partial<User>): Promise<{ message: string }> => {
  return fetchFromAPI('/user/updateUser', 'PUT', userData);
};

export const deleteUserProfile = (): Promise<{ message: string }> => {
  return fetchFromAPI('/user/deleteUser', 'DELETE');
};