import apiClient from './apiClient';

export interface PricingData {
  type: string;
  rate: number;
  fixedPrice: number;
}

// Get all pricing data
export const getPricing = async (): Promise<PricingData[]> => {
  try {
    const response = await apiClient.get('/pricing');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch pricing: ${error}`);
  }
};

// Update pricing data (admin only)
export const updatePricing = async (pricingData: PricingData[]): Promise<PricingData[]> => {
  try {
    const response = await apiClient.put('/pricing', pricingData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update pricing: ${error}`);
  }
};
