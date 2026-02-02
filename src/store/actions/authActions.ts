import type { Dispatch } from 'redux';
import { api } from '../api';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../types/actionTypes';

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user, token },
      });
      
      return response.data;
    } catch (error: any) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: error.response?.data?.message || 'Login failed',
      });
      throw error;
    }
  };
};

export const logout = () => {
  return (dispatch: Dispatch) => {
    localStorage.removeItem('authToken');
    dispatch({ type: LOGOUT });
  };
};
