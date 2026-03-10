import { api } from '@/store/api';

export interface FavoritePlatWithDetails {
  favoriteId: string;
  favoritedAt: string;
  platId: string;
  chefId: string;
  name: string;
  description: string;
  estimatedCookTime: number;
  categories: string[];
  imageUrl: string | null;
  platCreatedAt?: string;
  platUpdatedAt?: string;
  price?: number;
  averageRating?: number;
  chefFirstName?: string;
  chefLastName?: string;
  promotion?: {
    id: string;
    platId?: string;
    reductionValue: number;
    reductionEnds?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  } | null;
}

export interface FavoriteChefWithDetails {
  favoriteId: string;
  favoritedAt: string;
  chefId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  description: string | null;
  categories: string[];
  chefCertifications?: string[];
  chefCoverImg: string | null;
  averageRating: number;
  totalReviews: number;
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
