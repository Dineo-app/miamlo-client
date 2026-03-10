import { api } from '@/store/api';

export interface PaymentConfig {
  publishableKey: string;
}

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  description: string;
  items: {
    platId: string;
    platName: string;
    quantity: number;
    price: number;
    chefId: string;
  }[];
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

const paymentService = {
  async getConfig(): Promise<PaymentConfig> {
    const response = await api.get('/payment/config');
    return response.data?.data || response.data;
  },

  async createPaymentIntent(data: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    const response = await api.post('/payment/create-payment-intent', data);
    return response.data?.data || response.data;
  },

  async confirmPayment(paymentIntentId: string): Promise<any> {
    const response = await api.get(`/payment/confirm/${paymentIntentId}`);
    return response.data?.data || response.data;
  },
};

export default paymentService;
