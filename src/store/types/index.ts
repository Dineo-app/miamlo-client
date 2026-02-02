// Redux store type definitions
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  address?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpPhone: string | null;
  otpExpiresInMinutes: number | null;
}

export interface PlatState {
  plats: any[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  plats: PlatState;
}
