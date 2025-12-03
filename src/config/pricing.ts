export interface CarPricing {
  [key: string]: {
    oneWay: number;
    roundTrip: number;
  };
}

export const carPricingConfig: CarPricing = {
  "Sedan": {
    oneWay: 13,
    roundTrip: 11,
  },
  "Premium Sedan": {
    oneWay: 15,
    roundTrip: 12,
  },
  "SUV": {
    oneWay: 19,
    roundTrip: 15,
  },
  "Premium SUV": {
    oneWay: 23,
    roundTrip: 18,
  },
};

export type CarCategory = keyof typeof carPricingConfig;
