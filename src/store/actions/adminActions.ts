import type { Dispatch } from 'redux';
import { 
  FETCH_ADMIN_STATS_REQUEST, 
  FETCH_ADMIN_STATS_SUCCESS, 
  FETCH_ADMIN_STATS_FAILURE,
  FETCH_CHEFS_REQUEST,
  FETCH_CHEFS_SUCCESS,
  FETCH_CHEFS_FAILURE,
  FETCH_CHEF_DETAIL_REQUEST,
  FETCH_CHEF_DETAIL_SUCCESS,
  FETCH_CHEF_DETAIL_FAILURE,
  CREATE_PLATE_FOR_CHEF_REQUEST,
  CREATE_PLATE_FOR_CHEF_SUCCESS,
  CREATE_PLATE_FOR_CHEF_FAILURE
} from '../types/actionTypes';
import { api } from '../api';

export interface AdminStats {
  totalUsers: number;
  totalChefs: number;
  totalDishes: number;
  totalOrders: number;
  todayOrders: number;
}

export interface ChefListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  totalPlates: number;
  totalOrders: number;
  createdAt: string;
}

export interface PlatResponse {
  id: string;
  chefId: string;
  name: string;
  description: string;
  estimatedCookTime: number;
  price: number;
  categories: string[];
  imageUrl?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChefDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  plates: PlatResponse[];
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
  isActive?: boolean;
  description?: string;
}

export interface CreatePlateRequest {
  name: string;
  description: string;
  estimatedCookTime: number;
  price: number;
  categories: string[];
  imageUrl?: string;
  available?: boolean;
}

/**
 * Fetch admin dashboard statistics
 */
export const fetchAdminStats = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_ADMIN_STATS_REQUEST });
    
    try {
      const response = await api.get('/admin/stats');
      
      if (response.data.success && response.data.data) {
        dispatch({
          type: FETCH_ADMIN_STATS_SUCCESS,
          payload: response.data.data,
        });
        return response.data.data;
      }
      
      throw new Error('Failed to fetch admin stats');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch admin statistics';
      dispatch({
        type: FETCH_ADMIN_STATS_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};

/**
 * Fetch all chefs
 */
export const fetchChefs = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_CHEFS_REQUEST });
    
    try {
      const response = await api.get('/admin/chefs');
      
      if (response.data.success && response.data.data) {
        dispatch({
          type: FETCH_CHEFS_SUCCESS,
          payload: response.data.data,
        });
        return response.data.data;
      }
      
      throw new Error('Failed to fetch chefs');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch chefs';
      dispatch({
        type: FETCH_CHEFS_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};

/**
 * Fetch chef detail by ID
 */
export const fetchChefDetail = (chefId: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_CHEF_DETAIL_REQUEST });
    
    try {
      const response = await api.get(`/admin/chefs/${chefId}`);
      
      if (response.data.success && response.data.data) {
        dispatch({
          type: FETCH_CHEF_DETAIL_SUCCESS,
          payload: response.data.data,
        });
        return response.data.data;
      }
      
      throw new Error('Failed to fetch chef detail');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch chef detail';
      dispatch({
        type: FETCH_CHEF_DETAIL_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};

/**
 * Create a plate for a chef
 */
export const createPlateForChef = (chefId: string, plateData: CreatePlateRequest) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: CREATE_PLATE_FOR_CHEF_REQUEST });
    
    try {
      const response = await api.post(`/admin/chefs/${chefId}/plates`, plateData);
      
      if (response.data.success && response.data.data) {
        dispatch({
          type: CREATE_PLATE_FOR_CHEF_SUCCESS,
          payload: response.data.data,
        });
        return response.data.data;
      }
      
      throw new Error('Failed to create plate');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create plate';
      dispatch({
        type: CREATE_PLATE_FOR_CHEF_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};
