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

// Corporate pricing types
export interface CorporatePricingRow {
  vehicleType: CarCategory;
  oneWayRate: number;
  roundTripRate: number;
  discountPercent: number;
  notes: string;
}

export const corporatePricingRows: CorporatePricingRow[] = [
  {
    vehicleType: 'Sedan',
    oneWayRate: 14,
    roundTripRate: 17,
    discountPercent: 10,
    notes: 'Ideal for solo business travelers or small teams of up to 4.'
  },
  {
    vehicleType: 'Premium Sedan',
    oneWayRate: 15,
    roundTripRate: 19,
    discountPercent: 12,
    notes: 'Enhanced comfort and style for executive travel and client pick-ups.'
  },
  {
    vehicleType: 'SUV',
    oneWayRate: 19,
    roundTripRate: 23,
    discountPercent: 15,
    notes: 'Spacious and powerful, perfect for field visits and group commutes of up to 6.'
  },
  {
    vehicleType: 'Premium SUV',
    oneWayRate: 21,
    roundTripRate: 26,
    discountPercent: 18,
    notes: 'The ultimate in luxury and space for top-tier executive groups.'
  }
];
