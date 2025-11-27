import apiClient from './apiClient';
import { CarCategory } from '../config/pricing';

export interface CalculateFareRequest {
  from: string;
  to: string;
  category: CarCategory;
  tripType: 'oneWay' | 'roundTrip';
}

export interface CalculateFareResponse {
  distanceKm: number;
  fare: number;
}

// Calculate fare based on distance and category
export const calculateFare = async (fareData: CalculateFareRequest): Promise<CalculateFareResponse> => {
  try {
    const response = await apiClient.post('/calculate-fare', fareData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to calculate fare: ${error}`);
  }
};
