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
import type { AuthState } from '../types';

interface AuthAction {
  type: string;
  payload?: any;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start as true to prevent premature redirects
  error: null,
  otpSent: false,
  otpPhone: null,
  otpExpiresInMinutes: null,
};

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    // Register Flow
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        otpSent: true,
        otpPhone: action.payload.phone,
        otpExpiresInMinutes: action.payload.expiresInMinutes,
        error: null,
      };
      
    case REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        otpSent: false,
        error: action.payload,
      };
    
    // Login Flow - Send OTP
    case SEND_OTP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case SEND_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        otpSent: true,
        otpPhone: action.payload.phone,
        otpExpiresInMinutes: action.payload.expiresInMinutes,
        error: null,
      };
      
    case SEND_OTP_FAILURE:
      return {
        ...state,
        loading: false,
        otpSent: false,
        error: action.payload,
      };
    
    // Verify OTP (both login and register)
    case VERIFY_OTP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isAuthenticated: true,
        otpSent: false,
        otpPhone: null,
        otpExpiresInMinutes: null,
        error: null,
      };
      
    case VERIFY_OTP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
    // Resend OTP
    case RESEND_OTP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case RESEND_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        otpExpiresInMinutes: action.payload.expiresInMinutes,
        error: null,
      };
      
    case RESEND_OTP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
    // Restore auth from token
    case RESTORE_AUTH:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
      
    case LOGOUT:
      return {
        ...initialState,
      };
      
    default:
      return state;
  }
};
