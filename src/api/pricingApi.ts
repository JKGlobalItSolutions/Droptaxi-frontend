import apiClient from './apiClient';
import { defaultPricing, PricingData } from '../config/pricing';

const setLocalPricing = (pricing: PricingData[]) => {
  localStorage.setItem('pricing', JSON.stringify(pricing));
};

const getLocalPricing = (): PricingData[] | null => {
  const local = localStorage.getItem('pricing');
  return local ? JSON.parse(local) : null;
};

export type { PricingData };

// Get all pricing data for website display (no auth required)
export const getPricing = async (): Promise<PricingData[]> => {
  const localPricing = getLocalPricing();
  if (localPricing) {
    return localPricing;
  }

  try {
    const response = await apiClient.get('/api/pricing/');
    const apiPricing = response.data;
    setLocalPricing(apiPricing);
    return apiPricing;
  } catch (error) {
    console.warn('Failed to fetch pricing from backend:', error);
    const fallback = localPricing || defaultPricing;
    if (!localPricing) {
      setLocalPricing(defaultPricing);
    }
    return fallback;
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

  // Always set local pricing
  setLocalPricing(pricingData);

  try {
    // Update backend directly - admin token is automatically added by interceptor
    const response = await apiClient.put('/api/pricing/', pricingData);
    return response.data;
  } catch (error) {
    console.error('Failed to update pricing via API:', error);
    throw new Error(`API update failed, but pricing updated locally: ${error}`);
  }
};
