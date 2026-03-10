import { api } from '@/store/api';

export interface FavoritePlatWithDetails {
  favoriteId: string;
  platId: string;
  platName: string;
  platDescription: string;
  platPrice: number;
  platImageUrl: string | null;
  platCategories: string[];
  platEstimatedCookTime: number;
  platAverageRating: number;
  chefId: string;
  chefFirstName: string;
  chefLastName: string;
  promotion?: {
    id: string;
    reductionValue: number;
    isActive: boolean;
  } | null;
  createdAt: string;
}

export interface FavoriteChefWithDetails {
  favoriteId: string;
  chefId: string;
  chefFirstName: string;
  chefLastName: string;
  chefCoverImg: string | null;
  chefDescription: string | null;
  chefCategories: string[];
  chefAverageRating: number;
  chefReviewCount: number;
  createdAt: string;
}

const favoritesService = {
  // Plat favorites
  async getFavoritePlats(): Promise<FavoritePlatWithDetails[]> {
    const response = await api.get('/favorites/plats');
    return response.data?.data || response.data || [];
  },

  async addFavoritePlat(platId: string): Promise<any> {
    const response = await api.post('/favorites/plats', { platId });
    return response.data?.data || response.data;
  },

  async removeFavoritePlat(platId: string): Promise<void> {
    await api.delete(`/favorites/plats/${platId}`);
  },

  async checkFavoritePlat(platId: string): Promise<boolean> {
    try {
      const response = await api.get(`/favorites/plats/${platId}/check`);
      return response.data?.data ?? response.data ?? false;
    } catch {
      return false;
    }
  },

  // Chef favorites
  async getFavoriteChefs(): Promise<FavoriteChefWithDetails[]> {
    const response = await api.get('/favorites/chefs');
    return response.data?.data || response.data || [];
  },

  async addFavoriteChef(chefId: string): Promise<any> {
    const response = await api.post('/favorites/chefs', { chefId });
    return response.data?.data || response.data;
  },

  async removeFavoriteChef(chefId: string): Promise<void> {
    await api.delete(`/favorites/chefs/${chefId}`);
  },

  async checkFavoriteChef(chefId: string): Promise<boolean> {
    try {
      const response = await api.get(`/favorites/chefs/${chefId}/check`);
      return response.data?.data ?? response.data ?? false;
    } catch {
      return false;
    }
  },
};

export default favoritesService;
