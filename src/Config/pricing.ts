export type CarCategory = 'Sedan' | 'Premium Sedan' | 'SUV' | 'Premium SUV';

export const carPricingConfig: Record<CarCategory, { oneWay: number; roundTrip: number }> = {
  Sedan: {
    oneWay: 14,
    roundTrip: 17
  },
  'Premium Sedan': {
    oneWay: 15,
    roundTrip: 19
  },
  SUV: {
    oneWay: 19,
    roundTrip: 23
  },
  'Premium SUV': {
    oneWay: 21,
    roundTrip: 26
  }
};

// Pricing format for backend API
export interface PricingData {
  type: string;
  rate: number; // One way rate
  fixedPrice: number; // Round trip rate
}

export const defaultPricing: PricingData[] = [
  { type: 'Sedan', rate: 14, fixedPrice: 17 },
  { type: 'Premium Sedan', rate: 15, fixedPrice: 19 },
  { type: 'SUV', rate: 19, fixedPrice: 23 },
  { type: 'Premium SUV', rate: 21, fixedPrice: 26 }
];
