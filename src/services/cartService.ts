import { api } from '@/store/api';

export interface CartItem {
  id: string;
  platId: string;
  platName: string;
  platPrice: number;
  platImageUrl: string | null;
  quantity: number;
  totalPrice: number;
  chefId?: string;
  promotion?: {
    id: string;
    reductionValue: number;
    isActive: boolean;
  } | null;
  selectedIngredients?: {
    ingredientId: string;
    ingredientName: string;
    ingredientPrice: number;
  }[];
}

export interface AddToCartRequest {
  platId: string;
  quantity: number;
  selectedIngredientIds?: string[];
}

const cartService = {
  async getCartItems(): Promise<CartItem[]> {
    const response = await api.get('/cart');
    return response.data?.data || response.data || [];
  },

  async getCartCount(): Promise<number> {
    const response = await api.get('/cart/count');
    return response.data?.data ?? response.data ?? 0;
  },

  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    const response = await api.post('/cart', data);
    return response.data?.data || response.data;
  },

  async updateQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data?.data || response.data;
  },

  async removeFromCart(cartItemId: string): Promise<void> {
    await api.delete(`/cart/${cartItemId}`);
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },
};

export default cartService;
