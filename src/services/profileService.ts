import { api } from '@/store/api';

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

const profileService = {
  async updateProfile(data: UpdateProfileRequest): Promise<any> {
    // Backend expects snake_case field names (first_name, last_name) via @JsonProperty
    const payload: Record<string, string | undefined> = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      address: data.address,
    };
    const response = await api.put('/auth/profile', payload);
    return response.data?.data || response.data;
  },
};

export default profileService;
