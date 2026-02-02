import type { Dispatch } from 'redux';
import { api } from '../api';
import { FETCH_PLATS_REQUEST, FETCH_PLATS_SUCCESS, FETCH_PLATS_FAILURE } from '../types/actionTypes';

export const fetchPlats = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_PLATS_REQUEST });
    
    try {
      const response = await api.get('/plats');
      
      dispatch({
        type: FETCH_PLATS_SUCCESS,
        payload: response.data,
      });
      
      return response.data;
    } catch (error: any) {
      dispatch({
        type: FETCH_PLATS_FAILURE,
        payload: error.response?.data?.message || 'Failed to fetch plats',
      });
      throw error;
    }
  };
};
