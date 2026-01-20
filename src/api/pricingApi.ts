import apiClient from './apiClient';
import { defaultPricing, PricingData } from '../Config/pricing';

// Get all pricing data for website display (no auth required)
export const getPricing = async (): Promise<PricingData[]> => {
  try {
    const response = await apiClient.get('/pricing/');
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch pricing from backend:', error);
    return defaultPricing;
  }
};

// Update pricing data (admin only - requires Authorization header)
export const updatePricing = async (pricingData: PricingData[]): Promise<PricingData[]> => {
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

  try {
    // Update backend directly - admin token is automatically added by interceptor
    const response = await apiClient.put('/pricing/', pricingData);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update pricing via API:', error);
    // Throw a cleaner error for the UI
    throw new Error(error.response?.data?.message || error.message || 'Server update failed');
  }
};
