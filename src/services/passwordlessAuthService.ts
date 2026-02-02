/**
 * Passwordless Authentication Service
 * Handles OTP-based phone authentication for web client
 */

import { api } from '@/store/api';
import Cookies from 'js-cookie';

export interface OtpSentResponse {
  message: string;
  phone: string;
  expiresInMinutes: number;
  canResend: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface VerifyRegistrationRequest {
  phone: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

export interface LoginOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface ResendOtpRequest {
  phone: string;
  type: 'REGISTRATION' | 'LOGIN';
}

export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  address?: string;
  user_image?: string | null;
  is_verified: boolean;
}

export interface AuthData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
  user: UserInfo;
}

// Cookie storage utilities
const TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const COOKIE_OPTIONS = {
  secure: true,
  sameSite: 'strict' as const,
  expires: 7, // 7 days
};

export const storeTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(TOKEN_COOKIE, accessToken, COOKIE_OPTIONS);
  Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS);
};

export const getAccessToken = () => Cookies.get(TOKEN_COOKIE);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_COOKIE);

export const clearTokens = () => {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
};

/**
 * Passwordless Authentication API
 */
export const passwordlessAuthService = {
  /**
   * STEP 1: Register - Send OTP to phone
   */
  async register(data: RegisterRequest) {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: OtpSentResponse;
    }>('/auth/passwordless/register', data);
    return response.data;
  },

  /**
   * STEP 2: Verify Registration OTP and Create Account
   */
  async verifyRegistration(data: VerifyRegistrationRequest) {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: AuthData;
    }>('/auth/passwordless/verify-registration', data);
    
    if (response.data.success && response.data.data) {
      const { access_token, refresh_token } = response.data.data;
      storeTokens(access_token, refresh_token);
    }
    
    return response.data;
  },

  /**
   * STEP 1: Login - Send OTP to phone
   */
  async login(data: LoginOtpRequest) {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: OtpSentResponse;
    }>('/auth/passwordless/login', data);
    return response.data;
  },

  /**
   * STEP 2: Verify Login OTP
   */
  async verifyLogin(data: VerifyOtpRequest) {
    console.log('🔐 Sending verify login request:', data);
    const response = await api.post<{
      success: boolean;
      message: string;
      data: AuthData;
    }>('/auth/passwordless/verify-login', data);
    
    console.log('✅ Verify login response:', response.data);
    
    if (response.data.success && response.data.data) {
      const { access_token, refresh_token } = response.data.data;
      storeTokens(access_token, refresh_token);
    }
    
    return response.data;
  },

  /**
   * Resend OTP
   */
  async resendOtp(data: ResendOtpRequest) {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: OtpSentResponse;
    }>('/auth/passwordless/resend-otp', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: { access_token: string; refresh_token: string };
    }>('/auth/passwordless/refresh', {
      refreshToken
    });
    
    if (response.data.success && response.data.data) {
      const { access_token, refresh_token } = response.data.data;
      storeTokens(access_token, refresh_token);
    }
    
    return response.data;
  }
};

export default passwordlessAuthService;
