import { api } from '@/store/api';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface PlatReviewResponse {
  reviewId: string;
  platId: string;
  userId: string;
  userName: string;
  reviewText: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChefReviewResponse {
  reviewId: string;
  chefId: string;
  userId: string;
  userName: string;
  reviewText: string;
  rate: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Service ────────────────────────────────────────────────────────────────────

const reviewService = {
  // ── Plat reviews ────────────────────────────────────────────────────────────

  async getPlatReviews(platId: string): Promise<PlatReviewResponse[]> {
    const response = await api.get(`/plats/${platId}/reviews`);
    return response.data?.data || response.data || [];
  },

  async addPlatReview(platId: string, reviewText: string, rate: number): Promise<PlatReviewResponse> {
    const response = await api.post('/plats/reviews', { platId, reviewText, rate });
    return response.data?.data || response.data;
  },

  async hasUserReviewedPlat(platId: string): Promise<boolean> {
    try {
      const response = await api.get(`/plats/${platId}/reviews/check`);
      return response.data?.data ?? response.data ?? false;
    } catch {
      return false;
    }
  },

  // ── Chef reviews ────────────────────────────────────────────────────────────

  async getChefReviews(chefId: string): Promise<ChefReviewResponse[]> {
    const response = await api.get(`/chefs/${chefId}/reviews`);
    return response.data?.data || response.data || [];
  },

  async addChefReview(chefId: string, reviewText: string, rate: number): Promise<ChefReviewResponse> {
    const response = await api.post('/chefs/reviews', { chefId, reviewText, rate });
    return response.data?.data || response.data;
  },

  async hasUserReviewedChef(chefId: string): Promise<boolean> {
    try {
      const response = await api.get(`/chefs/${chefId}/reviews/check`);
      return response.data?.data ?? response.data ?? false;
    } catch {
      return false;
    }
  },
};

export default reviewService;
