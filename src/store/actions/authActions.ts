import type { Dispatch } from 'redux';
import passwordlessAuthService, { 
  clearTokens,
  getAccessToken,
  getUserData,
  storeUserData,
} from '@/services/passwordlessAuthService';
import type {
  RegisterRequest,
  VerifyRegistrationRequest,
  LoginOtpRequest,
  VerifyOtpRequest,
  ResendOtpRequest 
} from '@/services/passwordlessAuthService';
import {
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  RESEND_OTP_REQUEST,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_FAILURE,
  RESTORE_AUTH,
  LOGOUT,
} from '../types/actionTypes';

/**
 * REGISTER FLOW
 * Step 1: Send registration info and receive OTP
 */
export const sendRegisterOtp = (data: RegisterRequest) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    
    try {
      const response = await passwordlessAuthService.register(data);
      
      dispatch({
        type: REGISTER_SUCCESS,
        payload: {
          phone: data.phone,
          message: response.message,
          expiresInMinutes: response.data.expiresInMinutes,
        },
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: REGISTER_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};

/**
 * Step 2: Verify registration OTP and complete account creation
 */
export const verifyRegistrationOtp = (data: VerifyRegistrationRequest) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });
    
    try {
      const response = await passwordlessAuthService.verifyRegistration(data);
      
      if (response.success && response.data && response.data.user) {
        // Map backend snake_case to frontend camelCase
        const user = {
          id: response.data.user.id,
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          role: response.data.user.role,
          address: response.data.user.address,
        };
        
        // Store user data in localStorage
        storeUserData(user);
        
        dispatch({
          type: VERIFY_OTP_SUCCESS,
          payload: {
            user,
            isAuthenticated: true,
          },
        });
        
        return response;
      }
      
      throw new Error('Verification failed');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      dispatch({
        type: VERIFY_OTP_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};

/**
 * LOGIN FLOW
 * Step 1: Send phone and receive OTP
 */
export const sendLoginOtp = (data: LoginOtpRequest) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: SEND_OTP_REQUEST });
    
    try {
      const response = await passwordlessAuthService.login(data);
      
      dispatch({
        type: SEND_OTP_SUCCESS,
        payload: {
          phone: data.phone,
          message: response.message,
          expiresInMinutes: response.data.expiresInMinutes,
        },
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP';
      dispatch({
        type: SEND_OTP_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};

/**
 * Step 2: Verify login OTP
 */
export const verifyLoginOtp = (data: VerifyOtpRequest) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });
    
    try {
      const response = await passwordlessAuthService.verifyLogin(data);
      
      if (response.success && response.data && response.data.user) {
        // Map backend snake_case to frontend camelCase
        const user = {
          id: response.data.user.id,
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          email: response.data.user.email,
          phone: response.data.user.phone,
          role: response.data.user.role,
          address: response.data.user.address,
        };
        
        // Store user data in localStorage
        storeUserData(user);
        
        dispatch({
          type: VERIFY_OTP_SUCCESS,
          payload: {
            user,
            isAuthenticated: true,
          },
        });
        
        return response;
      }
      
      throw new Error('Verification failed');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      dispatch({
        type: VERIFY_OTP_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};

/**
 * Resend OTP
 */
export const resendOtp = (data: ResendOtpRequest) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: RESEND_OTP_REQUEST });
    
    try {
      const response = await passwordlessAuthService.resendOtp(data);
      
      dispatch({
        type: RESEND_OTP_SUCCESS,
        payload: {
          message: response.message,
          expiresInMinutes: response.data.expiresInMinutes,
        },
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      dispatch({
        type: RESEND_OTP_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
};

/**
 * Logout
 */
export const logout = () => {
  return (dispatch: Dispatch) => {
    clearTokens();
    dispatch({ type: LOGOUT });
  };
};

/**
 * Restore authentication state from token on app load
 */
export const restoreAuth = () => {
  return async (dispatch: Dispatch) => {
    try {
      const token = getAccessToken();
      const userData = getUserData();
      
      if (!token || !userData) {
        // No token or user data, mark as not loading
        dispatch({
          type: RESTORE_AUTH,
          payload: {
            user: null,
            isAuthenticated: false,
          },
        });
        return;
      }

      // Decode JWT token to check if it's expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        clearTokens();
        dispatch({
          type: RESTORE_AUTH,
          payload: {
            user: null,
            isAuthenticated: false,
          },
        });
        return;
      }

      // Token valid and user data exists - restore auth
      dispatch({
        type: RESTORE_AUTH,
        payload: {
          user: userData,
          isAuthenticated: true,
        },
      });
    } catch (error) {
      // Token invalid or expired, clear it
      clearTokens();
      dispatch({
        type: RESTORE_AUTH,
        payload: {
          user: null,
          isAuthenticated: false,
        },
      });
    }
  };
};
