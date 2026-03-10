import { api } from '@/store/api';

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderItem {
  platId: string;
  platName: string;
  quantity: number;
  price: number;
  chefId: string;
}

export interface Order {
  id: string;
  platId: string;
  platName: string;
  platImageUrl: string | null;
  chefId: string;
  chefName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  description: string;
  deliveryAddress: string;
  paymentIntentId: string;
  createdAt: string;
  updatedAt: string;
  selectedIngredients?: {
    ingredientId: string;
    ingredientName: string;
    ingredientPrice: number;
  }[];
}

export interface CreateOrderRequest {
  platId: string;
  chefId: string;
  quantity: number;
  description: string;
  deliveryAddress: string;
  paymentIntentId: string;
  selectedIngredientIds: string[];
}

const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data?.data || response.data;
  },

  async getUserOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my-orders');
    return response.data?.data || response.data || [];
  },

  async getOrderById(orderId: string): Promise<Order> {
    const response = await api.get(`/orders/${orderId}`);
    return response.data?.data || response.data;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    const response = await api.put(`/orders/${orderId}/cancel`);
    return response.data?.data || response.data;
  },
};

export default orderService;
