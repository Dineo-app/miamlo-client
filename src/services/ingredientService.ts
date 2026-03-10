import { api } from '@/store/api';

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  isFree: boolean;
}

const ingredientService = {
  async getIngredientsByPlatId(platId: string): Promise<Ingredient[]> {
    const response = await api.get(`/plats/${platId}/ingredients`);
    return response.data?.data || response.data || [];
  },
};

export default ingredientService;
