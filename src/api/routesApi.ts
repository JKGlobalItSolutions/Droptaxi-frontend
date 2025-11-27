import apiClient from './apiClient';

export interface RouteData {
  _id?: string;
  from: string;
  to: string;
  time: string;
  price: number;
  distance?: number;
}

// Get all routes
export const getRoutes = async (): Promise<RouteData[]> => {
  try {
    const response = await apiClient.get('/api/routes');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch routes: ${error}`);
  }
};

// Create a new route (admin only)
export const createRoute = async (routeData: Omit<RouteData, '_id'>): Promise<RouteData> => {
  try {
    const response = await apiClient.post('/api/routes', routeData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create route: ${error}`);
  }
};

// Update a route (admin only)
export const updateRoute = async (id: string, routeData: Partial<RouteData>): Promise<RouteData> => {
  try {
    const response = await apiClient.put(`/api/routes/${id}`, routeData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update route: ${error}`);
  }
};

// Delete a route (admin only)
export const deleteRoute = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/routes/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete route: ${error}`);
  }
};
