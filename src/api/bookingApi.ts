import apiClient from './apiClient';
import { CarCategory } from '../Config/pricing';

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  drop: string;
  vehicleType: CarCategory;
  date: string;
  message: string;
  distance?: number;
  calculatedPrice?: number;
}

// Submit booking inquiry
export const submitBooking = async (bookingData: BookingData): Promise<{ success: boolean; message: string }> => {
  const res = await apiClient.post('/booking', bookingData);
  return res.data;
};
