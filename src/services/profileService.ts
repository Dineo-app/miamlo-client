import { api } from '@/store/api';

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

const profileService = {
  async updateProfile(data: UpdateProfileRequest): Promise<any> {
    const response = await api.put('/auth/update-profile', data);
    return response.data?.data || response.data;
  },
};

export default profileService;
