import apiClient from './apiClient';
import { defaultPricing, PricingData } from '../config/pricing';

// Admin Authentication API
export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await apiClient.post('/admin/login', {
      username,
      password,
    });
    return response.data; // Should return {token: "jwt_token"}
  } catch (error) {
    throw new Error('Invalid credentials or server error.');
  }
};

export type { PricingData };

// Get all pricing data for website display (no auth required)
export const getPricing = async (): Promise<PricingData[]> => {
  try {
    const response = await apiClient.get('/api/pricing/');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch pricing from backend:', error);
    // Return default pricing as fallback
    return defaultPricing;
  }
};

// Update pricing data (admin only - requires Authorization header)
export const updatePricing = async (pricingData: PricingData[]): Promise<PricingData[]> => {
  try {
    // Validate data before sending to backend
    if (!Array.isArray(pricingData) || pricingData.length === 0) {
      throw new Error('Invalid pricing data provided');
    }

    pricingData.forEach(item => {
      if (!item.type || typeof item.rate !== 'number' || typeof item.fixedPrice !== 'number') {
        throw new Error(`Invalid data for ${item.type || 'unknown item'}`);
      }
      if (item.rate < 0 || item.fixedPrice < 0) {
        throw new Error('Pricing values cannot be negative');
      }
    });

    // Update backend directly - admin token is automatically added by interceptor
    const response = await apiClient.put('/api/pricing/', pricingData);
    return response.data;
  } catch (error) {
    console.error('Failed to update pricing:', error);
    throw new Error(`Failed to update pricing: ${error}`);
  }
};
