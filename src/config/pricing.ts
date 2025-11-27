export interface CarPricing {
  [key: string]: {
    oneWay: number;
    roundTrip: number;
  };
}

export const carPricingConfig: CarPricing = {
  "Sedan": {
    oneWay: 14,
    roundTrip: 13,
  },
  "Premium Sedan": {
    oneWay: 15,
    roundTrip: 14,
  },
  "SUV": {
    oneWay: 19,
    roundTrip: 18,
  },
  "Premium SUV": {
    oneWay: 21,
    roundTrip: 22,
  },
};

export type CarCategory = keyof typeof carPricingConfig;
