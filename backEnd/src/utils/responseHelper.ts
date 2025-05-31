/**
 * Standardized response helpers for API endpoints
 * Ensures consistent error handling and response formats across controllers
 */

import { Response } from 'express';

/**
 * Standard API response structure
 */
export interface APIResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

/**
 * Send successful response with data
 */
export const sendSuccess = <T>(
  res: Response, 
  data: T, 
  message: string = 'Success', 
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    message,
    data
  } as APIResponse<T>);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response, 
  message: string, 
  statusCode: number = 500, 
  error?: any
): void => {
  console.error(`Error [${statusCode}]:`, message, error);
  res.status(statusCode).json({
    message,
    error: error?.message || error
  } as APIResponse);
};

/**
 * Send validation error response
 */
export const sendValidationError = (
  res: Response, 
  message: string = 'Validation failed'
): void => {
  sendError(res, message, 400);
};

/**
 * Send not found error response
 */
export const sendNotFound = (
  res: Response, 
  resource: string = 'Resource'
): void => {
  sendError(res, `${resource} not found`, 404);
};

/**
 * Send unauthorized error response
 */
export const sendUnauthorized = (
  res: Response, 
  message: string = 'Unauthorized'
): void => {
  sendError(res, message, 401);
};

/**
 * Send forbidden error response
 */
export const sendForbidden = (
  res: Response, 
  message: string = 'Forbidden'
): void => {
  sendError(res, message, 403);
};
